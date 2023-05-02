import { c as create_ssr_component, u as is_promise, w as noop } from "../../../chunks/index2.js";
import { u as user } from "../../../chunks/userstore.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  data.ntl.logout.then(() => {
    user.logout();
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
	<div>Logging out...</div>
`;
    }
    return function(r) {
      return `
	${r.ok ? `<div>Logged out <a href="/">click here if it doesn&#39;t redirect</a></div>` : `<div>Logout failed</div>`}
`;
    }(__value);
  }(data.ntl.logout)}`;
});
export {
  Page as default
};
