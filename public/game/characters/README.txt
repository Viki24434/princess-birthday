ASET KARAKTER GAME

Folder cewek/ dan cowok/ menyimpan PNG kepala transparan. Tubuh dan gerak
tangan serta kaki digambar oleh game.

SATU PNG UNTUK SETIAP EKSPRESI
- samping-normal.png
- samping-kedip.png
- samping-terkejut.png
- samping-sedih.png
- samping-malu.png
- samping-senang.png

Semua gambar samping menghadap kanan. Game memakai file yang sama untuk
menghadap kiri dengan flip horizontal, bukan rotasi. Aset lama kiri.png dan
kanan.png sudah dihapus; keduanya tidak diperlukan saat game berjalan.

Setiap file berukuran 236 x 242 piksel dan dipotong mengikuti batas kepala,
tanpa margin atlas. Ukuran dan posisi kepala konsisten antar ekspresi.

MENJAGA KARAKTER ASLI
samping-normal.png adalah potongan langsung dari kanan.png yang asli
sebelum aset lama tersebut dihapus. Sumber lama tercatat di riwayat Git.
Variasi ekspresi memakai imagegen untuk mengedit wajah satu per satu, lalu
hanya area mata, alis, pipi dan mulut yang diterapkan ke PNG asli.
Siluet, rambut, topi, hijab, telinga dan bagian di luar area ekspresi
dipertahankan dari PNG asli.

PNG wajah depan tetap digunakan ketika karakter menghadap depan, misalnya
senang.png saat perayaan di balkon. Jika PNG ekspresi samping belum dimuat,
game memakai samping-normal.png dengan flip yang sesuai.

Untuk menambah ekspresi, simpan satu PNG menghadap kanan dengan ukuran yang
sama, daftarkan di src/game/assets/sprites.js, lalu atur pemakaiannya di
src/game/rendering/characterExpressions.js. Jangan menambah ruang kosong
atau menggeser posisi kepala antargambar.

Prompt dan catatan pemrosesan ada di docs/side-character-sprites.json.
