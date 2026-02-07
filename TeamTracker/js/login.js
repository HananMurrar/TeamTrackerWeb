const loginForm = document.querySelector('#login');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.status === 200) {
            // save token in local storage
            localStorage.setItem('token', data.token);
            // login successful so redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    } catch (err) {
        console.error(err);
    }
});
