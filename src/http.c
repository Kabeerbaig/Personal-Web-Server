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
#include <dirent.h>
#include "http.h"
#include "hexdump.h"
#include "socket.h"
#include "bufio.h"
#include "main.h"

#include <jwt.h>
#include <jansson.h>

// Static Variables
static const char *NEVER_EMBED_A_SECRET_IN_CODE = "supa secret";
static const char *USERNAME = "user0";
static const char *PASSWORD = "thepassword";

// Helper Functions
static bool handle_api_post(struct http_transaction *ta);
static bool handle_api_get(struct http_transaction *ta);
static bool handle_api_logout(struct http_transaction *ta);
static bool streaming_MP4(struct http_transaction *ta);

// Need macros here because of the sizeof
#define CRLF "\r\n"
#define CR "\r"
#define STARTS_WITH(field_name, header) \
    (!strncasecmp(field_name, header, sizeof(header) - 1))

/* Parse HTTP request line, setting req_method, req_path, and req_version. */
static bool http_parse_request(struct http_transaction *ta)
{
    size_t req_offset;
    ssize_t len = bufio_readline(ta->client->bufio, &req_offset);
    if (len < 2) // error, EOF, or less than 2 characters
        return false;

    char *request = bufio_offset2ptr(ta->client->bufio, req_offset);
    request[len - 2] = '\0'; // replace LF with 0 to ensure zero-termination
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
    if (http_version == NULL) // would be HTTP 0.9
        return false;

    // record client's HTTP version in request
    if (!strcmp(http_version, "HTTP/1.1"))
        ta->req_version = HTTP_1_1;
    else if (!strcmp(http_version, "HTTP/1.0"))
    {
        ta->req_version = HTTP_1_0;
        ta->persist = false;
    }
    else
        return false;

    return true;
}

/* Process HTTP headers. */
static bool
http_process_headers(struct http_transaction *ta)
{
    if (ta->req_version == HTTP_1_1)
    {
        ta->persist = true;
    }

    for (;;)
    {
        size_t header_offset;
        ssize_t len = bufio_readline(ta->client->bufio, &header_offset);
        if (len <= 0)
            return false;

        char *header = bufio_offset2ptr(ta->client->bufio, header_offset);
        if (len == 2 && STARTS_WITH(header, CRLF)) // empty CRLF
            return true;

        header[len - 2] = '\0';
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
        if (!strcasecmp(field_name, "Content-Length"))
        {
            ta->req_content_len = atoi(field_value);
        }

        /* Handle other headers here. Both field_value and field_name
         * are zero-terminated strings.
         */

        if (!strcasecmp(field_name, "Connection"))
        {

            if (!strcasecmp(field_value, "Close"))
            {
                ta->persist = false;
            }
        }

        if (!strcasecmp(field_name, "Cookie"))
        {
            char *encoded_cookie = field_value;

            char *token = strstr(encoded_cookie, "auth_token="); // tokenize the string by semicolon delimiter

            if (token == NULL)
            {
                ta->authenticated = false;
                continue;
            }
            token += strlen("auth_token=");
            // printf("Cookie: %s\n", token);

            jwt_t *ymtoken;
            jwt_decode(&ymtoken, token, (unsigned char *)NEVER_EMBED_A_SECRET_IN_CODE, strlen(NEVER_EMBED_A_SECRET_IN_CODE));

            char *grants = jwt_get_grants_json(ymtoken, NULL);
            if (grants == NULL)
            {
                ta->authenticated = false;
                continue;
            }
            json_error_t error;

            json_t *jgrants = json_loadb(grants, strlen(grants), 0, &error);
            if (jgrants == NULL)
            {
                ta->authenticated = false;
                continue;
            }

            json_int_t exp, iat;
            const char *sub;
            json_unpack(jgrants, "{s:I, s:I, s:s}",
                        "exp", &exp, "iat", &iat, "sub", &sub);

            time_t now = time(NULL);

            if (now < exp)
            {
                ta->token = grants;
                ta->authenticated = true;
            }
            else
            {
                ta->authenticated = false;
            }
        }
        if (!strcasecmp(field_name, "Range"))
        {
            // check for bytes in header value
            const char *str = "bytes=";
            // gets the length of the byte value
            size_t str_length = strlen(str);
            // checks if the field value starts with bytes
            if (strncmp(field_value, str, str_length) == 0)
            {
                // Find the position of the dash character (does the parsing)
                char *value = strchr(field_value + str_length, '-');
                // checks if the character was found
                if (value && value != field_value + str_length)
                {
                    // converts the string before the dash to represent the start range

                    long start = strtol(field_value + str_length, NULL, 10);
                    // represents the end range
                    long end;
                    if (strlen(value + 1) > 0)
                    {
                        end = strtol(value + 1, NULL, 10);
                    }
                    else
                    {
                        end = -1;
                    }
                    // sets the values for the target struct, I added these variables
                    ta->range_begin = start;
                    ta->range_end = end;
                    ta->range_flag = true;
                }
            }
        }
    }
}

const int MAX_HEADER_LEN = 2048;

/* add a formatted header to the response buffer. */
void http_add_header(buffer_t *resp, char *key, char *fmt, ...)
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
start_response(struct http_transaction *ta, buffer_t *res)
{
    buffer_init(res, 80);

    buffer_appends(res, "HTTP/1.0 ");

    switch (ta->resp_status)
    {
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
        &response, &ta->resp_headers};

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
        &response, &ta->resp_headers, &ta->resp_body};

    int rc = bufio_sendbuffers(ta->client->bufio, response_and_headers, 3);
    buffer_delete(&response);
    return rc != -1;
}

const int MAX_ERROR_LEN = 2048;

/* Send an error response. */
static bool
send_error(struct http_transaction *ta, enum http_response_status status, const char *fmt, ...)
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

    char *req_path = bufio_offset2ptr(ta->client->bufio, ta->req_path);
    // The code below is vulnerable to an attack.  Can you see
    // which?  Fix it to avoid indirect object reference (IDOR) attacks.

    if (strstr(req_path, "..") != NULL)
    {
        return send_error(ta, HTTP_NOT_FOUND, "Invalid path.");
    }

    snprintf(fname, sizeof fname, "%s%s", basedir, req_path);

    if (html5_fallback)
    {
        char *alternative_path = realpath(fname, NULL);

        // check to see if the requested path has "/"
        // also check if the requested file is not found then we update fname to /index.html
        if (strcasecmp(req_path, "/") == 0)
        {
            snprintf(fname, sizeof fname, "%s/index.html", basedir);
        }

        // If file cannot be found, return 200.html
        else if (alternative_path == NULL)
        {
            // alternative_path = realpath("/200.html", NULL);
            // if (alternative_path == NULL)
            // {
            //     return send_not_found(ta);
            // }
            snprintf(fname, sizeof fname, "%s/200.html", basedir);
        }
        // Checks if file path starts with resolved base directory
        // Return 404 Error if it doesnt start with it
        else if (alternative_path != NULL)
        {

            if (strstr(alternative_path, ".") != NULL)
            {
                snprintf(fname, sizeof fname, "%s", alternative_path);
            }
            else
            {
                snprintf(fname, sizeof fname, "%s.html", alternative_path);
            }

            free(alternative_path);
        }
    }

    if (access(fname, R_OK))
    {
        if (errno == EACCES)
            return send_error(ta, HTTP_PERMISSION_DENIED, "Permission denied.");
        else
            return send_not_found(ta);
    }

    // Determine file size
    struct stat st;
    int rc = stat(fname, &st);
    if (rc == -1)
        return send_error(ta, HTTP_INTERNAL_ERROR, "Could not stat file.");

    int filefd = open(fname, O_RDONLY);
    if (filefd == -1)
    {
        return send_not_found(ta);
    }

    ta->resp_status = HTTP_OK;
    http_add_header(&ta->resp_headers, "Content-Type", "%s", guess_mime_type(fname));
    off_t from = 0, to = st.st_size - 1;
    // Handle the Range header
    if (ta->range_flag)
    {
        // set the from range
        from = ta->range_begin;

        if (ta->range_end != -1)
        {
            // set the to range
            to = ta->range_end;
        }
        else
        {
            // set to range to the last found byte
            to = st.st_size - 1;
        }
        // check to see if requested value is valid
        if (to >= st.st_size || from > to)
        {
            return send_error(ta, HTTP_BAD_REQUEST, "Invalid byte range");
        }
        // set response to HTTP_PARTIAL_CONTENT if valid range
        ta->resp_status = HTTP_PARTIAL_CONTENT;
        // add proper header response
        http_add_header(&ta->resp_headers, "Content-Range", "bytes %jd-%jd/%jd", from, to, st.st_size);
    }
    else
    {
        // if no range is provided set from and last to last byte
        from = 0;
        to = st.st_size - 1;
        ta->resp_status = HTTP_OK;
    }
    http_add_header(&ta->resp_headers, "Accept-Ranges", "bytes");
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
    char *req_path = bufio_offset2ptr(ta->client->bufio, ta->req_path);

    if (STARTS_WITH(req_path, "/api/login"))
    {
        if (strcasecmp(req_path, "/api/login") != 0)
        {
            return send_not_found(ta);
        }

        if (ta->req_method == HTTP_POST)
        {
            return handle_api_post(ta);
        }
        else if (ta->req_method == HTTP_GET)
        {
            return handle_api_get(ta);
        }
        else
        {
            return send_error(ta, HTTP_METHOD_NOT_ALLOWED, "Method not allowed");
        }
    }
    else if (STARTS_WITH(req_path, "/api/logout"))
    {
        if (ta->req_method != HTTP_GET || ta->req_method != HTTP_POST)
        {
            return send_error(ta, HTTP_METHOD_NOT_ALLOWED, "Method not allowed");
        }
        return handle_api_logout(ta);
    }
    else if (STARTS_WITH(req_path, "/api/video"))
    {
        return streaming_MP4(ta);
    }
    return send_error(ta, HTTP_NOT_FOUND, "API not implemented");
}

/* Set up an http client, associating it with a bufio buffer. */
void http_setup_client(struct http_client *self, struct bufio *bufio)
{
    self->bufio = bufio;
}

/* Handle a single HTTP transaction.  Returns true on success. */
bool http_handle_transaction(struct http_client *self)
{
    struct http_transaction ta;
    memset(&ta, 0, sizeof ta);
    ta.client = self;

    if (!http_parse_request(&ta))
        return false;

    if (!http_process_headers(&ta))
        return false;

    if (ta.req_content_len > 0)
    {
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

    if (ta.req_version == HTTP_1_1)
    {
        http_add_header(&ta.resp_headers, "Connection", "keep-alive");
    } // add a response header
    if (ta.req_version == HTTP_1_0)
    {
        http_add_header(&ta.resp_headers, "Connection", "close");
    }

    bool rc = false;
    char *req_path = bufio_offset2ptr(ta.client->bufio, ta.req_path);
    printf("THE PATH: %s\n", req_path);

    if (STARTS_WITH(req_path, "/api"))
    {
        rc = handle_api(&ta);
    }
    else if (STARTS_WITH(req_path, "/private"))
    {
        if (ta.authenticated)
        {
            rc = handle_static_asset(&ta, server_root);
        }
        else
        {
            send_error(&ta, HTTP_PERMISSION_DENIED, "Permission Denied.");
        }
    }
    else
    {
        rc = handle_static_asset(&ta, server_root);
    }

    buffer_delete(&ta.resp_headers);
    buffer_delete(&ta.resp_body);

    ta.client->persist = ta.persist;

    return rc;
}

static bool handle_api_post(struct http_transaction *ta)
{
    char *buff = bufio_offset2ptr(ta->client->bufio, 0);
    char *body = buff + ta->req_body;

    // Parse the JSON body
    json_error_t err;
    json_t *req = json_loadb(body, ta->req_content_len, 0, &err);

    if (req == NULL)
    {
        return send_error(ta, HTTP_BAD_REQUEST, "BAD JSON REQUEST");
    }
    // Get the username and password from the json object
    const char *username, *password;
    if (json_unpack(req, "{s:s, s:s}", "username", &username, "password", &password) == -1)
    {
        return send_error(ta, HTTP_BAD_REQUEST, "Missing username and password!");
    }

    if (username == NULL || password == NULL)
    {
        return send_error(ta, HTTP_PERMISSION_DENIED, "Acess permission denied");
    }
    // If the username and password matches
    if (strcmp(username, USERNAME) == 0 && strcmp(password, PASSWORD) == 0)
    {
        // free the object since it is no longer needed
        json_decref(req);

        // create a token object
        jwt_t *mytoken;
        int rc = jwt_new(&mytoken);
        if (rc)
        {
            return send_error(ta, HTTP_INTERNAL_ERROR, "jwt_new");
        }
        // Set the claim for token
        rc = jwt_add_grant(mytoken, "sub", USERNAME);
        if (rc)
            return send_error(ta, HTTP_INTERNAL_ERROR, "jwt_add_grant sub");

        time_t tim = time(NULL);
        rc = jwt_add_grant_int(mytoken, "iat", tim);
        if (rc)
            return send_error(ta, HTTP_INTERNAL_ERROR, "jwt_add_grant iat");

        rc = jwt_add_grant_int(mytoken, "exp", tim + 3600 * 24);
        if (rc)
            return send_error(ta, HTTP_INTERNAL_ERROR, "jwt_add_grant exp");

        // Set algo for secret key
        rc = jwt_set_alg(mytoken, JWT_ALG_HS256, (unsigned char *)NEVER_EMBED_A_SECRET_IN_CODE, strlen(NEVER_EMBED_A_SECRET_IN_CODE));
        if (rc)
            return send_error(ta, HTTP_INTERNAL_ERROR, "jwt_set_alg");

        char *encoded = jwt_encode_str(mytoken);

        if (encoded == NULL)
        {
            return send_error(ta, HTTP_INTERNAL_ERROR, "Error with encoding token");
        }

        http_add_header(&ta->resp_headers, "Set-Cookie", "auth_token=%s; Path=/; Max-Age=%ld; SameSite=Lax; HttpOnly", encoded, token_expiration_time);

        json_t *claim = json_pack("{s:I, s:I, s:s}", "exp", tim + 3600 * 24, "iat", tim, "sub", USERNAME);
        // convert the JSON object to string
        char *str_claim = json_dumps(claim, 0);

        jwt_free(mytoken);
        // free the object
        json_decref(claim);

        // Append the claim string to request body
        buffer_appends(&ta->resp_body, str_claim);
        // Set response status
        ta->resp_status = HTTP_OK;

        http_add_header(&ta->resp_headers, "Content-Type", "application/json");

        return send_response(ta);
    }

    json_decref(req);
    return send_error(ta, HTTP_PERMISSION_DENIED, "Invalid username or password");
}

// Handle the get request
static bool handle_api_get(struct http_transaction *ta)
{
    if (ta->authenticated)
    {
        buffer_appends(&ta->resp_body, ta->token);
        http_add_header(&ta->resp_headers, "Content-Type", "application/json");
        ta->resp_status = HTTP_OK;

        return send_response(ta);
    }

    buffer_appends(&ta->resp_body, "{}");
    http_add_header(&ta->resp_headers, "Content-Type", "application/json");
    ta->resp_status = HTTP_OK;
    return send_response(ta);
}

// Handles the API logout
static bool handle_api_logout(struct http_transaction *ta)
{
    // Checks if the method is a post request
    if (ta->req_method != HTTP_POST)
    {
        return send_error(ta, HTTP_NOT_FOUND, "API not implemented");
    }
    ta->authenticated = false;
    ta->token = NULL;
    // set the JWT cookie header
    http_add_header(&ta->resp_headers, "Set-Cookie", "auth_token=%s; Path=/; Max-Age=%ld; HttpOnly", "", 0);

    http_add_header(&ta->resp_headers, "Content-Type", "application/json");
    buffer_appends(&ta->resp_body, "{Logging out}");

    // set the status
    ta->resp_status = HTTP_OK;
    return send_response(ta);
}

// handles stream of videos
static bool streaming_MP4(struct http_transaction *ta)
{
    // printf("MADE HERE\n");

    // pointer to a dir struct
    DIR *dirk;
    // represents a directory entry
    struct dirent *path;

    // opens the directory and returns a pointer to DIR struct
    dirk = opendir(server_root);
    // error check
    if (dirk == NULL)
    {
        return NULL;
    }
    // stores response string

    json_t *array = json_array();
    // loops through each entry in the direvtory

    while ((path = readdir(dirk)) != NULL)
    {

        // search for last occurance of character
        char *exit = strstr(path->d_name, ".mp4");
        // checks for proper extention
        if (exit != NULL && strcmp(exit, ".mp4") == 0)
        {
            // retreive information about file
            struct stat file;

            char fname[PATH_MAX];
            snprintf(fname, sizeof(fname), "%s/%s", server_root, path->d_name);

            // gets information on the file
            if (stat(fname, &file) == -1)
            {
                continue;
            }
            json_t *video = json_object();
            json_object_set_new(video, "size", json_integer(file.st_size));
            json_object_set_new(video, "name", json_string(path->d_name));
            json_array_append_new(array, video);
        }
    }
    // close the direvtory stream
    char *resp = json_dumps(array, JSON_INDENT(2));

    printf("HERE IS THE RESP: %s\n", resp);
    http_add_header(&ta->resp_headers, "Content-Type", "application/json");
    buffer_appends(&ta->resp_body, resp);
    ta->resp_status = HTTP_OK;
    json_decref(array);

    closedir(dirk);

    return send_response(ta);
}

// Serving files first - when request is made to server you should be able to return the file information through a file return protocol
// Authentication in file serving (#1)
// file streaming - streaming a very large file; return content of file but transfer part of a file at the same time; sending file piece by piece through a differnt request
// Server will be multithreaded;
// fully understand http.c code
// ipv6 support; lecture notes on independent socket programming
// curl localhost:4500/somepath
// right arrow get

// server loop accepts connections
// http handle transactions is called everytime a connection is called
// add authentification there; not implemented
// handlestaticasset
// handle api; figure out login stuff

// jwt

// curl -v used to debug network connections; you can manually see what is coming in and out in the headers
