import { Session } from '@supabase/supabase-js';

export interface Profile {
  username: string;
}

export interface AuthState {
  session: Session | null;
  profile: Profile | null;
}
