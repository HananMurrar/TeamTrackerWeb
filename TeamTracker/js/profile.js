(function () {
    const profileForm = document.getElementById('profile');
    const message = document.getElementById('profile-message');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // fetch user data
    async function loadProfile() {
        try {
            const res = await fetch('http://localhost:3000/api/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await res.json();

            if (data.msg) {
                message.textContent = data.msg;
            } else {
                document.getElementById('name').value = data.name;
                document.getElementById('email').value = data.email;
            }
        } catch (err) {
            console.error(err);
        }
    }

    // update profile
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('http://localhost:3000/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            message.textContent = data.msg;
        } catch (err) {
            console.error(err);
        }
    });

    loadProfile();
})();
