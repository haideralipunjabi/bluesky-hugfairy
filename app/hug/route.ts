import { NextResponse } from "next/server";
import templates from "../../data/templates.json";
import { AtpSessionData, AtpSessionEvent, BskyAgent, RichText } from "@atproto/api";

function generateAnonPost(recieverHandle: string) {
  const template =
    templates["anonymous"][
      Math.floor(Math.random() * templates["anonymous"].length)
    ];
  return template.value.replace("$reciever", `@${recieverHandle}`);
}

function generateNormalPost(
  recieverHandle: string,
  senderHandle: string
) {
  const template =
    templates["normal"][Math.floor(Math.random() * templates["normal"].length)];
  const text = template.value
    .replace("$reciever", `@${recieverHandle}`)
    .replace("$sender", `@${senderHandle}`);
  return text;
}

function generatePost(
  recieverHandle: string,
  senderHandle: string | undefined,
) {
  if (senderHandle) {
    return generateNormalPost(
      recieverHandle,
      senderHandle
    );
  }
  return generateAnonPost(recieverHandle);
}

export async function POST(request: Request) {
  const { identifier, anonymous, senderHandle, senderDid } =
    await request.json();
    const agent = new BskyAgent({
      service: 'https://bsky.social',persistSession: (evt: AtpSessionEvent, sess?: AtpSessionData) => {
        // store the session-data for reuse
        console.log(evt, sess);
      },
    });
  await agent.login({ identifier: process.env.IDENTIFIER!, password: process.env.PASSWORD! }, )
  console.log("logged in ");
  const response = await agent.getProfile({
    actor: identifier
  });
  console.log(response);
  if (!response.success) {
    return NextResponse.json(
      {
        error: "Profile Not Found",
      },
      {
        status: 404,
      }
    );
  }
  const profile = response.data;
  const { handle: recieverHandle, did: recieverDid } = profile;
  const [sHandle] = anonymous
    ? [undefined, undefined]
    : [senderHandle, senderDid];
  if (recieverDid === senderDid) {
    return NextResponse.json(
      {
        error: "Can't send a hug to yourself",
      },
      {
        status: 400,
      }
    );
  }
  const text = generatePost(
    recieverHandle,
    sHandle,
  );
  const rt = new RichText({
    text: text,
  })
  await rt.detectFacets(agent) 
  agent.post({
    $type: 'app.bsky.feed.post',
    text: rt.text,
    facets: rt.facets,
    createdAt: new Date().toISOString(),
  })
  // Post(text, entities, accessJwt, did);
  return NextResponse.json({
    success: "Hugged",
  });
}
