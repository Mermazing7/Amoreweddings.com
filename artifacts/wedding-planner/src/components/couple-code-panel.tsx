import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/react";
import { Copy, Check, Link2, LogIn, LogOut, Heart } from "lucide-react";

interface CoupleMember {
  user_id: string;
  role: string;
  joined_at: string;
}

interface CoupleProfile {
  id: number;
  code: string;
  owner_user_id: string;
  partner_user_id: string | null;
  created_at: string;
  members: CoupleMember[];
}

export function CoupleCodePanel() {
  const { user, isLoaded } = useUser();
  const [couple, setCouple] = useState<CoupleProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch("/api/couple", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setCouple(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!isLoaded || !user) return null;

  const isOwner = couple?.owner_user_id === user.id;
  const members = couple?.members ?? [];
  const collaboratorCount = Math.max(0, members.length - 1); // exclude owner

  async function copyCode() {
    if (!couple) return;
    await navigator.clipboard.writeText(couple.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleJoin() {
    setJoinError("");
    setJoining(true);
    try {
      const res = await fetch("/api/couple/join", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: joinCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setJoinError(data.error || "Something went wrong");
      } else {
        setCouple(data);
        setJoinCode("");
        setJoinSuccess(true);
        setTimeout(() => setJoinSuccess(false), 3000);
      }
    } catch {
      setJoinError("Connection error. Please try again.");
    } finally {
      setJoining(false);
    }
  }

  async function handleLeave() {
    if (!confirm("Leave this couple? You will no longer share planning data.")) return;
    setLeaving(true);
    try {
      const res = await fetch("/api/couple/leave", {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        const refreshed = await fetch("/api/couple", { credentials: "include" });
        setCouple(await refreshed.json());
      }
    } catch {
    } finally {
      setLeaving(false);
    }
  }

  if (loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border border-secondary/30 bg-card p-8 md:p-10"
    >
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-4 h-4 text-secondary stroke-[1.5]" />
        <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-secondary">
          Your Couple Code
        </p>
      </div>

      {couple && (
        <>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <p className="font-serif text-4xl md:text-5xl tracking-[0.25em] text-foreground select-all">
                {couple.code}
              </p>
              <p className="font-sans text-xs text-muted-foreground mt-2">
                Share this code with your partner so you can both plan together.
              </p>
            </div>
            <button
              onClick={copyCode}
              className="flex items-center gap-2 border border-border px-4 py-3 font-sans text-xs uppercase tracking-widest text-foreground hover:border-secondary hover:text-secondary transition-colors duration-300 shrink-0"
            >
              {copied ? (
                <><Check className="w-3.5 h-3.5" /> Copied</>
              ) : (
                <><Copy className="w-3.5 h-3.5" /> Copy</>
              )}
            </button>
          </div>

          {collaboratorCount > 0 && (
            <div className="flex items-start gap-3 py-3 px-4 border border-secondary/20 bg-secondary/5 mb-6">
              <Link2 className="w-4 h-4 text-secondary stroke-[1.5] shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans text-sm text-foreground">
                  {collaboratorCount === 1
                    ? "1 person is sharing this plan with you."
                    : `${collaboratorCount} people are sharing this plan with you.`}
                </p>
                <p className="font-sans text-xs text-muted-foreground mt-1">
                  Anyone with the code can join — partner, family, planner.
                </p>
              </div>
              {!isOwner && (
                <button
                  onClick={handleLeave}
                  disabled={leaving}
                  className="ml-auto flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors duration-300"
                >
                  <LogOut className="w-3 h-3" /> {leaving ? "Leaving…" : "Leave"}
                </button>
              )}
            </div>
          )}

          {isOwner && collaboratorCount === 0 && (
            <div className="border-t border-border pt-6">
              <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Or join someone else's plan
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setJoinError(""); }}
                  placeholder="Partner's code"
                  maxLength={6}
                  className="flex-1 bg-transparent border-b border-border py-2.5 font-sans text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-secondary transition-colors duration-300 tracking-[0.15em] uppercase"
                />
                <button
                  onClick={handleJoin}
                  disabled={joining || joinCode.length < 6}
                  className="flex items-center gap-2 bg-foreground text-background px-6 py-2.5 font-sans uppercase tracking-widest text-xs hover:bg-secondary transition-colors duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  {joining ? "Linking…" : "Link"}
                </button>
              </div>
              <AnimatePresence>
                {joinError && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="font-sans text-xs text-destructive mt-2">{joinError}</motion.p>
                )}
                {joinSuccess && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="font-sans text-xs text-secondary mt-2">Partner linked — you are now sharing this plan.</motion.p>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
