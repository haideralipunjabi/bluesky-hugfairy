const URL = "https://bsky.social/xrpc/app.bsky.actor.getProfile/";

export default async function getProfile(
  identifier: string,
  access_token: string
): Promise<ProfileGetResponse | undefined> {
  if (!identifier) {
    return;
  }
  return await fetch(URL + `?actor=${identifier}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data["error"]) {
        return;
      }
      return data;
    });
}
