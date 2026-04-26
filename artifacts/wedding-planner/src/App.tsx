import { useEffect, useRef, useState } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk, useUser } from "@clerk/react";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { CloudSync } from "@/components/cloud-sync";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const ivory = "#FAF7F2";
const brown = "#2C1810";
const blush = "#C9A89A";
const muted = "#8C7B74";
const border = "#E8E0D8";

const clerkAppearance = {
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: blush,
    colorBackground: ivory,
    colorInputBackground: ivory,
    colorText: brown,
    colorTextSecondary: muted,
    colorInputText: brown,
    colorNeutral: muted,
    borderRadius: "0px",
    fontFamily: "Outfit, sans-serif",
    fontFamilyButtons: "Outfit, sans-serif",
    fontSize: "14px",
  },
  elements: {
    rootBox: "w-full",
    cardBox: `border border-[${border}] w-full overflow-hidden shadow-none`,
    card: "!shadow-none !border-0 !bg-transparent !rounded-none px-10 py-10",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none px-10 pb-8",
    headerTitle: { color: brown, fontFamily: "Cormorant Garamond, serif", fontSize: "28px", fontWeight: "400" },
    headerSubtitle: { color: muted, fontFamily: "Outfit, sans-serif", fontSize: "13px" },
    socialButtonsBlockButtonText: { color: brown },
    formFieldLabel: { color: muted, fontFamily: "Outfit, sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase" as const },
    footerActionLink: { color: blush },
    footerActionText: { color: muted },
    dividerText: { color: muted },
    identityPreviewEditButton: { color: blush },
    formFieldSuccessText: { color: blush },
    alertText: { color: brown },
    logoBox: "flex justify-center mb-2",
    logoImage: "w-16 h-16",
    socialButtonsBlockButton: `border border-[${border}] hover:bg-[${border}] transition-colors`,
    formButtonPrimary: `bg-[${brown}] hover:bg-[${blush}] transition-colors rounded-none font-sans text-xs tracking-widest uppercase`,
    formFieldInput: `border-0 border-b border-[${border}] rounded-none bg-transparent focus:border-[${blush}] font-sans text-sm`,
    footerAction: `border-t border-[${border}] pt-4 mt-4`,
    dividerLine: `bg-[${border}]`,
    alert: `border border-[${border}]`,
    main: "gap-6",
  },
};

function SignInPage() {
  // To update login providers, app branding, or OAuth settings use the Auth
  // pane in the workspace toolbar. More information can be found in the Replit docs.
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-secondary text-center mb-8">Welcome back</p>
        <SignIn
          routing="path"
          path={`${basePath}/sign-in`}
          signUpUrl={`${basePath}/sign-up`}
          fallbackRedirectUrl={`${basePath}/`}
        />
      </div>
    </div>
  );
}

function SignUpPage() {
  // To update login providers, app branding, or OAuth settings use the Auth
  // pane in the workspace toolbar. More information can be found in the Replit docs.
  const [accepted, setAccepted] = useState<boolean>(() => {
    try { return localStorage.getItem("amore_terms_accepted") === "true"; } catch { return false; }
  });
  const [checked, setChecked] = useState(false);
  const [, navigate] = useLocation();

  function handleAccept() {
    if (!checked) return;
    try { localStorage.setItem("amore_terms_accepted", "true"); } catch {}
    try { localStorage.setItem("amore_terms_accepted_at", new Date().toISOString()); } catch {}
    setAccepted(true);
  }

  function handleDecline() {
    navigate("/");
  }

  if (!accepted) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-2xl border border-border bg-card p-8 md:p-12">
          <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-secondary text-center mb-3">
            Before you begin
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-center text-foreground mb-2">
            Terms of <em className="italic">Use</em>
          </h1>
          <p className="font-sans text-xs text-center text-muted-foreground mb-8">
            Please review and accept the following before creating an account.
          </p>

          <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-2 font-sans text-sm leading-relaxed text-foreground/90">
            <section>
              <h2 className="font-sans text-[11px] uppercase tracking-[0.2em] text-secondary mb-2">1. Service Description</h2>
              <p>
                Amore is a wedding-planning workspace provided on an
                &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis. The service
                allows you to organise checklists, vendors, guests, budgets and other
                planning details, and to export a snapshot of your work to PDF at any time.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-[11px] uppercase tracking-[0.2em] text-secondary mb-2">2. Your Data &amp; Backups</h2>
              <p>
                Your planning data is stored in your browser and, when you are signed in,
                synced to our servers. While we take reasonable steps to protect this
                information, you remain solely responsible for maintaining your own backups.
                We strongly recommend that you periodically use the built-in
                <em> Export to PDF </em>
                feature to save a personal copy of your plan.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-[11px] uppercase tracking-[0.2em] text-secondary mb-2">3. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable law, Amore, its operators,
                contributors and affiliates accept no liability whatsoever for any loss,
                corruption or unavailability of data, account interruptions, software
                errors, service downtime, or any direct, indirect, incidental, consequential
                or punitive damages arising from your use of, or inability to use, the
                service. By creating an account you acknowledge this and agree to keep
                your own backups via the PDF export.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-[11px] uppercase tracking-[0.2em] text-secondary mb-2">4. No Warranty</h2>
              <p>
                We make no warranties or representations regarding accuracy, reliability,
                availability or fitness for a particular purpose. Vendor information,
                checklists and recommendations are provided for convenience only and should
                be verified independently before any binding decision.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-[11px] uppercase tracking-[0.2em] text-secondary mb-2">5. Acceptance</h2>
              <p>
                By ticking the box below and continuing, you confirm that you have read,
                understood and agreed to these terms in full. If you do not accept them,
                please decline and you will not be able to create an account.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-[11px] uppercase tracking-[0.2em] text-secondary mb-2">6. Contact</h2>
              <p>
                If you have any questions about these terms or your account, please
                contact us at{" "}
                <a
                  href="mailto:Amoresupport@gmail.com"
                  className="text-secondary underline underline-offset-2 hover:text-foreground transition-colors duration-200"
                >
                  Amoresupport@gmail.com
                </a>
                .
              </p>
            </section>
          </div>

          <label className="flex items-start gap-3 mt-8 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="mt-1 w-4 h-4 accent-secondary cursor-pointer shrink-0"
            />
            <span className="font-sans text-sm text-foreground">
              I have read and accept the Terms of Use, and I understand that Amore is not
              responsible for lost data, crashes or service interruptions. I will use the
              PDF export feature to keep my own backups.
            </span>
          </label>

          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8">
            <button
              onClick={handleDecline}
              className="flex-1 border border-border px-6 py-3 font-sans uppercase tracking-widest text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors duration-300"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={!checked}
              className="flex-1 bg-foreground text-background px-6 py-3 font-sans uppercase tracking-widest text-xs hover:bg-secondary transition-colors duration-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Accept &amp; Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-secondary text-center mb-8">Begin your story</p>
        <SignUp
          routing="path"
          path={`${basePath}/sign-up`}
          signInUrl={`${basePath}/sign-in`}
          fallbackRedirectUrl={`${basePath}/`}
        />
      </div>
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function Router() {
  return (
    <>
      <CloudSync />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl || undefined}
      appearance={clerkAppearance}
      localization={{
        signIn: {
          start: {
            title: "Sign in to Amore",
            subtitle: "Continue planning your perfect day",
          },
        },
        signUp: {
          start: {
            title: "Create your Amore account",
            subtitle: "Start planning the wedding you've always dreamed of",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
