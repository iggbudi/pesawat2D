# Fixed Shooter Mini Game

Gim penembak pesawat 2D bergaya fixed shooter yang dibuat dengan HTML, CSS, dan JavaScript. Pemain mengendalikan pesawat di bagian bawah layar, menembak musuh yang turun dari atas, dan mencoba bertahan selama mungkin.

## Persiapan

1. Pastikan semua aset berada di direktori yang sama:
   - `index.html`
   - `style.css`
   - `script.js`
   - `shoot.m4a`, `ledakan.m4a`, `backgroundsuara.m4a`
   - `pesawat.piupiu-removebg-preview.png`, `moonnster_hijau-removebg-preview.png`, `galaxybackground.jpg`
2. Tidak diperlukan instalasi tambahan; gim berjalan langsung di browser modern (Chrome, Edge, Firefox, dsb.).

## Cara Menjalankan

1. Buka file `index.html` menggunakan browser favorit Anda (klik dua kali atau lewat menu Open File).
2. Setelah halaman terbuka, klik area permainan sekali agar browser mengizinkan audio.
3. Tekan tombol `Spasi` untuk memulai permainan.

## Kontrol

- **Gerakkan pesawat:** geser kursor mouse secara horizontal; pesawat akan mengikuti posisi mouse.
- **Tembak:** tekan `Spasi`. Peluru akan menembak lurus ke atas.
- **Pause/Resume:** tekan `P` atau `ESC` untuk jeda atau melanjutkan permainan.
- **Mulai ulang:** ketika game selesai, tekan `Spasi` lagi.

## Mekanik & Audio

- Peluru yang mengenai musuh memberikan skor dan memicu suara ledakan.
- Musuh yang mencapai dasar layar mengurangi nyawa pemain.
- Ketika permainan dimulai, musik latar diputar otomatis dan berhenti saat game berakhir.
- Saat game dijeda (pause), musik latar akan berhenti sementara dan melanjutkan ketika game dilanjutkan (resume).

## Sistem Level & Difficulty Progression

Game menggunakan sistem level dinamis yang meningkatkan kesulitan secara bertahap:

- **Level naik** setiap mencapai kelipatan 100 skor (Level 2 = 100 poin, Level 3 = 200 poin, dst.)
- Setiap level meningkat:
  - Kecepatan musuh bertambah 15%
  - Interval spawn musuh lebih cepat (hingga minimum 400ms)
  - Power-up spawn lebih sering
  - Jenis musuh yang lebih sulit mulai muncul

## Variasi Musuh

Game memiliki 4 jenis musuh dengan karakteristik berbeda:

### 🟢 Basic Enemy
- **Health:** 1 hit
- **Speed:** Normal
- **Score:** 10 points
- **Spawn:** Tersedia dari Level 1

### 🔵 Fast Enemy
- **Health:** 1 hit
- **Speed:** 1.8x lebih cepat
- **Score:** 15 points
- **Visual:** Biru dengan border biru terang
- **Spawn:** Mulai Level 2 (35% chance)

### 🔴 Tank Enemy
- **Health:** 3 hits (butuh 3 tembakan)
- **Speed:** 0.6x lebih lambat
- **Score:** 30 points
- **Visual:** Merah dengan border merah, ukuran lebih besar
- **Damage Indicator:** Opacity menurun setiap terkena tembakan
- **Spawn:** Mulai Level 3 (25% chance)

### 🟡 Boss Enemy
- **Health:** 5 hits (butuh 5 tembakan)
- **Speed:** 0.4x sangat lambat
- **Score:** 50 points
- **Visual:** Emas dengan glow effect, ukuran sangat besar
- **Damage Indicator:** Opacity menurun setiap terkena tembakan
- **Spawn:** Mulai Level 5 (5% chance)

## Power-Ups

Power-up muncul secara random dan turun dari atas. Tangkap dengan pesawat Anda untuk aktivasi:

### ⚡ Rapid Fire (Merah-Kuning)
- **Durasi:** 8 detik
- **Effect:** Meningkatkan fire rate dari 300ms ke 100ms (3x lebih cepat)
- **Best for:** Melawan swarm enemy atau boss

### 🛡 Shield (Biru)
- **Durasi:** 10 detik
- **Effect:** Musuh yang mencapai bawah tidak mengurangi nyawa
- **Best for:** Saat kewalahan atau nyawa tinggal sedikit

### ⚔ Multi Shot (Hijau)
- **Durasi:** 12 detik
- **Effect:** Menembak 3 peluru sekaligus (kiri, tengah, kanan)
- **Best for:** Coverage area lebih luas, melawan multiple enemies

### ⏱ Slow Motion (Ungu)
- **Durasi:** 8 detik
- **Effect:** Memperlambat semua musuh menjadi 40% kecepatan normal
- **Best for:** Memberikan waktu lebih untuk aim dan dodge

**Tips Power-up:**
- Power-up bisa stack! Aktifkan beberapa sekaligus untuk combo effect
- Power-up yang sama di-pickup lagi akan reset timer
- Status power-up aktif ditampilkan di atas game area dengan countdown timer

## Kustomisasi

- Kecepatan peluru, musuh, dan laju spawn berada di bagian atas `script.js` dan mudah diubah.
- Aset gambar/audio lain dapat diganti dengan nama file yang sama, atau sesuaikan path pada CSS/HTML bila perlu.

Selamat bermain! Jika ingin memublikasikan ke GitHub Pages, cukup unggah semua berkas ini ke repositori dan aktifkan Pages pada branch utama.*** End Patch} to=functions.apply_patch ***!
