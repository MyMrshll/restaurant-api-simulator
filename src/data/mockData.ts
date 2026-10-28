import type { MenuItem, Order } from '../types';

export const INITIAL_MENU: MenuItem[] = [
  { id: 'm1', name: 'Nasi Goreng', price: 18000, category: 'makanan', icon: '🍳' },
  { id: 'm2', name: 'Mie Goreng', price: 16000, category: 'makanan', icon: '🍜' },
  { id: 'm3', name: 'Ayam Bakar', price: 25000, category: 'makanan', icon: '🍗' },
  { id: 'm4', name: 'Es Teh Manis', price: 5000, category: 'minuman', icon: '🧊' },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 101,
    customer: 'Budi Santoso',
    items: [
      { name: 'Nasi Goreng', quantity: 2, price: 18000 },
      { name: 'Es Teh Manis', quantity: 2, price: 5000 },
    ],
    total: 46000,
    status: 'cooking',
    note: 'Pedas sedang, es teh jangan terlalu manis',
    createdAt: '10:15 WIB',
  },
  {
    id: 102,
    customer: 'Siti Rahma',
    items: [
      { name: 'Ayam Bakar', quantity: 1, price: 25000 },
      { name: 'Es Teh Manis', quantity: 1, price: 5000 },
    ],
    total: 30000,
    status: 'pending',
    note: 'Sambal dipisah',
    createdAt: '10:22 WIB',
  },
];

export interface MethodInfo {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  badgeColor: string;
  description: string;
  analogy: string;
  defaultPayload?: any;
}

export const HTTP_METHODS_INFO: MethodInfo[] = [
  {
    method: 'GET',
    endpoint: '/menu',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description: 'Mengambil data dari server tanpa mengubah apapun (Safe & Idempotent).',
    analogy: 'Pelanggan melihat daftar menu di atas meja kasir.',
  },
  {
    method: 'POST',
    endpoint: '/orders',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'Mengirim data baru untuk dibuatkan resource baru di server.',
    analogy: 'Pelanggan membuat pesanan baru dan menyerahkannya ke pelayan.',
    defaultPayload: {
      customer: 'Andi Pratama',
      items: [{ name: 'Nasi Goreng', quantity: 2 }],
      note: 'Tidak pedas',
    },
  },
  {
    method: 'GET',
    endpoint: '/orders/:id',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description: 'Mengambil detail spesifik satu resource berdasarkan identifier (ID).',
    analogy: 'Pelanggan bertanya ke pelayan: "Apakah pesanan nomor meja 101 sudah selesai?"',
  },
  {
    method: 'PUT',
    endpoint: '/orders/:id',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    description: 'Mengganti seluruh data resource lama dengan sekumpulan data baru secara utuh.',
    analogy: 'Pelanggan membatalkan seluruh isi pesanan dan menggantinya dengan paket menu baru.',
    defaultPayload: {
      customer: 'Budi Santoso (VIP)',
      items: [{ name: 'Ayam Bakar', quantity: 3, price: 25000 }],
      total: 75000,
      status: 'pending',
      note: 'Ganti total seluruh order',
    },
  },
  {
    method: 'PATCH',
    endpoint: '/orders/:id',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    description: 'Memperbarui sebagian field resource tanpa merombak field yang lain.',
    analogy: 'Pelanggan menambahkan catatan kecil: "Tolong sambalnya diganti yang tidak pedas ya".',
    defaultPayload: {
      note: 'Ubah catatan: Tambah kecap manis banyak',
    },
  },
  {
    method: 'DELETE',
    endpoint: '/orders/:id',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    description: 'Menghapus resource dari server sesuai ID.',
    analogy: 'Pelanggan membatalkan pesanan sebelum koki mulai memasak.',
  },
];

export interface StatusCodeItem {
  code: number;
  phrase: string;
  type: '2xx' | '4xx' | '5xx';
  meaning: string;
  analogy: string;
  triggerLabel: string;
}

export const STATUS_CODES_DATA: StatusCodeItem[] = [
  {
    code: 200,
    phrase: 'OK',
    type: '2xx',
    meaning: 'Permintaan berhasil diproses dan server mengembalikan data yang diminta.',
    analogy: 'Pelayan datang membawa buku menu atau mengabarkan info pesanan.',
    triggerLabel: 'Sukses Ambil Menu (GET 200)',
  },
  {
    code: 201,
    phrase: 'Created',
    type: '2xx',
    meaning: 'Resource baru berhasil dibuat dan disimpan di server.',
    analogy: 'Pesanan baru berhasil dicatat di buku order dapur dan tiket pesanan terbit.',
    triggerLabel: 'Order Berhasil Dibuat (POST 201)',
  },
  {
    code: 204,
    phrase: 'No Content',
    type: '2xx',
    meaning: 'Permintaan sukses tapi tidak ada data yang perlu dikirim balik di body response.',
    analogy: 'Pesanan berhasil dihapus/dibatalkan, pelayan hanya mengangguk tanda selesai.',
    triggerLabel: 'Hapus Order Sukses (DELETE 204)',
  },
  {
    code: 400,
    phrase: 'Bad Request',
    type: '4xx',
    meaning: 'Format data dari client salah, field wajib kosong, atau data tidak valid.',
    analogy: 'Pelanggan menulis orderan tanpa menulis nama pemesan atau memesan -5 porsi.',
    triggerLabel: 'Kirim Order Kosong (400)',
  },
  {
    code: 401,
    phrase: 'Unauthorized',
    type: '4xx',
    meaning: 'Klien belum login atau tidak menyertakan Authorization Token API.',
    analogy: 'Pelanggan masuk area khusus member VIP tanpa menunjukkan kartu identitas member.',
    triggerLabel: 'Tanpa Token Auth (401)',
  },
  {
    code: 403,
    phrase: 'Forbidden',
    type: '4xx',
    meaning: 'Klien sudah login tapi tidak memiliki hak akses/otorisasi ke resource tersebut.',
    analogy: 'Pelanggan biasa memaksa masuk ke dapur koki untuk mencoret buku resep rahasia.',
    triggerLabel: 'Akses Dapur Tanpa Izin (403)',
  },
  {
    code: 404,
    phrase: 'Not Found',
    type: '4xx',
    meaning: 'Resource yang dicari berdasarkan ID atau endpoint tidak ditemukan di server.',
    analogy: 'Pelanggan menanyakan status order nomor #999 yang memang tidak pernah ada.',
    triggerLabel: 'Cari Order Fiktif #999 (404)',
  },
  {
    code: 500,
    phrase: 'Internal Server Error',
    type: '5xx',
    meaning: 'Terjadi kegagalan fatal pada server/backend (crash, bug logika, database down).',
    analogy: 'Kompor di dapur meledak atau listrik padam mendadak sehingga koki tidak bisa memproses.',
    triggerLabel: 'Server Crash / DB Mati (500)',
  },
];

export const GLOSSARY: { term: string; tech: string; analogy: string }[] = [
  {
    term: 'Client / Frontend',
    tech: 'Aplikasi antarmuka (web browser, mobile app) yang digunakan user untuk meminta layanan.',
    analogy: 'Pelanggan yang duduk di meja atau layar tablet pemesanan mandiri di restoran.',
  },
  {
    term: 'API (Application Programming Interface)',
    tech: 'Kontrak, antarmuka, dan aturan protokol komunikasi antara dua sistem perangkat lunak.',
    analogy: 'Pelayan restoran yang menerima pesanan dari meja dan membawanya ke bagian dapur.',
  },
  {
    term: 'Backend / Server',
    tech: 'Layanan logika bisnis terpusat yang memproses data, autentikasi, validasi, dan keamanan.',
    analogy: 'Dapur utama tempat koki memeriksa ketersediaan bahan, memasak, dan menghitung tagihan.',
  },
  {
    term: 'Database',
    tech: 'Tempat penyimpanan data persisten yang terstruktur (SQL / NoSQL).',
    analogy: 'Buku catatan pesanan fisik atau sistem POS kasir restoran.',
  },
  {
    term: 'HTTP Response',
    tech: 'Pesan balasan dari server ke client berisi Status Code, Headers, dan Body data.',
    analogy: 'Pelayan kembali ke meja mengantarkan makanan yang sudah jadi atau struk tagihan.',
  },
  {
    term: 'Endpoint & URL',
    tech: 'Alamat spesifik pada server untuk mengakses resource tertentu (contoh: /api/orders).',
    analogy: 'Loket spesifik: loket kasir pemesanan, loket pengambilan makanan, atau loket komplain.',
  },
  {
    term: 'JSON (JavaScript Object Notation)',
    tech: 'Format standar pertukaran data berbasis teks ringan yang dipahami oleh semua bahasa pemrograman.',
    analogy: 'Kertas bon pesanan dengan format baku: nama pembeli, daftar item, dan catatan.',
  },
];
