import getBackendClient from "lib/getBackendClient";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const client = await getBackendClient(cookieStore);
  return NextResponse.json(client.jwks);
}
