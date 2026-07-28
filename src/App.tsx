import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LandingPageView } from './views/LandingPageView';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { PosView } from './views/PosView';
import { DigitalMenuView } from './views/DigitalMenuView';
import { KdsView } from './views/KdsView';
import { TablesView } from './views/TablesView';
import { OrdersView } from './views/OrdersView';
import { CashierView } from './views/CashierView';
import { ProductsView } from './views/ProductsView';
import { StockView } from './views/StockView';
import { FinancialView } from './views/FinancialView';
import { ReportsView } from './views/ReportsView';
import { UsersView } from './views/UsersView';
import { SettingsView } from './views/SettingsView';
import { Establishment } from './types';
import { api } from './services/api';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('landing');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);
  const [establishment, setEstablishment] = useState<Establishment | null>(null);

  // Check if URL directly requests the public digital menu (/cardapio)
  const isPublicMenuPath = window.location.pathname === '/cardapio' || window.location.search.includes('mesa=');

  useEffect(() => {
    if (isPublicMenuPath) {
      setActiveTab('cardapio');
    }
    loadEstablishment();
  }, [isPublicMenuPath]);

  const loadEstablishment = async () => {
    try {
      const est = await api.getEstablishment();
      setEstablishment(est);
    } catch (err) {
      console.error('Error loading establishment:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Carregando Sistema Gastronômico...</p>
        </div>
      </div>
    );
  }

  // Standalone Landing Page View
  if (activeTab === 'landing') {
    return (
      <LandingPageView
        onEnterSystem={() => setActiveTab(user ? 'dashboard' : 'login')}
        onGoToDigitalMenu={() => setActiveTab('cardapio')}
      />
    );
  }

  // Standalone Digital Menu View
  if (activeTab === 'cardapio') {
    return (
      <div className="min-h-screen bg-slate-50">
        {user && (
          <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
            <span className="font-bold text-rose-400">Modo de Visualização do Cliente (Cardápio Público)</span>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold"
            >
              Voltar ao Painel Administrativo
            </button>
          </div>
        )}
        <DigitalMenuView onGoToLanding={() => setActiveTab('landing')} />
      </div>
    );
  }

  // If user is not logged in AND NOT on landing or cardapio, show Login
  if (!user || activeTab === 'login') {
    return (
      <LoginView
        onGoToDigitalMenu={() => setActiveTab('cardapio')}
        onGoToLanding={() => setActiveTab('landing')}
      />
    );
  }

  // Render view depending on active tab for logged-in users
  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigate={setActiveTab} />;
      case 'pos':
        return <PosView />;
      case 'kds':
        return <KdsView />;
      case 'mesas':
        return <TablesView />;
      case 'pedidos':
        return <OrdersView />;
      case 'caixa':
        return <CashierView />;
      case 'produtos':
        return <ProductsView />;
      case 'estoque':
        return <StockView />;
      case 'financeiro':
        return <FinancialView />;
      case 'relatorios':
        return <ReportsView />;
      case 'usuarios':
        return <UsersView />;
      case 'configuracoes':
        return <SettingsView />;
      default:
        return <DashboardView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobileSidebar}
        setIsOpenMobile={setIsOpenMobileSidebar}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar
          activeTab={activeTab}
          establishment={establishment}
          onOpenMobileSidebar={() => setIsOpenMobileSidebar(true)}
        />

        <main className="flex-1 overflow-x-hidden">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
