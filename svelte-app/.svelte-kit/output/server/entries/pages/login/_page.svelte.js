import { c as create_ssr_component, h as compute_rest_props, k as spread, q as escape_object, p as escape_attribute_value, f as escape, d as add_attribute, t as compute_slots, v as validate_component } from "../../../chunks/index2.js";
import { u as user } from "../../../chunks/userstore.js";
import { c as classnames, C as Container } from "../../../chunks/Offcanvas.svelte_svelte_type_style_lang.js";
import { C as Col } from "../../../chunks/Col.js";
import { R as Row } from "../../../chunks/Row.js";
import { B as Button } from "../../../chunks/Button.js";
import { F as Form, a as FormGroup, L as Label, I as Input, B as ButtonToolbar } from "../../../chunks/Label.js";
import { t as toast } from "../../../chunks/auth.js";
function guard(name) {
  return () => {
    throw new Error(`Cannot call ${name}(...) on the server`);
  };
}
const goto = guard("goto");
const Alert = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let showClose;
  let classes;
  let closeClassNames;
  let $$restProps = compute_rest_props($$props, [
    "class",
    "children",
    "color",
    "closeClassName",
    "closeAriaLabel",
    "dismissible",
    "heading",
    "isOpen",
    "toggle",
    "fade",
    "transition"
  ]);
  let $$slots = compute_slots(slots);
  let { class: className = "" } = $$props;
  let { children = void 0 } = $$props;
  let { color = "success" } = $$props;
  let { closeClassName = "" } = $$props;
  let { closeAriaLabel = "Close" } = $$props;
  let { dismissible = false } = $$props;
  let { heading = void 0 } = $$props;
  let { isOpen = true } = $$props;
  let { toggle = void 0 } = $$props;
  let { fade = true } = $$props;
  let { transition = { duration: fade ? 400 : 0 } } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.children === void 0 && $$bindings.children && children !== void 0)
    $$bindings.children(children);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.closeClassName === void 0 && $$bindings.closeClassName && closeClassName !== void 0)
    $$bindings.closeClassName(closeClassName);
  if ($$props.closeAriaLabel === void 0 && $$bindings.closeAriaLabel && closeAriaLabel !== void 0)
    $$bindings.closeAriaLabel(closeAriaLabel);
  if ($$props.dismissible === void 0 && $$bindings.dismissible && dismissible !== void 0)
    $$bindings.dismissible(dismissible);
  if ($$props.heading === void 0 && $$bindings.heading && heading !== void 0)
    $$bindings.heading(heading);
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0)
    $$bindings.toggle(toggle);
  if ($$props.fade === void 0 && $$bindings.fade && fade !== void 0)
    $$bindings.fade(fade);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  showClose = dismissible || toggle;
  classes = classnames(className, "alert", `alert-${color}`, { "alert-dismissible": showClose });
  closeClassNames = classnames("btn-close", closeClassName);
  return `${isOpen ? `<div${spread(
    [
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { role: "alert" }
    ],
    {}
  )}>${heading || $$slots.heading ? `<h4 class="alert-heading">${escape(heading)}${slots.heading ? slots.heading({}) : ``}</h4>` : ``}
    ${showClose ? `<button type="button"${add_attribute("class", closeClassNames, 0)}${add_attribute("aria-label", closeAriaLabel, 0)}></button>` : ``}
    ${children ? `${escape(children)}` : `${slots.default ? slots.default({}) : ``}`}</div>` : ``}`;
});
const Card = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "body", "color", "inverse", "outline", "style"]);
  let { class: className = "" } = $$props;
  let { body = false } = $$props;
  let { color = "" } = $$props;
  let { inverse = false } = $$props;
  let { outline = false } = $$props;
  let { style = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.body === void 0 && $$bindings.body && body !== void 0)
    $$bindings.body(body);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.inverse === void 0 && $$bindings.inverse && inverse !== void 0)
    $$bindings.inverse(inverse);
  if ($$props.outline === void 0 && $$bindings.outline && outline !== void 0)
    $$bindings.outline(outline);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  classes = classnames(className, "card", inverse ? "text-white" : false, body ? "card-body" : false, color ? `${outline ? "border" : "bg"}-${color}` : false);
  return `<div${spread(
    [
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { style: escape_attribute_value(style) }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const CardBody = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  classes = classnames(className, "card-body");
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`;
});
const CardHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "tag"]);
  let { class: className = "" } = $$props;
  let { tag = "div" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  classes = classnames(className, "card-header");
  return `${tag === "h3" ? `<h3${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</h3>` : `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], {})}>${slots.default ? slots.default({}) : ``}</div>`}`;
});
const success = (m) => toast.push({
  msg: m,
  theme: {
    "--toastBackground": "green",
    "--toastColor": "white",
    "--toastBarBackground": "olive"
  }
});
const Loginform = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let username = "da user";
  let password = "thepassword";
  let { onSubmit } = $$props;
  let { autherror } = $$props;
  if ($$props.onSubmit === void 0 && $$bindings.onSubmit && onSubmit !== void 0)
    $$bindings.onSubmit(onSubmit);
  if ($$props.autherror === void 0 && $$bindings.autherror && autherror !== void 0)
    $$bindings.autherror(autherror);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(Form, "Form").$$render($$result, { method: "POST" }, {}, {
      default: () => {
        return `${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Label, "Label").$$render($$result, { for: "username" }, {}, {
              default: () => {
                return `Username`;
              }
            })}
		${validate_component(Input, "Input").$$render(
              $$result,
              {
                type: "text",
                name: "username",
                id: "username",
                value: username
              },
              {
                value: ($$value) => {
                  username = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}
	${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Label, "Label").$$render($$result, { for: "password" }, {}, {
              default: () => {
                return `Password`;
              }
            })}
		${validate_component(Input, "Input").$$render(
              $$result,
              {
                type: "password",
                name: "password",
                id: "password",
                value: password
              },
              {
                value: ($$value) => {
                  password = $$value;
                  $$settled = false;
                }
              },
              {}
            )}`;
          }
        })}
	${autherror ? `${validate_component(FormGroup, "FormGroup").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Alert, "Alert").$$render($$result, { color: "danger", role: "alert" }, {}, {
              default: () => {
                return `${escape(autherror)}`;
              }
            })}`;
          }
        })}` : ``}
	${validate_component(ButtonToolbar, "ButtonToolbar").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Button, "Button").$$render(
              $$result,
              {
                color: "primary",
                type: "submit",
                class: "me-1"
              },
              {},
              {
                default: () => {
                  return `Login`;
                }
              }
            )}
		${validate_component(Button, "Button").$$render($$result, { color: "secondary", type: "reset" }, {}, {
              default: () => {
                return `Reset`;
              }
            })}`;
          }
        })}`;
      }
    })}`;
  } while (!$$settled);
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let autherror = void 0;
  async function doLogin(v) {
    const urlParams = new URLSearchParams(window.location.search);
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v)
      });
      if (r.ok) {
        const userobj = await r.json();
        success("Logged in as " + userobj.sub);
        const dstpath = urlParams.get("next") || "/";
        console.log("login response json", userobj, "going to", dstpath);
        user.login(userobj);
        goto(dstpath);
      } else {
        autherror = await r.text();
        console.log("login error", autherror);
      }
    } catch (er) {
      console.log("login error", er);
      autherror = String(er);
    }
  }
  return `${validate_component(Container, "Container").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Row, "Row").$$render($$result, { class: "pb-5 pt-5" }, {}, {
        default: () => {
          return `${validate_component(Col, "Col").$$render(
            $$result,
            {
              xs: { size: "auto", offset: 0 },
              sm: { size: "auto", offset: 4 }
            },
            {},
            {
              default: () => {
                return `${validate_component(Card, "Card").$$render($$result, { class: "mx-auto" }, {}, {
                  default: () => {
                    return `${validate_component(CardHeader, "CardHeader").$$render($$result, {}, {}, {
                      default: () => {
                        return `<h3>Please log in</h3>`;
                      }
                    })}
				${validate_component(CardBody, "CardBody").$$render($$result, {}, {}, {
                      default: () => {
                        return `${validate_component(Loginform, "LoginForm").$$render($$result, { autherror, onSubmit: (v) => doLogin(v) }, {}, {})}`;
                      }
                    })}`;
                  }
                })}`;
              }
            }
          )}`;
        }
      })}`;
    }
  })}`;
});
export {
  Page as default
};
