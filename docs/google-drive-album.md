# Menghubungkan album ke Google Drive milikmu

Website sudah memiliki tombol **Simpan ke kenangan**, antrean foto di perangkat,
dan galeri untuk membuka serta mengunduh ulang foto. Agar salinannya benar-benar
masuk ke Drive, hubungkan satu folder melalui Apps Script milikmu.

Yang disimpan adalah **PNG hasil akhir dengan bingkai**, bukan rekaman kamera.
Satu hasil berisi 1, 3, atau 4 foto sesuai pilihan di photobooth. Batas satu PNG
adalah 8 MB. Orang yang memegang kode album bisa menyimpan dan melihat album
bersama ini; penerima website tidak perlu login Google.
Jika sesi dihentikan lebih awal, foto yang sudah terambil tetap dapat disimpan.

## 1. Siapkan folder dan kode album

1. Buat folder **Kenangan Princess Birthday** di Google Drive milikmu.
2. Salin ID folder dari alamatnya: `https://drive.google.com/drive/folders/ID_FOLDER`.
3. Pilih kode album sepanjang 12–128 karakter. Bagikan kode ini kepada orang yang
   ingin kamu beri akses album. Jangan memasukkannya ke kode React atau variabel `VITE_*`.

Folder tidak perlu dijadikan publik. Website membaca fotonya melalui penghubung
yang dijalankan oleh akunmu, dan memeriksa kode album pada setiap permintaan.

## 2. Pasang penghubung di akun Google milikmu

1. Buka [Google Apps Script](https://script.google.com/home/start), lalu buat project baru.
2. Ganti isi `Code.gs` dengan seluruh isi [file penghubung](../google-apps-script/Code.gs).
3. Di **Project Settings**, aktifkan tampilan `appsscript.json`, kemudian ganti isi
   manifest dengan [appsscript.json dari project ini](../google-apps-script/appsscript.json).
4. Masih di **Project Settings → Script Properties**, tambahkan:

   | Properti | Nilai |
   | --- | --- |
   | `DRIVE_FOLDER_ID` | ID folder pada langkah pertama |
   | `ALBUM_ACCESS_CODE` | Kode album pilihanmu |

5. Dari editor, pilih fungsi **setupAlbum**, lalu **Run** dan berikan izin akses
   Drive untuk akunmu. Fungsi ini memeriksa folder, menyimpan hash kode, lalu
   menghapus properti kode yang masih berbentuk teks biasa.
6. Pilih **Deploy → New deployment → Web app**. Atur **Execute as: Me** dan
   **Who has access: Anyone**, kemudian deploy.
7. Salin **Web app URL** yang berakhiran `/exec`. Jangan memakai URL `/dev`.

Pengaturan eksekusi sebagai pemilik mengikuti [dokumentasi web app Google](https://developers.google.com/apps-script/guides/web).
Kode akses tetap diperlukan oleh penghubung meski deployment dapat diakses tanpa login.

## 3. Hubungkan website

Di root project, buat `.env.local` dari `.env.example`, lalu isi:

```dotenv
VITE_DRIVE_ALBUM_URL=https://script.google.com/macros/s/ID_DEPLOYMENT/exec
```

Jika `.env.local` sudah ada, cukup tambahkan variabel tersebut. Restart `npm run dev`.
Untuk versi hosting, isi variabel build yang sama lalu jalankan build/deploy ulang.
Ini tetap bisa digunakan pada hosting statis: penghubung Drive berada di Apps Script.

URL deployment bukan kata sandi. Kode album dimasukkan melalui website, disimpan
sementara di memori tab, dan tidak ditulis ke URL atau localStorage.

## 4. Coba dengan satu hasil foto

1. Buka halaman photobooth dan isi kode di **Album Kenangan Kita → Buka album**.
2. Ambil foto, pilih bingkai yang kamu suka, lalu klik **Simpan ke kenangan**.
3. Tunggu pesan **Foto kenangan sudah tersimpan di Google Drive**.
4. Periksa file PNG di folder Drive milikmu.
5. Refresh website, buka album lagi, lalu coba **Buka foto** dan **Unduh fotonya**.

Foto di perangkat lain dapat dilihat setelah album dibuka dengan kode yang sama.
Galeri menampilkan 12 foto per halaman. Foto baru kadang belum memiliki thumbnail
dari Drive; tombol **Buka foto** tetap bisa mengambil PNG aslinya.

## Jika internet terputus

Tombol simpan lebih dahulu menyimpan PNG ke IndexedDB pada browser. Selama belum
dikonfirmasi Drive, statusnya adalah **salinan di perangkat ini**. Buka album lagi
atau gunakan **Kirim foto yang tertunda** untuk mencoba ulang. ID foto yang tetap
mencegah unggahan ganda saat permintaan sebelumnya sebenarnya sudah berhasil.

Setelah Drive mengonfirmasi, PNG besar tidak lagi disimpan di database browser.
Jangan menghapus data browser jika masih ada foto tertunda yang belum dikirim.
Tombol **Unduh PNG** tetap tersedia untuk menyimpan salinan manual ke perangkat.

## Mengubah kode dan memperbarui penghubung

Untuk mengganti kode, isi kembali `ALBUM_ACCESS_CODE` di Script Properties dan
jalankan `setupAlbum` lagi. Pengunjung akan diminta membuka album dengan kode baru.
Setelah mengubah `Code.gs`, perbarui deployment ke versi baru melalui
**Deploy → Manage deployments → Edit → New version** agar URL `/exec` tetap sama.

Jika membuka album gagal, pastikan URL adalah deployment `/exec`, akses deployment
adalah **Anyone**, eksekusi sebagai **Me**, folder masih tersedia, dan `setupAlbum`
sudah selesai. Pada koneksi lambat permintaan dibatasi 45 detik dan bisa dicoba lagi.

Pengujian otomatis menggunakan Drive tiruan dan IndexedDB tiruan; pengujian akun
Drive asli baru dapat dilakukan setelah deployment milikmu tersedia.
