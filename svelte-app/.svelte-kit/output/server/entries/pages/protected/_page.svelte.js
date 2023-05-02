import { c as create_ssr_component, b as subscribe, v as validate_component, f as escape } from "../../../chunks/index2.js";
import { C as Container } from "../../../chunks/Offcanvas.svelte_svelte_type_style_lang.js";
import { R as Row } from "../../../chunks/Row.js";
import { u as user } from "../../../chunks/userstore.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $user, $$unsubscribe_user;
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_user();
  return `${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `${$user ? `${validate_component(Row, "Row").$$render($$result, {}, {}, {
        default: () => {
          return `<h1 class="mt-4">Welcome to a protected page</h1>
			<p>You are logged in as user <tt>${escape($user.sub)}</tt></p>`;
        }
      })}
		${validate_component(Row, "Row").$$render($$result, { class: "mt-1" }, {}, {
        default: () => {
          return `<p>Your token was issued at ${escape(new Date($user.iat * 1e3).toString())}, it expires ${escape(new Date($user.exp * 1e3).toString())}</p>`;
        }
      })}
		${validate_component(Row, "Row").$$render($$result, { class: "mt-1" }, {}, {
        default: () => {
          return `<p>This page is &quot;private&quot; only inasmuch as the front-end does not display it to unauthenticated
				users. In a fully-fledged app, this page would now perform API requests that require
				authentication.
			</p>`;
        }
      })}` : `${validate_component(Row, "Row").$$render($$result, {}, {}, {
        default: () => {
          return `<h1 class="mt-4">Not logged in - you should not be seeing this on the client</h1>
			<div><a href="/login">Log in</a></div>`;
        }
      })}`}`;
    }
  })}`;
});
export {
  Page as default
};
