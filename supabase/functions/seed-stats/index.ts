import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Get real profile count
  const { count: profileCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Upsert the platform_stats row (service role bypasses RLS)
  const { data, error } = await supabase
    .from("platform_stats")
    .upsert(
      { id: 1, applicants: profileCount ?? 0, early_users: profileCount ?? 0, countries: 18 },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
