// form.js
document.addEventListener('DOMContentLoaded', function() {
    // Mendapatkan parameter URL dari halaman saat ini
    const urlParams = new URLSearchParams(window.location.search);
    // Mengambil nama tur dari parameter 'tour' di URL
    const tourName = urlParams.get('tour');
    // Mengambil harga dari parameter 'price' di URL (ini masih berupa string)
    let price = urlParams.get('price');

    // Mendapatkan referensi ke elemen-elemen HTML yang relevan
    const bookingDetailsDiv = document.getElementById('bookingDetails'); // Div untuk detail booking awal
    const bookingForm = document.getElementById('bookingForm');           // Formulir pemesanan
    const formMessageDiv = document.getElementById('formMessage');       // Div untuk pesan formulir
    const emailInput = document.getElementById('email');                 // Input email
    const phoneInput = document.getElementById('phoneNumber');           // Input nomor telepon
    const numParticipantsInput = document.getElementById('numParticipants'); // Input jumlah peserta
    const departureDateInput = document.getElementById('departureDate'); // Input tanggal keberangkatan

    // Elemen untuk menampilkan pesan error validasi
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const numParticipantsError = document.getElementById('numParticipantsError');
    const dateError = document.getElementById('dateError');
    const paymentMethodError = document.getElementById('paymentMethodError');
    const paymentMethodSelect = document.getElementById('paymentMethod');


    // Mendapatkan referensi ke elemen modal konfirmasi
    const confirmationModalElement = document.getElementById('confirmationModal');
    const downloadPdfButton = document.getElementById('downloadPdfButton');
    // const downloadJsonButton = document.getElementById('downloadJsonButton'); // Baris ini dihapus

    // Variabel untuk menyimpan data booking saat ini
    let currentBookingData = null;
    // Variabel untuk menyimpan harga dasar tur (setelah diurai dari string)
    let basePrice = 0;

    // Fungsi untuk mengurai string harga menjadi angka numerik
    // Mendukung format "IDR 1.500.000", "Rp 50.000", "1500000"
    function parsePrice(priceString) {
        if (!priceString) return 0;
        // Hapus "IDR", "Rp", spasi, dan titik (ribuan)
        let cleanedPrice = priceString.replace(/IDR|Rp|\s|\./g, '');
        // Ganti koma desimal menjadi titik jika ada
        cleanedPrice = cleanedPrice.replace(/,/g, '.');
        return parseFloat(cleanedPrice);
    }

    // Memeriksa apakah nama tur dan harga ada di URL
    if (tourName && price) {
        // Mengurai harga string menjadi angka numerik
        basePrice = parsePrice(price);

        // Menampilkan detail tur yang dipilih di atas formulir
        bookingDetailsDiv.innerHTML = `
            <h2 class="text-primary fw-bold">${tourName}</h2>
            <p class="fs-5">Harga per orang: <strong class="text-success">${formatRupiah(basePrice)}</strong></p>
            <p class="text-muted">Pilih jumlah peserta dan tanggal keberangkatan untuk melanjutkan.</p>
        `;
    } else {
        // Jika tidak ada parameter tur di URL, tampilkan pesan error
        bookingDetailsDiv.innerHTML = '<p class="alert alert-danger">Detail tur tidak ditemukan. Silakan kembali ke halaman pemilihan tur.</p>';
        bookingForm.style.display = 'none'; // Sembunyikan formulir
    }

    // Fungsi untuk memformat angka menjadi format mata uang Rupiah
    function formatRupiah(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0 // Tidak menampilkan angka desimal untuk Rupiah
        }).format(amount);
    }

    // Fungsi untuk memperbarui total harga berdasarkan jumlah peserta
    function updateTotalPrice() {
        const numParticipants = parseInt(numParticipantsInput.value);
        if (isNaN(numParticipants) || numParticipants < 1) {
            numParticipantsError.textContent = 'Jumlah peserta minimal 1.';
            numParticipantsInput.classList.add('is-invalid'); // Kelas Bootstrap untuk invalid
            return;
        } else {
            numParticipantsError.textContent = '';
            numParticipantsInput.classList.remove('is-invalid');
        }
        const totalPrice = basePrice * numParticipants;
        // Menampilkan total harga yang dihitung
        bookingDetailsDiv.querySelector('p:last-of-type').innerHTML = `Total harga: <strong class="text-info">${formatRupiah(totalPrice)}</strong>`;
    }

    // Menambahkan event listener untuk perubahan jumlah peserta
    numParticipantsInput.addEventListener('input', updateTotalPrice);

    // Memastikan total harga diperbarui saat halaman pertama kali dimuat
    updateTotalPrice();

    // Validasi input email secara real-time
    emailInput.addEventListener('input', function() {
        if (emailInput.validity.valid) {
            emailError.textContent = ''; // Hapus pesan error jika valid
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
        } else {
            emailInput.classList.add('is-invalid');
            emailInput.classList.remove('is-valid');
            if (emailInput.validity.valueMissing) {
                emailError.textContent = 'Email tidak boleh kosong.';
            } else if (emailInput.validity.typeMismatch) {
                emailError.textContent = 'Format email tidak valid.';
            } else if (emailInput.validity.patternMismatch) {
                emailError.textContent = 'Format email tidak valid (contoh: user@example.com).';
            }
        }
    });

    // Validasi input nomor telepon secara real-time
    phoneInput.addEventListener('input', function() {
        if (phoneInput.validity.valid) {
            phoneError.textContent = '';
            phoneInput.classList.remove('is-invalid');
            phoneInput.classList.add('is-valid');
        } else {
            phoneInput.classList.add('is-invalid');
            phoneInput.classList.remove('is-valid');
            if (phoneInput.validity.valueMissing) {
                phoneError.textContent = 'Nomor telepon tidak boleh kosong.';
            } else if (phoneInput.validity.patternMismatch) {
                phoneError.textContent = 'Format nomor telepon tidak valid (contoh: +6281234567890).';
            }
        }
    });

    // Validasi input tanggal keberangkatan
    departureDateInput.addEventListener('input', function() {
        const selectedDate = new Date(this.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Atur jam ke 00:00:00 untuk perbandingan yang akurat

        if (this.value === '') {
            dateError.textContent = 'Tanggal keberangkatan tidak boleh kosong.';
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
        } else if (selectedDate < today) {
            dateError.textContent = 'Tanggal keberangkatan tidak boleh di masa lalu.';
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
        } else {
            dateError.textContent = '';
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        }
    });

    // Validasi pilihan metode pembayaran
    paymentMethodSelect.addEventListener('change', function() {
        if (paymentMethodSelect.value === '') {
            paymentMethodError.textContent = 'Pilih metode pembayaran.';
            paymentMethodSelect.classList.add('is-invalid');
            paymentMethodSelect.classList.remove('is-valid');
        } else {
            paymentMethodError.textContent = '';
            paymentMethodSelect.classList.remove('is-invalid');
            paymentMethodSelect.classList.add('is-valid');
        }
    });


    // Menangani pengiriman formulir
    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah pengiriman formulir default

        // Lakukan validasi ulang semua input sebelum submit
        let formIsValid = true;

        // Trigger validation for all inputs to show messages
        emailInput.dispatchEvent(new Event('input'));
        phoneInput.dispatchEvent(new Event('input'));
        numParticipantsInput.dispatchEvent(new Event('input'));
        departureDateInput.dispatchEvent(new Event('input'));
        paymentMethodSelect.dispatchEvent(new Event('change')); // Trigger change for select

        // Check if any error message is visible
        if (emailError.textContent || phoneError.textContent || numParticipantsError.textContent || dateError.textContent || paymentMethodError.textContent) {
            formIsValid = false;
        }

        // Check native form validity
        if (!bookingForm.checkValidity()) {
            formIsValid = false;
        }

        if (!formIsValid) {
            formMessageDiv.textContent = 'Mohon lengkapi semua bidang yang wajib diisi dan perbaiki kesalahan.';
            formMessageDiv.className = 'message alert alert-danger';
            return;
        }

        // Jika formulir valid, kumpulkan data
        const fullName = document.getElementById('fullName').value;
        const email = emailInput.value;
        const phoneNumber = phoneInput.value;
        const departureDate = departureDateInput.value;
        const numParticipants = parseInt(numParticipantsInput.value);
        const paymentMethod = paymentMethodSelect.value;
        const totalPrice = basePrice * numParticipants;

        // Buat kode booking acak sederhana
        const bookingCode = 'TRV-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        // Simpan data booking saat ini
        currentBookingData = {
            bookingCode: bookingCode,
            tourName: tourName,
            departureDate: departureDate,
            numParticipants: numParticipants,
            pricePerPerson: basePrice,
            totalPrice: totalPrice,
            customerName: fullName,
            customerEmail: email,
            customerPhone: phoneNumber,
            paymentMethod: paymentMethod
        };

        // Mengisi data ke modal konfirmasi
        document.getElementById('ticketBookingCode').textContent = currentBookingData.bookingCode;
        document.getElementById('ticketTourName').textContent = currentBookingData.tourName;
        document.getElementById('ticketDepartureDate').textContent = new Date(currentBookingData.departureDate).toLocaleDateString('id-ID'); // Format tanggal
        document.getElementById('ticketNumParticipants').textContent = currentBookingData.numParticipants;
        document.getElementById('ticketPricePerPerson').textContent = formatRupiah(currentBookingData.pricePerPerson);
        document.getElementById('ticketTotalPrice').textContent = formatRupiah(currentBookingData.totalPrice);
        document.getElementById('ticketCustomerName').textContent = currentBookingData.customerName;
        document.getElementById('ticketCustomerEmail').textContent = currentBookingData.customerEmail;
        document.getElementById('ticketCustomerPhone').textContent = currentBookingData.customerPhone;
        document.getElementById('ticketPaymentMethod').textContent = currentBookingData.paymentMethod === 'transfer_bank' ? 'Transfer Bank' :
                                                                       currentBookingData.paymentMethod === 'kartu_kredit' ? 'Kartu Kredit' :
                                                                       currentBookingData.paymentMethod === 'ewallet' ? 'E-wallet' : currentBookingData.paymentMethod;

        // Tampilkan modal konfirmasi menggunakan Bootstrap JavaScript
        const modal = new bootstrap.Modal(confirmationModalElement);
        modal.show();

        // Tampilkan pesan sukses di bawah formulir
        formMessageDiv.textContent = 'Pemesanan Anda telah diterima!';
        formMessageDiv.className = 'message alert alert-success';

        // Nonaktifkan formulir setelah pengiriman berhasil
        bookingForm.reset(); // Reset formulir
        bookingForm.querySelector('button[type="submit"]').disabled = true;
        document.querySelector('.back-button').style.pointerEvents = 'none'; // Nonaktifkan tombol kembali
        document.querySelector('.back-button').style.opacity = '0.5';

        // Reset validasi visual pada form
        const formControls = bookingForm.querySelectorAll('.form-control, .form-select');
        formControls.forEach(control => {
            control.classList.remove('is-valid', 'is-invalid');
        });
    });

    // Menangani unduh sebagai PDF (menggunakan fungsi print browser)
    downloadPdfButton.addEventListener('click', function() {
        window.print();
    });

    // Bagian downloadJsonButton di sini dihapus

    // Panggil fungsi updateTotalPrice saat halaman dimuat pertama kali
    updateTotalPrice();
});