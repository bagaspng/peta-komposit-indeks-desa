# Peta Komposit Indeks Desa (SIG Lampung)

Web GIS interaktif visualisasi Kluster LISA & Indeks Desa Provinsi Lampung berbasis **Leaflet** dan **HTMLWidgets**. Project ini telah direfaktor dari file HTML monolitik (±53 MB) menjadi static web application yang terstruktur, modular, efisien, dan siap di-deploy ke Vercel.

---

## 1. Struktur Folder

```text
SIGLampung/
├── index.html                   # Entry point aplikasi web (hanya ~1 KB)
├── vercel.json                  # Konfigurasi caching CDN & static headers Vercel
├── README.md                    # Dokumentasi teknis & panduan deployment
│
├── css/
│   └── style.css                # Kumpulan styling Leaflet, htmltools, dan UI
│
├── js/
│   ├── map.js                   # Inisialisasi peta dan loader data JSON asinkron
│   └── lib/                     # Library dependensi Leaflet & runtime
│       ├── htmlwidgets.js       # Runtime binding HTMLWidgets
│       ├── jquery.min.js        # jQuery v3.6.0
│       ├── leaflet.js           # Leaflet Map Engine v1.3.1
│       ├── proj4.js             # Proj4js (sistem koordinat/proyeksi)
│       ├── Proj4Leaflet.js      # Plugin integrasi Proj4 untuk Leaflet
│       ├── leaflet-binding.js   # Binding widget Leaflet HTMLWidgets
│       ├── leaflet-providers.js # Layer tiles Leaflet providers
│       └── leaflet-providers-plugin.js # Helper provider tiles
│
├── data/
│   └── indeks-desa.json         # Data 2.640 desa, poligon, atribut, dan legenda (SHA-256 match)
│
├── assets/                      # Folder aset statis pendukung
│
└── backup/
    └── Peta_ Komposit Indeks Desa.html  # Golden reference / file HTML asli utuh
```

---

## 2. Fungsi Setiap Folder dan File

| Folder / File | Fungsi & Keterangan |
|---|---|
| `index.html` | Entry point utama yang dimuat browser. Berukuran sangat ringan (~1 KB), memuat DOM skeleton map container dan referensi modular. |
| `css/style.css` | Menggabungkan aturan CSS `htmltools`, `leaflet`, `leafletfix`, dan `rstudio-leaflet` dengan urutan dan spesifisitas yang identik. |
| `js/map.js` | Mengambil data `indeks-desa.json` secara asinkron via `fetch()`, menginisialisasi Leaflet widget, dan merender poligon serta popup. |
| `js/lib/` | Berisi pustaka JavaScript bawaan tanpa modifikasi fungsional (Leaflet 1.3.1, HTMLWidgets, jQuery 3.6.0, Proj4). |
| `data/indeks-desa.json` | Dataset spasial lengkap (2.640 entitas desa, geometri poligon batas wilayah, atribut skor indeks desa, status kemajuan, dan kluster LISA). Karakter dan byte diekstrak 100% identik. |
| `backup/` | Menyimpan file HTML asli `Peta_ Komposit Indeks Desa.html` sebagai *golden reference*. |
| `vercel.json` | Mengatur HTTP Cache-Control header untuk static CDN caching (immutable caching untuk data spasial dan library JS/CSS). |

---

## 3. Cara Menjalankan Secara Lokal

Karena aplikasi memuat dataset spasial eksternal menggunakan `fetch("./data/indeks-desa.json")`, browser memblokir protokol `file:///` karena aturan keamanan CORS. Jalankan menggunakan web server lokal:

### Menggunakan Python (Rekomendasi):
```bash
# Python 3
python -m http.server 8000
```
Buka browser dan akses:
```
http://localhost:8000
```

### Menggunakan Node.js / npx:
```bash
npx serve .
# atau
npx http-server -p 8000
```

---

## 4. Cara Melakukan Update Data

File data `data/indeks-desa.json` menyimpan struktur objek JSON HTMLWidgets Leaflet:
```json
{
  "x": {
    "options": { ... },
    "calls": [
      { "method": "addProviderTiles", ... },
      { "method": "addPolygons", "args": [ geometries, null, null, styleOptions, popupHtmlStrings, ... ] },
      { "method": "addLegend", ... }
    ],
    "limits": { "lat": [...], "lng": [...] }
  },
  "evals": [],
  "jsHooks": []
}
```

Jika terdapat pembaruan data atau ekspor baru dari R / Leaflet:
1. Ekspor data peta baru ke format JSON dengan skema yang sama.
2. Perbarui file `data/indeks-desa.json`.
3. Tidak diperlukan perubahan kode pada `index.html`, `js/map.js`, maupun `css/style.css`.
4. Jika ID kontainer atau ID widget berubah, sesuaikan konstanta `widgetId` di `js/map.js`.

---

## 5. Cara Deploy ke Vercel

Project ini berstatus **Pure Static Site** tanpa memerlukan Node.js runtime, build step, maupun server Python.

### Metode 1: Menggunakan GitHub (Rekomendasi)
1. Inisialisasi Git dan commit repository:
   ```bash
   git init
   git add .
   git commit -m "Refactor Leaflet map static web project"
   git remote add origin https://github.com/<username>/<repo-name>.git
   git push -u origin main
   ```
2. Buka [Vercel Dashboard](https://vercel.com/dashboard) -> Klik **Add New Project**.
3. Import repository GitHub Anda.
4. Pada bagian **Framework Preset**, pilih **Other** (atau biarkan default static).
5. Pada bagian **Root Directory**, biarkan default `./`.
6. Klik **Deploy**. Vercel akan langsung mempublikasikan aplikasi sebagai static site global CDN.

### Metode 2: Menggunakan Vercel CLI
```bash
npm install -g vercel
vercel
# Untuk produksi:
vercel --prod
```

---

## 6. Dependency yang Digunakan

Seluruh dependensi dipertahankan sesuai versi asli:
* **HTMLWidgets runtime** (v1.x)
* **Leaflet.js** (v1.3.1)
* **jQuery** (v3.6.0)
* **Proj4js** (v2.x)
* **Proj4Leaflet** (v1.0.1)
* **Leaflet-providers** (v1.1.17)
* **Esri WorldGrayCanvas Basemap**
