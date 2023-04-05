
const URL = "https://bsky.social/xrpc/com.atproto.repo.createRecord";

export default function Post(
  text: string,
  entities: Array<MentionEnitity>,
  access_token: string,
  did: string
) {
  console.log("Hugging");
  console.log(text);
  console.log(entities);
  console.log(did);
  console.log(access_token)
  return fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      repo: did,
      collection: "app.bsky.feed.post",
      record: {
        $type: "app.bsky.feed.post",
        text: text,
        createdAt: new Date().toISOString(),
        entities: entities,
      },
    }),
  }).catch((error)=>{
      console.log(error)
  })
}
