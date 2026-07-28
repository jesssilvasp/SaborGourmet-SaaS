import React, { useState, useEffect } from 'react';
import {
  DollarSign, Plus, Calendar, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { Expense } from '../types';
import { api } from '../services/api';

export const FinancialView: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Insumos');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<'pendente' | 'pago'>('pendente');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const exps = await api.getExpenses();
      setExpenses(exps);
    } catch (err) {
      console.error('Erro ao carregar despesas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !dueDate) return;

    try {
      await api.createExpense({
        description,
        category,
        amount: Number(amount),
        dueDate,
        status
      });

      setShowExpenseModal(false);
      resetForm();
      loadExpenses();
    } catch (err: any) {
      alert(err.message || 'Erro ao lançar despesa.');
    }
  };

  const resetForm = () => {
    setDescription('');
    setCategory('Insumos');
    setAmount('');
    setDueDate('');
    setStatus('pendente');
  };

  const totalPending = expenses.filter(e => e.status === 'pendente').reduce((acc, e) => acc + e.amount, 0);
  const totalPaid = expenses.filter(e => e.status === 'pago').reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Financeiro & Lançamento de Despesas</h2>
          <p className="text-xs text-slate-500">Controle de contas a pagar e fluxo de saídas</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowExpenseModal(true);
          }}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-rose-900/20"
        >
          <Plus className="w-4 h-4" />
          Lançar Nova Despesa
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-1">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Contas a Pagar (Pendentes)</span>
          <p className="text-2xl font-black text-slate-800">R$ {totalPending.toFixed(2)}</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-1">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Despesas Pagas</span>
          <p className="text-2xl font-black text-slate-800">R$ {totalPaid.toFixed(2)}</p>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] bg-slate-50">
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4">Valor (R$)</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-800">{exp.description}</td>
                  <td className="py-3 px-4 text-slate-500 font-medium">{exp.category}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">{exp.dueDate}</td>
                  <td className="py-3 px-4 font-black text-slate-800">R$ {exp.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      exp.status === 'pago' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {exp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateExpense} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-slate-800 text-base">Lançar Nova Despesa</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição do Lançamento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aluguel do Imóvel Comercial"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-hidden"
                  >
                    <option value="Insumos">Insumos & Compras</option>
                    <option value="Fixa">Despesa Fixa (Aluguel, Luz)</option>
                    <option value="Utilidades">Utilidades & Internet</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Salários">Salários & Mão de Obra</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="3500.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data de Vencimento</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Situação Inicial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-hidden"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExpenseModal(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-900/20"
              >
                Salvar Despesa
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
