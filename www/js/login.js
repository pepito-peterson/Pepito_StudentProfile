document.addEventListener('DOMContentLoaded', async () => {
    // UPDATE THIS IP
    const API_URL = 'http://192.168.100.4:3000/api';
    const statusMsg = document.getElementById('status-msg');

    // 1. Network Test
    try {
        const ping = await fetch(`${API_URL}/ping`);
        if (ping.ok) {
            statusMsg.textContent = "Network Connected!";
            statusMsg.style.color = "green";
        }
    } catch (err) {
        statusMsg.textContent = "Network Offline: Cannot reach Node server.";
        statusMsg.style.color = "red";
    }

    // 2. Login Handling
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        statusMsg.textContent = "Authenticating...";
        statusMsg.style.color = "blue";

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: document.getElementById('identifier').value,
                    password: document.getElementById('password').value
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            localStorage.setItem('studentToken', data.token);
            window.location.replace('index.html');
        } catch (err) {
            statusMsg.textContent = err.message || "Connection refused.";
            statusMsg.style.color = "red";
        }
    });
});