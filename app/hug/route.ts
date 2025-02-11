import { NextResponse } from "next/server";
import templates from "../../data/templates.json";
import { Agent, CredentialSession, RichText } from "@atproto/api";
import { getLoggedInUser } from "lib/getBackendClient";
import { cookies } from "next/headers";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";

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

async function checkDailyHugLimit(
  supabase: SupabaseClient<Database>,
  senderDid: string,
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Start of tomorrow
  const { count, error } = await supabase
    .from("hugs")
    .select("*", { count: "exact" }) // Important for accurate counts
    .eq("sender", senderDid)
    .gte("created_at", today.toISOString()) // Greater than or equal to start of today
    .lt("created_at", tomorrow.toISOString()); // Less than start of tomorrow

  if (error) {
    throw error;
  }
  return (count || 0) <= 3;
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
  const supabaseURL = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  if (supabaseURL == null || supabaseKey == null) {
    return NextResponse.json(
      {
        error: "Server Error",
      },
      {
        status: 500,
      },
    );
  }
  const supabase = createClient<Database>(supabaseURL, supabaseKey);

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
  if (!(await checkDailyHugLimit(supabase, senderDid!))) {
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
  const created_at = new Date().toISOString();
  agent.post({
    $type: "app.bsky.feed.post",
    text: rt.text,
    facets: rt.facets,
    createdAt: created_at,
  });
  await supabase.from("hugs").insert({
    anonymous: anonymous,
    created_at: created_at,
    sender: senderDid!,
    recipient: recieverDid!,
  });
  return NextResponse.json({
    success: "Hugged",
  });
}
