import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { email, code } = await req.json();
    if (!email || !code) return new Response(JSON.stringify({ error: "Missing email or code" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

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

    const data = await res.json();
    if (!res.ok) return new Response(JSON.stringify({ error: data.message || "Failed to send" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
