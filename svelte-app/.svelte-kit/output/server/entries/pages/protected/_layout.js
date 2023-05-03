import { r as requireAuthentication } from "../../../chunks/auth.js";
async function load(loadArgs) {
  return requireAuthentication(loadArgs);
}
const prerender = false;
export {
  load,
  prerender
};
