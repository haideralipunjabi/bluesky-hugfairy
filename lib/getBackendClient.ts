import { JoseKey } from "@atproto/jwk-jose";
import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import process from "process";
import { SessionStore, StateStore } from "./storage";
import { Agent } from "@atproto/api";

export const BASE_URL = "https://hugfairy.haider.id";
export const clientMetadata = {
  client_id: `${BASE_URL}/client-metadata.json`,
  client_name: "Hugfairy",
  client_uri: BASE_URL,
  logo_uri: `${BASE_URL}/logo.png`,
  redirect_uris: [`${BASE_URL}/callback`],
  scope: "atproto transition:generic",
  grant_types: ["authorization_code", "refresh_token"],
  response_types: ["code"],
  token_endpoint_auth_method: "private_key_jwt",
  token_endpoint_auth_signing_alg: "ES256",
  application_type: "web",
  dpop_bound_access_tokens: true,
  jwks_uri: `${BASE_URL}/jwks.json`,
};

export default async function getBackendClient(
  cookieStore: ReadonlyRequestCookies,
): Promise<NodeOAuthClient> {
  return new NodeOAuthClient({
    // @ts-expect-error weird
    clientMetadata: clientMetadata,
    stateStore: new StateStore(cookieStore),
    sessionStore: new SessionStore(cookieStore),
    keyset: await setupKeys(),
  });
}

async function setupKeys() {
  const keyset = [
    await JoseKey.fromImportable(process.env.PRIVATE_KEY_1!),
    await JoseKey.fromImportable(process.env.PRIVATE_KEY_2!),
    await JoseKey.fromImportable(process.env.PRIVATE_KEY_3!),
  ];
  return keyset;
}

export async function getLoggedInUser(cookieStore: ReadonlyRequestCookies) {
  const client = await getBackendClient(cookieStore);
  const userDid = cookieStore.get("userDid")?.value;
  if (userDid) {
    try {
      const oauthSession = await client.restore(userDid);
      const agent = new Agent(oauthSession);
      const profile = await agent.getProfile({ actor: agent?.did ?? "" });
      return {
        did: agent?.did,
        handle: profile.data.handle,
        name: profile.data.displayName,
      };
    } catch {
      return;
    }
  }
}
