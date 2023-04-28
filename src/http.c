/*
 * A partial implementation of HTTP/1.0
 *
 * This code is mainly intended as a replacement for the book's 'tiny.c' server
 * It provides a *partial* implementation of HTTP/1.0 which can form a basis for
 * the assignment.
 *
 * @author G. Back for CS 3214 Spring 2018
 */
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include <stdbool.h>
#include <errno.h>
#include <unistd.h>
#include <time.h>
#include <fcntl.h>
#include <linux/limits.h>
#include <jwt.h>
#include <jansson.h>
#include "http.h"
#include "hexdump.h"
#include "socket.h"

#include "bufio.h"
#include "main.h"
const char *http_request_header(struct http_transaction *ta, const char *header);
char *get_jwt_cookie(struct http_transaction *ta);
static bool handle_api_logout(struct http_transaction *ta);
static bool handle_api_get(struct http_transaction *ta);
static bool handle_api_post(struct http_transaction *ta);
// static variables 
static const char * NEVER_EMBED_A_SECRET_IN_CODE = "supa secret";
static const char *USERNAME = "user0";
static const char *PASSWORD = "thepassword";
// Need macros here because of the sizeof
#define CRLF "\r\n"
#define CR "\r"
#define STARTS_WITH(field_name, header) \
    (!strncasecmp(field_name, header, sizeof(header) - 1))

/* Parse HTTP request line, setting req_method, req_path, and req_version. */
static bool
http_parse_request(struct http_transaction *ta)
{
    size_t req_offset;
    ssize_t len = bufio_readline(ta->client->bufio, &req_offset);
    if (len < 2)       // error, EOF, or less than 2 characters
        return false;

    char *request = bufio_offset2ptr(ta->client->bufio, req_offset);
    request[len-2] = '\0';  // replace LF with 0 to ensure zero-termination
    char *endptr;
    char *method = strtok_r(request, " ", &endptr);
    if (method == NULL)
        return false;

    if (!strcmp(method, "GET"))
        ta->req_method = HTTP_GET;
    else if (!strcmp(method, "POST"))
        ta->req_method = HTTP_POST;
    else
        ta->req_method = HTTP_UNKNOWN;

    char *req_path = strtok_r(NULL, " ", &endptr);
    if (req_path == NULL)
        return false;

    ta->req_path = bufio_ptr2offset(ta->client->bufio, req_path);

    char *http_version = strtok_r(NULL, CR, &endptr);
    if (http_version == NULL)  // would be HTTP 0.9
        return false;

    // record client's HTTP version in request
    if (!strcmp(http_version, "HTTP/1.1"))
        ta->req_version = HTTP_1_1;
    else if (!strcmp(http_version, "HTTP/1.0"))
        ta->req_version = HTTP_1_0;
    else
        return false;

    return true;
}

/* Process HTTP headers. */
static bool
http_process_headers(struct http_transaction *ta)
{
    for (;;) {
        size_t header_offset;
        ssize_t len = bufio_readline(ta->client->bufio, &header_offset);
        if (len <= 0)
            return false;

        char *header = bufio_offset2ptr(ta->client->bufio, header_offset);
        if (len == 2 && STARTS_WITH(header, CRLF))       // empty CRLF
            return true;

        header[len-2] = '\0';
        /* Each header field consists of a name followed by a 
         * colon (":") and the field value. Field names are 
         * case-insensitive. The field value MAY be preceded by 
         * any amount of LWS, though a single SP is preferred.
         */
        char *endptr;
        char *field_name = strtok_r(header, ":", &endptr);
        if (field_name == NULL)
            return false;

        // skip white space
        char *field_value = endptr;
        while (*field_value == ' ' || *field_value == '\t')
            field_value++;

        // you may print the header like so
        // printf("Header: %s: %s\n", field_name, field_value);
        if (!strcasecmp(field_name, "Content-Length")) {
            ta->req_content_len = atoi(field_value);
        }

        /* Handle other headers here. Both field_value and field_name
         * are zero-terminated strings.
         */
    }
}

const int MAX_HEADER_LEN = 2048;

/* add a formatted header to the response buffer. */
void 
http_add_header(buffer_t * resp, char* key, char* fmt, ...)
{
    va_list ap;

    buffer_appends(resp, key);
    buffer_appends(resp, ": ");

    va_start(ap, fmt);
    char *error = buffer_ensure_capacity(resp, MAX_HEADER_LEN);
    int len = vsnprintf(error, MAX_HEADER_LEN, fmt, ap);
    resp->len += len > MAX_HEADER_LEN ? MAX_HEADER_LEN - 1 : len;
    va_end(ap);

    buffer_appends(resp, "\r\n");
}

/* add a content-length header. */
static void
add_content_length(buffer_t *res, size_t len)
{
    http_add_header(res, "Content-Length", "%ld", len);
}

/* start the response by writing the first line of the response 
 * to the response buffer.  Used in send_response_header */
static void
start_response(struct http_transaction * ta, buffer_t *res)
{
    buffer_init(res, 80);

    buffer_appends(res, "HTTP/1.0 ");

    switch (ta->resp_status) {
    case HTTP_OK:
        buffer_appends(res, "200 OK");
        break;
    case HTTP_PARTIAL_CONTENT:
        buffer_appends(res, "206 Partial Content");
        break;
    case HTTP_BAD_REQUEST:
        buffer_appends(res, "400 Bad Request");
        break;
    case HTTP_PERMISSION_DENIED:
        buffer_appends(res, "403 Permission Denied");
        break;
    case HTTP_NOT_FOUND:
        buffer_appends(res, "404 Not Found");
        break;
    case HTTP_METHOD_NOT_ALLOWED:
        buffer_appends(res, "405 Method Not Allowed");
        break;
    case HTTP_REQUEST_TIMEOUT:
        buffer_appends(res, "408 Request Timeout");
        break;
    case HTTP_REQUEST_TOO_LONG:
        buffer_appends(res, "414 Request Too Long");
        break;
    case HTTP_NOT_IMPLEMENTED:
        buffer_appends(res, "501 Not Implemented");
        break;
    case HTTP_SERVICE_UNAVAILABLE:
        buffer_appends(res, "503 Service Unavailable");
        break;
    case HTTP_INTERNAL_ERROR:
    default:
        buffer_appends(res, "500 Internal Server Error");
        break;
    }
    buffer_appends(res, CRLF);
}

/* Send response headers to client */
static bool
send_response_header(struct http_transaction *ta)
{
    buffer_t response;
    start_response(ta, &response);
    buffer_appends(&ta->resp_headers, CRLF);

    buffer_t *response_and_headers[2] = {
        &response, &ta->resp_headers
    };

    int rc = bufio_sendbuffers(ta->client->bufio, response_and_headers, 2);
    buffer_delete(&response);
    return rc != -1;
}

/* Send a full response to client with the content in resp_body. */
static bool
send_response(struct http_transaction *ta)
{
    // add content-length.  All other headers must have already been set.
    add_content_length(&ta->resp_headers, ta->resp_body.len);
    buffer_appends(&ta->resp_headers, CRLF);

    buffer_t response;
    start_response(ta, &response);

    buffer_t *response_and_headers[3] = {
        &response, &ta->resp_headers, &ta->resp_body
    };

    int rc = bufio_sendbuffers(ta->client->bufio, response_and_headers, 3);
    buffer_delete(&response);
    return rc != -1;
}

const int MAX_ERROR_LEN = 2048;

/* Send an error response. */
static bool
send_error(struct http_transaction * ta, enum http_response_status status, const char *fmt, ...)
{
    va_list ap;

    va_start(ap, fmt);
    char *error = buffer_ensure_capacity(&ta->resp_body, MAX_ERROR_LEN);
    int len = vsnprintf(error, MAX_ERROR_LEN, fmt, ap);
    ta->resp_body.len += len > MAX_ERROR_LEN ? MAX_ERROR_LEN - 1 : len;
    va_end(ap);
    ta->resp_status = status;
    http_add_header(&ta->resp_headers, "Content-Type", "text/plain");
    return send_response(ta);
}

/* Send Not Found response. */
static bool
send_not_found(struct http_transaction *ta)
{
    return send_error(ta, HTTP_NOT_FOUND, "File %s not found", 
        bufio_offset2ptr(ta->client->bufio, ta->req_path));
}

/* A start at assigning an appropriate mime type.  Real-world 
 * servers use more extensive lists such as /etc/mime.types
 */
static const char *
guess_mime_type(char *filename)
{
    char *suffix = strrchr(filename, '.');
    if (suffix == NULL)
        return "text/plain";

    if (!strcasecmp(suffix, ".html"))
        return "text/html";

    if (!strcasecmp(suffix, ".gif"))
        return "image/gif";

    if (!strcasecmp(suffix, ".png"))
        return "image/png";

    if (!strcasecmp(suffix, ".jpg"))
        return "image/jpeg";

    if (!strcasecmp(suffix, ".js"))
        return "text/javascript";

    // add extra check for file suffix
    if (!strcasecmp(suffix, ".css"))
        return "text/css";

    if (!strcasecmp(suffix, ".mp4"))
        return "video/mp4";

    if (!strcasecmp(suffix, ".svg"))
        return "image/svg+xml";
    
// add extra checks for proper files 
// make sure two dots are not present, path parsing ; follow code that gets to the static file serving 
// main function for handeling file is handle_transaction; add .. check in there; http error code do not serve file 

    return "text/plain";
}

/* Handle HTTP transaction for static files. */
static bool
handle_static_asset(struct http_transaction *ta, char *basedir)
{
    char fname[PATH_MAX];
    // extra char arrays to hold the file path 
    char alternative_path[PATH_MAX];
    char base_path[PATH_MAX];
    char *req_path = bufio_offset2ptr(ta->client->bufio, ta->req_path);
    // The code below is vulnerable to an attack.  Can you see
    // which?  Fix it to avoid indirect object reference (IDOR) attacks.

    if (strstr(req_path, "..") != NULL) {
        return send_error(ta, HTTP_NOT_FOUND, "Invalid path.");
    }
    snprintf(fname, sizeof fname, "%s%s", basedir, req_path);
    // check to see if the requested path has "/" 
    // also check if the requested file is not found then we update fname to /index.html
    if (strcmp(req_path, "/") == 0 || access(fname, R_OK) != 0) {
        snprintf(fname, sizeof fname, "%s/index.html", basedir);
    }
   //Resolve the file path and base directory path 
   // if any erorrs are found then return 404 Error
    if (!realpath(fname, alternative_path) || !realpath(basedir, base_path)) {  
        return send_not_found(ta);
    }
    // Checks if file path starts with resolved base directory 
    // Return 404 Error if it doesnt start with it 
    if (strncmp(alternative_path, base_path, strlen(base_path)) != 0) {
        return send_error(ta, HTTP_NOT_FOUND, "Invalid path.");
    
    }
    // Checks to see if file to be served is accessible
    // If it is not then send 404 Error
    if (access(fname, R_OK)) {
    
        return send_not_found(ta);
       
    }

    // Determine file size
    struct stat st;
    int rc = stat(fname, &st);
    if (rc == -1)
        return send_error(ta, HTTP_INTERNAL_ERROR, "Could not stat file.");

    int filefd = open(fname, O_RDONLY);
    if (filefd == -1) {
        return send_not_found(ta);
    }

    ta->resp_status = HTTP_OK;
    http_add_header(&ta->resp_headers, "Content-Type", "%s", guess_mime_type(fname));
    off_t from = 0, to = st.st_size - 1;

    off_t content_length = to + 1 - from;
    add_content_length(&ta->resp_headers, content_length);

    bool success = send_response_header(ta);
    if (!success)
        goto out;

    // sendfile may send fewer bytes than requested, hence the loop
    while (success && from <= to)
        success = bufio_sendfile(ta->client->bufio, filefd, &from, to + 1 - from) > 0;

out:
    close(filefd);
    return success;
}

static bool
handle_api(struct http_transaction *ta)
{
    // handle login and logout 
    char *buff = bufio_offset2ptr(ta->client->bufio, 0);
    char *path = buff + ta->req_body;

    if (STARTS_WITH(path, "/api/login") == 0) {
        if (ta->req_method == HTTP_POST) {
            return handle_api_post(ta);
        }
        else if (ta->req_method == HTTP_GET) {
            return handle_api_get(ta);
        }
        
    
    }
    else if ( STARTS_WITH(path, "/api/logout") == 0) {
        return handle_api_logout(ta);
    
    }

    return send_error(ta, HTTP_NOT_FOUND, "API not implemented");
   
}

/* Set up an http client, associating it with a bufio buffer. */
void 
http_setup_client(struct http_client *self, struct bufio *bufio)
{
    self->bufio = bufio;
}

/* Handle a single HTTP transaction.  Returns true on success. */
// handle different types of request
bool
http_handle_transaction(struct http_client *self)
{
    struct http_transaction ta;
    memset(&ta, 0, sizeof ta);
    ta.client = self;

    if (!http_parse_request(&ta))
        return false;

    if (!http_process_headers(&ta))
        return false;

    if (ta.req_content_len > 0) {
        int rc = bufio_read(self->bufio, ta.req_content_len, &ta.req_body);
        if (rc != ta.req_content_len)
            return false;

        // To see the body, use this:
        // char *body = bufio_offset2ptr(ta.client->bufio, ta.req_body);
        // hexdump(body, ta.req_content_len);
    }

    buffer_init(&ta.resp_headers, 1024);
    http_add_header(&ta.resp_headers, "Server", "CS3214-Personal-Server");
    buffer_init(&ta.resp_body, 0);

    bool rc = false;
    char *req_path = bufio_offset2ptr(ta.client->bufio, ta.req_path);
    if (STARTS_WITH(req_path, "/api")) {
        rc = handle_api(&ta);
    } else
    if (STARTS_WITH(req_path, "/private")) {
        /* not implemented */
    } 
    else {
        rc = handle_static_asset(&ta, server_root);
    }

    buffer_delete(&ta.resp_headers);
    buffer_delete(&ta.resp_body);

    return rc;
}
// helper function for get/post request authenticate 

static bool handle_api_post(struct http_transaction *ta) {
    char *buff = bufio_offset2ptr(ta->client->bufio, 0);
    char *body = buff + ta->req_body;
    // Parse the JSON body
    json_error_t err;
    json_t *req = json_loads(body, 0, &err);

    if (req == NULL) {
        return send_error(ta, HTTP_BAD_REQUEST, "BAD JSON REQUEST");
    }

    // Get the username and password from the json object

    const char *username, *password;

    if (json_unpack(req, "{s:s, s:s}", "username", &username, "password", &password) == -1) {
        return send_error(ta, HTTP_BAD_REQUEST, "Missing username and password!");
    }

    // If the username and password matches 
    if (strcmp(username, USERNAME) != 0 || strcmp(password, PASSWORD) != 0) {
        json_decref(req);
        return send_error(ta, HTTP_PERMISSION_DENIED, "Invalid username or password");
    
    }
    // free the object since it is no longer needed 
    json_decref(req);

    // create a token object
    jwt_t *token;
    int rc = jwt_new(&token);

    if (rc) {
        return send_error(ta, HTTP_INTERNAL_ERROR, "Error with token");
    }
    // Set the claim for token
    time_t tim = time(NULL);
    jwt_add_grant(token, "sub", USERNAME);
    jwt_add_grant_int(token, "iat", tim);
    jwt_add_grant_int(token, "exp", tim + 3600 * 24);

    // Set algo for secret key 
    jwt_set_alg(token, JWT_ALG_HS256, (unsigned char*)NEVER_EMBED_A_SECRET_IN_CODE, strlen(NEVER_EMBED_A_SECRET_IN_CODE));

    char *encode = jwt_encode_str(token);
    jwt_free(token);

    if (encode == NULL) {
        return send_error(ta, HTTP_INTERNAL_ERROR, "Error with encoding token");
    
    }

    // Try to set the cookie in the response header??
    
    http_add_header(&ta->resp_headers,"Set-Cookie: jwt=%s; Path=/; HttpOnly; SameSite=Lax; Max-Age=%d\r\n", encode, 3600 * 24 );
    

   json_t *claim = json_pack("{s:I, s:I, s:s}", "exp", tim + 3600 *24, "iat", tim, "sub", USERNAME);
   // convert the JSON object to string 
   char *str_claim = json_dumps(claim, 0);

   // free the object 
   json_decref(claim);
   // Append the claim string to request body 
   buffer_append(&ta->resp_body, str_claim, strlen(str_claim));
    // free string object
   free(str_claim);
   // free encoded JWT 
   free(encode);
   // Set response status 
   ta->resp_status = HTTP_OK;

   return true;

}
// Handle the get request 
static bool handle_api_get(struct http_transaction *ta) {
    // Gets the JWT cookie value from header
    char *cookie = get_jwt_cookie(ta);
    // If cookie value is found then decode it
    if (cookie != NULL) {
    jwt_t *decode_token;
    int rc = jwt_decode(&decode_token, cookie, (unsigned char *)NEVER_EMBED_A_SECRET_IN_CODE, strlen(NEVER_EMBED_A_SECRET_IN_CODE));
    // If sucessfull decoding then check if token is expired
    if (rc == 0) {
    // get the current time and expiration time
    time_t tim = time(NULL);
    time_t exp = jwt_get_grant_int(decode_token, "exp");
    // If the token is not expired extract the sub claim and return the JSON
    if (tim < exp) {
        const char *sub = jwt_get_grant(decode_token, "sub");
        json_t *claim = json_pack("{s:s, s:I, s:I}", "sub", sub, "iat", jwt_get_grant_int(decode_token, "iat"), "exp", exp);
        char *claim_str = json_dumps(claim, 0);
        buffer_append(&ta->resp_body, claim_str, strlen(claim_str));
        // Append the JSON object to the response body and set the status 
        json_decref(claim);
        free(claim_str);
        jwt_free(decode_token);

        ta->resp_status = HTTP_OK;
        free(cookie);
        return true;
        
    
    
    }
    else {
        json_t *empty_obect = json_object();
        char *str = json_dumps(empty_obect, 0);
        buffer_append(&ta->resp_body, str, strlen(str));
        json_decref(empty_obect);
        free(str);
        ta->resp_status = HTTP_OK;
        free(cookie);
        return true;
    }
    
    }
 }
 // If the JWT cookie is not found or invalid return empty JSON object
 buffer_appends(&ta->resp_body, "{}");
 ta->resp_status = HTTP_OK;
 return true;

}
// Handles the API logout
static bool handle_api_logout(struct http_transaction *ta) {
// Checks if the method is a post request
if (ta->req_method != HTTP_POST) {
    return send_error(ta, HTTP_NOT_FOUND, "API not implemented");
    }
    // set the JWT cookie header
    buffer_appends(&ta->resp_headers, "Set-Cookie: jwt=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0\r\n");
    // set the status 
    ta->resp_status = HTTP_OK;
    return true;
}
// JWT cookie checker in header
char *get_jwt_cookie(struct http_transaction *ta) {
    // gets value of cookie header in transaction
    const char *cookie = http_request_header(ta, "Cookie");
    // if the cookie header ecists then set prefix in header
    if (cookie != NULL) {
    
        const char *prefix = "jwt=";
        const char *start = strstr(cookie, prefix);
        // if the prefix is found, extract the JWT cookie value
        if (start != NULL) {
            start += strlen(prefix);
            const char *end = strchr(start, ';');
        //looks for semicolon
        // If it is found then JWT cookie value extends to the cookie header
            if (end == NULL) {
                end = cookie + strlen(cookie);
            
            }
            int length = end - start;
            // allocates memory to store the new JWT cookie value
            char *jwt_cookie = malloc(length + 1);
            // Checks if allocation is valid 
            if (jwt_cookie == NULL) {
                return NULL;
            }
            // Copy the JWT cookie value to the new string and add null terminator
            else {
            strncpy(jwt_cookie, start, length);
                jwt_cookie[length] = '\0';
                return jwt_cookie;
                
            }
            
    }

    }
    // return null if header does not exist
    return NULL;


}
// translate the cookie header
const char *http_request_header(struct http_transaction *ta, const char *header) {
    // Looks for the start of the header string in the response header
    const char *start = ta->resp_headers.buf;
    bool tracker = false;
    // loop until header is found or end of string 
    while (*start && !tracker) {
    // compares current position with the request header
        if (strncasecmp(start, header, strlen(header)) == 0) {
        // increment the pointer
            start += strlen(header);
            // checks to see if the value is a colon
            if (*start == ':') {
                start++;
                // checks to see if value is a space
                while (*start == ' ') {
                    start++;
                }
            // find the end of the header
            const char *end = strchr(start, '\r');
            if (end) {
            // calculate the length of header
                int length = end - start;
                // allocate memory for the header value string and null terminator
                char *value = malloc(length + 1);
                if (value) {
                //copy header value
                    strncpy(value, start, length);
                    value[length] = '\0';
                    // return value
                    return value;
                }

            
            
            }
            tracker = true;
        
        }
    
    
    
    }
    // find the next response in header and increment the pointer
    start = strchr(start, '\n');
    if (start) {
        start++;
    }

}
    return NULL;
}

// Serving files first - when request is made to server you should be able to return the file information through a file return protocol
// Authentication in file serving (#1)
// file streaming - streaming a very large file; return content of file but transfer part of a file at the same time; sending file piece by piece through a differnt request
// Server will be multithreaded; 
// fully understand http.c code 
// ipv6 support; lecture notes on independent socket programming
// curl localhost:4500/somepath
//right arrow get 


// server loop accepts connections
// http handle transactions is called everytime a connection is called
// add authentification there; not implemented 
//handlestaticasset
//handle api; figure out login stuff

//jwt 

// curl -v used to debug network connections; you can manually see what is coming in and out in the headers

//curl -i -T /home/ugrads/majors/kabeerb/CS3214/Projects/Personal_Server/pserv/src/http.c http://localhost:4521/



//curl request with an invalid file; 
// curl command to get a file: curl link /filname
// run -p 4521 -R /home/ugrads/majors/kabeerb/CS3214/Projects/Personal_Server/pserv/tests/test_root_data
// ./server_unit_te./server_unit_test_pserv.py -s /home/ugrads/majors/kabeerb/CS3214/Projects/Personal_Server/pserv/src/server 


// curl http localhost;