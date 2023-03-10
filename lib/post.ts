const URL = "https://bsky.social/xrpc/com.atproto.repo.createRecord";

export default function Post(
  text: string,
  entities: Array<MentionEnitity>,
  access_token: string,
  did: string
) {
  return fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      did: did,
      collection: "app.bsky.feed.post",
      record: {
        $type: "app.bsky.feed.post",
        text: text,
        createdAt: new Date().toISOString(),
        entities: entities,
      },
    }),
  });
}
