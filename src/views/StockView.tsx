import React, { useState, useEffect } from 'react';
import {
  Warehouse, Plus, AlertTriangle, Edit3, ArrowUpRight,
  ArrowDownRight, RefreshCw, CheckCircle2
} from 'lucide-react';
import { StockItem } from '../types';
import { api } from '../services/api';

export const StockView: React.FC = () => {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showItemModal, setShowItemModal] = useState(false);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('kg');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [supplier, setSupplier] = useState('');

  const [adjustModalItem, setAdjustModalItem] = useState<StockItem | null>(null);
  const [adjustDelta, setAdjustDelta] = useState('');

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    setLoading(true);
    try {
      const items = await api.getStock();
      setStock(items);
    } catch (err) {
      console.error('Erro ao carregar estoque:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStockItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !unit) return;

    try {
      await api.createStockItem({
        name,
        unit,
        currentQuantity: Number(currentQuantity || 0),
        minQuantity: Number(minQuantity || 5),
        costPerUnit: Number(costPerUnit || 0),
        supplier: supplier || 'Geral'
      });

      setShowItemModal(false);
      resetForm();
      loadStock();
    } catch (err: any) {
      alert(err.message || 'Erro ao cadastrar insumo.');
    }
  };

  const handleAdjustQuantity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalItem || !adjustDelta) return;

    try {
      await api.updateStockQuantity(adjustModalItem.id, Number(adjustDelta));
      setAdjustModalItem(null);
      setAdjustDelta('');
      loadStock();
    } catch (err: any) {
      alert(err.message || 'Erro ao ajustar estoque.');
    }
  };

  const resetForm = () => {
    setName('');
    setUnit('kg');
    setCurrentQuantity('');
    setMinQuantity('');
    setCostPerUnit('');
    setSupplier('');
  };

  const lowStockCount = stock.filter(s => s.currentQuantity <= s.minQuantity).length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Estoque & Controle de Insumos</h2>
          <p className="text-xs text-slate-500">Acompanhamento de matérias-primas e alerta de reposição</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowItemModal(true);
          }}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-rose-900/20"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Novo Insumo
        </button>
      </div>

      {/* Alert bar if low stock */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-800 font-medium">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Atenção: Existem <strong>{lowStockCount} insumo(s)</strong> abaixo do nível mínimo de segurança!</span>
          </div>
        </div>
      )}

      {/* Stock Items Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] bg-slate-50">
                <th className="py-3 px-4">Insumo / Matéria-Prima</th>
                <th className="py-3 px-4">Unidade</th>
                <th className="py-3 px-4">Qtd. Atual</th>
                <th className="py-3 px-4">Mínimo</th>
                <th className="py-3 px-4">Custo Unitário</th>
                <th className="py-3 px-4">Fornecedor</th>
                <th className="py-3 px-4 text-right">Ajustar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stock.map(item => {
                const isLow = item.currentQuantity <= item.minQuantity;

                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        {isLow && <span className="w-2 h-2 rounded-full bg-amber-500" title="Estoque Baixo" />}
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 uppercase font-mono">{item.unit}</td>
                    <td className="py-3 px-4 font-black text-slate-900 text-sm">
                      {item.currentQuantity} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {item.minQuantity} {item.unit}
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-600">R$ {item.costPerUnit.toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-600">{item.supplier}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setAdjustModalItem(item)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg"
                      >
                        Ajustar Qtd.
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Stock Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateStockItem} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-slate-800 text-base">Novo Insumo no Estoque</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Insumo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Queijo Mussarela Fatiado"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unidade de Medida</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-hidden"
                  >
                    <option value="kg">Quilo (kg)</option>
                    <option value="g">Grama (g)</option>
                    <option value="un">Unidade (un)</option>
                    <option value="L">Litro (L)</option>
                    <option value="ml">Mililitro (ml)</option>
                    <option value="pct">Pacote (pct)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Custo por Unidade (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="35.00"
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantidade Inicial</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="10"
                    value={currentQuantity}
                    onChange={(e) => setCurrentQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estoque Mínimo</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="2"
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fornecedor Principal</label>
                <input
                  type="text"
                  placeholder="Ex: Laticínios Vale"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-900/20"
              >
                Salvar Insumo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Adjust Quantity Modal */}
      {adjustModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAdjustQuantity} className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-black text-slate-800 text-base">Ajuste de Estoque — {adjustModalItem.name}</h3>

            <p className="text-xs text-slate-500">
              Quantidade atual: <strong>{adjustModalItem.currentQuantity} {adjustModalItem.unit}</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quantidade a Adicionar ou Subtrair (Use negativo para perdas ex: -2)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ex: 5 ou -2"
                value={adjustDelta}
                onChange={(e) => setAdjustDelta(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAdjustModalItem(null)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-900/20"
              >
                Confirmar Ajuste
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
