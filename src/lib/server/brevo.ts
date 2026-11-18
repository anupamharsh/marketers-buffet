import "server-only";

const API = "https://api.brevo.com/v3";
const headers = () => ({ "api-key": process.env.BREVO_API_KEY || "", "content-type": "application/json", accept: "application/json" });

/** Adds (or updates) a contact on the newsletter list. Returns true on success. */
export async function addToNewsletter(email: string, attributes: Record<string, string> = {}) {
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_LIST_ID) return false;
  try {
    const res = await fetch(`${API}/contacts`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ email, listIds: [Number(process.env.BREVO_LIST_ID)], updateEnabled: true, attributes }),
    });
    return res.ok || res.status === 204;
  } catch {
    return false;
  }
}

/**
 * Transactional email. Sends only once a verified domain sender is set
 * (BREVO_SENDER_EMAIL); until then it quietly returns false.
 */
export async function sendEmail(to: string, subject: string, html: string) {
  const sender = process.env.BREVO_SENDER_EMAIL;
  if (!process.env.BREVO_API_KEY || !sender) return false;
  try {
    const res = await fetch(`${API}/smtp/email`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        sender: { email: sender, name: "Marketers Buffet" },
        replyTo: { email: process.env.BREVO_REPLY_TO || sender },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
