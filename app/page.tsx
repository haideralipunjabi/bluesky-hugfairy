import { ErrorAlert } from "components/alert";
import BuyMeACoffee from "components/buymeacoffee";
import FeaturedProfiles from "components/featuredProfiles";
import FollowOnBlueSky from "components/followOnBluesky";
import HugsCount from "components/hugscount";
import HugsForm from "components/hugsform";
import LoginButton from "components/loginbutton";
import ProductHunt from "components/producthunt";
import { BASE_URL, getLoggedInUser } from "lib/getBackendClient";
import { cookies } from "next/headers";

export const metadata = {
  title: "Hugfairy",
  description: "Homepage for Hugfairy bot. A bot to send hugs on BlueSky",
  creator: "Haider Ali Punjabi",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Hugfairy",
    description: "Homepage for Hugfairy bot. A bot to send hugs on BlueSky",
    url: new URL(BASE_URL),
    siteName: "Hugfairy",
    images: [
      {
        url: `${BASE_URL}/og.png`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const loggedInUser = await getLoggedInUser(cookieStore);
  const isLoggedIn = () => loggedInUser != null;
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen w-max flex-col justify-start gap-y-1 pt-10 text-foreground-primary sm:gap-y-2 md:gap-y-3 lg:gap-y-4">
      <div className="my-4 text-center">
        <h2 className="text-l my-2 md:text-xl lg:text-2xl">
          Send hugs over the sky!!
        </h2>
      </div>
      {error && <ErrorAlert>{error}</ErrorAlert>}
      {isLoggedIn() ? <HugsForm name={loggedInUser?.name} /> : <LoginButton />}
      {isLoggedIn() ? <HugsCount userDid={loggedInUser!.did!} /> : <></>}
      <div className="mx-auto">
        <h2 className="text-l my-2 text-center md:text-xl lg:text-2xl">
          Help support the bot!
        </h2>
        <div className="flex flex-col items-center gap-y-2">
          <ProductHunt />
          <BuyMeACoffee />
          <FollowOnBlueSky />
        </div>
      </div>
      <FeaturedProfiles />
    </div>
  );
}
