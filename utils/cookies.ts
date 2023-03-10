import { serialize } from "cookie";

export function setCookies(cookies: object) {
  Object.entries(cookies).forEach(([key, value]) => {
    document.cookie = serialize(key, value, {
      sameSite: "strict",
      path: "/",
    });
  });
}
