import React, { useState, useEffect } from 'react';
import {
  Grid, Plus, User, QrCode, Calculator, CheckCircle2,
  RefreshCw, Utensils, AlertCircle
} from 'lucide-react';
import { Table, Order } from '../types';
import { api } from '../services/api';

export const TablesView: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showNewTableModal, setShowNewTableModal] = useState(false);
  const [newTableNum, setNewTableNum] = useState('');
  const [newTableSeats, setNewTableSeats] = useState('4');

  const [showQrModal, setShowQrModal] = useState<Table | null>(null);
  const [showSplitBillModal, setShowSplitBillModal] = useState<Order | null>(null);
  const [splitPeople, setSplitPeople] = useState(2);

  const [waiterName, setWaiterName] = useState('Roberto Garçom');
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tbls, ords] = await Promise.all([
        api.getTables(),
        api.getOrders()
      ]);
      setTables(tbls);
      setOrders(ords);
    } catch (err) {
      console.error('Erro ao carregar mesas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNum) return;
    try {
      await api.createTable({
        number: Number(newTableNum),
        seats: Number(newTableSeats)
      });
      setShowNewTableModal(false);
      setNewTableNum('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erro ao criar mesa.');
    }
  };

  const handleOccupyTable = async (table: Table) => {
    try {
      await api.updateTableStatus(table.id, 'ocupada', waiterName, customerName || 'Cliente Mesa');
      setSelectedTable(null);
      setCustomerName('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erro ao ocupar mesa.');
    }
  };

  const handleReleaseTable = async (table: Table) => {
    try {
      await api.updateTableStatus(table.id, 'disponivel');
      setSelectedTable(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erro ao liberar mesa.');
    }
  };

  const getTableOrder = (table: Table) => {
    if (!table.currentOrderId) return null;
    return orders.find(o => o.id === table.currentOrderId) || null;
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Mesas & Comandas</h2>
          <p className="text-xs text-slate-500">Monitoramento do salão e divisão de conta</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewTableModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-rose-900/20"
          >
            <Plus className="w-4 h-4" />
            Adicionar Nova Mesa
          </button>
        </div>
      </div>

      {/* Tables Status Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Disponíveis</span>
          <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
            {tables.filter(t => t.status === 'disponivel').length}
          </span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Ocupadas</span>
          <span className="text-sm font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg">
            {tables.filter(t => t.status === 'ocupada').length}
          </span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Reservadas</span>
          <span className="text-sm font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg">
            {tables.filter(t => t.status === 'reservada').length}
          </span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Aguardando Conta</span>
          <span className="text-sm font-black text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-lg">
            {tables.filter(t => t.status === 'aguardando_fechamento').length}
          </span>
        </div>
      </div>

      {/* Interactive Tables salon map */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {tables.map(table => {
          const activeOrder = getTableOrder(table);

          const statusColors = {
            disponivel: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:border-emerald-500',
            ocupada: 'bg-rose-50 text-rose-800 border-rose-300 hover:border-rose-500',
            reservada: 'bg-amber-50 text-amber-800 border-amber-300 hover:border-amber-500',
            aguardando_fechamento: 'bg-violet-50 text-violet-800 border-violet-300 hover:border-violet-500'
          };

          return (
            <div
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between h-40 shadow-2xs ${statusColors[table.status]}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-black opacity-60">MESA</span>
                  <h3 className="text-xl font-black">{table.number}</h3>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQrModal(table);
                  }}
                  className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-700 shadow-2xs"
                  title="Ver QR Code da Mesa"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-bold truncate">
                  {table.customerName || `${table.seats} lugares`}
                </p>

                {activeOrder && (
                  <p className="text-xs font-black text-rose-700">
                    R$ {activeOrder.total.toFixed(2)}
                  </p>
                )}

                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/80">
                  {table.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Detail Modal */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-800">Mesa #{selectedTable.number}</h3>
                <p className="text-xs text-slate-500">Capacidade para {selectedTable.seats} pessoas</p>
              </div>
              <button onClick={() => setSelectedTable(null)} className="font-bold text-slate-400">✕</button>
            </div>

            {selectedTable.status === 'disponivel' ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 font-medium">Esta mesa está livre. Deseja abrir uma comanda?</p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Cliente na Mesa</label>
                  <input
                    type="text"
                    placeholder="Ex: Família Silva"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden"
                  />
                </div>

                <button
                  onClick={() => handleOccupyTable(selectedTable)}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-rose-900/20"
                >
                  Abrir Mesa e Iniciar Comanda
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-slate-800">Cliente: {selectedTable.customerName || 'Não Informado'}</p>
                  <p className="text-slate-500">Garçom Atendente: {selectedTable.waiterName || 'Roberto Garçom'}</p>
                  {getTableOrder(selectedTable) && (
                    <p className="text-rose-600 font-black text-sm pt-1">
                      Consumo Total: R$ {getTableOrder(selectedTable)!.total.toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  {getTableOrder(selectedTable) && (
                    <button
                      onClick={() => setShowSplitBillModal(getTableOrder(selectedTable))}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                    >
                      <Calculator className="w-4 h-4" />
                      Calculadora de Divisão de Conta
                    </button>
                  )}

                  <button
                    onClick={() => handleReleaseTable(selectedTable)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
                  >
                    Fechar Conta & Liberar Mesa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-center">
            <h3 className="font-black text-slate-800 text-base">QR Code — Mesa #{showQrModal.number}</h3>
            <p className="text-xs text-slate-500">O cliente pode escanear para abrir o cardápio e fazer pedidos direto do celular.</p>

            <div className="w-48 h-48 mx-auto bg-slate-900 p-4 rounded-2xl flex items-center justify-center text-white font-mono text-xs shadow-inner">
              <QrCode className="w-32 h-32 text-rose-500" />
            </div>

            <p className="text-[10px] font-mono font-semibold text-slate-400">
              Link: /cardapio?mesa={showQrModal.number}
            </p>

            <button
              onClick={() => setShowQrModal(null)}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Split Bill Calculator Modal */}
      {showSplitBillModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                <Calculator className="w-5 h-5 text-rose-600" />
                Divisão de Conta por Pessoas
              </h3>
              <button onClick={() => setShowSplitBillModal(null)} className="font-bold text-slate-400">✕</button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Valor Total da Mesa:</span>
                <span className="text-rose-600 font-black text-sm">R$ {showSplitBillModal.total.toFixed(2)}</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dividir em quantas pessoas?</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={splitPeople}
                  onChange={(e) => setSplitPeople(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 text-center space-y-1">
                <p className="text-slate-500 font-medium">Cada pessoa paga:</p>
                <p className="text-2xl font-black text-rose-600">
                  R$ {(showSplitBillModal.total / splitPeople).toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSplitBillModal(null)}
              className="w-full py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              Concluir Divisão
            </button>
          </div>
        </div>
      )}

      {/* New Table Modal */}
      {showNewTableModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateTable} className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-slate-800 text-base">Adicionar Nova Mesa ao Salão</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Número da Mesa</label>
              <input
                type="number"
                required
                placeholder="Ex: 7"
                value={newTableNum}
                onChange={(e) => setNewTableNum(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lugares (Capacidade)</label>
              <input
                type="number"
                required
                value={newTableSeats}
                onChange={(e) => setNewTableSeats(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewTableModal(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-900/20"
              >
                Criar Mesa
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
