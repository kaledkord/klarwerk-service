import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { name, company, phone, email, service, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Pflichtfelder fehlen." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save to database using service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabase.from("contact_submissions").insert({
      name,
      company: company || null,
      phone: phone || null,
      email,
      message,
      service: service || null,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      return new Response(
        JSON.stringify({ error: "Datenbankfehler beim Speichern der Anfrage." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      // DB was saved, just skip email silently if key not configured
      console.warn("RESEND_API_KEY not configured — email not sent.");
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const serviceLabel = service ? `<strong>Leistung:</strong> ${service}<br>` : "";
    const companyLabel = company ? `<strong>Firma:</strong> ${company}<br>` : "";
    const phoneLabel = phone ? `<strong>Telefon:</strong> ${phone}<br>` : "";

    const htmlBody = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1e293b">
        <div style="background:#0f172a;padding:24px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:#ffffff;margin:0;font-size:20px">Neue Kontaktanfrage</h2>
          <p style="color:#94a3b8;margin:4px 0 0;font-size:14px">KlarWerk Service — Kontaktformular</p>
        </div>
        <div style="background:#f8fafc;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px">
          <p style="margin:0 0 16px;font-size:15px">
            <strong>Name:</strong> ${name}<br>
            ${companyLabel}
            <strong>E-Mail:</strong> <a href="mailto:${email}" style="color:#0891b2">${email}</a><br>
            ${phoneLabel}
            ${serviceLabel}
          </p>
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:6px;padding:16px;margin-top:16px">
            <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#64748b;text-transform:uppercase;letter-spacing:.05em">Nachricht</p>
            <p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap">${message}</p>
          </div>
          <p style="margin:24px 0 0;font-size:12px;color:#94a3b8">
            Diese E-Mail wurde automatisch über das Kontaktformular auf klarwerk-service.com gesendet.
          </p>
        </div>
      </div>
    `;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "KlarWerk Service <onboarding@resend.dev>",
        to: ["info@klarwerk-service.com"],
        reply_to: email,
        subject: `Neue Anfrage von ${name}${company ? ` (${company})` : ""}`,
        html: htmlBody,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Resend error:", errText);
      // DB was saved — return success anyway so the user doesn't retry unnecessarily
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Unbekannter Fehler. Bitte versuchen Sie es erneut." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
