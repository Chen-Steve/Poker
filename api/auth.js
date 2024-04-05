import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xhxgdydgzidbdhlaeahk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoeGdkeWRnemlkYmRobGFlYWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEwNjQ1NDEsImV4cCI6MjAyNjY0MDU0MX0.35HxQ7V_eMuBdZHgbx3wx_b8hG7Z9RtSxDhlNFdLuug';

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