import { clientMetadata } from "lib/getBackendClient";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(clientMetadata);
}
