import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Prevent multiple initializations
        if (initialized) return;
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth session error:", error);
        }
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          setInitialized(true);
        }

        // Listen for auth changes - only once
        if (!subscription) {
          const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;
            
            console.log("Auth state changed:", event, session?.user?.email);
            
            // Prevent duplicate events
            if (event === 'INITIAL_SESSION' && initialized) {
              console.log("Skipping duplicate INITIAL_SESSION event");
              return;
            }
            
            if (event === 'SIGNED_IN' && initialized) {
              console.log("Skipping duplicate SIGNED_IN event");
              return;
            }
            
            if (event === 'TOKEN_REFRESHED') {
              console.log('Token refreshed successfully');
              setUser(session?.user ?? null);
              setLoading(false);
              return;
            }
            
            if (event === 'SIGNED_OUT') {
              console.log('User signed out');
              setUser(null);
              setLoading(false);
              setInitialized(false);
              return;
            }
            
            if (event === 'INITIAL_SESSION') {
              console.log('Initial session loaded');
              setUser(session?.user ?? null);
              setLoading(false);
              setInitialized(true);
              return;
            }
            
            // Handle other events
            setUser(session?.user ?? null);
            setLoading(false);
          });

          setSubscription(authSubscription);
        }

        return () => {
          if (subscription) subscription.unsubscribe();
        };
      } catch (err) {
        console.error("Auth initialization error:", err);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [initialized, subscription]);

  return { user, loading };
}
