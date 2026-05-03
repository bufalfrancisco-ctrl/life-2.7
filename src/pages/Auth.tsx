import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Sparkles, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import SettingsButton from "@/components/SettingsButton";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (authed) return <Navigate to="/" replace />;

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // LOGICA ENTER TEST
  const handleEnterTest = () => {
    const masterKey = prompt("Inserisci il codice Developer:");
    if (masterKey === "zetamog") {
      toast.success("Modalità Developer Attivata!");
      navigate("/", { replace: true });
    } else {
      toast.error("Codice errato!");
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(`Could not sign in with ${provider}`);
      return;
    }
    if (result.redirected) return;
    navigate("/", { replace: true });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute top-5 right-5 z-20">
        <SettingsButton />
      </div>
      
      <div className="glass-card w-full max-w-sm p-7 animate-hero-enter">
        <div className="flex flex-col items-center mb-6 text-center">
          <Sparkles className="w-7 h-7 text-primary mb-2" />
          <h1 className="text-2xl font-bold text-foreground">
            {mode === "signin" ? "Welcome back" : "Begin your project"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "Sign in to continue your journey" : "Create an account to start"}
          </p>
        </div>

        {/* ========================================== */}
        {/* PULSANTI SOCIAL CON ICONE ORIGINALI */}
        {/* ========================================== */}
        <div className="flex flex-col gap-2 mb-4">
          <button
            onClick={() => handleOAuth("google")}
            className="w-full py-2.5 rounded-xl glass-input !py-2.5 !px-4 text-sm font-medium hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.1A6.59 6.59 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.07H2.18A10.99 10.99 0 0 0 12 23z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A10.99 10.99 0 0 0 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
            </svg>
            Continue with Google
          </button>
          
          <button
            onClick={() => handleOAuth("apple")}
            className="w-full py-2.5 rounded-xl glass-input !py-2.5 !px-4 text-sm font-medium hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden>
              <path d="M16.365 1.43c0 1.14-.46 2.23-1.213 3.04-.81.86-2.13 1.52-3.21 1.43-.13-1.12.42-2.27 1.18-3.06.85-.88 2.27-1.55 3.24-1.4zM20.7 17.17c-.59 1.36-.87 1.97-1.62 3.18-1.05 1.69-2.53 3.79-4.36 3.81-1.63.01-2.05-1.06-4.26-1.05-2.21.01-2.67 1.07-4.3 1.05-1.83-.02-3.23-1.92-4.28-3.61C-.99 17.09-1.32 11.5 1.04 8.45c1.69-2.18 4.34-3.46 6.83-3.46 2.54 0 4.14 1.39 6.24 1.39 2.04 0 3.28-1.4 6.22-1.4 2.21 0 4.55 1.2 6.22 3.27-5.46 2.99-4.57 10.79-1.85 8.92z"/>
            </svg>
            Continue with Apple
          </button>
        </div>
        {/* ========================================== */}

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleEmail} className="flex flex-col gap-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="glass-input w-full !pl-9"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="glass-input w-full !pl-9"
            />
          </div>
          <button type="submit" disabled={loading} className="hero-button !py-3 !text-base disabled:opacity-50">
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-5">
          {mode === "signin" ? "No account yet?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-primary hover:underline font-medium"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>

      {/* TASTO ENTER TEST */}
      <div className="fixed bottom-4 left-4 z-50">
        <button 
          onClick={handleEnterTest}
          className="bg-red-600/20 hover:bg-red-600/40 text-red-500 border border-red-600/30 font-medium py-2 px-4 rounded-full backdrop-blur-md transition-all text-xs"
        >
          Enter test mode
        </button>
      </div>
    </div>
  );
};

export default Auth;
