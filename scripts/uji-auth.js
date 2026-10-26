import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { pool } from "../src/db/pool.js"; // BENAR
import { verifikasiPenyedia } from "./verifikasi-penyedia.js";

const base = process.argv[2] ?? "http://127.0.0.1:3000";
const tujuan = new URL(base);

if (
  tujuan.protocol !== "http:" ||
  !["localhost", "127.0.0.1"].includes(tujuan.hostname) ||
  !["localhost", "127.0.0.1"].includes(process.env.PGHOST) ||
  process.env.PGDATABASE !== "sisabaik_dev"
) {
  throw new Error("Uji ini hanya untuk HTTP dan database praktikum lokal");
}

const password = randomBytes(18).toString("hex");
const marker = `Uji Auth ${Date.now()}-${randomBytes(3).toString("hex")}`;
const suffix = marker.replace(/[^a-z0-9-]/gi, "").toLowerCase();

const emailRina = `rina.${suffix}@example.test`;
const emailBudi = `budi.${suffix}@example.test`;
const emailSiti = `siti.${suffix}@example.test`;
const emailAndi = `andi.${suffix}@example.test`;

let checks = 0;

async function api(path, method = "GET", body, token) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const r = await fetch(new URL(path, base), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  return {
    status: r.status,
    headers: r.headers,
    body: r.status === 204 ? null : await r.json(),
  };
}

function status(r, expected) {
  assert.equal(
    r.status,
    expected,
    `HTTP ${r.status}; code=${r.body?.error?.code ?? "-"}`
  );
  checks++;
}

async function login(email) {
  const r = await api("/api/auth/login", "POST", {
    email,
    kataSandi: password,
  });
  status(r, 200);
  return r.body.data;
}

try {
  status(await api("/api/pesanan"), 401);
  status(await api("/api/auth/saya", "GET", undefined, "rusak"), 401);
  
  assert.equal(
    (await pool.query("SELECT current_database() AS nama")).rows[0].nama,
    "sisabaik_dev"
  );

  for (const [email, nama] of [
    [emailRina, "Rina Uji"],
    [emailBudi, "Budi Uji"],
  ]) {
    const reg = await api("/api/auth/registrasi-penyedia", "POST", {
      namaLengkap: nama,
      email,
      kataSandi: password,
      namaUsaha: `Dapur ${nama}`,
      alamat: "Jl. Kampus No. 8, Padang",
      nomorTelepon: "+6281234567890",
    });

    status(reg, 201);
    assert.equal(reg.body.data.peran, "penyedia");
    assert.equal(reg.body.data.statusVerifikasi, "menunggu");
    assert.equal(reg.body.data.namaUsaha, `Dapur ${nama}`);

    const sesi = await login(email);
    const pending = await api("/api/penawaran/milik-saya", "GET", undefined, sesi.accessToken);
    status(pending, 403);
    assert.equal(pending.body.error.code, "PROVIDER_NOT_VERIFIED");

    const dbAkun = (
      await pool.query("SELECT id, kata_sandi_hash FROM pengguna WHERE email=$1", [email])
    ).rows[0];

    assert.equal(
      String(dbAkun?.id),
      reg.body.data.id,
      "Server HTTP dan script harus memakai database yang sama."
    );
    assert.ok(dbAkun.kata_sandi_hash && dbAkun.kata_sandi_hash !== password);

    await verifikasiPenyedia(pool, email);

    const fresh = await api("/api/auth/saya", "GET", undefined, sesi.accessToken);
    status(fresh, 200);
    assert.equal(fresh.body.data.statusVerifikasi, "terverifikasi");
  }

  console.log(`PASS: ${checks} pemeriksaan HTTP.`);
} catch (error) {
  console.error("FAIL:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}