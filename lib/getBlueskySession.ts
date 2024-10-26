import { BrowserOAuthClient, OAuthSession } from '@atproto/oauth-client-browser'

export default async function getBlueskySession() : Promise<OAuthSession | undefined> {
    const client = new BrowserOAuthClient({
        handleResolver: 'https://bsky.social',
        // Only works if the current origin is a loopback address:
        clientMetadata: undefined,
      })
    return (await client.init())?.session
}
