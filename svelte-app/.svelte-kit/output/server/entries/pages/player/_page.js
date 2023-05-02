import { r as requireAuthentication } from "../../../chunks/auth.js";
async function load(loadArgs) {
  const user = await requireAuthentication(loadArgs);
  const { fetch } = loadArgs;
  const res = await fetch("/api/video");
  const videos = res.json();
  return { videos, user };
}
const ssr = false;
export {
  load,
  ssr
};
