import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getBackendClient from "lib/getBackendClient";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const client = await getBackendClient(cookieStore);
  const params = new URLSearchParams(request.url.split("?")[1]);
  const { session } = await client.callback(params);
  cookieStore.set("userDid", session.did);
  return NextResponse.redirect(
    new URL("https://hugfairy.haider.id", request.url),
  );
}
