const URL = "https://bsky.social/xrpc/com.atproto.server.createSession";

export default function Login(
  identifier: string | undefined,
  password: string | undefined
): Promise<LoginResponse> {
  if (!identifier || !password) {
    throw "Invalid Params";
  }
  return fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier,
      password,
    }),
  }).then(async (response) => {
    if (response.status != 200) {
      throw await response.json();
    }
    return await response.json();
  });
}
