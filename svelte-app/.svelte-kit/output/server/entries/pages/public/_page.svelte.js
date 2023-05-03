import { c as create_ssr_component, v as validate_component } from "../../../chunks/index2.js";
import { C as Container } from "../../../chunks/Offcanvas.svelte_svelte_type_style_lang.js";
import { R as Row } from "../../../chunks/Row.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Container, "Container").$$render($$result, { class: "mt-4" }, {}, {
    default: () => {
      return `<h1>Welcome to a public page</h1>
	${validate_component(Row, "Row").$$render($$result, { class: "mt-3" }, {}, {
        default: () => {
          return `<p>This public page is accessible to anyone.</p>`;
        }
      })}`;
    }
  })}`;
});
export {
  Page as default
};
