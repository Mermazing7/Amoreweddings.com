import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useUser, useClerk, Show, useReverification } from "@clerk/react";
import { LogOut, ChevronDown, Download, KeyRound, Heart, X } from "lucide-react";
import { downloadWeddingPlanPDF } from "@/lib/pdf-export";
import { CoupleCodePanel } from "./couple-code-panel";

function PasswordResetPanel({ onDone }: { onDone: () => void }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [, navigate] = useLocation();
  const updatePasswordWithReverify = useReverification(
    (params: Parameters<NonNullable<typeof user>["updatePassword"]>[0]) =>
      user!.updatePassword(params)
  );

  async function handleForgotPassword() {
    const email = user?.primaryEmailAddress?.emailAddress;
    await signOut();
    navigate(`/sign-in${email ? `?identifier=${encodeURIComponent(email)}&forgot=1` : "?forgot=1"}`);
    onDone();
  }
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signOutOthers, setSignOutOthers] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const hasPassword = user?.passwordEnabled ?? false;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setError("New passwords don't match."); return; }
    if (hasPassword && !currentPassword) { setError("Please enter your current password."); return; }
    setSubmitting(true);
    try {
      await updatePasswordWithReverify({
        ...(hasPassword ? { currentPassword } : {}),
        newPassword,
        signOutOfOtherSessions: signOutOthers,
      });
      setSuccess(true);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setTimeout(() => { setSuccess(false); onDone(); }, 1800);
    } catch (err) {
      const e = err as { errors?: Array<{ message?: string; longMessage?: string }> };
      setError(e?.errors?.[0]?.longMessage || e?.errors?.[0]?.message || "Couldn't update password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = "w-full bg-transparent border-b border-[#E8E0D8] py-2.5 font-sans text-sm text-[#2C1810] placeholder:text-[#8C7B74]/40 focus:outline-none focus:border-[#C9A89A] transition-colors duration-300";
  const labelCls = "block font-sans text-[11px] uppercase tracking-[0.18em] text-[#8C7B74] mb-2";

  return (
    <form onSubmit={handleSubmit} className="bg-[#FAF7F2] border border-[#E8E0D8] p-8 md:p-10 space-y-7">
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#C9A89A] mb-3">Account Security</p>
        <h3 className="font-serif text-3xl text-[#2C1810]">{hasPassword ? "Reset Password" : "Set a Password"}</h3>
        <p className="font-sans text-sm text-[#8C7B74] mt-2">
          {hasPassword
            ? "Choose a new password for your Amore account."
            : "You signed in with a social account. Set a password to also sign in with email."}
        </p>
      </div>

      {hasPassword && (
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label className="block font-sans text-[11px] uppercase tracking-[0.18em] text-[#8C7B74]">Current Password</label>
            <button type="button" onClick={handleForgotPassword}
              className="font-sans text-[10px] uppercase tracking-widest text-[#C9A89A] hover:text-[#2C1810] transition-colors duration-200">
              Forgot? Email me a reset link
            </button>
          </div>
          <input type="password" autoComplete="current-password" value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
        </div>
      )}
      <div>
        <label className={labelCls}>New Password</label>
        <input type="password" autoComplete="new-password" value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)} className={inputCls} placeholder="At least 8 characters" />
      </div>
      <div>
        <label className={labelCls}>Confirm New Password</label>
        <input type="password" autoComplete="new-password" value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} placeholder="Repeat new password" />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={signOutOthers} onChange={(e) => setSignOutOthers(e.target.checked)}
          className="w-4 h-4 accent-[#C9A89A]" />
        <span className="font-sans text-xs text-[#8C7B74]">Sign out of all other devices</span>
      </label>

      {error && <p className="font-sans text-xs text-red-500 border border-red-200 bg-red-50/60 px-4 py-3">{error}</p>}
      {success && <p className="font-sans text-xs text-[#4A7C59] border border-[#B8D9C4] bg-[#F0F7F2] px-4 py-3">Password updated successfully.</p>}

      <div className="flex items-center gap-4 pt-2">
        <button type="submit" disabled={submitting}
          className="bg-[#2C1810] text-white font-sans text-[11px] uppercase tracking-widest px-8 py-3 hover:bg-[#C9A89A] transition-colors duration-500 disabled:opacity-50">
          {submitting ? "Saving…" : hasPassword ? "Update Password" : "Set Password"}
        </button>
        <button type="button" onClick={onDone}
          className="font-sans text-[11px] uppercase tracking-widest text-[#8C7B74] hover:text-[#2C1810] border-b border-transparent hover:border-[#2C1810] transition-colors duration-300 pb-0.5">
          Cancel
        </button>
      </div>
    </form>
  );
}

function AuthMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const [coupleOpen, setCoupleOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [, navigate] = useLocation();

  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const initial = email[0]?.toUpperCase() ?? "A";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 font-sans text-xs uppercase tracking-widest transition-colors duration-300"
      >
        <span className="w-7 h-7 flex items-center justify-center text-[11px] font-medium border border-current/30 rounded-none">
          {initial}
        </span>
        <span className="hidden sm:inline">Account</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-4 w-60 bg-[#FAF7F2] border border-[#E8E0D8] shadow-2xl z-[100]"
            onMouseLeave={() => setOpen(false)}
          >
            <div className="px-5 py-4 border-b border-[#E8E0D8]">
              <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-[#8C7B74] mb-1">Signed in as</p>
              <p className="font-sans text-sm text-[#2C1810] truncate">{email}</p>
            </div>
            <button
              onClick={() => { setOpen(false); downloadWeddingPlanPDF(); }}
              className="w-full flex items-center gap-3 px-5 py-3.5 font-sans text-xs uppercase tracking-widest text-[#2C1810] hover:bg-[#E8E0D8]/40 transition-colors duration-200 text-left border-b border-[#E8E0D8]"
            >
              <Download className="w-3.5 h-3.5 text-[#8C7B74] stroke-[1.5]" />
              Download PDF
            </button>
            <button
              onClick={() => { setOpen(false); setCoupleOpen(true); }}
              className="w-full flex items-center gap-3 px-5 py-3.5 font-sans text-xs uppercase tracking-widest text-[#2C1810] hover:bg-[#E8E0D8]/40 transition-colors duration-200 text-left border-b border-[#E8E0D8]"
            >
              <Heart className="w-3.5 h-3.5 text-[#8C7B74] stroke-[1.5]" />
              Couple Code
            </button>
            <button
              onClick={() => { setOpen(false); setProfileOpen(true); }}
              className="w-full flex items-center gap-3 px-5 py-3.5 font-sans text-xs uppercase tracking-widest text-[#2C1810] hover:bg-[#E8E0D8]/40 transition-colors duration-200 text-left border-b border-[#E8E0D8]"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#8C7B74] stroke-[1.5]" />
              Reset Password
            </button>
            <button
              onClick={() => { setOpen(false); signOut(() => navigate("/")); }}
              className="w-full flex items-center gap-3 px-5 py-3.5 font-sans text-xs uppercase tracking-widest text-[#2C1810] hover:bg-[#E8E0D8]/40 transition-colors duration-200 text-left"
            >
              <LogOut className="w-3.5 h-3.5 text-[#8C7B74] stroke-[1.5]" />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {createPortal(
      <AnimatePresence>
        {coupleOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setCoupleOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setCoupleOpen(false)}
                className="absolute -top-3 -right-3 w-9 h-9 bg-[#FAF7F2] border border-[#E8E0D8] flex items-center justify-center text-[#2C1810] hover:bg-[#E8E0D8]/60 transition-colors duration-200 z-10"
                aria-label="Close"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
              <CoupleCodePanel />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}

      {createPortal(
      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setProfileOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setProfileOpen(false)}
                className="absolute -top-3 -right-3 w-9 h-9 bg-[#FAF7F2] border border-[#E8E0D8] flex items-center justify-center text-[#2C1810] hover:bg-[#E8E0D8]/60 transition-colors duration-200 z-10"
                aria-label="Close"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
              <PasswordResetPanel onDone={() => setProfileOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 px-8 md:px-12 flex items-center justify-between transition-all duration-500 ${
        scrolled
          ? "bg-[#FAF7F2]/97 backdrop-blur-md border-b border-[#E8E0D8] py-4"
          : "bg-transparent py-6"
      }`}
      style={{ pointerEvents: "auto" }}
    >
      <Link
        href="/"
        className={`font-serif text-xl tracking-[0.12em] uppercase transition-colors duration-500 select-none ${
          scrolled ? "text-[#2C1810]" : "text-white"
        }`}
      >
        Amore
      </Link>

      <div
        className={`hidden md:flex items-center gap-10 font-sans text-[11px] tracking-[0.18em] uppercase transition-colors duration-500 ${
          scrolled ? "text-[#2C1810]" : "text-white"
        }`}
      >
        {[
          { label: "Planning", href: "#tools" },
          { label: "Venues", href: "#venues" },
          { label: "Themes", href: "#themes" },
          { label: "Vendors", href: "#planning" },
          { label: "Registry", href: "#registry" },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="relative group hover:opacity-100 opacity-80 transition-opacity duration-300"
          >
            {label}
            <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-current group-hover:w-full transition-all duration-300" />
          </a>
        ))}
      </div>

      <Show when="signed-in">
        <div className={`transition-colors duration-500 ${scrolled ? "text-[#2C1810]" : "text-white"}`}>
          <AuthMenu />
        </div>
      </Show>

      <Show when="signed-out">
        <button
          onClick={() => navigate("/sign-in")}
          className={`font-sans text-[11px] uppercase tracking-[0.18em] transition-all duration-300 hover:opacity-100 opacity-80 relative group ${
            scrolled ? "text-[#2C1810]" : "text-white"
          }`}
        >
          Sign In
          <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-current group-hover:w-full transition-all duration-300" />
        </button>
      </Show>
    </motion.nav>
  );
}
