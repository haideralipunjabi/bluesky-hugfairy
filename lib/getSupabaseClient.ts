import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "database.types";

export class SupabaseClientHelper {
  client!: SupabaseClient<Database>;

  async authorize() {
    const supabaseURL = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    this.client = await createClient<Database>(supabaseURL!, supabaseKey!);
  }

  async checkDailyHugLimit(senderDid: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow
    const { count, error } = await this.client
      .from("hugs")
      .select("*", { count: "exact" }) // Important for accurate counts
      .eq("sender", senderDid)
      .gte("created_at", today.toISOString()) // Greater than or equal to start of today
      .lt("created_at", tomorrow.toISOString()); // Less than start of tomorrow

    if (error) {
      throw error;
    }
    return (count || 0) < 3;
  }

  async getRemainingFreeHugs(senderDid: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow
    const { count, error } = await this.client
      .from("hugs")
      .select("*", { count: "exact" }) // Important for accurate counts
      .eq("sender", senderDid)
      .eq("premium", false)
      .gte("created_at", today.toISOString()) // Greater than or equal to start of today
      .lt("created_at", tomorrow.toISOString()); // Less than start of tomorrow

    if (error) {
      throw error;
    }
    return 3 - (count || 0);
  }

  async getRemainingPremiumHugs(senderDid: string) {
    const { count: sentCount, error: error1 } = await this.client
      .from("hugs")
      .select("*", { count: "exact" }) // Important for accurate counts
      .eq("sender", senderDid)
      .eq("premium", true);
    if (error1) {
      throw error1;
    }
    const { count: purchaseCount, error: error2 } = await this.client
      .from("sales")
      .select("*", { count: "exact" }) // Important for accurate counts
      .eq("bsky_did", senderDid);
    if (error2) {
      throw error2;
    }
    return (purchaseCount || 0) * 5 - (sentCount || 0);
  }

  async logHug(
    anonymous: boolean,
    created_at: string,
    sender: string,
    recipient: string,
    premium: boolean,
  ) {
    await this.client.from("hugs").insert({
      anonymous: anonymous,
      created_at: created_at,
      sender: sender,
      recipient: recipient,
      premium: premium,
    });
  }
}
