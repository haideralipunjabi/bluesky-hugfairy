import { NextResponse } from "next/server";
import templates from "../../data/templates.json";
import { Agent, CredentialSession, RichText } from "@atproto/api";
import { getLoggedInUser } from "lib/getBackendClient";
import { cookies } from "next/headers";
import { SupabaseClientHelper } from "lib/getSupabaseClient";
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

async function verifyFollowing(agent: Agent, senderDid: string) {
  const senderProfile = await agent.getProfile({
    actor: senderDid,
  });
  return senderProfile.data.viewer?.followedBy != null;
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
  const supabaseHelper = new SupabaseClientHelper();
  await supabaseHelper.authorize();
  const { handle: senderHandle, did: senderDid } = senderProfile;
  const session = new CredentialSession(new URL("https://bsky.social"));
  await session.login({
    identifier: process.env.IDENTIFIER!,
    password: process.env.PASSWORD!,
  });
  const agent = new Agent(session);
  if (!(await verifyFollowing(agent, senderDid!))) {
    return NextResponse.json(
      {
        error: "Please follow us first!",
      },
      {
        status: 404,
      },
    );
  }
  const freeHugs = await supabaseHelper.getRemainingFreeHugs(senderDid!);
  const premiumHugs = await supabaseHelper.getRemainingPremiumHugs(senderDid!);

  if (freeHugs + premiumHugs == 0) {
    return NextResponse.json(
      {
        error: "You can't send more hugs today!",
      },
      {
        status: 500,
      },
    );
  }
  const response = await agent
    .getProfile({
      // eslint-disable-next-line no-control-regex
      actor: identifier.replace(/[^\x00-\x7F]/g, "").replace("@", ""),
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
  const created_at = new Date().toISOString();
  agent.post({
    $type: "app.bsky.feed.post",
    text: rt.text,
    facets: rt.facets,
    createdAt: created_at,
  });
  await supabaseHelper.logHug(
    anonymous,
    created_at,
    senderDid!,
    recieverDid!,
    freeHugs == 0,
  );
  return NextResponse.json({
    success: "Hugged",
  });
}
