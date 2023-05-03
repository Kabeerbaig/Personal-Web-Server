import { c as create_ssr_component, v as validate_component, d as add_attribute, f as escape } from "../../chunks/index2.js";
import { v as version } from "../../chunks/environment.js";
import { C as Col } from "../../chunks/Col.js";
import { C as Container } from "../../chunks/Offcanvas.svelte_svelte_type_style_lang.js";
import { R as Row } from "../../chunks/Row.js";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".app-logo.svelte-cvaujw{height:19vmin;padding:1rem;width:100%}.cs3214-logo.svelte-cvaujw{height:19vmin;padding:1rem;width:100%}",
  map: null
};
const logo = "/images/svelte-logo.svg";
const cs3214 = "/images/cs3214.png";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Row, "Row").$$render($$result, { class: "mt-4" }, {}, {
        default: () => {
          return `<h1>CS3214 Demo App</h1>`;
        }
      })}
	${validate_component(Row, "Row").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Col, "Col").$$render($$result, { xs: { size: 9 }, md: { size: 6 } }, {}, {
            default: () => {
              return `<img alt="CS3214 logo"${add_attribute("src", cs3214, 0)} class="cs3214-logo svelte-cvaujw">`;
            }
          })}
		${validate_component(Col, "Col").$$render($$result, { xs: { size: 6 }, md: { size: 6 } }, {}, {
            default: () => {
              return `<img alt="Svelte Logo"${add_attribute("src", logo, 0)} class="app-logo svelte-cvaujw">`;
            }
          })}`;
        }
      })}
	${validate_component(Row, "Row").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Col, "Col").$$render($$result, { class: "mt-3" }, {}, {
            default: () => {
              return `<p class="lead">This small <a href="https://svelte.dev/">Svelte</a>${escape(" ")}
				version ${escape(version)}${escape(" ")}
				app shows how to use the JWT authentication facilities of your server in a single-page web application.
			</p>`;
            }
          })}`;
        }
      })}
	${validate_component(Row, "Row").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Col, "Col").$$render($$result, {}, {}, {
            default: () => {
              return `Click <a${add_attribute("href", `/protected`, 0)}>here</a> to navigate to a protected section of the app.
		`;
            }
          })}`;
        }
      })}`;
    }
  })}`;
});
export {
  Page as default
};
