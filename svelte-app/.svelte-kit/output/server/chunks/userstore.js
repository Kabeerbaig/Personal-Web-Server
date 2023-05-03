import { w as writable } from "./index.js";
import { g as getUser } from "./auth.js";
function createUser() {
  const { subscribe, set } = writable(void 0, function start(set2) {
    getUser().then((user2) => set2(user2));
    return () => {
    };
  });
  return {
    subscribe,
    logout: () => set(null),
    login: (user2) => {
      set(user2);
    }
  };
}
const user = createUser();
export {
  user as u
};
