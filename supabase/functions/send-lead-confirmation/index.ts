const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LeadEmailRequest {
  name: string;
  email: string;
}

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { name, email }: LeadEmailRequest = await req.json();

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0a0a0a;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 16px; padding: 40px; border: 1px solid #c9a227;">
            <h1 style="color: #c9a227; margin: 0 0 24px 0; font-size: 28px; text-align: center;">
              Olá, ${name}! 👋
            </h1>
            
            <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Recebemos sua solicitação de <strong style="color: #c9a227;">Diagnóstico Financeiro Gratuito</strong> e estamos muito felizes em tê-lo(a) conosco!
            </p>
            
            <p style="color: #e5e5e5; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Nossa equipe está preparando uma análise personalizada da sua situação financeira. Em breve você receberá:
            </p>
            
            <ul style="color: #e5e5e5; font-size: 16px; line-height: 1.8; margin: 0 0 24px 0; padding-left: 20px;">
              <li>📊 Análise completa do seu perfil financeiro</li>
              <li>💡 Recomendações personalizadas</li>
              <li>🎯 Estratégias para alcançar seus objetivos</li>
            </ul>
            
            <p style="color: #a3a3a3; font-size: 14px; line-height: 1.6; margin: 0; text-align: center;">
              Enquanto isso, fique à vontade para explorar nosso site e conhecer mais sobre nossos serviços.
            </p>
            
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #333; text-align: center;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                © 2024 Lanas Finanças. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Lanas Finanças <onboarding@resend.dev>",
        to: [email],
        subject: "Seu Diagnóstico Financeiro está a caminho! 🎉",
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", emailData);
      return new Response(
        JSON.stringify({ error: emailData.message || "Failed to send email" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Confirmation email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, data: emailData }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-lead-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
