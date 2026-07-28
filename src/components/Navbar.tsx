import React from 'react';
import { Menu, Clock, Store, AlertTriangle } from 'lucide-react';
import { Establishment } from '../types';

interface NavbarProps {
  activeTab: string;
  establishment: Establishment | null;
  onOpenMobileSidebar: () => void;
}

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Painel Geral & Indicadores',
  pos: 'Ponto de Venda — PDV Balcão',
  cardapio: 'Cardápio Digital do Cliente',
  kds: 'Cozinha (Kitchen Display System)',
  mesas: 'Gestão de Mesas e Comandas',
  pedidos: 'Gestão de Pedidos',
  caixa: 'Fluxo e Abertura de Caixa',
  produtos: 'Produtos e Categorias',
  estoque: 'Estoque e Insumos',
  financeiro: 'Financeiro e Despesas',
  relatorios: 'Relatórios e Desempenho',
  usuarios: 'Equipe e Permissões',
  configuracoes: 'Configurações e Backup'
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  establishment,
  onOpenMobileSidebar
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-hidden"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-800">
            {TAB_TITLES[activeTab] || 'Sabor Gourmet'}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            {establishment?.name || 'Sistema de Gestão para Restaurantes'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {establishment && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border bg-slate-50">
            <span className={`w-2 h-2 rounded-full ${establishment.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className={establishment.isOpen ? 'text-emerald-700' : 'text-rose-700'}>
              {establishment.isOpen ? 'Aberto para Vendas' : 'Fechado'}
            </span>
          </div>
        )}

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}</span>
        </div>
      </div>
    </header>
  );
};
