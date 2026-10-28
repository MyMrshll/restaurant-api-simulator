# RESTaurant API Simulator 🍽️⚡

> "Pesan Makanan, Pahami Cara Kerja API."  
> Media pembelajaran interaktif untuk demonstrasi cara kerja REST API bagi mahasiswa baru HIMA TI CLUB 2026.

## 🎯 Konsep Utama (Analogi Restoran)

| Dunia Restoran | Konsep Teknis REST API |
|---|---|
| **Pelanggan** | Client / Web Browser / Mobile App |
| **Aplikasi Menu** | Frontend UI |
| **Pelayan (Perantara)** | API (Application Programming Interface) |
| **Pesanan Pelanggan** | HTTP Request (Method, Endpoint, Body) |
| **Dapur & Koki** | Backend / Server (Controller, Business Logic) |
| **Buku Catatan Order** | Database (Storage / Persistence) |
| **Jawaban & Makanan** | HTTP Response (Status Code, Data Body) |
| **Nomor Meja / Order ID** | Resource Identifier (ID) |
| **Hasil Pelayanan** | HTTP Status Code (200, 201, 400, 404, 500, dll) |

---

## ✨ Fitur Simulator

1. **Visual Pipeline Aliran Data (5 Nodes):**
   - Menampilkan visual pergerakan data dari `CLIENT` ➔ `API` ➔ `BACKEND` ➔ `DATABASE` ➔ `RESPONSE`.
   - Disertai kontrol *Play*, *Pause*, *Step* (tahap demi tahap), dan *Reset*.
2. **Interactive Ordering Form:**
   - Pilih menu: Nasi Goreng, Mie Goreng, Ayam Bakar, Es Teh Manis.
   - Input nama pemesan, kuantitas, catatan khusus.
   - Tombol *Pesan Sekarang* langsung memicu simulasi `POST /orders`.
3. **HTTP Methods Explorer:**
   - Playground eksplorasi semantik RESTful: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
4. **HTTP Status Code Visualizer:**
   - Uji coba respons nyata untuk kode status:
     - `200 OK` (Ambil Menu)
     - `201 Created` (Order Berhasil Dibuat)
     - `204 No Content` (Order Berhasil Dihapus)
     - `400 Bad Request` (Payload Tidak Lengkap)
     - `401 Unauthorized` (Akses Tanpa Token)
     - `403 Forbidden` (Akses Terbatas / Role Guard)
     - `404 Not Found` (Order Fiktif)
     - `500 Internal Server Error` (Database Crash / Uncaught Bug)
5. **JSON Request & Response Inspector:**
   - Tab *Request*, *Response*, *Headers*, dan *Network Timeline*.
   - Fitur *Copy JSON* ke clipboard.
6. **Virtual Database Explorer:**
   - Tabel orders in-memory yang reaktif terhadap mutasi data secara real-time.
7. **Mode Presentasi:**
   - Tampilan khusus proyektor dengan font ekstra besar dan narasi bertahap untuk presentasi di depan kelas.
8. **Kamus Konsep:**
   - Panduan analogi istilah teknis bagi mahasiswa pemula.

---

## 🚀 Menjalankan Secara Lokal

```bash
# Clone repository
git clone https://github.com/MyMrshll/restaurant-api-simulator.git
cd restaurant-api-simulator

# Install dependencies (Node 20+ / Node 22 LTS direkomendasikan)
npm install

# Jalankan development server
npm run dev
```

Buka URL `http://localhost:5173` di browser.

Untuk membuat production build:
```bash
npm run build
```

---

Dibuat untuk materi perkuliahan & workshop **HIMA TI CLUB 2026**.
