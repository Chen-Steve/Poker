import { createClient } from '@supabase/supabase-js';

const supabaseUrl = env("SUPABASE_URL");
const supabaseAnonKey = env("SUPABASE_ANON_KEY");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signUp(email, password) {
  const { user, error } = await supabase.auth.signUp({ email, password });
  // Handle the response, e.g., save the user profile or show errors
  if (error) {
    console.error('Signup error:', error);
  } else {
    console.log('User signed up', user);
  }
}

export async function signIn(email, password) {
  const { user, session, error } = await supabase.auth.signIn({ email, password });
  // Handle the response, e.g., store the session or show errors
  if (error) {
    console.error('Signin error:', error);
  } else {
    console.log('User signed in', user);
    window.location.href = '../game.html';
  }
}