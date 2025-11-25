import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthState } from '../types/auth.types';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    session: null,
    profile: null,
  });

  const fetchProfile = async (session: Session) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      setState((prev) => ({
        ...prev,
        profile: data,
      }));
    } catch (error) {
      console.warn('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((prev) => ({ ...prev, session }));
      if (session) fetchProfile(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({ ...prev, session }));
      if (session) {
        fetchProfile(session);
      } else {
        setState((prev) => ({ ...prev, profile: null }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return {
    ...state,
    logout,
    isLoggedIn: !!state.session,
  };
};
