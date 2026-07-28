import React, { useState, useEffect } from 'react';
import {
  Wallet, ArrowDownCircle, ArrowUpCircle, Lock, Unlock,
  Plus, DollarSign, Printer, CheckCircle2, AlertCircle
} from 'lucide-react';
import { CashRegister } from '../types';
import { api } from '../services/api';

export const CashierView: React.FC = () => {
  const [cashRegister, setCashRegister] = useState<CashRegister | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [initialFloat, setInitialFloat] = useState('150.00');

  const [showMovementModal, setShowMovementModal] = useState<'sangria' | 'suprimento' | null>(null);
  const [movementAmount, setMovementAmount] = useState('');
  const [movementDescription, setMovementDescription] = useState('');

  const [showCloseModal, setShowCloseModal] = useState(false);
  const [countedCash, setCountedCash] = useState('');
  const [closingNotes, setClosingNotes] = useState('');

  useEffect(() => {
    loadCashier();
  }, []);

  const loadCashier = async () => {
    setLoading(true);
    try {
      const register = await api.getCurrentCashier();
      setCashRegister(register);
    } catch (err) {
      console.error('Erro ao carregar o caixa:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCashier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const reg = await api.openCashier(Number(initialFloat));
      setCashRegister(reg);
      setShowOpenModal(false);
    } catch (err: any) {
      alert(err.message || 'Erro ao abrir caixa.');
    }
  };

  const handleAddMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showMovementModal || !movementAmount || !movementDescription) return;
    try {
      const reg = await api.addCashMovement(showMovementModal, Number(movementAmount), movementDescription);
      setCashRegister(reg);
      setShowMovementModal(null);
      setMovementAmount('');
      setMovementDescription('');
    } catch (err: any) {
      alert(err.message || 'Erro ao registrar movimentação.');
    }
  };

  const handleCloseCashier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const reg = await api.closeCashier(Number(countedCash), closingNotes);
      setCashRegister(reg);
      setShowCloseModal(false);
    } catch (err: any) {
      alert(err.message || 'Erro ao fechar caixa.');
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Fluxo e Gestão de Caixa</h2>
          <p className="text-xs text-slate-500">Controle de abertura, fechamento, suprimentos e sangrias</p>
        </div>

        {cashRegister?.status === 'aberto' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMovementModal('suprimento')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-900/20"
            >
              <ArrowDownCircle className="w-4 h-4" />
              Suprimento (Entrada)
            </button>

            <button
              onClick={() => setShowMovementModal('sangria')}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-900/20"
            >
              <ArrowUpCircle className="w-4 h-4" />
              Sangria (Retirada)
            </button>

            <button
              onClick={() => setShowCloseModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4" />
              Fechar Caixa
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowOpenModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-rose-900/20"
          >
            <Unlock className="w-4 h-4" />
            Abrir Caixa do Dia
          </button>
        )}
      </div>

      {/* Cash Register Status Summary */}
      {!cashRegister || cashRegister.status === 'fechado' ? (
        <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">O caixa está fechado no momento.</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Clique no botão acima para realizar a abertura e definir o fundo de troco inicial.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Register Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Aberto Por</span>
              <p className="text-base font-black text-slate-800">{cashRegister.openedBy}</p>
              <p className="text-[10px] text-slate-400">Em {new Date(cashRegister.openedAt).toLocaleString('pt-BR')}</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Fundo Inicial</span>
              <p className="text-base font-black text-slate-800">R$ {cashRegister.initialCash.toFixed(2)}</p>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Saldo em Gaveta Estimado</span>
              <p className="text-xl font-black text-emerald-400">R$ {cashRegister.currentCash.toFixed(2)}</p>
            </div>
          </div>

          {/* Movements History */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-800">Movimentações do Caixa</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Horário</th>
                    <th className="py-2.5 px-3">Tipo</th>
                    <th className="py-2.5 px-3">Descrição</th>
                    <th className="py-2.5 px-3">Forma</th>
                    <th className="py-2.5 px-3 text-right">Valor (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cashRegister.movements.map((mov) => (
                    <tr key={mov.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-slate-500">
                        {new Date(mov.timestamp).toLocaleTimeString('pt-BR')}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          mov.type === 'venda' || mov.type === 'suprimento'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {mov.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{mov.description}</td>
                      <td className="py-2.5 px-3 text-slate-500">{mov.method || '-'}</td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-800">
                        R$ {mov.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Open Cashier Modal */}
      {showOpenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleOpenCashier} className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-slate-800 text-base">Abertura de Caixa</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fundo de Troco Inicial (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={initialFloat}
                onChange={(e) => setInitialFloat(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-hidden"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowOpenModal(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-900/20"
              >
                Confirmar Abertura
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sangria / Suprimento Modal */}
      {showMovementModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddMovement} className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-slate-800 text-base capitalize">
              Lançar {showMovementModal}
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={movementAmount}
                onChange={(e) => setMovementAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Descrição / Motivo</label>
              <input
                type="text"
                required
                placeholder="Ex: Retirada de troco para compra de gelo"
                value={movementDescription}
                onChange={(e) => setMovementDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowMovementModal(null)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Confirmar Lançamento
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Close Cashier Modal */}
      {showCloseModal && cashRegister && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCloseCashier} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-slate-800 text-base">Fechamento e Conferência de Caixa</h3>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <p className="flex justify-between">
                <span className="text-slate-600">Saldo Estimado na Gaveta:</span>
                <span className="font-black text-slate-800">R$ {cashRegister.currentCash.toFixed(2)}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Valor Contado em Dinheiro na Gaveta (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ex: 450.00"
                value={countedCash}
                onChange={(e) => setCountedCash(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden"
              />
            </div>

            {countedCash && (
              <div className="p-3 rounded-xl bg-slate-900 text-white text-xs flex justify-between font-bold">
                <span>Diferença Apurada:</span>
                <span className={Number(countedCash) - cashRegister.currentCash >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  R$ {(Number(countedCash) - cashRegister.currentCash).toFixed(2)}
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Observações do Fechamento</label>
              <textarea
                placeholder="Anotações de fechamento..."
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-hidden h-16"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCloseModal(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-900/20"
              >
                Confirmar Fechamento
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
