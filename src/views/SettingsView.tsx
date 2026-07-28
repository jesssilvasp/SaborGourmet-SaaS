import React, { useState, useEffect } from 'react';
import {
  Settings, Save, Download, Upload, Store, Printer,
  CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { Establishment } from '../types';
import { api } from '../services/api';

export const SettingsView: React.FC = () => {
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [avgPreparationTime, setAvgPreparationTime] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const est = await api.getEstablishment();
      setEstablishment(est);
      setName(est.name);
      setCnpj(est.cnpj);
      setPhone(est.phone);
      setDeliveryFee(est.deliveryFee.toString());
      setMinOrder(est.minOrder.toString());
      setAvgPreparationTime(est.avgPreparationTime.toString());
      setIsOpen(est.isOpen);
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const updated = await api.updateEstablishment({
        name,
        cnpj,
        phone,
        deliveryFee: Number(deliveryFee),
        minOrder: Number(minOrder),
        avgPreparationTime: Number(avgPreparationTime),
        isOpen
      });
      setEstablishment(updated);
      setSuccessMsg('Configurações salvas com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      const data = await api.exportBackup();
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_gastronomia_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert(err.message || 'Erro ao exportar backup.');
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        await api.importBackup(parsed);
        alert('Backup restaurado com sucesso! Recarregando dados...');
        loadSettings();
      } catch (err: any) {
        alert('Erro ao restaurar backup: arquivo JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Configurações & Backup do Sistema</h2>
        <p className="text-xs text-slate-500">Dados do estabelecimento, taxas de entrega e cópias de segurança</p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Establishment Profile Form */}
        <form onSubmit={handleSaveSettings} className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Perfil do Estabelecimento</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nome Comercial do Restaurante</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">CNPJ / CPF</label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-medium focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Telefone Principal</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Taxa Entrega (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pedido Mínimo (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tempo Preparo (min)</label>
                <input
                  type="number"
                  value={avgPreparationTime}
                  onChange={(e) => setAvgPreparationTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <label className="font-bold text-slate-700">Status de Atendimento:</label>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                  isOpen ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }`}
              >
                {isOpen ? 'Aberto para Vendas' : 'Fechado para Vendas'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="py-2.5 px-6 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-900/20 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>

        {/* Backup & Restore Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Backup de Dados (JSON)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Exporte todos os produtos, pedidos, clientes e histórico do banco de dados para segurança em formato JSON.
            </p>

            <button
              type="button"
              onClick={handleExportBackup}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar Backup Agora
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="block text-xs font-bold text-slate-700">Restaurar Cópia de Segurança:</span>
            <label className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer border border-slate-300">
              <Upload className="w-4 h-4" />
              <span>Selecionar Arquivo .JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
