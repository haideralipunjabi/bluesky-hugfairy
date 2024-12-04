import Link from "next/link";
import Image from "next/image";
import buymeacoffee from "public/buymeacoffee.png";
const BuyMeACoffee = () => {
  return (
    <Link href="https://buymeacoffee.com/halipunjabi" target="_blank">
      <Image
        src={buymeacoffee}
        alt="Buy Me A Coffee"
        height="60"
        width="217"
      ></Image>
    </Link>
  );
};
export default BuyMeACoffee;
