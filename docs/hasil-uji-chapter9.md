# Laporan Hasil Uji - Chapter 9 (SisaBaik Frontend)

- **Nama Penguji**: Reza Febriani
- **Program Studi**: Bisnis Digital (Universitas Negeri Padang)
- **Tanggal Pengujian**: 2 November 2026

## 1. Lingkungan Pengujian
- **Node Version**: v24.x
- **Framework**: Vue 3 / Vite
- **Metode Penyimpanan Data**: In-memory fixture (State lokal browser)

## 2. Catatan Hasil Aktual Skenario (Langkah 12)
1. **Tampilan Awal Pembeli**: Berhasil memuat daftar penawaran makanan, total unit tersedia, dan informasi penyedia dengan baik.
2. **Pencarian & Filter**: Kolom pencarian dan filter kategori berfungsi akurat untuk menyaring data menu.
3. **Pemilihan Menu**: Tombol "Pilih makanan" berhasil memicu panel ringkasan pilihan di bagian bawah.
4. **Mode Penyedia & Validasi**: Pengalihan mode ke penyedia menampilkan form penawaran dengan validasi input kosong/error yang berjalan semestinya.
5. **Uji Refresh Memori**: Saat halaman di-*refresh*, data kembali ke kondisi awal sesuai sifat *fixture* memori.

## 3. Aliran Data (Props & Emits)
- Komponen induk (`App.vue`) mengelola state utama dan mendistribusikan data ke komponen anak menggunakan **props**.
- Komponen anak meneruskan interaksi atau aksi pengguna kembali ke komponen induk menggunakan sistem **emits**.

## 5. Kesimpulan
Seluruh komponen antarmuka, reaktivitas state, dan validasi formulir pada aplikasi SisaBaik frontend telah berfungsi dengan baik.