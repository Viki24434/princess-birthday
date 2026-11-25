# Mengganti tulisan dan foto

Konten personal disimpan di `public/data`. Edit JSON memakai VS Code, simpan dengan
encoding UTF-8, lalu cek hasilnya melalui `npm run dev`.

## File yang diedit

| File | Bagian yang bisa diganti |
| --- | --- |
| `birthday.json` | Nama, judul browser dan header, pesan kado, kue, pengantar kenangan, photobooth, dan penutup |
| `memories.json` | Foto, judul, tanggal, dan cerita pada kartu kenangan |
| `letter.json` | Isi surat, judul halaman surat, serta tulisan pada amplop dan tombol surat |
| `game.json` | Pengantar game, pesan menang, area rahasia, serta foto dan caption di sepanjang game |

## Nama cukup diganti sekali

Di `birthday.json`, ubah `recipient.name`, `recipient.nickname`, dan `sender.name`.
Teks dapat memakai placeholder berikut di keempat file JSON:

- `{name}`: nama penerima.
- `{nickname}`: nama panggilan penerima.
- `{sender}`: nama pengirim.
- `{hearts}`: jumlah hati yang dibutuhkan game, khusus teks di `game.json`.

Contoh: `"title": "Selamat ulang tahun, {nickname}! ♡"`.
Placeholder bersifat opsional; boleh langsung menulis teks sendiri.

## Pesan pada halaman

Bagian di `birthday.json` disusun menurut halaman:

- `website`: judul tab browser, nama website, tagline, label header, dan catatan footer.
  `subtitle` menjadi pengantar halaman sebelum kado dibuka.
- `welcome.closed` dan `welcome.opened`: pesan sebelum dan sesudah kado dibuka.
  Pesan paragraf sebelum kado dibuka ada di `website.welcomeMessage`.
- `cake.before` dan `cake.after`: pesan sebelum dan sesudah lilin ditiup.
  `cake.candles` mengatur jumlah lilin, antara 1 sampai 8.
- `memories`: judul dan pengantar halaman kenangan.
- `photoBooth`: judul, pesan kamera, dan pengaturan awal foto.
  `captureCount` menerima 1, 3, atau 4; `countdown` menerima 3 atau 5.
  `defaultFrame` memakai salah satu ID di `photoBooth.frames`.
- `photoBooth.frames`: label pilihan bingkai, judul, dan subjudul pada hasil PNG 1 atau 4 foto.
- `photoBooth.print`: tulisan footer hasil PNG serta teks layout khusus 3 foto.
- `final`: judul, paragraf penutup, dan label tombol terakhir.
  Paragraf pengantar penutup tetap di `website.closingMessage`.

`letter.json` memiliki `scene` untuk halaman/amplop dan `paragraphs` untuk isi surat.
Tambah atau kurangi item pada array `paragraphs` untuk mengubah jumlah paragraf.

Jangan mengganti nama properti seperti `title`, `paragraphs`, atau ID bingkai seperti
`princess`. Ganti nilainya. Jika ingin mengosongkan teks, gunakan `""`; jika ingin
mengosongkan daftar paragraf, gunakan `[]`.

## Mengganti foto

### Foto di folder project

Simpan foto, misalnya di `public/images/memories/foto-kita.jpg`, lalu isi:

```json
"image": "images/memories/foto-kita.jpg"
```

Path dimulai dari dalam `public`, tanpa menuliskan `public/`. Samakan huruf besar
dan kecil nama file agar foto terbaca di GitHub Pages.

### Foto dari internet

Properti `image` juga menerima URL gambar langsung:

```json
"image": "https://example.com/foto-kita.jpg"
```

Gunakan HTTPS dan alamat yang benar-benar membuka gambar. Link halaman Google Drive,
halaman album, atau halaman pencarian gambar bukan link gambar langsung. Gambar
harus bisa dibuka pengunjung tanpa login, dan hostingnya harus mengizinkan pemuatan
dari website lain. Menyimpan foto di folder project lebih mudah diandalkan.

Cara ini berlaku untuk `memories.json`, `game.json → memories`, dan gambar hadiah
pada `game.json → secret.image`.

## Foto dan pesan game

`game.json → memories` berisi 8 slot, berurutan dari awal hingga akhir perjalanan.
Ganti `image` dan `text` pada slot yang diinginkan. Slot yang tidak diisi tidak
ditampilkan; posisi dan jumlah maksimum slot tetap mengikuti level game.

Pesan rahasia berada di `secret.title` dan `secret.message`. Pesan pembuka dan
kemenangan berada di `intro` dan `win`.

Teks kontrol teknis, pesan kesalahan, pesan gagal/checkpoint, desain, fisika game,
sprite karakter, dan dekorasi bingkai tetap berada di kode. Album Drive dikelola
terpisah melalui `.env.local` / repository variable dan Google Apps Script.
Bagian `theme` dan tanggal lahir pada `birthday.json` masih berupa metadata; warna
dan tampilan diatur melalui CSS.

## Melihat perubahan dan memperbarui website online

Jalankan `npm run dev` dan refresh halaman setelah mengubah JSON. Untuk memeriksa
build produksi, jalankan `npm run build`.

Website online baru berubah setelah perubahan di-commit dan di-push ke `main`, lalu
workflow deployment berhasil. Semua file dalam `public/data` dapat dibaca pengunjung;
simpan kode akses album dan rahasia lain di pengaturan backend.
