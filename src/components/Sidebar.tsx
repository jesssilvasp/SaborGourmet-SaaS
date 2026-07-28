import React from 'react';
import {
  LayoutDashboard, ShoppingCart, UtensilsCrossed, MonitorPlay,
  Grid, ClipboardList, Wallet, Package, Warehouse, DollarSign,
  BarChart3, Users, Settings, LogOut, ChevronRight, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile
}) => {
  const { user, logout, hasRole } = useAuth();

  const menuGroups = [
    {
      title: 'Vendas & Operação',
      items: [
        { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard, roles: ['admin', 'gerente', 'atendente', 'caixa'] },
        { id: 'pos', label: 'PDV (Balcão)', icon: ShoppingCart, roles: ['admin', 'gerente', 'atendente', 'caixa'] },
        { id: 'cardapio', label: 'Cardápio Digital', icon: UtensilsCrossed, roles: ['admin', 'gerente', 'atendente', 'garcom', 'cliente'] },
        { id: 'kds', label: 'Cozinha (KDS)', icon: MonitorPlay, roles: ['admin', 'gerente', 'cozinha'] },
        { id: 'mesas', label: 'Mesas & Comandas', icon: Grid, roles: ['admin', 'gerente', 'garcom', 'atendente'] },
        { id: 'pedidos', label: 'Gestão de Pedidos', icon: ClipboardList, roles: ['admin', 'gerente', 'atendente', 'caixa', 'entregador'] },
      ]
    },
    {
      title: 'Gestão & Controle',
      items: [
        { id: 'caixa', label: 'Caixa do Dia', icon: Wallet, roles: ['admin', 'gerente', 'caixa'] },
        { id: 'produtos', label: 'Produtos & Cardápio', icon: Package, roles: ['admin', 'gerente'] },
        { id: 'estoque', label: 'Estoque & Insumos', icon: Warehouse, roles: ['admin', 'gerente'] },
        { id: 'financeiro', label: 'Despesas & Contas', icon: DollarSign, roles: ['admin', 'gerente'] },
        { id: 'relatorios', label: 'Relatórios', icon: BarChart3, roles: ['admin', 'gerente'] },
      ]
    },
    {
      title: 'Administração',
      items: [
        { id: 'usuarios', label: 'Equipe & Perfis', icon: Users, roles: ['admin', 'gerente'] },
        { id: 'configuracoes', label: 'Configurações', icon: Settings, roles: ['admin', 'gerente'] },
        { id: 'landing', label: 'Site / Landing Page', icon: Globe, roles: ['admin', 'gerente', 'atendente', 'caixa', 'garcom', 'cozinha'] },
      ]
    }
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center text-white font-black shadow-md shadow-rose-950/40">
              🍔
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-sm leading-tight">Sabor Gourmet</h1>
              <span className="text-[11px] font-medium text-rose-400">Sistema de Vendas</span>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        {user && (
          <div className="px-4 py-3 mx-3 my-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold text-xs uppercase">
              {user.name.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-100 truncate">{user.name}</p>
              <span className="inline-block px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-slate-700 text-rose-300 rounded">
                {user.role}
              </span>
            </div>
          </div>
        )}

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin">
          {menuGroups.map((group, gIdx) => {
            const filteredItems = group.items.filter(it => hasRole(...it.roles));
            if (filteredItems.length === 0) return null;

            return (
              <div key={gIdx} className="space-y-1">
                <h2 className="px-3 text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                  {group.title}
                </h2>
                {filteredItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-900/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer Logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </aside>
    </>
  );
};
