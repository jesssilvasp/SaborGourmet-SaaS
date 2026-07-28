import React, { useEffect, useState } from 'react';
import {
  DollarSign, ShoppingBag, TrendingUp, AlertTriangle,
  Clock, ShoppingCart, MonitorPlay, Grid, Wallet, Plus, RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    totalRevenue: number;
    totalOrders: number;
    avgTicket: number;
    lowStockCount: number;
    activeOrdersCount: number;
    salesByPaymentMethod: Record<string, number>;
    salesByType: Record<string, number>;
  } | null>(null);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const summary = await api.getSummaryReport();
      setData(summary);
    } catch (err) {
      console.error('Erro ao carregar resumo do painel:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Painel Principal</h2>
          <p className="text-xs text-slate-500">Acompanhamento das vendas e da operação em tempo real</p>
        </div>
        <button
          onClick={loadSummary}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Indicadores</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Faturamento */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Faturamento Total</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">
            R$ {data?.totalRevenue ? data.totalRevenue.toFixed(2) : '0,00'}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Vendas acumuladas
          </p>
        </div>

        {/* Quantidade de Pedidos */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total de Pedidos</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">
            {data?.totalOrders || 0}
          </div>
          <p className="text-[11px] text-blue-600 font-semibold">
            {data?.activeOrdersCount || 0} pedidos em andamento
          </p>
        </div>

        {/* Ticket Médio */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket Médio</span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">
            R$ {data?.avgTicket ? data.avgTicket.toFixed(2) : '0,00'}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Por pedido finalizado</p>
        </div>

        {/* Alerta Estoque */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estoque Baixo</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              (data?.lowStockCount || 0) > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800">
            {data?.lowStockCount || 0}
          </div>
          <p className="text-[11px] text-amber-700 font-medium">Insumos precisando de reposição</p>
        </div>
      </div>

      {/* Quick Access Shortcuts */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800">Atalhos Operacionais Rápidos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('pos')}
            className="p-4 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white shadow-md shadow-rose-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center gap-2 text-center"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="text-xs font-bold">Abrir PDV (Balcão)</span>
          </button>

          <button
            onClick={() => onNavigate('kds')}
            className="p-4 rounded-2xl bg-slate-800 text-slate-100 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center gap-2 text-center"
          >
            <MonitorPlay className="w-6 h-6 text-rose-400" />
            <span className="text-xs font-bold">Tela da Cozinha (KDS)</span>
          </button>

          <button
            onClick={() => onNavigate('mesas')}
            className="p-4 rounded-2xl bg-slate-800 text-slate-100 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center gap-2 text-center"
          >
            <Grid className="w-6 h-6 text-amber-400" />
            <span className="text-xs font-bold">Mesas & Comandas</span>
          </button>

          <button
            onClick={() => onNavigate('caixa')}
            className="p-4 rounded-2xl bg-slate-800 text-slate-100 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center gap-2 text-center"
          >
            <Wallet className="w-6 h-6 text-emerald-400" />
            <span className="text-xs font-bold">Gestão do Caixa</span>
          </button>
        </div>
      </div>

      {/* Breakdown Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Payment Method */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Vendas por Forma de Pagamento</h3>
          <div className="space-y-3">
            {data?.salesByPaymentMethod && Object.keys(data.salesByPaymentMethod).length > 0 ? (
              Object.entries(data.salesByPaymentMethod).map(([method, val]) => {
                const numericVal = Number(val) || 0;
                return (
                  <div key={method} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700">{method}</span>
                      <span className="text-slate-900 font-bold">R$ {numericVal.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{
                          width: `${Math.min(100, (numericVal / (data.totalRevenue || 1)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">Nenhuma venda registrada ainda.</p>
            )}
          </div>
        </div>

        {/* Sales by Order Type */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Distribuição por Canal de Venda</h3>
          <div className="space-y-3">
            {data?.salesByType && Object.keys(data.salesByType).length > 0 ? (
              Object.entries(data.salesByType).map(([type, count]) => {
                const typeLabels: Record<string, string> = {
                  balcao: 'Balcão / Retirada',
                  mesa: 'Consumo na Mesa',
                  entrega: 'Entrega (Delivery)',
                  comanda: 'Comanda Individual'
                };
                return (
                  <div key={type} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-700 capitalize">{typeLabels[type] || type}</span>
                    <span className="font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                      {count} {count === 1 ? 'pedido' : 'pedidos'}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">Nenhum pedido por canal.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
