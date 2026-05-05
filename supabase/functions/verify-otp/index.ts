import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Verifies the OTP by comparing a hash of the submitted code against
// the stored hash. The plaintext code never touches the server after send-otp.

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return new Response(JSON.stringify({ error: "Missing email or code" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Hash the submitted code
    const encoder = new TextEncoder();
    const data = encoder.encode(code.toString());
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const codeHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    // Look up a valid, unused, non-expired OTP record for this email
    const now = new Date().toISOString();
    const { data: record, error } = await supabase
      .from("otp_codes")
      .select("id")
      .eq("email", email.toLowerCase())
      .eq("code_hash", codeHash)
      .eq("used", false)
      .gte("expires_at", now)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !record) {
      return new Response(JSON.stringify({ valid: false, error: "Invalid or expired code" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Mark the OTP as used so it can't be replayed
    await supabase.from("otp_codes").update({ used: true }).eq("id", record.id);

    return new Response(JSON.stringify({ valid: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
