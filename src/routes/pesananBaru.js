import { randomUUID } from "node:crypto";

export const pesananBaru = {
    id: randomUUID(),
    namaPemesan: namaPemesan.trim(),
    status: "menunggu-konfirmasi",
    items: detail,
    total: detail.reduce((jumlah, baris) => jumlah + baris.subtotal, 0),
    nilaiStokTerselamatkan: detail.reduce(
        (jumlah, baris) => jumlah + baris.nilaiStokTerselamatkan,
        0
    ),
    dibuatPada: new Date().toISOString()
};
