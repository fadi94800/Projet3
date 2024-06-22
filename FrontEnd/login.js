document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const emailvalue = loginForm.email.value;
        const passwordvalue = loginForm.password.value;

        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: emailvalue, password: passwordvalue }),
            });

            if (!response.ok) {
                throw new Error('Invalid login');
            }

            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            window.location.href = 'index.html';
        } catch (error) {
            errorMessage.style.display = 'block';
        }
    });
});
