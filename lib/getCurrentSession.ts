export default function getCurrentSession(
  access_token: string
): Promise<SessionGetResponse> {
  return fetch("https://bsky.social/xrpc/com.atproto.server.getSession", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  })
    .then((response) => response.json())
    .then((data: SessionGetResponse) => data);
}
