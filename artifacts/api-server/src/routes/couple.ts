import { Router } from "express";
import { getAuth } from "@clerk/express";
import { pool } from "../lib/db";

const router = Router();

const SAFE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += SAFE_CHARS[Math.floor(Math.random() * SAFE_CHARS.length)];
  }
  return code;
}

function requireAuth(req: any, res: any, next: any) {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId;
  next();
}

async function getMembership(userId: string) {
  // Find a couple either via members table or as legacy owner/partner
  const r = await pool.query(
    `SELECT cp.*
     FROM couple_profiles cp
     LEFT JOIN couple_members cm ON cm.couple_id = cp.id
     WHERE cp.owner_user_id = $1
        OR cp.partner_user_id = $1
        OR cm.user_id = $1
     LIMIT 1`,
    [userId]
  );
  return r.rows[0] ?? null;
}

async function listMembers(coupleId: number) {
  const r = await pool.query(
    `SELECT user_id, role, joined_at FROM couple_members WHERE couple_id = $1 ORDER BY joined_at ASC`,
    [coupleId]
  );
  return r.rows;
}

async function ensureMember(coupleId: number, userId: string, role: string) {
  await pool.query(
    `INSERT INTO couple_members (couple_id, user_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (couple_id, user_id) DO NOTHING`,
    [coupleId, userId, role]
  );
}

async function findOrCreateCouple(userId: string) {
  const existing = await getMembership(userId);
  if (existing) {
    // Make sure the owner is recorded in members table (legacy backfill)
    await ensureMember(existing.id, existing.owner_user_id, "owner");
    if (existing.partner_user_id) {
      await ensureMember(existing.id, existing.partner_user_id, "partner");
    }
    return existing;
  }

  let code = generateCode();
  for (let attempt = 0; attempt < 10; attempt++) {
    const conflict = await pool.query(
      `SELECT id FROM couple_profiles WHERE code = $1`,
      [code]
    );
    if (conflict.rows.length === 0) break;
    code = generateCode();
  }

  const created = await pool.query(
    `INSERT INTO couple_profiles (code, owner_user_id, wedding_data)
     VALUES ($1, $2, '{}') RETURNING *`,
    [code, userId]
  );
  const profile = created.rows[0];
  await ensureMember(profile.id, userId, "owner");
  return profile;
}

router.get("/couple", requireAuth, async (req: any, res) => {
  try {
    const couple = await findOrCreateCouple(req.userId);
    const members = await listMembers(couple.id);
    res.json({ ...couple, members });
  } catch (err) {
    console.error("GET /couple:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/couple/join", requireAuth, async (req: any, res) => {
  const { userId } = req;
  const code = (req.body?.code || "").toUpperCase().trim();

  if (!code) return res.status(400).json({ error: "Code is required" });

  try {
    const existing = await getMembership(userId);
    if (existing && existing.code === code) {
      const members = await listMembers(existing.id);
      return res.json({ ...existing, members });
    }
    if (existing) {
      // If user only owns their own empty auto-created plan (no other members),
      // discard it so they can join someone else's plan.
      const otherMembers = await pool.query(
        `SELECT 1 FROM couple_members WHERE couple_id = $1 AND user_id <> $2 LIMIT 1`,
        [existing.id, userId]
      );
      const hasOthers = otherMembers.rows.length > 0 || (existing.partner_user_id && existing.partner_user_id !== userId);
      if (existing.owner_user_id === userId && !hasOthers) {
        await pool.query(`DELETE FROM couple_profiles WHERE id = $1`, [existing.id]);
      } else {
        return res.status(400).json({ error: "You are already in another plan. Leave it first." });
      }
    }

    const target = await pool.query(
      `SELECT * FROM couple_profiles WHERE code = $1`,
      [code]
    );

    if (target.rows.length === 0) {
      return res.status(404).json({ error: "Code not found. Check it and try again." });
    }

    const profile = target.rows[0];

    if (profile.owner_user_id === userId) {
      return res.status(400).json({ error: "That is your own code — share it with your partner." });
    }

    // Determine role: first non-owner joiner becomes "partner" (and fills legacy column),
    // anyone after that is a "collaborator" (e.g. wedding planner, family member).
    let role = "collaborator";
    if (!profile.partner_user_id) {
      role = "partner";
      await pool.query(
        `UPDATE couple_profiles SET partner_user_id = $1, updated_at = NOW() WHERE id = $2`,
        [userId, profile.id]
      );
    }

    await ensureMember(profile.id, userId, role);

    const refreshed = await pool.query(`SELECT * FROM couple_profiles WHERE id = $1`, [profile.id]);
    const members = await listMembers(profile.id);
    res.json({ ...refreshed.rows[0], members });
  } catch (err) {
    console.error("POST /couple/join:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/couple/data", requireAuth, async (req: any, res) => {
  const { userId } = req;
  const { data } = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "data object is required" });
  }

  try {
    const couple = await getMembership(userId);
    if (!couple) return res.status(404).json({ error: "No couple profile found" });

    const result = await pool.query(
      `UPDATE couple_profiles
       SET wedding_data = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(data), couple.id]
    );
    const members = await listMembers(couple.id);
    res.json({ ...result.rows[0], members });
  } catch (err) {
    console.error("PUT /couple/data:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/couple/leave", requireAuth, async (req: any, res) => {
  const { userId } = req;
  try {
    const couple = await getMembership(userId);
    if (!couple) return res.status(400).json({ error: "You are not part of a couple plan." });

    if (couple.owner_user_id === userId) {
      return res.status(400).json({ error: "The owner cannot leave their own plan." });
    }

    await pool.query(
      `DELETE FROM couple_members WHERE couple_id = $1 AND user_id = $2`,
      [couple.id, userId]
    );

    if (couple.partner_user_id === userId) {
      // Promote next collaborator (if any) to partner so legacy column reflects reality
      const next = await pool.query(
        `SELECT user_id FROM couple_members
         WHERE couple_id = $1 AND user_id <> $2
         ORDER BY joined_at ASC LIMIT 1`,
        [couple.id, couple.owner_user_id]
      );
      const nextPartner = next.rows[0]?.user_id ?? null;
      await pool.query(
        `UPDATE couple_profiles SET partner_user_id = $1, updated_at = NOW() WHERE id = $2`,
        [nextPartner, couple.id]
      );
      if (nextPartner) {
        await pool.query(
          `UPDATE couple_members SET role = 'partner' WHERE couple_id = $1 AND user_id = $2`,
          [couple.id, nextPartner]
        );
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /couple/leave:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
