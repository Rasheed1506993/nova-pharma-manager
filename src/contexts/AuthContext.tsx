
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PharmacyProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  owner_name?: string;
  created_at?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  pharmacy: PharmacyProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [pharmacy, setPharmacy] = useState<PharmacyProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Fetch pharmacy profile when auth state changes
        if (currentSession?.user) {
          fetchPharmacyProfile(currentSession.user.id);
        } else {
          setPharmacy(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Fetch pharmacy profile for existing session
      if (currentSession?.user) {
        fetchPharmacyProfile(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPharmacyProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('pharmacies')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching pharmacy profile:', error);
        return;
      }
      
      setPharmacy(data);
    } catch (error) {
      console.error('Error in fetchPharmacyProfile:', error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "تم تسجيل الخروج بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الخروج",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const value = {
    session,
    user,
    pharmacy,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
