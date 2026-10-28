import React from 'react';
import { Database, AlertCircle } from 'lucide-react';
import type { Order } from '../types';

interface DatabaseExplorerProps {
  orders: Order[];
  onSelectOrderForGet: (id: number) => void;
  onSelectOrderForPatch: (id: number) => void;
  onSelectOrderForDelete: (id: number) => void;
  lastMutatedId: number | null;
}

export const DatabaseExplorer: React.FC<DatabaseExplorerProps> = ({
  orders,
  onSelectOrderForGet,
  onSelectOrderForPatch,
  onSelectOrderForDelete,
  lastMutatedId,
}) => {
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'cooking':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'served':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'cancelled':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="bg-darkpanel border border-darkborder rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-darkborder/70 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Virtual Database Explorer
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {orders.length} Records
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Tabel orders di dalam memori virtual aplikasi (State React)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Virtual Storage — Reset jika browser di-refresh</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-darkborder">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-darkpanel2 text-slate-400 uppercase text-[10px] tracking-wider border-b border-darkborder">
            <tr>
              <th className="px-3 py-2.5">ID</th>
              <th className="px-3 py-2.5">Customer</th>
              <th className="px-3 py-2.5">Items Pesanan</th>
              <th className="px-3 py-2.5">Total Harga</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5">Catatan</th>
              <th className="px-3 py-2.5 text-right">Aksi REST API</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-darkborder/60 bg-darkpanel">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 font-sans text-xs">
                  Semua record pesanan telah dihapus. Buat pesanan baru lewat form di atas untuk mengisi database.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isJustChanged = lastMutatedId === order.id;
                return (
                  <tr
                    key={order.id}
                    className={`transition-colors ${
                      isJustChanged
                        ? 'bg-blue-950/40 text-blue-200'
                        : 'hover:bg-slate-850 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="px-3 py-2.5 font-bold text-blue-400">#{order.id}</td>
                    <td className="px-3 py-2.5 font-sans font-medium text-white">{order.customer}</td>
                    <td className="px-3 py-2.5 text-slate-300">
                      {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                    </td>
                    <td className="px-3 py-2.5 text-emerald-400 font-bold">
                      Rp {order.total.toLocaleString('id-ID')}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-400 font-sans text-[11px] truncate max-w-[140px]" title={order.note}>
                      {order.note || '-'}
                    </td>
                    <td className="px-3 py-2.5 text-right space-x-1">
                      <button
                        onClick={() => onSelectOrderForGet(order.id)}
                        className="px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] font-medium transition"
                        title="Jalankan GET /orders/:id"
                      >
                        GET
                      </button>
                      <button
                        onClick={() => onSelectOrderForPatch(order.id)}
                        className="px-2 py-1 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 text-[10px] font-medium transition"
                        title="Jalankan PATCH /orders/:id"
                      >
                        PATCH
                      </button>
                      <button
                        onClick={() => onSelectOrderForDelete(order.id)}
                        className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[10px] font-medium transition"
                        title="Jalankan DELETE /orders/:id"
                      >
                        DEL
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
