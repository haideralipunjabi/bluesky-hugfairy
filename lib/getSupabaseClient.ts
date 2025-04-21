import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "database.types";

const product_id_map = {
  "XCgph9rio2syVsV6qlu5wA==": 5,
  "OCD39Erdiiv1G3BlWMUyqA==": 30,
};
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
    const freeHugs = 3 - (count || 0);
    return freeHugs >= 0 ? freeHugs : 0;
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
    let totalPurchaseCount = 0;
    for (const [product_id, count] of Object.entries(product_id_map)) {
      const { count: purchaseCount, error: error2 } = await this.client
        .from("sales")
        .select("*", { count: "exact" }) // Important for accurate counts
        .eq("bsky_did", senderDid)
        .eq("product_id", product_id);
      if (error2) {
        throw error2;
      }
      totalPurchaseCount += count * (purchaseCount || 0);
    }
    const paidHugs = totalPurchaseCount - (sentCount || 0);
    return paidHugs >= 0 ? paidHugs : 0;
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
