export function labelPesanan(status) {
  const mapping = {
    "menunggu-konfirmasi": "Menunggu Konfirmasi",
    "dikonfirmasi": "Dikonfirmasi",
    "siap-diambil": "Siap Diambil",
    "selesai": "Selesai",
    "dibatalkan": "Dibatalkan"
  };
  return mapping[status] ?? status;
}

export function labelPembayaran(status) {
  const mapping = {
    "belum-dibayar": "Belum Dibayar",
    "dibayar": "Dibayar",
    "gratis": "Gratis"
  };
  return mapping[status] ?? status;
}

export function visualKategori(kategori) {
  const mapping = {
    "roti": "Roti & Kue",
    "makanan-berat": "Makanan Berat",
    "minuman": "Minuman",
    "bahan-segar": "Bahan Segar"
  };
  return mapping[kategori] ?? kategori;
}

export function labelStatus(status) {
  const mapping = {
    "aktif": "Aktif",
    "draft": "Draft",
    "habis": "Habis",
    "kedaluwarsa": "Kedaluwarsa"
  };
  return mapping[status] ?? status;
}

export function sisaWaktu(berakhirPada) {
  const selisih = new Date(berakhirPada) - new Date();
  if (selisih <= 0) return "Berakhir";
  const jam = Math.floor(selisih / (1000 * 60 * 60));
  const menit = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
  return `Sisa ${jam}j ${menit}m`;
}