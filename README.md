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
- **Mulai ulang:** ketika game selesai, tekan `Spasi` lagi.

## Mekanik & Audio

- Peluru yang mengenai musuh memberikan skor +10 dan memicu suara ledakan.
- Musuh yang mencapai dasar layar mengurangi nyawa pemain.
- Ketika permainan dimulai, musik latar diputar otomatis dan berhenti saat game berakhir.

## Kustomisasi

- Kecepatan peluru, musuh, dan laju spawn berada di bagian atas `script.js` dan mudah diubah.
- Aset gambar/audio lain dapat diganti dengan nama file yang sama, atau sesuaikan path pada CSS/HTML bila perlu.

Selamat bermain! Jika ingin memublikasikan ke GitHub Pages, cukup unggah semua berkas ini ke repositori dan aktifkan Pages pada branch utama.*** End Patch} to=functions.apply_patch ***!
