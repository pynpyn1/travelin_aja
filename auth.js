// Nama file: auth.js
// Fungsi: Mengelola status login pengguna di seluruh situs.

document.addEventListener('DOMContentLoaded', () => {
    // === ELEMEN DOM ===
    // Elemen terkait autentikasi di navbar
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutButton = document.getElementById('logout-button');

    // Formulir login dan register
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Mengecek apakah ada pengguna yang sedang login dari localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    // === FUNGSI UTAMA ===

    /**
     * Memperbarui tampilan navbar berdasarkan status login pengguna.
     */
    function updateNavbar() {
        if (loggedInUser) {
            // Jika pengguna login, tampilkan info pengguna dan tombol logout
            authButtons.classList.add('d-none');
            userInfo.classList.remove('d-none');
            userInfo.classList.add('d-flex');
            welcomeMessage.textContent = `Halo, ${loggedInUser.username}!`;
        } else {
            // Jika tidak ada yang login, tampilkan tombol Login & Daftar
            authButtons.classList.remove('d-none');
            userInfo.classList.add('d-none');
            userInfo.classList.remove('d-flex');
        }
    }

    /**
     * Menangani proses logout.
     */
    function handleLogout() {
        // Hapus data pengguna dari localStorage
        localStorage.removeItem('loggedInUser');
        // Arahkan kembali ke halaman utama
        window.location.href = 'index.html';
    }

    // === EVENT LISTENERS ===

    // Listener untuk tombol logout
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Listener untuk form pendaftaran
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const registerAlert = document.getElementById('register-alert');

            // Ambil data pengguna yang sudah ada atau buat array baru
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Cek apakah email sudah terdaftar
            const userExists = users.some(user => user.email === email);
            if (userExists) {
                registerAlert.textContent = 'Email sudah terdaftar. Silakan gunakan email lain.';
                registerAlert.className = 'alert alert-danger';
                registerAlert.classList.remove('d-none');
                return;
            }

            // Tambahkan pengguna baru
            users.push({ username, email, password });
            // Simpan kembali ke localStorage
            localStorage.setItem('users', JSON.stringify(users));

            // Tampilkan pesan sukses dan arahkan ke halaman login
            registerAlert.textContent = 'Pendaftaran berhasil! Anda akan diarahkan ke halaman login...';
            registerAlert.className = 'alert alert-success';
            registerAlert.classList.remove('d-none');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });
    }

    // Listener untuk form login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const loginAlert = document.getElementById('login-alert');

            // Ambil data semua pengguna
            const users = JSON.parse(localStorage.getItem('users')) || [];
            // Cari pengguna berdasarkan email dan password
            const foundUser = users.find(user => user.email === email && user.password === password);

            if (foundUser) {
                // Jika pengguna ditemukan, simpan infonya ke localStorage sebagai "loggedInUser"
                localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
                // Arahkan ke halaman utama
                window.location.href = 'index.html';
            } else {
                // Jika tidak ditemukan, tampilkan pesan error
                loginAlert.textContent = 'Email atau password salah.';
                loginAlert.classList.remove('d-none');
            }
        });
    }

    // Panggil fungsi untuk memperbarui navbar saat halaman dimuat
    updateNavbar();
});