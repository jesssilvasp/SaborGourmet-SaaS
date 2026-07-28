import React, { useState, useEffect } from 'react';
import {
  ClipboardList, Search, Truck, Printer, CheckCircle2,
  XCircle, Clock, ChevronRight, User, AlertTriangle
} from 'lucide-react';
import { Order, Driver } from '../types';
import { api } from '../services/api';

const STAGES: { id: Order['status']; label: string; color: string }[] = [
  { id: 'novo', label: 'Novos', color: 'border-blue-500 bg-blue-50/50' },
  { id: 'confirmado', label: 'Confirmados', color: 'border-violet-500 bg-violet-50/50' },
  { id: 'em_preparo', label: 'Em Preparo', color: 'border-amber-500 bg-amber-50/50' },
  { id: 'pronto', label: 'Prontos', color: 'border-emerald-500 bg-emerald-50/50' },
  { id: 'saiu_entrega', label: 'Em Entrega', color: 'border-cyan-500 bg-cyan-50/50' },
  { id: 'concluido', label: 'Concluídos', color: 'border-slate-400 bg-slate-50' },
];

export const OrdersView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('todos');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [assignDriverOrder, setAssignDriverOrder] = useState<Order | null>(null);
  const [cancelOrderModal, setCancelOrderModal] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const [ords, drvs] = await Promise.all([
        api.getOrders(),
        api.getDrivers()
      ]);
      setOrders(ords);
      setDrivers(drvs);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    try {
      await api.updateOrderStatus(orderId, status);
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar status do pedido.');
    }
  };

  const handleAssignDriver = async (driverName: string) => {
    if (!assignDriverOrder) return;
    try {
      await api.updateOrderStatus(assignDriverOrder.id, 'saiu_entrega', { driverName });
      setAssignDriverOrder(null);
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Erro ao atribuir entregador.');
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelOrderModal || !cancelReason) return;
    try {
      await api.updateOrderStatus(cancelOrderModal.id, 'cancelado', { cancelReason });
      setCancelOrderModal(null);
      setCancelReason('');
      loadOrders();
    } catch (err: any) {
      alert(err.message || 'Erro ao cancelar pedido.');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesType = typeFilter === 'todos' || o.type === typeFilter;
    const matchesSearch = o.orderNumber.toString().includes(search) || o.customerName.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Gestão de Pedidos (Kanban)</h2>
          <p className="text-xs text-slate-500">Acompanhamento e alteração de fases de todos os pedidos</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative bg-white rounded-xl border border-slate-200 p-1.5 shadow-2xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por # ou cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent pl-8 pr-3 py-1 text-xs text-slate-800 font-medium focus:outline-hidden"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-hidden shadow-2xs"
          >
            <option value="todos">Todos os Canais</option>
            <option value="balcao">Balcão / Retirada</option>
            <option value="mesa">Mesa</option>
            <option value="entrega">Entrega (Delivery)</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {STAGES.map(stage => {
          const stageOrders = filteredOrders.filter(o => o.status === stage.id);

          return (
            <div
              key={stage.id}
              className={`w-72 shrink-0 rounded-2xl border-t-4 bg-slate-100/80 p-3 space-y-3 ${stage.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">{stage.label}</span>
                <span className="w-5 h-5 rounded-full bg-white text-slate-800 font-black text-[11px] flex items-center justify-center shadow-xs">
                  {stageOrders.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[50vh]">
                {stageOrders.map(order => (
                  <div
                    key={order.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono font-black text-rose-600 text-sm">#{order.orderNumber}</span>
                        <span className="ml-2 font-bold text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {order.type}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-xs space-y-0.5">
                      <p className="font-bold text-slate-800 truncate">{order.customerName}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-black text-slate-800">R$ {order.total.toFixed(2)}</span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedOrderDetails(order)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg"
                        >
                          Detalhes
                        </button>

                        {order.status === 'pronto' && order.type === 'entrega' && (
                          <button
                            onClick={() => setAssignDriverOrder(order)}
                            className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] rounded-lg"
                          >
                            Entregador
                          </button>
                        )}

                        {order.status !== 'concluido' && order.status !== 'cancelado' && (
                          <button
                            onClick={() => setCancelOrderModal(order)}
                            className="px-1.5 py-1 text-rose-500 hover:bg-rose-50 rounded-lg text-[10px] font-bold"
                            title="Cancelar Pedido"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-800 text-base">Pedido #{selectedOrderDetails.orderNumber}</h3>
                <p className="text-xs text-slate-500">Cliente: {selectedOrderDetails.customerName}</p>
              </div>
              <button onClick={() => setSelectedOrderDetails(null)} className="font-bold text-slate-400">✕</button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-slate-800">Itens Solicitados:</div>
              {selectedOrderDetails.items.map((it, idx) => (
                <div key={idx} className="flex justify-between border-b border-slate-200 pb-1">
                  <span>{it.quantity}x {it.productName}</span>
                  <span className="font-bold">R$ {(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="pt-2 font-black text-sm flex justify-between text-rose-600">
                <span>Total Pago ({selectedOrderDetails.paymentMethod}):</span>
                <span>R$ {selectedOrderDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="w-full py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Assign Driver Modal */}
      {assignDriverOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-slate-800 text-base">Atribuir Entregador — Pedido #{assignDriverOrder.orderNumber}</h3>

            <div className="space-y-2">
              {drivers.map(drv => (
                <button
                  key={drv.id}
                  onClick={() => handleAssignDriver(drv.name)}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-left hover:border-cyan-500 text-xs font-bold text-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p>{drv.name}</p>
                    <p className="text-[10px] font-normal text-slate-500">{drv.vehicle} • {drv.phone}</p>
                  </div>
                  <Truck className="w-4 h-4 text-cyan-600" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setAssignDriverOrder(null)}
              className="w-full py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-slate-800 text-base">Cancelar Pedido #{cancelOrderModal.orderNumber}</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Motivo do Cancelamento</label>
              <textarea
                required
                placeholder="Ex: Falta de ingrediente, desistência do cliente..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-hidden h-20"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCancelOrderModal(null)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Voltar
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
