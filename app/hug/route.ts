import { NextResponse } from "next/server";
import getProfile from "../../lib/getProfile";
import Login from "../../lib/login";
import templates from "../../data/templates.json";
import Post from "../../lib/post";

function generateAnonPost(recieverHandle: string, recieverDid: string) {
  const template =
    templates["anonymous"][
      Math.floor(Math.random() * templates["anonymous"].length)
    ];
  const text = template.value.replace("$reciever", recieverHandle);
  const entities = template.enitities;
  entities[0].index.end = entities[0].index.start + recieverHandle.length;
  entities[0].value = recieverDid;
  return {
    text,
    entities,
  };
}

function generateNormalPost(
  recieverHandle: string,
  recieverDid: string,
  senderHandle: string,
  senderDid: string
) {
  const template =
    templates["normal"][Math.floor(Math.random() * templates["normal"].length)];
  const text = template.value
    .replace("$reciever", recieverHandle)
    .replace("$sender", senderHandle);
  const entities = template.enitities;
  entities[0].index.end = entities[0].index.start + recieverHandle.length;
  entities[0].value = recieverDid;
  entities[1].index.start += recieverHandle.length;
  entities[1].index.end = entities[1].index.start + senderHandle.length;
  entities[1].value = senderDid;
  return {
    text,
    entities,
  };
}

function generatePost(
  recieverHandle: string,
  recieverDid: string,
  senderHandle: string | undefined,
  senderDid: string | undefined
) {
  if (senderHandle && senderDid) {
    return generateNormalPost(
      recieverHandle,
      recieverDid,
      senderHandle,
      senderDid
    );
  }
  return generateAnonPost(recieverHandle, recieverDid);
}

export async function POST(request: Request) {
  const { identifier, anonymous, senderHandle, senderDid } =
    await request.json();
  const { accessJwt, did } = await Login(
    process.env.IDENTIFIER,
    process.env.PASSWORD
  );
  const profile = await getProfile(identifier, accessJwt);
  if (!profile) {
    return NextResponse.json(
      {
        error: "Profile Not Found",
      },
      {
        status: 404,
      }
    );
  }
  const { handle: recieverHandle, did: recieverDid } =
    profile as ProfileGetResponse;
  const [sHandle, sDid] = anonymous
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
  const { text, entities } = generatePost(
    recieverHandle,
    recieverDid,
    sHandle,
    sDid
  );
  Post(text, entities, accessJwt, did);
  return NextResponse.json({
    success: "Hugged",
  });
}
