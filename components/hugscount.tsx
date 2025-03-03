import { SupabaseClientHelper } from "lib/getSupabaseClient";
export default async function HugsCount({ userDid }: { userDid: string }) {
  const supabaseHelper = new SupabaseClientHelper();
  await supabaseHelper.authorize();
  return (
    <>
      <div className="text-center">
        You have {await supabaseHelper.getRemainingFreeHugs(userDid)} free hugs
        left today.
        <br />
        You have {await supabaseHelper.getRemainingPremiumHugs(userDid)} paid
        hugs.{" "}
        <a
          href="https://haideralipunjabi.gumroad.com/l/yyfivx"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy More
        </a>
      </div>
    </>
  );
}
