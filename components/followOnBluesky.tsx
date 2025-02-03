import Link from "next/link";
import Image from "next/image";
import blueskyLogo from "public/bluesky_media_kit_logo.svg";
const FollowOnBlueSky = () => (
  <Link
    href="https://bsky.app/profile/did:plc:ofcaxfjbigivt2rtq3z2yuwg"
    target="_blank"
  >
    <button className="flex items-center justify-center rounded bg-bluesky p-2 text-white hover:cursor-pointer">
      <Image width={32} alt="" className="mx-2 text-white" src={blueskyLogo} />

      <span className="text-l md:text-xl lg:text-xl">Follow us on BlueSky</span>
    </button>
  </Link>
);
export default FollowOnBlueSky;
