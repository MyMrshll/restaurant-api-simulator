import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Send, AlertTriangle } from 'lucide-react';
import type { MenuItem } from '../types';

interface OrderFormProps {
  menuItems: MenuItem[];
  onPlaceOrder: (orderData: {
    customer: string;
    items: { name: string; quantity: number; price: number }[];
    note?: string;
  }) => void;
  isSimulating: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  menuItems,
  onPlaceOrder,
  isSimulating,
}) => {
  const [customer, setCustomer] = useState('Andi Pratama');
  const [note, setNote] = useState('Pedas manis, tolong sendok plastik');
  const [quantities, setQuantities] = useState<Record<string, number>>({
    m1: 2, // Nasi Goreng 2
    m4: 1, // Es Teh 1
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
    setValidationError(null);
  };

  const selectedItems = menuItems
    .filter((item) => (quantities[item.id] || 0) > 0)
    .map((item) => ({
      name: item.name,
      quantity: quantities[item.id],
      price: item.price,
    }));

  const total = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim()) {
      setValidationError('Nama pelanggan wajib diisi!');
      return;
    }
    if (selectedItems.length === 0) {
      setValidationError('Pilih minimal 1 menu makanan/minuman!');
      return;
    }

    setValidationError(null);
    onPlaceOrder({
      customer: customer.trim(),
      items: selectedItems,
      note: note.trim(),
    });
  };

  return (
    <div className="bg-darkpanel border border-darkborder rounded-2xl p-5 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-darkborder/70 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Simulasi Pemesanan (Client)
            </h3>
            <p className="text-[11px] text-slate-400">
              Uji coba kirim HTTP POST /orders ke backend
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          POST /orders
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3.5">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
              Nama Pelanggan <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={customer}
              onChange={(e) => {
                setCustomer(e.target.value);
                setValidationError(null);
              }}
              placeholder="Contoh: Budi Santoso"
              disabled={isSimulating}
              className="w-full px-3 py-1.5 rounded-lg bg-darkpanel2 border border-darkborder text-slate-100 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          {/* Menu Selection List */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2 font-mono">
              Pilih Menu Makanan & Minuman
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {menuItems.map((item) => {
                const qty = quantities[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded-xl border transition ${
                      qty > 0
                        ? 'bg-blue-950/20 border-blue-500/40 text-slate-100'
                        : 'bg-darkpanel2/60 border-darkborder/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <div className="text-xs font-medium text-slate-200">{item.name}</div>
                        <div className="text-[11px] font-mono text-emerald-400">
                          Rp {item.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 bg-slate-800/80 rounded-lg p-1 border border-slate-700/60">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.id, -1)}
                        disabled={isSimulating || qty === 0}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-mono font-bold text-white">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.id, 1)}
                        disabled={isSimulating}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Note */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 font-mono">
              Catatan Khusus (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Jangan terlalu pedas, kuah banyak"
              disabled={isSimulating}
              className="w-full px-3 py-1.5 rounded-lg bg-darkpanel2 border border-darkborder text-slate-100 text-xs focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Footer & Submit Button */}
        <div className="pt-3 border-t border-darkborder/70 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Harga Estimasi:</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSimulating}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Pesan Sekarang (Jalankan POST Request)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
