import React, { useState, useEffect } from 'react';
import {
  Clock, CheckCircle2, Flame, Maximize2, RefreshCw, AlertTriangle
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';

export const KdsView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sectorFilter, setSectorFilter] = useState<string>('todos');
  const [loading, setLoading] = useState(true);

  const loadKdsOrders = async () => {
    try {
      const allOrders = await api.getOrders();
      // Filter orders in production states (novo, confirmado, em_preparo)
      const kitchenOrders = allOrders.filter(o => ['novo', 'confirmado', 'em_preparo'].includes(o.status));
      setOrders(kitchenOrders);
    } catch (err) {
      console.error('Erro ao carregar KDS:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKdsOrders();
    const interval = setInterval(loadKdsOrders, 5000); // Auto-refresh kitchen display every 5s
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: Order['status']) => {
    try {
      await api.updateOrderStatus(orderId, nextStatus);
      loadKdsOrders();
    } catch (err) {
      console.error('Erro ao atualizar status do pedido no KDS:', err);
    }
  };

  const getElapsedTime = (createdAt: string) => {
    const minutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60));
    return minutes;
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-950 min-h-screen text-slate-100 space-y-6">
      {/* KDS Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-500 border border-rose-500/30 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Tela da Cozinha — KDS</h2>
            <p className="text-xs text-slate-400">Acompanhamento e controle de produção em tempo real</p>
          </div>
        </div>

        {/* Sector Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {['todos', 'chapa', 'pizzaria', 'bar', 'cozinha'].map((sec) => (
            <button
              key={sec}
              onClick={() => setSectorFilter(sec)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                sectorFilter === sec
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sec}
            </button>
          ))}

          <button
            onClick={loadKdsOrders}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Atualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Order Cards Grid */}
      {orders.length === 0 ? (
        <div className="text-center py-24 text-slate-500 space-y-3">
          <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500/50" />
          <h3 className="text-base font-bold text-slate-300">Cozinha sem Pedidos Pendentes!</h3>
          <p className="text-xs text-slate-500">Todos os pedidos foram preparados e entregues.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {orders.map((order) => {
            const elapsed = getElapsedTime(order.createdAt);
            const isDelayed = elapsed > 25;

            // Filter sector items if needed
            const itemsToDisplay = sectorFilter === 'todos'
              ? order.items
              : order.items.filter(it => it.sector === sectorFilter);

            if (itemsToDisplay.length === 0) return null;

            return (
              <div
                key={order.id}
                className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-xl transition-all ${
                  isDelayed
                    ? 'bg-rose-950/30 border-rose-600/80'
                    : order.status === 'em_preparo'
                    ? 'bg-slate-900 border-amber-500/80'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="p-3 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-rose-400 text-base">#{order.orderNumber}</span>
                    <span className="font-bold text-slate-300 uppercase px-2 py-0.5 rounded bg-slate-700 text-[10px]">
                      {order.type === 'mesa' ? `Mesa ${order.tableNumber}` : order.type}
                    </span>
                  </div>

                  <div className={`flex items-center gap-1 font-mono font-bold text-xs px-2 py-1 rounded-lg ${
                    isDelayed ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-700 text-slate-300'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{elapsed} min</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-72">
                  <p className="text-[11px] font-semibold text-slate-400 border-b border-slate-800 pb-1">
                    Cliente: <span className="text-slate-200 font-bold">{order.customerName}</span>
                  </p>

                  <div className="space-y-2">
                    {itemsToDisplay.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-start justify-between">
                          <span className="font-black text-slate-100 text-sm">
                            {item.quantity}x {item.productName}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {item.sector || 'cozinha'}
                          </span>
                        </div>

                        {item.additionals.length > 0 && (
                          <div className="text-[11px] text-emerald-400 font-medium pl-2 border-l border-emerald-500/40">
                            {item.additionals.map((add, aIdx) => (
                              <div key={aIdx}>+ {add.itemName}</div>
                            ))}
                          </div>
                        )}

                        {item.observation && (
                          <div className="text-[11px] font-bold text-amber-300 bg-amber-950/50 p-1.5 rounded border border-amber-800/60">
                            Obs: {item.observation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
                  {order.status !== 'em_preparo' ? (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'em_preparo')}
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      Iniciar Preparo
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'pronto')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Marcar como Pronto!
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
