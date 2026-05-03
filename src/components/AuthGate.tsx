import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

interface Props {
  children: React.ReactNode;
}

const AuthGate = ({ children }: Props) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // ============================================================
  // MODIFICA PER DEV MODE: 
  // ============================================================
  
  // Questa riga SOTTO deve essere commentata (con //) per entrare senza login
  // if (!session) return <Navigate to="/auth" replace />; 

  // Deve esserci scritto questo per far passare chiunque:
  return <>{children}</>;

  // ============================================================
};

export default AuthGate;