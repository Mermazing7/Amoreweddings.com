// Resend email client (Replit integration: connection:conn_resend)
import { Resend } from "resend";

let cachedSettings: { apiKey: string; fromEmail: string } | null = null;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) throw new Error("X-Replit-Token not found");
  if (!hostname) throw new Error("REPLIT_CONNECTORS_HOSTNAME not set");

  const data = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=resend`,
    { headers: { Accept: "application/json", "X-Replit-Token": xReplitToken } }
  ).then((r) => r.json());

  const conn = data?.items?.[0];
  if (!conn?.settings?.api_key) throw new Error("Resend not connected");
  return { apiKey: conn.settings.api_key as string, fromEmail: conn.settings.from_email as string };
}

// Never cache the client; tokens can rotate.
export async function getResendClient() {
  const creds = await getCredentials();
  cachedSettings = creds;
  return { client: new Resend(creds.apiKey), fromEmail: creds.fromEmail };
}

export async function sendSignupNotification(params: {
  email: string;
  userId: string;
  name?: string | null;
}) {
  const { client, fromEmail } = await getResendClient();
  const to = "amoresupport@gmail.com";
  const subject = `New Amore signup — ${params.email}`;
  const when = new Date().toLocaleString("en-GB", { timeZone: "UTC" }) + " UTC";
  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#2C1810;max-width:560px;margin:0 auto;padding:24px;">
      <p style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#8C7B74;margin:0 0 8px;">Amore</p>
      <h1 style="font-family:Georgia,serif;font-weight:400;font-size:24px;margin:0 0 16px;">New signup</h1>
      <table style="font-size:14px;line-height:1.6;border-collapse:collapse;">
        <tr><td style="color:#8C7B74;padding-right:16px;">Email</td><td>${escapeHtml(params.email)}</td></tr>
        ${params.name ? `<tr><td style="color:#8C7B74;padding-right:16px;">Name</td><td>${escapeHtml(params.name)}</td></tr>` : ""}
        <tr><td style="color:#8C7B74;padding-right:16px;">User ID</td><td><code>${escapeHtml(params.userId)}</code></td></tr>
        <tr><td style="color:#8C7B74;padding-right:16px;">When</td><td>${when}</td></tr>
      </table>
    </div>`;
  const text = `New Amore signup\n\nEmail: ${params.email}\n${params.name ? `Name: ${params.name}\n` : ""}User ID: ${params.userId}\nWhen: ${when}`;

  return client.emails.send({ from: fromEmail, to, subject, html, text });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

void cachedSettings; // silence unused-var if not referenced elsewhere
