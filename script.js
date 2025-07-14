// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Menunggu seluruh konten HTML dimuat sebelum menjalankan script

    // Mendapatkan semua tombol dengan class 'book-tour-button'
    const bookTourButtons = document.querySelectorAll('.book-tour-button');

    // Iterasi setiap tombol 'Pesan Tiket'
    bookTourButtons.forEach(button => {
        // Menambahkan event listener untuk setiap klik tombol
        button.addEventListener('click', function() {
            // Mengambil nama tur dari atribut 'data-tour-name' tombol
            const tourName = this.dataset.tourName;
            // Mengambil harga tur dari atribut 'data-tour-price' tombol
            const tourPrice = this.dataset.tourPrice;

            // Membuat URL tujuan ke 'form.html' dengan parameter tur dan harga
            // encodeURIComponent digunakan untuk memastikan karakter khusus (misal spasi) dienkode dengan benar di URL
            window.location.href = `form.html?tour=${encodeURIComponent(tourName)}&price=${encodeURIComponent(tourPrice)}`;
        });
    });
});