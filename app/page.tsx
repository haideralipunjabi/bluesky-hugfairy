import HugsForm from "../components/hugsform";
import LoginForm from "../components/loginform";
import { cookies } from "next/headers";
import getCurrentSession from "../lib/getCurrentSession";

export const metadata = {
  title: "Bluesky Hugfairy",
  description:
    "Homepage for BlueSky Hugfairy bot. A bot to send hugs on BlueSky",
  creator: "Haider Ali Punjabi",
  metadataBase: new URL("https://bsky-hugfairy.vercel.app"),
  openGraph: {
    title: "Bluesky Hugfairy",
    description: "The React Framework for the Web",
    url: "Homepage for BlueSky Hugfairy bot. A bot to send hugs on BlueSky",
    siteName: "Bluesky Hugfairy",
    images: [
      {
        url: "https://bsky-hugfairy.vercel.app/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
};

export default async function Page() {
  const cookieStore = cookies();
  const access_token = cookieStore.get("accessJwt")?.value;
  const { handle, did } = access_token
    ? await getCurrentSession(access_token)
    : { handle: undefined, did: undefined };
  return (
    <div className="mx-auto flex min-h-screen w-max flex-col justify-start gap-y-1 pt-10 text-foreground-primary sm:gap-y-2 md:gap-y-3 lg:gap-y-4">
      <div className="my-4 text-center">
        <h1 className="my-2 text-3xl md:text-4xl lg:text-5xl">
          Bluesky Hugfairy
        </h1>
        <h2 className="text-l my-2 md:text-xl lg:text-2xl">
          Send hugs to anyone on BlueSky
        </h2>
      </div>
      {handle ? <HugsForm handle={handle} did={did} /> : <LoginForm />}
    </div>
  );
}
