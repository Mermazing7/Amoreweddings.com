import { useEffect, useRef } from "react";
import { useUser } from "@clerk/react";

const AMORE_PREFIX = "amore_";

function getAllAmoreData(): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(AMORE_PREFIX)) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key)!);
      } catch {
        data[key] = localStorage.getItem(key);
      }
    }
  }
  return data;
}

async function pushToServer() {
  const data = getAllAmoreData();
  if (Object.keys(data).length === 0) return;
  try {
    await fetch("/api/couple/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ data }),
    });
  } catch {
    /* silent — sync is best-effort */
  }
}

async function notifySignupOnce(userId: string) {
  const key = `amore_signup_notified_${userId}`;
  if (localStorage.getItem(key)) return;
  try {
    const r = await fetch("/api/notify-signup", { method: "POST", credentials: "include" });
    if (r.ok) localStorage.setItem(key, "1");
  } catch {
    /* silent */
  }
}

export function CloudSync() {
  const { user, isLoaded } = useUser();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (isLoaded && user?.id) notifySignupOnce(user.id);
  }, [isLoaded, user?.id]);

  useEffect(() => {
    if (!isLoaded || !user || initializedRef.current) return;
    initializedRef.current = true;

    (async () => {
      try {
        const res = await fetch("/api/couple", { credentials: "include" });
        if (!res.ok) return;
        const couple = await res.json();
        const serverData: Record<string, unknown> = couple.wedding_data ?? {};

        if (Object.keys(serverData).length > 0) {
          for (const [key, value] of Object.entries(serverData)) {
            if (key.startsWith(AMORE_PREFIX)) {
              localStorage.setItem(key, JSON.stringify(value));
            }
          }
          window.dispatchEvent(new Event("amore-sync"));
        } else {
          await pushToServer();
        }
      } catch {
        /* silent */
      }
    })();
  }, [isLoaded, user]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(pushToServer, 30_000);
    const handleUnload = () => pushToServer();
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [user]);

  return null;
}
