# Princess Birthday

Website kejutan ulang tahun dengan photobooth, album kenangan, dan game menuju kastil.

## Menjalankan project

```sh
npm install
npm run dev
```

Build produksi: `npm run build`. Pengujian: `node --test tests/*.test.js`.

## Album kenangan Google Drive

Untuk menyimpan hasil photobooth ke satu folder Google Drive milik pemilik website,
ikuti [panduan pemasangan album](docs/google-drive-album.md). Penghubung siap disalin
dari `google-apps-script/Code.gs`. Isi URL deployment melalui `.env.local` berdasarkan
`.env.example`. Tanpa URL tersebut, penyimpanan hanya berada di perangkat pengguna.

Kode album hanya disimpan di Google Apps Script dan dimasukkan saat membuka album;
kode ini tidak dimasukkan ke variabel `VITE_*` atau repository.

## Deploy ke GitHub Pages

Ikuti [panduan deployment](docs/github-pages.md) untuk mengisi URL album di repository
variables dan mengaktifkan GitHub Pages. Setelah pengaturan awal selesai, push ke
`main` akan menjalankan tes, build, dan deployment secara otomatis.

## Teknologi

React, Vite, GSAP, IndexedDB melalui idb, serta Google Apps Script untuk album Drive.
