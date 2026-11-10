<script setup>
import { ref, nextTick, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { api } from "../lib/api.js";
import { periksaRegistrasi } from "../lib/registrasi.js";
import { isiSesi } from "../lib/sesi.js";

const router = useRouter();
const form = ref({
  namaLengkap: "",
  email: "",
  kataSandi: "",
  konfirmasiSandi: "",
  peran: "pembeli",
  namaUsaha: "",
  alamat: "",
  nomorTelepon: "",
});
const errors = ref({});
const sibuk = ref(false);
const errorGlobal = ref("");
const ringkasan = ref(null);
let controller;

onUnmounted(() => controller?.abort());

async function daftar() {
  if (sibuk.value) return;
  errorGlobal.value = "";
  errors.value = periksaRegistrasi(form.value);
  if (Object.keys(errors.value).length) {
    await nextTick();
    ringkasan.value?.focus();
    return;
  }

  const body = {
    namaLengkap: form.namaLengkap.trim(),
    email: form.email.trim(),
    kataSandi: form.kataSandi,
  };

  if (form.peran === "penyedia") {
    Object.assign(body, {
      namaUsaha: form.namaUsaha.trim(),
      alamat: form.alamat.trim(),
      nomorTelepon: form.nomorTelepon.trim(),
    });
  }

  sibuk.value = true;
  controller?.abort();
  controller = new AbortController();

  try {
    const hasil = await api(
      form.peran === "penyedia"
        ? "/api/auth/registrasi-penyedia"
        : "/api/auth/registrasi",
      {
        method: "POST",
        body,
        signal: controller.signal,
      }
    );

    if (controller.signal.aborted) return;

    if (form.peran === "penyedia" && hasil.data.pengguna.statusVerifikasi === "menunggu") {
      isiSesi(hasil.data);
      router.push("/profil-penyedia");
    } else {
      router.push({
        path: "/login",
        query: { pesan: "Registrasi berhasil. Silakan login." },
      });
    }
  } catch (e) {
    if (e.name === "AbortError") return;
    errorGlobal.value = e.message;
    await nextTick();
    ringkasan.value?.focus();
  } finally {
    if (!controller.signal.aborted) sibuk.value = false;
  }
}
</script>

<template>
  <main class="auth-view">
    <div class="auth-card">
      <h1>Buat akun SisaBaik</h1>
      <p class="form-intro">
        Daftar sebagai pembeli untuk menyelamatkan makanan berlebih, atau sebagai penyedia usaha kuliner.
      </p>

      <p
        ref="ringkasan"
        tabindex="-1"
        role="status"
        aria-live="polite"
        class="error-summary"
      >
        <span v-if="Object.keys(errors).length">Periksa isian yang ditandai.</span>
        <span v-if="errorGlobal">{{ errorGlobal }}</span>
      </p>

      <form novalidate @submit.prevent="daftar">
        <fieldset :disabled="sibuk">
          <div class="field-full">
            <label>Jenis akun</label>
            <div class="radio-group">
              <label>
                <input
                  type="radio"
                  v-model="form.peran"
                  value="pembeli"
                />
                Pembeli
              </label>
              <label>
                <input
                  type="radio"
                  v-model="form.peran"
                  value="penyedia"
                />
                Penyedia makanan
              </label>
            </div>
          </div>

          <div class="field-full">
            <label for="namaLengkap">Nama lengkap</label>
            <input
              id="namaLengkap"
              v-model.trim="form.namaLengkap"
              required
              minlength="2"
              maxlength="100"
              :aria-invalid="Boolean(errors.namaLengkap)"
            />
            <p v-if="errors.namaLengkap" class="error">{{ errors.namaLengkap }}</p>
          </div>

          <div class="field-full">
            <label for="email">Alamat email</label>
            <input
              id="email"
              type="email"
              v-model.trim="form.email"
              required
              maxlength="254"
              :aria-invalid="Boolean(errors.email)"
            />
            <p v-if="errors.email" class="error">{{ errors.email }}</p>
          </div>

          <div>
            <label for="kataSandi">Kata sandi</label>
            <input
              id="kataSandi"
              type="password"
              v-model="form.kataSandi"
              required
              minlength="15"
              :aria-invalid="Boolean(errors.kataSandi)"
            />
            <p v-if="errors.kataSandi" class="error">{{ errors.kataSandi }}</p>
          </div>

          <div>
            <label for="konfirmasiSandi">Ulangi kata sandi</label>
            <input
              id="konfirmasiSandi"
              type="password"
              v-model="form.konfirmasiSandi"
              required
              :aria-invalid="Boolean(errors.konfirmasiSandi)"
            />
            <p v-if="errors.konfirmasiSandi" class="error">
              {{ errors.konfirmasiSandi }}
            </p>
          </div>

          <template v-if="form.peran === 'penyedia'">
            <div class="field-full">
              <label for="namaUsaha">Nama usaha</label>
              <input
                id="namaUsaha"
                v-model.trim="form.namaUsaha"
                required
                minlength="2"
                maxlength="120"
                :aria-invalid="Boolean(errors.namaUsaha)"
              />
              <p v-if="errors.namaUsaha" class="error">{{ errors.namaUsaha }}</p>
            </div>

            <div class="field-full">
              <label for="alamat">Alamat pengambilan</label>
              <textarea
                id="alamat"
                v-model.trim="form.alamat"
                required
                minlength="5"
                maxlength="1000"
                :aria-invalid="Boolean(errors.alamat)"
              ></textarea>
              <p v-if="errors.alamat" class="error">{{ errors.alamat }}</p>
            </div>

            <div class="field-full">
              <label for="nomorTelepon">Nomor telepon</label>
              <input
                id="nomorTelepon"
                type="tel"
                v-model.trim="form.nomorTelepon"
                required
                :aria-invalid="Boolean(errors.nomorTelepon)"
              />
              <p v-if="errors.nomorTelepon" class="error">
                {{ errors.nomorTelepon }}
              </p>
            </div>
          </template>

          <button class="button-wide" type="submit" :disabled="sibuk">
            {{ sibuk ? "Memproses..." : "Daftar sekarang" }}
          </button>
        </fieldset>
      </form>

      <p class="auth-footer">
        Sudah punya akun? <RouterLink to="/login">Login di sini</RouterLink>
      </p>
    </div>
  </main>
</template>