import { NextResponse } from "next/server";
import templates from "../../data/templates.json";
import { Agent, CredentialSession, RichText } from "@atproto/api";
import { getLoggedInUser } from "lib/getBackendClient";
import { cookies } from "next/headers";

function generateAnonPost(recieverHandle: string) {
  const template =
    templates["anonymous"][
      Math.floor(Math.random() * templates["anonymous"].length)
    ];
  return template.value.replace("$reciever", `@${recieverHandle}`);
}

function generateNormalPost(recieverHandle: string, senderHandle: string) {
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
    return generateNormalPost(recieverHandle, senderHandle);
  }
  return generateAnonPost(recieverHandle);
}

export async function POST(request: Request) {
  const { identifier, anonymous } = await request.json();
  const cookieStore = await cookies();
  const senderProfile = await getLoggedInUser(cookieStore);
  if (!senderProfile) {
    return NextResponse.json(
      {
        error: "You are not logged in!",
      },
      {
        status: 404,
      },
    );
  }
  const { handle: senderHandle, did: senderDid } = senderProfile;
  const session = new CredentialSession(new URL("https://bsky.social"));
  await session.login({
    identifier: process.env.IDENTIFIER!,
    password: process.env.PASSWORD!,
  });
  const agent = new Agent(session);
  const response = await agent
    .getProfile({
      // eslint-disable-next-line no-control-regex
      actor: identifier.replace(/[^\x00-\x7F]/g, ""),
    })
    .catch((r) => r);

  if (!response.success) {
    return NextResponse.json(
      {
        error: "Profile Not Found",
      },
      {
        status: 404,
      },
    );
  }
  const { handle: recieverHandle, did: recieverDid } = response.data;

  if (recieverDid === senderDid) {
    return NextResponse.json(
      {
        error: "Can't send a hug to yourself",
      },
      {
        status: 400,
      },
    );
  }
  const text = generatePost(
    recieverHandle,
    anonymous ? undefined : senderHandle,
  );
  const rt = new RichText({
    text: text,
  });
  await rt.detectFacets(agent);
  agent.post({
    $type: "app.bsky.feed.post",
    text: rt.text,
    facets: rt.facets,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({
    success: "Hugged",
  });
}
