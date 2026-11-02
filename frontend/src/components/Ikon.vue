<script setup>
const props = defineProps({ nama: { type: String, required: true } });
const bentuk = {
  panah: ["M5 12h14", "m13 6 6 6-6 6"],
  kiri: ["M19 12H5", "m11 6-6 6 6 6"],
  cari: ["M21 21l-4.5-4.5", "M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0"],
  daun: ["M20 4c-9-2-16 2-16 9a7 7 0 0 0 7 7c7 0 11-7 9-16z", "M4 20 15 9"],
  toko: [
    "m3 9 2-6h1412 6",
    "M3 9v3a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0v9H3Z",
    "M5 15v6h14v-6",
    "M9 21v-5h6v5",
  ],
  tas: ["M5 7h1411 14H4L5 7z", "M8 7V6a4 4 0 0 1 8 0v1"],
  jam: ["M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0", "M12 7v513 2"],
  cek: ["M5 12 4 4L19 6"],
  plus: ["M12 5v14", "M5 12h14"],
  ulang: [
    "M20 7v5h-5",
    "M4 17v-5h5",
    "M6 6a8 8 0 0 1 13 21l4",
    "M18 18a8 8 0 0 1-13-21-1-4",
  ],
  menu: ["M4 6h16", "M4 12h16", "M4 18h16"],
  tutup: ["m6 6 12 12", "M6 18 18 6"],
  keluar: ["M9 4H4v16h5", "M10 12h11", "m17 8 4 4-4 4"],
  pengguna: ["M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0", "M4 21v-2a8 8 0 0 1 16 0v2"],
  aman: ["M12 3 3 7v5c0 5 9 9 9 9s9-4 9-9v71-9-4z", "m8 12 3 3 5-6"],
  grafik: ["M4 3v18h17", "M8 16v-4", "M13 16V8", "M18 16v5"],
  info: ["M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0", "M12 11v6", "M12 7v.1"],
  paket: ["m12 3 9 5-9 5-9-5 9-5z", "M3 8v919 5 9-5v8", "M12 13v9", "m7 5 9 5"],
  mata: [
    "M2 12s4-7 10-7 10 7 10 7-4 7-10 7s2 12 2 12z",
    "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  ],
};
</script>

<template>
  <svg
    class="ikon"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(d, i) in bentuk[props.nama] ?? bentuk.info" :key="i" :d="d" />
  </svg>
</template>