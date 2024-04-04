import { supabase } from './supabaseClient.js';

document.getElementById('signInForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const { error } = await supabase.auth.signIn({ email, password });
        if (error) throw error;
        // Redirect to the main game page upon successful sign in
        window.location.href = '/game.html';
    } catch (error) {
        alert(error.error_description || error.message);
    }
});