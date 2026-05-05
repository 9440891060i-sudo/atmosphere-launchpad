import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// OTP is generated SERVER-SIDE only. The client never receives or stores the code.
// A hashed version is stored in the otp_codes table with a 10-minute expiry.

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Missing email" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Rate-limit: max 3 OTP requests per email per 10 minutes
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("otp_codes")
      .select("*", { count: "exact", head: true })
      .eq("email", email.toLowerCase())
      .gte("created_at", tenMinutesAgo);

    if ((count ?? 0) >= 3) {
      return new Response(JSON.stringify({ error: "Too many requests. Wait 10 minutes and try again." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Generate 6-digit code server-side
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the code before storing (SHA-256)
    const encoder = new TextEncoder();
    const data = encoder.encode(code);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const codeHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    // Store hashed OTP with 10-minute expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await supabase.from("otp_codes").insert({
      email: email.toLowerCase(),
      code_hash: codeHash,
      expires_at: expiresAt,
      used: false,
    });

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Atmosphere <noreply@startatmosphere.com>",
        to: [email],
        subject: "Your Atmosphere verification code",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0a0a0a;color:#e5e5e5;border-radius:12px">
          <h2 style="font-size:20px;font-weight:300;margin-bottom:8px">Atmosphere</h2>
          <p style="color:#888;font-size:14px;margin-bottom:24px">Your early access verification code</p>
          <div style="background:#111;border:1px solid #222;border-radius:8px;padding:24px;text-align:center;letter-spacing:.3em;font-size:32px;font-weight:300;color:#fff">${code}</div>
          <p style="color:#555;font-size:12px;margin-top:20px">Expires in 10 minutes. If you didn't request this, ignore this email.</p>
        </div>`,
      }),
    });

    const resData = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: resData.message || "Failed to send" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Return success — code is NEVER returned to the client
    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
