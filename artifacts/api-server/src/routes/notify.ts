import { Router } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { pool } from "../lib/db";
import { sendSignupNotification } from "../lib/resend";

const router = Router();

// Track which user IDs we've already emailed about, so a refresh / re-trigger
// from the client doesn't send duplicate notifications.
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS signup_notifications (
      user_id TEXT PRIMARY KEY,
      email TEXT,
      sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}
const ready = ensureTable().catch((e) => console.error("signup_notifications init:", e));

router.post("/notify-signup", async (req: any, res) => {
  try {
    await ready;
    const auth = getAuth(req);
    const userId = auth?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const existing = await pool.query(
      `SELECT user_id FROM signup_notifications WHERE user_id = $1`,
      [userId]
    );
    if (existing.rows.length > 0) {
      return res.json({ ok: true, alreadySent: true });
    }

    let email = "";
    let name: string | null = null;
    try {
      const user = await clerkClient.users.getUser(userId);
      email =
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        "";
      name = [user.firstName, user.lastName].filter(Boolean).join(" ") || null;
    } catch (e) {
      console.error("clerk getUser failed:", e);
    }

    await sendSignupNotification({ email: email || "(unknown)", userId, name });

    await pool.query(
      `INSERT INTO signup_notifications (user_id, email) VALUES ($1, $2)
       ON CONFLICT (user_id) DO NOTHING`,
      [userId, email]
    );

    res.json({ ok: true });
  } catch (err: any) {
    console.error("POST /notify-signup:", err);
    res.status(500).json({ error: err?.message || "Failed to send notification" });
  }
});

export default router;
