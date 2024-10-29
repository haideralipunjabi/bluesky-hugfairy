import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getBackendClient, { BASE_URL } from "lib/getBackendClient";

const baseURL = new URL(BASE_URL);
export async function GET(request: Request) {
  const data = new URLSearchParams(request.url.split("?")[1]);
  const identifier = data.get("identifier")?.toString();
  if (!identifier) {
    baseURL.searchParams.set("error", "An identifier is required!");
    return NextResponse.redirect(baseURL);
  }
  try {
    const cookieStore = await cookies();
    const client = await getBackendClient(cookieStore);
    const url = await client.authorize(identifier, {
      state: "8T-Qmf34lT-NLFdPW7wwfA",
    });
    return NextResponse.redirect(url);
  } catch (e: unknown) {
    let message = "Error occured";
    if (typeof e === "string") {
      message = e.toUpperCase(); // works, `e` narrowed to string
    } else if (e instanceof Error) {
      message = e.message; // works, `e` narrowed to Error
    }
    baseURL.searchParams.set("error", message);
    return NextResponse.redirect(baseURL);
  }
}
