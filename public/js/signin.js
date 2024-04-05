import { signIn } from '../../api/auth.js'

document.getElementById('signInForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await signIn(email, password);

    window.location.href = '../game.html';
  });  