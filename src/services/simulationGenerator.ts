import type {
  HttpRequest,
  HttpResponse,
  Order,
  SimulationStep,
  TimelineEvent,
} from '../types';
import { INITIAL_MENU } from '../data/mockData';

export interface GeneratedSimulation {
  steps: SimulationStep[];
  request: HttpRequest;
  response: HttpResponse;
  databaseMutation?: (orders: Order[]) => Order[];
  timeline: TimelineEvent[];
}

export function generateGetMenuSimulation(): GeneratedSimulation {
  const request: HttpRequest = {
    method: 'GET',
    endpoint: '/menu',
    headers: {
      Accept: 'application/json',
      'User-Agent': 'RESTaurant-Client/1.0',
    },
  };

  const response: HttpResponse = {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Response-Time': '18ms',
    },
    body: {
      success: true,
      count: INITIAL_MENU.length,
      data: INITIAL_MENU,
    },
    durationMs: 42,
  };

  const steps: SimulationStep[] = [
    {
      nodeId: 'CLIENT',
      title: 'Pelanggan Membuka Aplikasi',
      description: 'Frontend mempersiapkan permintaan untuk mengambil katalog makanan yang tersedia.',
      analogy: 'Pelanggan duduk di meja dan meminta buku menu kepada pelayan.',
      technicalTerm: 'Client HTTP Request Initiation (Idempotent & Safe)',
      payloadSnapshot: null,
    },
    {
      nodeId: 'API',
      title: 'Pelayan Meneruskan Request GET',
      description: 'API Route mengarahkan request GET /menu menuju controller yang sesuai tanpa body payload.',
      analogy: 'Pelayan mengingat permintaan menu dan berjalan menuju meja kasir / rak buku menu.',
      technicalTerm: 'HTTP GET Method / Routing',
      payloadSnapshot: { method: 'GET', endpoint: '/menu' },
    },
    {
      nodeId: 'BACKEND',
      title: 'Backend Menjalankan MenuController',
      description: 'Server memeriksa cache menu atau menyusun query untuk mengambil data menu aktif.',
      analogy: 'Kasir mengecek daftar makanan apa saja yang masih siap dijual hari ini.',
      technicalTerm: 'Controller Handler & Business Logic',
      checklists: ['✓ Request method GET valid', '✓ Tanpa autentikasi (Public endpoint)', '✓ Siapkan query menu aktif'],
    },
    {
      nodeId: 'DATABASE',
      title: 'Database Membaca Tabel Menu',
      description: 'Menjalankan query SELECT * FROM menus WHERE available = true.',
      analogy: 'Membuka lembaran buku menu resmi restoran.',
      technicalTerm: 'Database Read Operation (No Data Mutation)',
      payloadSnapshot: { query: 'SELECT id, name, price, category FROM menus' },
    },
    {
      nodeId: 'RESPONSE',
      title: 'Response 200 OK Diterima Client',
      description: 'Frontend menerima status 200 OK bersama JSON berisi 4 item menu lalu menampilkannya di UI.',
      analogy: 'Pelayan menyodorkan buku menu yang rapi ke tangan pelanggan.',
      technicalTerm: 'HTTP 200 OK Response & Client DOM Render',
      payloadSnapshot: response.body,
    },
  ];

  return {
    steps,
    request,
    response,
    timeline: [
      { timestamp: '00:00.010', node: 'CLIENT', description: 'Memulai request GET /menu', status: 'info' },
      { timestamp: '00:00.022', node: 'API', description: 'Request diterima gateway', status: 'info' },
      { timestamp: '00:00.030', node: 'BACKEND', description: 'MenuController merespons', status: 'info' },
      { timestamp: '00:00.038', node: 'DATABASE', description: 'Mengambil 4 item menu dari storage', status: 'info' },
      { timestamp: '00:00.042', node: 'RESPONSE', description: 'HTTP 200 OK terkirim kembali ke browser', status: 'success' },
    ],
  };
}

export function generatePostOrderSimulation(orderData: {
  customer: string;
  items: { name: string; quantity: number; price: number }[];
  note?: string;
}): GeneratedSimulation {
  const total = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const newId = Math.floor(100 + Math.random() * 900);

  const request: HttpRequest = {
    method: 'POST',
    endpoint: '/orders',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: {
      customer: orderData.customer,
      items: orderData.items.map(i => ({ name: i.name, quantity: i.quantity })),
      note: orderData.note || 'Tidak ada catatan',
    },
  };

  const newOrder: Order = {
    id: newId,
    customer: orderData.customer,
    items: orderData.items,
    total,
    status: 'pending',
    note: orderData.note || '-',
    createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
  };

  const response: HttpResponse = {
    status: 201,
    statusText: 'Created',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Location: `/orders/${newId}`,
      'X-Resource-ID': String(newId),
    },
    body: {
      success: true,
      message: 'Pesanan berhasil dibuat!',
      data: newOrder,
    },
    durationMs: 78,
  };

  const steps: SimulationStep[] = [
    {
      nodeId: 'CLIENT',
      title: 'Pelanggan Menekan "Pesan Sekarang"',
      description: `Client memvalidasi form lokal dan merangkum pesanan atas nama "${orderData.customer}".`,
      analogy: 'Pelanggan menulis daftar pesanan di kertas dan melambaikan tangan ke pelayan.',
      technicalTerm: 'Form Serialization & Client Payload Preparation',
      payloadSnapshot: request.body,
    },
    {
      nodeId: 'API',
      title: 'API Gateway Menerima Payload POST',
      description: 'API memverifikasi format JSON dan meneruskan request POST /orders ke Backend.',
      analogy: 'Pelayan mengambil kertas pesanan, memastikan tulisan terbaca, lalu mengantarkannya ke dapur.',
      technicalTerm: 'HTTP POST Request / Payload Transmission',
      payloadSnapshot: { method: 'POST', endpoint: '/orders', body: request.body },
    },
    {
      nodeId: 'BACKEND',
      title: 'Dapur Server Memvalidasi Data & Kalkulasi',
      description: 'Server menjalankan validasi skema, menghitung harga total di sisi backend, dan menyiapkan ID unik.',
      analogy: 'Koki memeriksa ketersediaan bahan, menghitung total harga tagihan, dan memberi nomor tiket antrean.',
      technicalTerm: 'Server-Side Validation & Business Logic Pipeline',
      checklists: [
        '✓ Request POST /orders diterima',
        '✓ Content-Type: application/json valid',
        `✓ Nama pelanggan valid: "${orderData.customer}"`,
        `✓ ${orderData.items.length} jenis item terverifikasi`,
        `✓ Total dihitung server: Rp ${total.toLocaleString('id-ID')}`,
        `✓ Resource ID #${newId} digenerate`,
      ],
    },
    {
      nodeId: 'DATABASE',
      title: 'Menyimpan Order ke Virtual Database',
      description: `INSERT INTO orders (id, customer, total, status) VALUES (${newId}, '${orderData.customer}', ${total}, 'pending').`,
      analogy: 'Koki menuliskan tiket pesanan baru ke buku besar pesanan dapur.',
      technicalTerm: 'Database Mutation / Persistence (INSERT Record)',
      payloadSnapshot: newOrder,
    },
    {
      nodeId: 'RESPONSE',
      title: 'Response 201 Created Kembali ke Client',
      description: `Server merespons dengan HTTP Status 201 Created dan menyertakan objek order lengkap dengan ID #${newId}.`,
      analogy: 'Pelayan kembali ke meja membawa tanda nomor meja dan struk tanda pesanan sedang dimasak.',
      technicalTerm: 'HTTP 201 Created Response & State Synchronization',
      payloadSnapshot: response.body,
    },
  ];

  return {
    steps,
    request,
    response,
    databaseMutation: (currentOrders) => [newOrder, ...currentOrders],
    timeline: [
      { timestamp: '00:00.012', node: 'CLIENT', description: `Form disubmit oleh ${orderData.customer}`, status: 'info' },
      { timestamp: '00:00.028', node: 'API', description: 'POST payload diteruskan ke backend', status: 'info' },
      { timestamp: '00:00.045', node: 'BACKEND', description: `Validasi sukses, total Rp ${total.toLocaleString('id-ID')}`, status: 'success' },
      { timestamp: '00:00.065', node: 'DATABASE', description: `Order #${newId} disimpan ke tabel orders`, status: 'success' },
      { timestamp: '00:00.078', node: 'RESPONSE', description: 'HTTP 201 Created diterima client', status: 'success' },
    ],
  };
}

export function generateGetOrderSimulation(orderId: number, existingOrder?: Order): GeneratedSimulation {
  const request: HttpRequest = {
    method: 'GET',
    endpoint: `/orders/${orderId}`,
    headers: {
      Accept: 'application/json',
    },
  };

  if (!existingOrder) {
    const response: HttpResponse = {
      status: 404,
      statusText: 'Not Found',
      headers: { 'Content-Type': 'application/json' },
      body: {
        success: false,
        error: 'Order Not Found',
        message: `Pesanan dengan ID #${orderId} tidak ditemukan di sistem.`,
      },
      durationMs: 35,
    };

    const steps: SimulationStep[] = [
      {
        nodeId: 'CLIENT',
        title: `Mencari Pesanan ID #${orderId}`,
        description: `Client mengirim request untuk memeriksa status pesanan #${orderId}.`,
        analogy: `Pelanggan bertanya: "Halo pelayan, pesanan meja nomor #${orderId} bagaimana ya?"`,
        technicalTerm: 'HTTP GET with Resource Identifier Path Parameter',
      },
      {
        nodeId: 'API',
        title: 'Meneruskan GET /orders/:id',
        description: 'Meneruskan request ke router pemesanan.',
        analogy: 'Pelayan mencatat nomor ID dan menanyakannya ke dapur.',
        technicalTerm: 'Route Parameter Extraction (:id)',
      },
      {
        nodeId: 'BACKEND',
        title: 'Query Pencarian ke Database',
        description: 'Server memproses parameter ID dan meminta data ke database.',
        analogy: 'Koki membuka buku besar pesanan mencari nomor yang dimaksud.',
        technicalTerm: 'Query Handler Execution',
        checklists: [`✓ Cari ID: ${orderId}`, '✗ Record tidak ada dalam sistem'],
        isError: true,
      },
      {
        nodeId: 'DATABASE',
        title: 'Database: 0 Records Found',
        description: `SELECT * FROM orders WHERE id = ${orderId} menghasilkan 0 baris.`,
        analogy: 'Koki tidak menemukan catatan nomor pesanan tersebut di buku order dapur.',
        technicalTerm: 'Database Empty Result / Null Entity',
        isError: true,
      },
      {
        nodeId: 'RESPONSE',
        title: 'Response 404 Not Found',
        description: 'Server mengembalikan kode status 404 Not Found karena resource tidak eksis.',
        analogy: 'Pelayan kembali ke meja dan mengabarkan bahwa nomor pesanan tersebut tidak terdaftar.',
        technicalTerm: 'HTTP 404 Client Error',
        payloadSnapshot: response.body,
        isError: true,
      },
    ];

    return {
      steps,
      request,
      response,
      timeline: [
        { timestamp: '00:00.010', node: 'CLIENT', description: `Cek order #${orderId}`, status: 'info' },
        { timestamp: '00:00.020', node: 'API', description: 'Meneruskan GET /orders/:id', status: 'info' },
        { timestamp: '00:00.028', node: 'BACKEND', description: 'Query pencarian ID', status: 'warning' },
        { timestamp: '00:00.032', node: 'DATABASE', description: 'Record tidak ditemukan (0 rows)', status: 'error' },
        { timestamp: '00:00.035', node: 'RESPONSE', description: 'HTTP 404 Not Found', status: 'error' },
      ],
    };
  }

  const response: HttpResponse = {
    status: 200,
    statusText: 'OK',
    headers: { 'Content-Type': 'application/json' },
    body: {
      success: true,
      data: existingOrder,
    },
    durationMs: 38,
  };

  const steps: SimulationStep[] = [
    {
      nodeId: 'CLIENT',
      title: `Client Meminta Detail Order #${orderId}`,
      description: `Mengirim request GET /orders/${orderId}.`,
      analogy: `Pelanggan bertanya ke pelayan perihal perkembangan pesanan nomor #${orderId}.`,
      technicalTerm: 'HTTP GET Specific Resource',
    },
    {
      nodeId: 'API',
      title: 'Meneruskan Route /orders/:id',
      description: 'API menerjemahkan parameter ID ke backend.',
      analogy: 'Pelayan menuju dapur membawa nomor pesanan.',
      technicalTerm: 'URL Path Parameter Resolution',
    },
    {
      nodeId: 'BACKEND',
      title: 'Backend Menemukan Order',
      description: 'Backend memvalidasi hak akses dan mengambil detail pesanan.',
      analogy: 'Koki membaca status pesanan di papan antrean: sedang dimasak.',
      technicalTerm: 'Entity Retrieval & Authorization Check',
      checklists: [`✓ ID #${orderId} valid`, `✓ Customer: ${existingOrder.customer}`, `✓ Status: ${existingOrder.status}`],
    },
    {
      nodeId: 'DATABASE',
      title: 'Database Mengembalikan Record',
      description: `Record order #${orderId} berhasil di-fetch dari memory.`,
      analogy: 'Data di buku catatan pesanan berhasil terbaca.',
      technicalTerm: 'Single Row Fetch (Read)',
      payloadSnapshot: existingOrder,
    },
    {
      nodeId: 'RESPONSE',
      title: 'Response 200 OK',
      description: `Client menerima data lengkap pesanan #${orderId}.`,
      analogy: 'Pelayan kembali menginformasikan: "Pesanan Mas Budi sedang dimasak ya!"',
      technicalTerm: 'HTTP 200 OK Delivery',
      payloadSnapshot: response.body,
    },
  ];

  return {
    steps,
    request,
    response,
    timeline: [
      { timestamp: '00:00.010', node: 'CLIENT', description: `Request detail #${orderId}`, status: 'info' },
      { timestamp: '00:00.022', node: 'API', description: 'Route GET /orders/:id diteruskan', status: 'info' },
      { timestamp: '00:00.030', node: 'BACKEND', description: 'Pesanan ditemukan di memori', status: 'success' },
      { timestamp: '00:00.035', node: 'DATABASE', description: 'Data order diekstrak', status: 'info' },
      { timestamp: '00:00.038', node: 'RESPONSE', description: 'HTTP 200 OK terkirim', status: 'success' },
    ],
  };
}

export function generatePatchOrderSimulation(
  orderId: number,
  patchData: { note?: string; status?: Order['status'] },
  existingOrder?: Order
): GeneratedSimulation {
  const request: HttpRequest = {
    method: 'PATCH',
    endpoint: `/orders/${orderId}`,
    headers: {
      'Content-Type': 'application/json',
    },
    body: patchData,
  };

  if (!existingOrder) {
    return generateGetOrderSimulation(orderId, undefined);
  }

  const updatedOrder: Order = {
    ...existingOrder,
    ...patchData,
  };

  const response: HttpResponse = {
    status: 200,
    statusText: 'OK',
    headers: { 'Content-Type': 'application/json' },
    body: {
      success: true,
      message: 'Sebagian informasi pesanan berhasil diperbarui (PATCH)',
      data: updatedOrder,
    },
    durationMs: 46,
  };

  const steps: SimulationStep[] = [
    {
      nodeId: 'CLIENT',
      title: 'Pelanggan Memperbarui Catatan (PATCH)',
      description: `Client hanya mengirimkan field yang ingin diubah: ${JSON.stringify(patchData)}.`,
      analogy: 'Pelanggan memanggil pelayan: "Tolong tambahkan catatan jangan terlalu pedas ya".',
      technicalTerm: 'HTTP PATCH (Partial Modification of a Resource)',
      payloadSnapshot: patchData,
    },
    {
      nodeId: 'API',
      title: 'API Menerima Request PATCH',
      description: `PATCH /orders/${orderId} dikirim dengan JSON payload partial.`,
      analogy: 'Pelayan membawa pesan revisi catatan ke dapur.',
      technicalTerm: 'Partial Update Contract',
    },
    {
      nodeId: 'BACKEND',
      title: 'Backend Menggabungkan (Merge) Perubahan',
      description: 'Backend mempertahankan field lama (customer, items, total) dan hanya menimpa field yang dikirim.',
      analogy: 'Koki mengambil kertas pesanan lama, lalu menuliskan catatan tambahan tanpa membuang kertas aslinya.',
      technicalTerm: 'Partial Object Merging & Sanitization',
      checklists: [
        `✓ Order #${orderId} ditemukan`,
        '✓ Field yang dikirim diizinkan untuk diubah',
        '✓ Field lain (items, total) tetap utuh',
      ],
    },
    {
      nodeId: 'DATABASE',
      title: 'Database: UPDATE orders SET ...',
      description: `UPDATE orders SET note = '${patchData.note || ''}' WHERE id = ${orderId}.`,
      analogy: 'Memperbarui baris catatan pada buku pesanan.',
      technicalTerm: 'Database Partial Column Update',
      payloadSnapshot: updatedOrder,
    },
    {
      nodeId: 'RESPONSE',
      title: 'Response 200 OK dengan Data Terupdate',
      description: 'Server merespons dengan data order terbaru yang sudah dimerge.',
      analogy: 'Pelayan mengonfirmasi: "Catatannya sudah ditambahkan ke koki ya kak!"',
      technicalTerm: 'HTTP 200 OK with Updated Representation',
      payloadSnapshot: response.body,
    },
  ];

  return {
    steps,
    request,
    response,
    databaseMutation: (orders) => orders.map((o) => (o.id === orderId ? updatedOrder : o)),
    timeline: [
      { timestamp: '00:00.012', node: 'CLIENT', description: `Kirim PATCH order #${orderId}`, status: 'info' },
      { timestamp: '00:00.024', node: 'API', description: 'Menerima partial update', status: 'info' },
      { timestamp: '00:00.035', node: 'BACKEND', description: 'Merge field catatan sukses', status: 'success' },
      { timestamp: '00:00.042', node: 'DATABASE', description: 'Kolom note diperbarui di DB', status: 'success' },
      { timestamp: '00:00.046', node: 'RESPONSE', description: 'HTTP 200 OK terkirim', status: 'success' },
    ],
  };
}

export function generatePutOrderSimulation(
  orderId: number,
  replacementData: { customer: string; items: { name: string; quantity: number; price: number }[]; note?: string },
  existingOrder?: Order
): GeneratedSimulation {
  const total = replacementData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updatedOrder: Order = {
    id: orderId,
    customer: replacementData.customer,
    items: replacementData.items,
    total,
    status: 'pending',
    note: replacementData.note || '-',
    createdAt: existingOrder?.createdAt || 'Baru Saja',
  };

  const request: HttpRequest = {
    method: 'PUT',
    endpoint: `/orders/${orderId}`,
    headers: { 'Content-Type': 'application/json' },
    body: {
      customer: replacementData.customer,
      items: replacementData.items,
      note: replacementData.note,
    },
  };

  const response: HttpResponse = {
    status: 200,
    statusText: 'OK',
    headers: { 'Content-Type': 'application/json' },
    body: {
      success: true,
      message: 'Seluruh resource order berhasil diganti (PUT)',
      data: updatedOrder,
    },
    durationMs: 50,
  };

  const steps: SimulationStep[] = [
    {
      nodeId: 'CLIENT',
      title: 'Pelanggan Mengganti Total Pesanan (PUT)',
      description: 'Client mengirim seluruh representasi pesanan baru untuk menimpa resource lama.',
      analogy: 'Pelanggan membatalkan seluruh menu lama dan mengganti dengan paket menu baru secara utuh.',
      technicalTerm: 'HTTP PUT (Full Replacement of a Resource)',
      payloadSnapshot: request.body,
    },
    {
      nodeId: 'API',
      title: 'API Menerima Request PUT /orders/:id',
      description: 'Meneruskan representasi utuh ke backend.',
      analogy: 'Pelayan membawa kertas bon baru untuk menggantikan kertas bon lama di dapur.',
      technicalTerm: 'Full Entity Replacement Protocol',
    },
    {
      nodeId: 'BACKEND',
      title: 'Backend Memvalidasi Seluruh Field Pengganti',
      description: 'Berbeda dengan PATCH, PUT mewajibkan semua field utama dikirim ulang karena data lama ditimpa total.',
      analogy: 'Koki merobek kertas bon lama dan menuliskan ulang data dari nol.',
      technicalTerm: 'Complete Schema Validation & Resource Overwrite',
      checklists: [
        `✓ Order #${orderId} ditemukan`,
        '✓ Semua field wajib tersedia lengkap',
        `✓ Hitung ulang total: Rp ${total.toLocaleString('id-ID')}`,
      ],
    },
    {
      nodeId: 'DATABASE',
      title: 'Database: Overwrite Record',
      description: `UPDATE orders SET customer='...', items='...', total=${total} WHERE id=${orderId}.`,
      analogy: 'Menghapus catatan lama di buku order dan menggantinya dengan tulisan baru.',
      technicalTerm: 'Database Full Row Replacement',
      payloadSnapshot: updatedOrder,
    },
    {
      nodeId: 'RESPONSE',
      title: 'Response 200 OK dengan Resource Baru',
      description: 'Server merespons dengan representasi utuh yang telah diganti.',
      analogy: 'Pelayan menyerahkan struk baru kepada pelanggan.',
      technicalTerm: 'HTTP 200 OK Replacement Complete',
      payloadSnapshot: response.body,
    },
  ];

  return {
    steps,
    request,
    response,
    databaseMutation: (orders) => orders.map((o) => (o.id === orderId ? updatedOrder : o)),
    timeline: [
      { timestamp: '00:00.010', node: 'CLIENT', description: `Kirim PUT order #${orderId}`, status: 'info' },
      { timestamp: '00:00.022', node: 'API', description: 'Request PUT diterima gateway', status: 'info' },
      { timestamp: '00:00.034', node: 'BACKEND', description: 'Validasi skema utuh berhasil', status: 'success' },
      { timestamp: '00:00.044', node: 'DATABASE', description: 'Record diganti total di DB', status: 'success' },
      { timestamp: '00:00.050', node: 'RESPONSE', description: 'HTTP 200 OK terkirim', status: 'success' },
    ],
  };
}

export function generateDeleteOrderSimulation(orderId: number, existingOrder?: Order): GeneratedSimulation {
  const request: HttpRequest = {
    method: 'DELETE',
    endpoint: `/orders/${orderId}`,
    headers: {
      Authorization: 'Bearer student_token_2026',
    },
  };

  if (!existingOrder) {
    return generateGetOrderSimulation(orderId, undefined);
  }

  const response: HttpResponse = {
    status: 204,
    statusText: 'No Content',
    headers: {
      'X-Deleted-Resource': String(orderId),
    },
    body: null, // 204 MUST not have body
    durationMs: 40,
  };

  const steps: SimulationStep[] = [
    {
      nodeId: 'CLIENT',
      title: `Pelanggan Membatalkan Order #${orderId}`,
      description: `Client mengirim request DELETE /orders/${orderId}.`,
      analogy: 'Pelanggan memanggil pelayan: "Tolong batalkan pesanan saya ya kak, saya harus pergi mendadak."',
      technicalTerm: 'HTTP DELETE Method Request',
    },
    {
      nodeId: 'API',
      title: 'API Gateway Meneruskan DELETE',
      description: 'API memeriksa otorisasi pemanggil dan meneruskan perintah hapus ke Backend.',
      analogy: 'Pelayan berlari ke dapur mengabarkan pembatalan.',
      technicalTerm: 'Authorized DELETE Route Processing',
    },
    {
      nodeId: 'BACKEND',
      title: 'Backend Memvalidasi Syarat Hapus',
      description: 'Server mengecek apakah pesanan berstatus boleh dibatalkan (misal: belum disajikan).',
      analogy: 'Koki memeriksa kuali: makanan belum dimasak, sehingga pembatalan disetujui.',
      technicalTerm: 'Business Rule Authorization & State Check',
      checklists: [
        `✓ Order #${orderId} ditemukan`,
        `✓ Status '${existingOrder.status}' diizinkan untuk dibatalkan`,
        '✓ Menghapus dari persistent storage',
      ],
    },
    {
      nodeId: 'DATABASE',
      title: 'Database: DELETE FROM orders',
      description: `DELETE FROM orders WHERE id = ${orderId}. Record dihapus dari storage.`,
      analogy: 'Koki mencoret baris pesanan tersebut dari buku order dapur dengan spidol merah.',
      technicalTerm: 'Database Row Deletion',
    },
    {
      nodeId: 'RESPONSE',
      title: 'Response 204 No Content',
      description: 'Server merespons status 204 No Content (Sukses dieksekusi tanpa body data kembali).',
      analogy: 'Pelayan kembali mengangguk ramah tanda pesanan sudah resmi dibatalkan tanpa memberikan struk lagi.',
      technicalTerm: 'HTTP 204 No Content (Standard for Successful DELETE)',
      payloadSnapshot: '(No Content - Empty Response Body)',
    },
  ];

  return {
    steps,
    request,
    response,
    databaseMutation: (orders) => orders.filter((o) => o.id !== orderId),
    timeline: [
      { timestamp: '00:00.011', node: 'CLIENT', description: `Request DELETE order #${orderId}`, status: 'info' },
      { timestamp: '00:00.020', node: 'API', description: 'Gateway memvalidasi token', status: 'info' },
      { timestamp: '00:00.030', node: 'BACKEND', description: 'Aturan bisnis pembatalan disetujui', status: 'success' },
      { timestamp: '00:00.036', node: 'DATABASE', description: `Record #${orderId} dihapus dari storage`, status: 'warning' },
      { timestamp: '00:00.040', node: 'RESPONSE', description: 'HTTP 204 No Content dikirim', status: 'success' },
    ],
  };
}

export function generateCustomErrorSimulation(code: number): GeneratedSimulation {
  switch (code) {
    case 400: {
      const request: HttpRequest = {
        method: 'POST',
        endpoint: '/orders',
        headers: { 'Content-Type': 'application/json' },
        body: { customer: '', items: [] },
      };
      const response: HttpResponse = {
        status: 400,
        statusText: 'Bad Request',
        headers: { 'Content-Type': 'application/json' },
        body: {
          success: false,
          error: 'Bad Request',
          message: 'Validasi gagal: Nama pelanggan tidak boleh kosong dan minimal 1 item harus dipilih.',
          errors: [
            { field: 'customer', message: 'Field "customer" wajib diisi' },
            { field: 'items', message: 'Daftar pesanan tidak boleh kosong' },
          ],
        },
        durationMs: 25,
      };
      return {
        steps: [
          {
            nodeId: 'CLIENT',
            title: 'Client Mengirim Payload Tidak Lengkap',
            description: 'Klien mengirim form kosong (nama kosong, tanpa menu).',
            analogy: 'Pelanggan menyerahkan kertas kosong ke pelayan.',
            technicalTerm: 'Invalid Client Payload Submission',
            payloadSnapshot: request.body,
          },
          {
            nodeId: 'API',
            title: 'API Meneruskan Request ke Controller',
            description: 'Request lolos routing namun akan dicek oleh middleware validasi.',
            analogy: 'Pelayan membawa kertas kosong tersebut ke koki.',
            technicalTerm: 'Route Dispatching',
          },
          {
            nodeId: 'BACKEND',
            title: 'Backend Menolak: Validation Fails',
            description: 'Backend validator mendeteksi format request melanggar skema. Alur langsung dihentikan.',
            analogy: 'Koki bingung dan menolak: "Ini kertas kosong, siapa yang pesan dan mau masak apa?"',
            technicalTerm: 'Input Validation Guard & Request Abortion',
            checklists: ['✗ Nama pelanggan kosong!', '✗ Tidak ada item makanan!', '✗ Request DITOLAK (Tidak menyentuh Database)'],
            isError: true,
          },
          {
            nodeId: 'RESPONSE',
            title: 'Response 400 Bad Request',
            description: 'Server mengembalikan status 400 dengan rincian validasi error.',
            analogy: 'Pelayan mengembalikan kertas ke pelanggan: "Maaf kak, tolong diisi dulu nama dan pilih makanannya."',
            technicalTerm: 'HTTP 400 Client Error Response',
            payloadSnapshot: response.body,
            isError: true,
          },
        ],
        request,
        response,
        timeline: [
          { timestamp: '00:00.010', node: 'CLIENT', description: 'Kirim payload tidak valid', status: 'warning' },
          { timestamp: '00:00.018', node: 'API', description: 'Meneruskan ke validator', status: 'info' },
          { timestamp: '00:00.024', node: 'BACKEND', description: 'Validasi skema gagal (Validation Error)', status: 'error' },
          { timestamp: '00:00.025', node: 'RESPONSE', description: 'HTTP 400 Bad Request dikirim balik', status: 'error' },
        ],
      };
    }
    case 401: {
      const request: HttpRequest = {
        method: 'GET',
        endpoint: '/admin/orders',
        headers: { Accept: 'application/json' }, // missing Authorization
      };
      const response: HttpResponse = {
        status: 401,
        statusText: 'Unauthorized',
        headers: { 'WWW-Authenticate': 'Bearer error="invalid_token"' },
        body: {
          success: false,
          error: 'Unauthorized',
          message: 'Header "Authorization: Bearer <token>" tidak ditemukan. Anda harus login terlebih dahulu.',
        },
        durationMs: 15,
      };
      return {
        steps: [
          {
            nodeId: 'CLIENT',
            title: 'Client Mengakses Endpoint Terproteksi Tanpa Token',
            description: 'Klien mencoba mengakses /admin/orders tanpa menyertakan kredensial login.',
            analogy: 'Orang asing mencoba masuk ke ruangan manajemen restoran tanpa kartu pegawai.',
            technicalTerm: 'Unauthenticated Request (Missing Credentials)',
          },
          {
            nodeId: 'API',
            title: 'API Auth Middleware Memblokir Request',
            description: 'Middleware memeriksa header Authorization. Karena kosong, proses langsung di-reject.',
            analogy: 'Satpam di depan pintu masuk memeriksa kartu identitas: "Tidak ada tanda pengenal, dilarang masuk!"',
            technicalTerm: 'Auth Guard Middleware Interception',
            checklists: ['✗ Cek header Authorization', '✗ Token Bearer tidak ada', '✗ Akses DITOLAK seketika di level API'],
            isError: true,
          },
          {
            nodeId: 'RESPONSE',
            title: 'Response 401 Unauthorized',
            description: 'Server langsung merespons 401 Unauthorized tanpa menyentuh backend dapur maupun database.',
            analogy: 'Satpam menyuruh orang asing tersebut untuk pergi ke meja pendaftaran login dulu.',
            technicalTerm: 'HTTP 401 Authentication Failure',
            payloadSnapshot: response.body,
            isError: true,
          },
        ],
        request,
        response,
        timeline: [
          { timestamp: '00:00.008', node: 'CLIENT', description: 'Request tanpa header auth', status: 'warning' },
          { timestamp: '00:00.014', node: 'API', description: 'Auth Guard: Missing Bearer Token', status: 'error' },
          { timestamp: '00:00.015', node: 'RESPONSE', description: 'HTTP 401 Unauthorized ditolak langsung', status: 'error' },
        ],
      };
    }
    case 403: {
      const request: HttpRequest = {
        method: 'DELETE',
        endpoint: '/kitchen/recipes',
        headers: {
          Authorization: 'Bearer student_regular_token',
        },
      };
      const response: HttpResponse = {
        status: 403,
        statusText: 'Forbidden',
        headers: { 'Content-Type': 'application/json' },
        body: {
          success: false,
          error: 'Forbidden',
          message: 'Akun Anda terverifikasi sebagai ROLE_STUDENT, namun aksi ini membutuhkan ROLE_SUPERADMIN.',
        },
        durationMs: 22,
      };
      return {
        steps: [
          {
            nodeId: 'CLIENT',
            title: 'User Terautentikasi Meminta Aksi di Luar Haknya',
            description: 'User memiliki token login valid (Role: Mahasiswa), tapi mencoba mengakses fungsi Admin.',
            analogy: 'Pelanggan resmi yang sudah bayar mencoba masuk ke brankas rahasia restoran.',
            technicalTerm: 'Authenticated but Insufficient Role Permissions (RBAC)',
          },
          {
            nodeId: 'API',
            title: 'API Memvalidasi Token (Token Valid)',
            description: 'Token JWT valid dan terbaca, diteruskan ke Backend Authorizer.',
            analogy: 'Satpam melihat identitas: "Benar Anda pelanggan resmi, silakan masuk ruang makan."',
            technicalTerm: 'Token Verification Succeeded',
          },
          {
            nodeId: 'BACKEND',
            title: 'Backend Role Guard: 403 Forbidden',
            description: 'Backend memeriksa hak akses resource (ACL / RBAC). Mahasiswa dilarang mengedit resep!',
            analogy: 'Manajer restoran memergoki: "Anda pelanggan terdaftar, tapi dilarang mengotak-atik resep koki!"',
            technicalTerm: 'Role-Based Access Control Rejection',
            checklists: ['✓ Token otentik', '✗ Hak akses tidak cukup (Requires ROLE_ADMIN)', '✗ Permintaan diblokir'],
            isError: true,
          },
          {
            nodeId: 'RESPONSE',
            title: 'Response 403 Forbidden',
            description: 'Server menolak pemrosesan karena klien tidak berhak mengakses resource ini.',
            analogy: 'Pelayan menegur ramah: "Maaf kak, menu ini khusus untuk koki kepala."',
            technicalTerm: 'HTTP 403 Forbidden Rejection',
            payloadSnapshot: response.body,
            isError: true,
          },
        ],
        request,
        response,
        timeline: [
          { timestamp: '00:00.010', node: 'CLIENT', description: 'Request dengan token mahasiswa', status: 'info' },
          { timestamp: '00:00.016', node: 'API', description: 'Token terverifikasi', status: 'info' },
          { timestamp: '00:00.020', node: 'BACKEND', description: 'Role check gagal: Perlu ROLE_ADMIN', status: 'error' },
          { timestamp: '00:00.022', node: 'RESPONSE', description: 'HTTP 403 Forbidden dikembalikan', status: 'error' },
        ],
      };
    }
    case 500:
    default: {
      const request: HttpRequest = {
        method: 'POST',
        endpoint: '/orders',
        headers: { 'Content-Type': 'application/json' },
        body: { customer: 'Simulasi Crash', items: [{ name: 'Nasi Goreng', quantity: 1 }] },
      };
      const response: HttpResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        headers: { 'Content-Type': 'application/json' },
        body: {
          success: false,
          error: 'Internal Server Error',
          message: 'Unhandled Exception: Database connection timeout / Pool exhausted on port 5432.',
          stackTrace: 'Error: Connection lost at PostgresPool.connect() ... [Simulasi Bug Backend]',
        },
        durationMs: 95,
      };
      return {
        steps: [
          {
            nodeId: 'CLIENT',
            title: 'Client Mengirim Pesanan Normal',
            description: 'Permintaan dari sisi klien sudah benar dan valid.',
            analogy: 'Pelanggan memesan makanan secara sopan dan benar sesuai prosedur.',
            technicalTerm: 'Valid Client HTTP Request',
            payloadSnapshot: request.body,
          },
          {
            nodeId: 'API',
            title: 'API Mengalirkan Request ke Dapur Server',
            description: 'Gateway meneruskan paket request tanpa kendala.',
            analogy: 'Pelayan membawa pesanan ke dapur dengan lancar.',
            technicalTerm: 'Gateway Forwarding',
          },
          {
            nodeId: 'BACKEND',
            title: 'Backend Crash / Uncaught Exception!',
            description: 'Terjadi kegagalan tak terduga pada server: memori penuh, bug kode koki, atau koneksi DB putus.',
            analogy: 'Tiba-tiba kompor dapur meledak atau listrik dapur padam total!',
            technicalTerm: 'Unhandled Server Exception / Crash',
            checklists: ['✓ Validasi input lolos', '✗ Gagal terhubung ke Database cluster', '✗ Fatal Error: Process terminated unexpectedly!'],
            isError: true,
          },
          {
            nodeId: 'RESPONSE',
            title: 'Response 500 Internal Server Error',
            description: 'Global Error Handler menangkap crash dan merespons status 500 agar server tidak hang.',
            analogy: 'Pelayan panik kembali ke meja: "Maaf kak, dapur kami mendadak kebakaran/rusak, mohon maaf sekali!"',
            technicalTerm: 'HTTP 500 Internal Server Error Catch',
            payloadSnapshot: response.body,
            isError: true,
          },
        ],
        request,
        response,
        timeline: [
          { timestamp: '00:00.010', node: 'CLIENT', description: 'Kirim request normal', status: 'info' },
          { timestamp: '00:00.025', node: 'API', description: 'Request sampai ke backend', status: 'info' },
          { timestamp: '00:00.060', node: 'BACKEND', description: 'FATAL ERROR: DB Connection Dropped', status: 'error' },
          { timestamp: '00:00.095', node: 'RESPONSE', description: 'HTTP 500 Internal Server Error', status: 'error' },
        ],
      };
    }
  }
}
