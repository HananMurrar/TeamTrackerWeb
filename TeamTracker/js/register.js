const registerForm = document.querySelector('#registration form');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.status === 201) {
            // registration successful so redirect to login
            window.location.href = 'login.html';
        }
    } catch (err) {
        console.error(err);
    }
});
