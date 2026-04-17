// --- 1. AMBIL ELEMEN DARI HTML ---
const inputNama = document.getElementById('nama-barang');
const inputHarga = document.getElementById('harga-barang');
const inputKategori = document.getElementById('kategori-barang');
const tombolSimpan = document.getElementById('tombol-simpan');
const daftarBelanja = document.getElementById('daftar-belanja');
const totalHargaEl = document.getElementById('total-harga');

// --- 2. DATA UTAMA ---
let transactions = JSON.parse(localStorage.getItem('dataBelanja')) || [];
let myChart = null; // Variabel untuk menyimpan grafik

// --- 3. FUNGSI LOGIKA ---

// Fungsi simpan ke storage & update semua tampilan
function updateSemua() {
    localStorage.setItem('dataBelanja', JSON.stringify(transactions));
    renderList();
    renderChart();
}

// Fungsi tambah data
tombolSimpan.addEventListener('click', () => {
    const nama = inputNama.value;
    const harga = parseInt(inputHarga.value);
    const kategori = inputKategori.value;

    if (!nama || !harga || !kategori) {
        alert("Isi semua dulu ya!");
        return;
    }

    const baru = {
        id: Date.now(),
        nama: nama,
        harga: harga,
        kategori: kategori
    };

    transactions.push(baru);
    updateSemua();

    // Kosongkan input setelah simpan
    inputNama.value = '';
    inputHarga.value = '';
    inputKategori.value = '';
});

// Fungsi hapus data
function hapusData(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateSemua();
}

// --- 4. FUNGSI TAMPILAN (RENDER) ---

function renderList() {
    daftarBelanja.innerHTML = '';
    let total = 0;

    transactions.forEach(t => {
        const li = document.createElement('li');
        li.style.marginBottom = "10px";
        li.innerHTML = `
            <span><strong>${t.nama}</strong> - Rp${t.harga.toLocaleString()} (${t.kategori})</span>
            <button onclick="hapusData(${t.id})" style="margin-left: 10px; color: red;">Hapus</button>
        `;
        daftarBelanja.appendChild(li);
        total += t.harga;
    });

    totalHargaEl.innerText = total.toLocaleString();
}

// Fungsi untuk menggambar grafik Pie Chart
function renderChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    
    // Hitung total per kategori
    const dataKategori = { 'Food': 0, 'Transport': 0, 'Fun': 0 };
    transactions.forEach(t => {
        if (dataKategori[t.kategori] !== undefined) {
            dataKategori[t.kategori] += t.harga;
        }
    });

    // Jika grafik sudah ada, hapus dulu biar nggak tumpang tindih
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Makanan', 'Transportasi', 'Hiburan'],
            datasets: [{
                data: [dataKategori['Food'], dataKategori['Transport'], dataKategori['Fun']],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Jalankan pertama kali saat web dibuka
renderList();
renderChart();
