# Deploy ke GitHub Pages

Workflow `.github/workflows/deploy.yml` menguji dan membangun website, lalu menerbitkan
folder `dist` setiap ada push ke `main`. Google Apps Script tetap menangani album Drive.

## Pengaturan pertama

1. Buka [repository variables](https://github.com/Viki24434/princess-birthday/settings/variables/actions).
   Pilih **New repository variable**:
   - Name: `VITE_DRIVE_ALBUM_URL`
   - Value: URL Apps Script `/exec` yang sama dengan nilai di `.env.local`.
     Salin URL-nya saja, tanpa `VITE_DRIVE_ALBUM_URL=` dan tanpa tanda kutip.
2. Buka [Settings → Pages](https://github.com/Viki24434/princess-birthday/settings/pages).
   Di **Build and deployment → Source**, pilih **GitHub Actions**.
3. Buka [workflow deployment](https://github.com/Viki24434/princess-birthday/actions/workflows/deploy.yml).
   Pilih **Run workflow → main → Run workflow**. Jika sudah ada run yang gagal sebelum
   pengaturan selesai, bisa pilih **Re-run all jobs** pada run tersebut.
4. Tunggu job `build` dan `deploy` berwarna hijau. Alamat website akan ditampilkan
   pada deployment: **https://viki24434.github.io/princess-birthday/**.

URL Apps Script adalah alamat layanan publik yang memang digunakan browser.
**Jangan masukkan `ALBUM_ACCESS_CODE` ke repository, Actions variables, atau `VITE_*`.**
Kode album tetap berada di Script Properties dan dimasukkan pengunjung saat membuka album.
File `.env.local` tidak ikut push; pengaturan lokal tidak otomatis tersedia di GitHub.

## Pemeriksaan setelah deploy

- Buka website dan cek gambar, audio setelah interaksi, game, serta tombol navigasi.
- Izinkan kamera saat memakai photobooth. Izin kamera di domain GitHub Pages perlu
  diberikan lagi meskipun kamera sebelumnya sudah diizinkan pada localhost.
- Ambil foto, buka album memakai kode album, lalu pilih **Simpan ke kenangan**.
  Pastikan status tersimpan di Google Drive, kemudian muat ulang dan buka album lagi.

Build menggunakan base path dari GitHub Pages agar gambar dan berkas game bisa dimuat
di subfolder repository. Jika URL Apps Script berubah, perbarui repository variable
dan jalankan workflow lagi agar URL baru masuk ke build.

## Jika deployment gagal

- **Check album configuration**: pastikan repository variable sudah berisi URL `/exec`.
- **Configure Pages**: pastikan Source pada Settings → Pages sudah **GitHub Actions**.
- **Test / Build**: baca pesan error pada langkah tersebut di tab Actions.
- Album tidak terhubung: pastikan web app Apps Script dieksekusi sebagai pemilik dan
  aksesnya **Anyone**, seperti dalam [panduan album](google-drive-album.md).

Alur build mengikuti [panduan resmi Vite untuk GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages).
