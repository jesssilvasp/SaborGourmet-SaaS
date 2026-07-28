import React, { useState, useEffect } from 'react';
import {
  BarChart3, Download, Printer, Calendar, DollarSign,
  TrendingUp, ShoppingBag, FileSpreadsheet
} from 'lucide-react';
import { api } from '../services/api';

export const ReportsView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.getSummaryReport();
      setSummary(data);
    } catch (err) {
      console.error('Erro ao carregar relatórios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!summary) return;
    const csvRows = [
      ['Indicador', 'Valor'],
      ['Faturamento Total (R$)', summary.totalRevenue?.toFixed(2)],
      ['Total de Pedidos', summary.totalOrders],
      ['Ticket Medio (R$)', summary.avgTicket?.toFixed(2)],
      ['Insumos em Alerta de Estoque', summary.lowStockCount]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_gastronomia_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Relatórios & Desempenho Operacional</h2>
          <p className="text-xs text-slate-500">Métricas consolidadas do banco de dados real</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-900/20"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exportar para CSV
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Imprimir Relatório
          </button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Faturamento Consolidado</span>
          <p className="text-2xl font-black text-slate-800">R$ {summary?.totalRevenue?.toFixed(2) || '0,00'}</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Volume de Pedidos</span>
          <p className="text-2xl font-black text-slate-800">{summary?.totalOrders || 0}</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Ticket Médio Por Cliente</span>
          <p className="text-2xl font-black text-slate-800">R$ {summary?.avgTicket?.toFixed(2) || '0,00'}</p>
        </div>
      </div>
    </div>
  );
};
