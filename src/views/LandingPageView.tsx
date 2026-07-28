import React, { useState } from 'react';
import {
  Flame, Utensils, QrCode, Monitor, ShoppingBag, Grid,
  Calculator, Truck, ArrowRight, Check, Star, ShieldCheck,
  TrendingUp, Clock, ChevronRight, Zap, Play, Store, Lock,
  FileText, Users, DollarSign, Sparkles, ChefHat, Sliders,
  Award, Heart, RefreshCw, CheckCircle2, ChevronDown, Layers,
  Phone, Pizza, Coffee, Wine, ThumbsUp
} from 'lucide-react';

interface LandingPageViewProps {
  onEnterSystem: () => void;
  onGoToDigitalMenu: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterSystem,
  onGoToDigitalMenu
}) => {
  const [activeTab, setActiveTab] = useState<'pdv' | 'kds' | 'mesas' | 'menu'>('pdv');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Interactive Burger Builder State
  const [bun, setBun] = useState<'brioche' | 'australiano' | 'batata'>('brioche');
  const [meat, setMeat] = useState<'double_smash' | 'angus_200g' | 'plant_based'>('double_smash');
  const [cheese, setCheese] = useState<'cheddar' | 'prato' | 'gorgonzola'>('cheddar');
  const [side, setSide] = useState<'rustica' | 'crinkle' | 'rings'>('rustica');
  const [drink, setDrink] = useState<'shake' | 'soda' | 'refri'>('shake');

  // Calculate Combo Price
  const prices = {
    bun: { brioche: 0, australiano: 2, batata: 1 },
    meat: { double_smash: 24, angus_200g: 29, plant_based: 26 },
    cheese: { cheddar: 4, prato: 4, gorgonzola: 6 },
    side: { rustica: 14, crinkle: 16, rings: 15 },
    drink: { shake: 18, soda: 12, refri: 8 }
  };

  const currentComboTotal =
    prices.meat[meat] +
    prices.bun[bun] +
    prices.cheese[cheese] +
    prices.side[side] +
    prices.drink[drink];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Banner Notice - High Energy */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-red-700 text-white text-[11px] sm:text-xs font-black py-2 px-4 text-center flex items-center justify-center gap-2 shadow-md">
        <span className="bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full text-[10px] uppercase font-black animate-pulse">NOVO</span>
        <span>Módulo KDS Ultra-Rápido & Autoatendimento via QR Code na Mesa Ativos!</span>
        <button
          onClick={onEnterSystem}
          className="underline hover:text-amber-200 transition-colors ml-2 font-bold"
        >
          Acessar Sistema Agora &rarr;
        </button>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3.5 cursor-pointer group" onClick={onEnterSystem}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-600 to-red-600 flex items-center justify-center text-2xl shadow-lg shadow-amber-950/80 font-black border border-amber-400/30 group-hover:scale-105 transition-transform">
              🍔
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white block leading-none font-serif">
                Sabor<span className="text-amber-400">Gourmet</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-500/90 tracking-widest uppercase">
                PDV & GESTÃO DE LANCHONETES
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-stone-300">
            <a href="#recursos" className="hover:text-amber-400 transition-colors">Diferenciais</a>
            <a href="#cardapio-showcase" className="hover:text-amber-400 transition-colors">O Cardápio</a>
            <a href="#combo-builder" className="hover:text-amber-400 transition-colors">Simulador de Pedido</a>
            <a href="#demo" className="hover:text-amber-400 transition-colors">Telas Operacionais</a>
            <a href="#planos" className="hover:text-amber-400 transition-colors">Planos</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onGoToDigitalMenu}
              className="px-3.5 py-2.5 sm:px-4.5 sm:py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-amber-400 flex items-center gap-2 transition-all shadow-sm hover:border-amber-500/40"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Cardápio</span> Digital
            </button>

            <button
              onClick={onEnterSystem}
              className="px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-stone-950 text-xs font-black flex items-center gap-2 transition-all shadow-xl shadow-amber-950/80 hover:scale-[1.02]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acessar Painel</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - World-Class Diner Vibe */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-stone-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/40 via-stone-950 to-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-lg shadow-amber-950/50 backdrop-blur-md">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span>Inspirado nas Maiores Lanchonetes e Hamburguerias do Mundo</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            A Tecnologia Gastronômica que <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-red-500">Acelera Sua Cozinha e Dobra Suas Vendas</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-stone-300 max-w-3xl mx-auto leading-relaxed font-normal">
            PDV ultrarrápido para balcão e delivery, KDS sem papel para a chapa, autoatendimento por QR Code na mesa e gestão completa de caixa e estoque em tempo real.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onEnterSystem}
              className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-stone-950 font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-2xl shadow-amber-950/90 transition-all hover:scale-[1.03]"
            >
              <ChefHat className="w-5 h-5 text-stone-950" />
              <span>Acessar o Sistema Completo</span>
              <ArrowRight className="w-5 h-5 text-stone-950" />
            </button>

            <button
              onClick={onGoToDigitalMenu}
              className="w-full sm:w-auto px-8 py-4.5 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all hover:border-stone-700"
            >
              <QrCode className="w-5 h-5 text-amber-400" />
              <span>Ver Cardápio Público do Cliente</span>
            </button>
          </div>

          {/* Live Metrics Ticker */}
          <div className="pt-8 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80 backdrop-blur-sm">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">VELOCIDADE DO PDV</span>
              <p className="text-xl sm:text-2xl font-black text-amber-400">&lt; 2.5 seg</p>
              <p className="text-[11px] text-stone-400">Por pedido no balcão</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80 backdrop-blur-sm">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">REDUÇÃO DE ERROS</span>
              <p className="text-xl sm:text-2xl font-black text-rose-400">99.4%</p>
              <p className="text-[11px] text-stone-400">Com KDS na cozinha</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80 backdrop-blur-sm">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">TICKET MÉDIO</span>
              <p className="text-xl sm:text-2xl font-black text-emerald-400">+28%</p>
              <p className="text-[11px] text-stone-400">Com QR Code na mesa</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800/80 backdrop-blur-sm">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">SATISFAÇÃO</span>
              <p className="text-xl sm:text-2xl font-black text-amber-300">4.9 ★★★★★</p>
              <p className="text-[11px] text-stone-400">Mais de 1.200 lanchonetes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gastronomic Craft Showcase Section */}
      <section id="cardapio-showcase" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
            DESIGN SENSORIAL & ALTA GASTRONOMIA
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            A Experiência Visual que Faz o Cliente Babar
          </h2>
          <p className="text-sm sm:text-base text-stone-400 max-w-2xl mx-auto">
            Fotos em alta resolução, opções personalizadas de adicionais e interface limpa que destaca seus melhores pratos.
          </p>
        </div>

        {/* Mouth-watering Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 - Smash Burger */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 group">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
                alt="Smash Burger Duplo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-3 right-3 bg-amber-500 text-stone-950 font-black text-xs px-2.5 py-1 rounded-full shadow-md">
                CAMPEÃO DE VENDAS
              </span>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-base text-white">Smash Burger Duplo Premium</h3>
                <span className="text-amber-400 font-mono font-black text-sm">R$ 32,90</span>
              </div>
              <p className="text-xs text-stone-400 line-clamp-2">
                2x Blends Smash 80g na chapa bem crostados, cheddar americano derretido, cebola caramelizada e molho secreto no pão brioche amanteigado.
              </p>
              <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-[11px] text-stone-400">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Flame className="w-3.5 h-3.5" /> Chapa 220°C
                </span>
                <span>Preparo: ~ 8 min</span>
              </div>
            </div>
          </div>

          {/* Card 2 - Fries */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 group">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80"
                alt="Batata Rústica Trufada"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 font-bold text-xs px-2.5 py-1 rounded-full">
                ACOMPANHAMENTO
              </span>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-base text-white">Batata Rústica Alecrim & Bacon</h3>
                <span className="text-amber-400 font-mono font-black text-sm">R$ 19,90</span>
              </div>
              <p className="text-xs text-stone-400 line-clamp-2">
                Batatas corte rústico crocantes, temperadas com sal marinho, alecrim fresco, farofa de bacon artesanal e maionese da casa.
              </p>
              <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-[11px] text-stone-400">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> Dica de Harmonização
                </span>
                <span>Porção 350g</span>
              </div>
            </div>
          </div>

          {/* Card 3 - Milkshake */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 group">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80"
                alt="Milkshake Artesanal"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-3 right-3 bg-rose-500 text-white font-bold text-xs px-2.5 py-1 rounded-full">
                SOBREMESA
              </span>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-base text-white">Shake Pistache & Nutella 500ml</h3>
                <span className="text-amber-400 font-mono font-black text-sm">R$ 24,90</span>
              </div>
              <p className="text-xs text-stone-400 line-clamp-2">
                Sorvete fava de baunilha batido com pasta italiana de pistache puro, ganache de Nutella e crocante de praliné.
              </p>
              <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-[11px] text-stone-400">
                <span className="flex items-center gap-1 text-rose-400 font-bold">
                  <Heart className="w-3.5 h-3.5 fill-rose-400" /> Favorito das Famílias
                </span>
                <span>Creamy Shake</span>
              </div>
            </div>
          </div>

          {/* Card 4 - Pizza */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 group">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
                alt="Pizza Napolitana artesanal"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute top-3 right-3 bg-amber-500 text-stone-950 font-black text-xs px-2.5 py-1 rounded-full">
                FORNO A LENHA
              </span>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-base text-white">Pizza Pepperoni & Stracciatella</h3>
                <span className="text-amber-400 font-mono font-black text-sm">R$ 54,90</span>
              </div>
              <p className="text-xs text-stone-400 line-clamp-2">
                Massa de fermentação natural 48h, molho de tomate San Marzano, muçarela fior di latte, pepperoni artesanal e manjericão fresco.
              </p>
              <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-[11px] text-stone-400">
                <span className="flex items-center gap-1 text-red-400 font-bold">
                  <Flame className="w-3.5 h-3.5" /> Forno 450°C
                </span>
                <span>Tamanho M (30cm)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Combo Builder Simulator */}
      <section id="combo-builder" className="py-20 bg-stone-900/60 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
              SIMULADOR INTERATIVO DE PEDIDO
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Monte o Combo Perfeito
            </h2>
            <p className="text-sm sm:text-base text-stone-400 max-w-xl mx-auto">
              Veja como o sistema aceita modificadores, adicionais e calcula o valor total instantaneamente para o garçom ou cliente.
            </p>
          </div>

          <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Options Selector */}
            <div className="lg:col-span-7 space-y-6">
              {/* Option 1: Pão */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-black">1</span>
                  <span>Escolha o Pão Artesanal</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'brioche', name: 'Brioche Dourado', desc: 'Macio e amanteigado' },
                    { id: 'australiano', name: 'Australiano', desc: 'Levemente adocicado (+$2)' },
                    { id: 'batata', name: 'Pão de Batata', desc: 'Fofinho e leve (+$1)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setBun(item.id as any)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        bun === item.id
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-md'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <p className="font-bold text-xs">{item.name}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Carne */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-black">2</span>
                  <span>Escolha o Blend de Carne</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'double_smash', name: 'Double Smash 160g', desc: 'Crosta perfeita' },
                    { id: 'angus_200g', name: 'Angus Prime 200g', desc: 'Suaulento (+$5)' },
                    { id: 'plant_based', name: 'Plant-Based 150g', desc: '100% Vegetal (+$2)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setMeat(item.id as any)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        meat === item.id
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-md'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <p className="font-bold text-xs">{item.name}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Acompanhamento & Bebida */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-black">3</span>
                    <span>Acompanhamento</span>
                  </label>
                  <select
                    value={side}
                    onChange={(e) => setSide(e.target.value as any)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="rustica">Batata Rústica Alecrim (R$ 14,00)</option>
                    <option value="crinkle">Crinkle Fries c/ Trufa (R$ 16,00)</option>
                    <option value="rings">Onion Rings Crocantes (R$ 15,00)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-black">4</span>
                    <span>Bebida Gelada</span>
                  </label>
                  <select
                    value={drink}
                    onChange={(e) => setDrink(e.target.value as any)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="shake">Milkshake de Pistache (R$ 18,00)</option>
                    <option value="soda">Soda Artesanal Maçã Verde (R$ 12,00)</option>
                    <option value="refri">Refrigerante Lata 350ml (R$ 8,00)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Live Order Ticket Summary */}
            <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ReceiptIcon className="w-5 h-5 text-amber-400" />
                    <span className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                      SIMULAÇÃO DE COMANDA #208
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold">
                    PDV REALTIME
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-stone-200">
                    <span>1x Burger Personalizado</span>
                    <span className="font-mono font-bold">R$ {prices.meat[meat] + prices.bun[bun] + prices.cheese[cheese]},00</span>
                  </div>
                  <div className="pl-3 border-l-2 border-stone-800 text-[11px] text-stone-400 space-y-0.5">
                    <p>• Pão: {bun === 'brioche' ? 'Brioche' : bun === 'australiano' ? 'Australiano' : 'Batata'}</p>
                    <p>• Blend: {meat === 'double_smash' ? 'Double Smash' : meat === 'angus_200g' ? 'Angus Prime' : 'Plant-Based'}</p>
                    <p>• Queijo: Cheddar Americano Derretido</p>
                  </div>

                  <div className="flex justify-between text-stone-200 pt-1">
                    <span>1x {side === 'rustica' ? 'Batata Rústica' : side === 'crinkle' ? 'Crinkle Fries' : 'Onion Rings'}</span>
                    <span className="font-mono font-bold">R$ {prices.side[side]},00</span>
                  </div>

                  <div className="flex justify-between text-stone-200">
                    <span>1x {drink === 'shake' ? 'Shake Pistache' : drink === 'soda' ? 'Soda Artesanal' : 'Refrigerante'}</span>
                    <span className="font-mono font-bold">R$ {prices.drink[drink]},00</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-stone-400">Total do Combo:</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    R$ {currentComboTotal},00
                  </span>
                </div>

                <button
                  onClick={onEnterSystem}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-stone-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-950/80"
                >
                  <Zap className="w-4 h-4 fill-stone-950" />
                  <span>Testar Lançamento no PDV</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Operational Demo Section */}
      <section id="demo" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
            ENGENHARIA OPERACIONAL
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Telas Desenhadas para Altíssima Demanda
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
            Sem telas travadas, sem menus confusos. Ergonomia visual máxima para garçons, caixas e chapeiros.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {[
            { id: 'pdv', label: 'PDV Balcão & Delivery', icon: ShoppingBag, color: 'text-amber-400' },
            { id: 'kds', label: 'KDS Monitor Cozinha', icon: Flame, color: 'text-rose-400' },
            { id: 'mesas', label: 'Mapa de Mesas & Comandas', icon: Grid, color: 'text-emerald-400' },
            { id: 'menu', label: 'Autoatendimento QR Code', icon: QrCode, color: 'text-cyan-400' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-950/80'
                    : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mockup Frame */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-[11px] text-stone-400">
                https://sabor-gourmet.app/{activeTab}
              </span>
            </div>
            <button
              onClick={onEnterSystem}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-[11px] rounded-xl shadow-md"
            >
              Abrir no Sistema Real
            </button>
          </div>

          {/* Tab 1: PDV */}
          {activeTab === 'pdv' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="md:col-span-2 space-y-3 bg-stone-950 p-4 rounded-2xl border border-stone-800">
                <div className="flex justify-between items-center font-bold text-stone-300">
                  <span>🍔 Categorias em Destaque</span>
                  <span className="text-amber-400 font-mono text-[11px]">18 itens cadastrados</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { name: 'Smash Duplo Bacon', price: 'R$ 32,90', icon: '🍔' },
                    { name: 'X-Salada Especial', price: 'R$ 24,00', icon: '🥪' },
                    { name: 'Pizza Pepperoni M', price: 'R$ 54,90', icon: '🍕' },
                    { name: 'Batata Rústica Alecrim', price: 'R$ 19,90', icon: '🍟' },
                    { name: 'Shake de Pistache', price: 'R$ 24,90', icon: '🥤' },
                    { name: 'Soda Maçã Verde', price: 'R$ 12,00', icon: '🍹' }
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      onClick={onEnterSystem}
                      className="p-3 bg-stone-900 rounded-xl border border-stone-800 font-bold text-stone-200 hover:border-amber-500 cursor-pointer flex items-center justify-between transition-all hover:bg-stone-800/80"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{p.icon}</span>
                        <span>{p.name}</span>
                      </div>
                      <span className="text-amber-400 font-mono font-black">{p.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                    <h4 className="font-bold text-white">Comanda Atual #104</h4>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded font-bold">BALCÃO</span>
                  </div>
                  <div className="space-y-2 py-3 text-xs">
                    <div className="flex justify-between text-stone-300">
                      <span>1x Smash Duplo Bacon</span>
                      <span className="font-mono">R$ 32,90</span>
                    </div>
                    <div className="flex justify-between text-stone-300">
                      <span>1x Batata Rústica Alecrim</span>
                      <span className="font-mono">R$ 19,90</span>
                    </div>
                    <div className="flex justify-between text-stone-300">
                      <span>1x Coca Zero 350ml</span>
                      <span className="font-mono">R$ 7,50</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800 space-y-2">
                  <div className="flex justify-between text-sm font-black text-amber-400 font-mono">
                    <span>Subtotal:</span>
                    <span>R$ 60,30</span>
                  </div>
                  <button onClick={onEnterSystem} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all shadow-md">
                    Pagamento Instantâneo (Pix / Card)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: KDS */}
          {activeTab === 'kds' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3.5 bg-stone-950 rounded-2xl border border-amber-500/80 space-y-2.5">
                <div className="flex justify-between font-mono font-bold text-amber-400 bg-stone-900 p-2 rounded-xl">
                  <span>#102 • MESA 04</span>
                  <span className="flex items-center gap-1 text-amber-400"><Clock className="w-3 h-3" /> 06 min</span>
                </div>
                <div className="space-y-1.5 text-stone-200">
                  <p className="font-bold">2x Smash Duplo Bacon</p>
                  <p className="text-[10px] text-amber-300 bg-amber-950/60 border border-amber-800/60 p-1.5 rounded-lg">
                    Obs: Sem cebola, pão australiano
                  </p>
                  <p className="font-bold">1x Batata Rústica Alecrim</p>
                </div>
                <button onClick={onEnterSystem} className="w-full py-2 bg-amber-500 text-stone-950 font-black rounded-xl text-[11px] shadow-sm">
                  Iniciar Preparo
                </button>
              </div>

              <div className="p-3.5 bg-stone-950 rounded-2xl border border-rose-600/80 space-y-2.5">
                <div className="flex justify-between font-mono font-bold text-rose-400 bg-stone-900 p-2 rounded-xl">
                  <span>#101 • DELIVERY</span>
                  <span className="text-rose-500 font-bold animate-pulse flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 22 min!
                  </span>
                </div>
                <div className="space-y-1.5 text-stone-200">
                  <p className="font-bold">1x Pizza Pepperoni M</p>
                  <p className="text-[10px] text-emerald-400 bg-emerald-950/60 p-1 rounded">+ Borda Recheada Catupiry</p>
                  <p className="font-bold">1x Shake Pistache</p>
                </div>
                <button onClick={onEnterSystem} className="w-full py-2 bg-rose-600 text-white font-black rounded-xl text-[11px] shadow-sm">
                  Marcar como Pronto!
                </button>
              </div>

              <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 space-y-2.5">
                <div className="flex justify-between font-mono font-bold text-stone-400 bg-stone-900 p-2 rounded-xl">
                  <span>#103 • BALCÃO</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 02 min</span>
                </div>
                <div className="space-y-1.5 text-stone-200">
                  <p className="font-bold">1x Soda Artesanal Maçã</p>
                  <p className="font-bold">1x X-Salada Especial</p>
                </div>
                <button onClick={onEnterSystem} className="w-full py-2 bg-stone-800 text-stone-300 font-bold rounded-xl text-[11px]">
                  Aguardando Cozinha
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Mesas */}
          {activeTab === 'mesas' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-emerald-400 text-xs">MESA 01</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="font-bold text-white text-sm">Disponível</p>
                <p className="text-[10px] text-stone-400">Capacidade: 4 pessoas</p>
              </div>

              <div className="p-3.5 bg-rose-950/30 border border-rose-500/40 rounded-2xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-rose-400 text-xs">MESA 02</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                </div>
                <p className="font-bold text-white text-sm">Ocupada (Família Silva)</p>
                <p className="text-rose-400 font-black font-mono">R$ 184,50 (3 itens)</p>
              </div>

              <div className="p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-2xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-amber-400 text-xs">MESA 03</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <p className="font-bold text-white text-sm">Reservada (20:30h)</p>
                <p className="text-[10px] text-stone-400">Capacidade: 2 pessoas</p>
              </div>

              <div className="p-3.5 bg-violet-950/30 border border-violet-500/40 rounded-2xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-violet-400 text-xs">MESA 04</span>
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                </div>
                <p className="font-bold text-white text-sm">Aguardando Fechamento</p>
                <p className="text-violet-300 font-black font-mono">R$ 128,00 (Divisão 2p)</p>
              </div>
            </div>
          )}

          {/* Tab 4: QR Code Menu */}
          {activeTab === 'menu' && (
            <div className="p-5 bg-stone-950 rounded-2xl border border-stone-800 space-y-4 text-xs max-w-md mx-auto text-center">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
                <QrCode className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold text-[10px]">
                  MESA #05 DETECTADA AUTOMATICAMENTE
                </span>
                <h4 className="font-black text-white text-lg">Cardápio Digital Interativo</h4>
                <p className="text-[11px] text-stone-400">O cliente lê o QR Code, monta o pedido e manda direto pra cozinha!</p>
              </div>
              <button
                onClick={onGoToDigitalMenu}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-stone-950 font-black rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <QrCode className="w-4 h-4 text-stone-950" />
                <span>Testar Visão do Cliente Agora</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose SaborGourmet - Feature Modules */}
      <section id="recursos" className="py-20 border-t border-stone-900 bg-stone-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
              DIFERENCIAIS EXCLUSIVOS
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Feito para Simplificar a Vida do Dono de Lanchonete
            </h2>
            <p className="text-sm text-stone-400 max-w-xl mx-auto">
              Controle total da operação sem planilhas complicadas ou sistemas lentos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">PDV Frente de Caixa Ultra Rápido</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Atendimento presencial e delivery com suporte a atalhos de teclado, adicionais, troco rápido e emissão de cupons de ficha.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">KDS Cozinha sem Papel</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Monitores coloridos por setor (Chapa, Fritadeira, Pizzaria, Bar) com alertas visuais de tempo limite de preparo.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Grid className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Gestão de Salão & Calculadora de Conta</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Mapa tátil das mesas, comanda individual por cliente e calculadora automática de divisão igualitária da conta.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Autoatendimento QR Code Mesa</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Elimine filas no balcão. Os clientes fazem o pedido via smartphone e recebem os lanches diretamente na mesa.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Controle de Caixa Cego & Sangria</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Registro rigoroso de abertura, reforço, sangrias e fechamento de caixa cego com auditoria para evitar divergências.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Estoque com Alerta & DRE Realtime</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Baixa de insumos por produto vendido, alerta de estoque crítico e relatórios financeiros completos com curva ABC.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparative Table: Traditional vs SaborGourmet */}
      <section className="py-20 border-t border-stone-900 bg-stone-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
              POR QUE MUDAR HOJE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Sistemas Antigos vs. SaborGourmet
            </h2>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl text-xs">
            <div className="grid grid-cols-12 bg-stone-950 p-4 border-b border-stone-800 font-bold text-stone-300">
              <div className="col-span-5 sm:col-span-4">Funcionalidade</div>
              <div className="col-span-3 sm:col-span-4 text-stone-500">Comandas de Papel / Sistemas Antigos</div>
              <div className="col-span-4 sm:col-span-4 text-amber-400 font-black flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> SaborGourmet
              </div>
            </div>

            <div className="divide-y divide-stone-800/80">
              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 sm:col-span-4 font-bold text-white">Velocidade no Balcão</div>
                <div className="col-span-3 sm:col-span-4 text-stone-400">Demora (15 a 30 seg)</div>
                <div className="col-span-4 sm:col-span-4 text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> &lt; 2.5 segundos por pedido
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 sm:col-span-4 font-bold text-white">Comunicação c/ Cozinha</div>
                <div className="col-span-3 sm:col-span-4 text-stone-400">Papel rasgado/Perda de ticket</div>
                <div className="col-span-4 sm:col-span-4 text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Tela KDS Instantânea
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 sm:col-span-4 font-bold text-white">Pedidos no Salão</div>
                <div className="col-span-3 sm:col-span-4 text-stone-400">Garçom precisa ir e voltar</div>
                <div className="col-span-4 sm:col-span-4 text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Autoatendimento QR Code
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 sm:col-span-4 font-bold text-white">Fechamento de Caixa</div>
                <div className="col-span-3 sm:col-span-4 text-stone-400">Lento e sujeito a rasuras</div>
                <div className="col-span-4 sm:col-span-4 text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Auditoria de Caixa Cego
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20 border-t border-stone-900 bg-stone-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
              INVESTIMENTO TRANSPARENTE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">Planos que Cabem no seu Bolso</h2>
            <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
              Sem fidelidade obrigatória, sem cobrança de comissão por pedido e suporte em português.
            </p>

            {/* Billing Cycle Selector */}
            <div className="pt-4 flex justify-center">
              <div className="bg-stone-900 p-1 rounded-2xl border border-stone-800 flex items-center gap-1 text-xs">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Cobrança Mensal
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    billingCycle === 'yearly'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <span>Anual (Economize 20%)</span>
                  <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase font-black">POPULAR</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Plan 1 */}
            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Lanchonete Início</span>
                  <h3 className="text-xl font-black text-white">Plano Start</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    R$ {billingCycle === 'yearly' ? '71' : '89'}
                  </span>
                  <span className="text-xs text-stone-400">/mês</span>
                </div>
                <ul className="space-y-2.5 text-xs text-stone-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>PDV Balcão & Delivery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Cardápio Digital QR Code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Controle de Caixa Básico</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onEnterSystem}
                className="w-full py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs transition-all"
              >
                Acessar & Testar Grátis
              </button>
            </div>

            {/* Plan 2 - Highlighted */}
            <div className="p-6 rounded-3xl bg-stone-900 border-2 border-amber-500 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-amber-950/50">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-950 px-4 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-md">
                MAIS POPULAR
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Hamburguerias & Gastronomia</span>
                  <h3 className="text-xl font-black text-white">Plano Profissional</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">
                    R$ {billingCycle === 'yearly' ? '135' : '169'}
                  </span>
                  <span className="text-xs text-stone-400">/mês</span>
                </div>
                <ul className="space-y-2.5 text-xs text-stone-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>PDV + KDS Cozinha Ilimitado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Mapa de Mesas e Comandas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Gestão de Estoque e Insumos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Calculadora de Divisão de Contas</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterSystem}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-stone-950 font-black text-xs shadow-lg shadow-amber-950/80 transition-all hover:scale-[1.02]"
              >
                Acessar Módulos Completos
              </button>
            </div>

            {/* Plan 3 */}
            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Redes & Franquias</span>
                  <h3 className="text-xl font-black text-white">Plano Multi-Lojas</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    R$ {billingCycle === 'yearly' ? '239' : '299'}
                  </span>
                  <span className="text-xs text-stone-400">/mês</span>
                </div>
                <ul className="space-y-2.5 text-xs text-stone-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Tudo do Plano Profissional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Multi-operadores e Cargos Custom</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Exportação de Relatórios CSV/PDF</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onEnterSystem}
                className="w-full py-3.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs transition-all"
              >
                Acessar Sistema
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-stone-900 bg-stone-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
              CASOS DE SUCESSO REAL
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Quem Testou, Aprovou</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
              <div className="flex text-amber-400 gap-1 text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-stone-300 italic leading-relaxed">
                "O KDS na chapa reduziu nosso tempo médio de preparo dos Smash Burgers de 22 para 9 minutos. Nossos chapeiros amaram a tela escura e legível."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">
                  MO
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Marcelo Oliveira</p>
                  <p className="text-[10px] text-stone-500">Chef & Proprietário • Smash House SP</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
              <div className="flex text-amber-400 gap-1 text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-stone-300 italic leading-relaxed">
                "A calculadora de divisão de contas no mapa de mesas eliminou a dor de cabeça dos garçons nos finais de semana com mesas grandes."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-black text-xs">
                  CP
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Camila Prado</p>
                  <p className="text-[10px] text-stone-500">Gerente • Cantina & Diner Bella</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
              <div className="flex text-amber-400 gap-1 text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-stone-300 italic leading-relaxed">
                "Os clientes ficaram encantados com as fotos em HD do cardápio via QR Code. O ticket médio dos pedidos na mesa subiu 28%!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-xs">
                  RS
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Renato Santos</p>
                  <p className="text-[10px] text-stone-500">Fundador • Craft Burger Bar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Hero Banner */}
      <section className="py-16 bg-gradient-to-r from-amber-600 via-rose-600 to-red-700 text-stone-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Pronto para Transformar a Gestão da Sua Lanchonete?
          </h2>
          <p className="text-sm sm:text-base text-amber-100 max-w-2xl mx-auto font-medium">
            Junte-se a centenas de estabelecimentos gastronômicos que já aceleraram suas vendas e organizaram sua cozinha.
          </p>
          <div className="pt-2">
            <button
              onClick={onEnterSystem}
              className="px-8 py-4 bg-stone-950 hover:bg-stone-900 text-amber-400 font-black text-sm rounded-2xl shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <Zap className="w-5 h-5 fill-amber-400" />
              <span>Acessar Painel do Sistema Agora</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-stone-950 py-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-base">
              🍔
            </div>
            <div>
              <span className="font-bold text-stone-300 block">SaborGourmet Gestão Gastronômica</span>
              <span className="text-[10px] text-stone-600">Frente de Caixa, KDS & Autoatendimento</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-semibold text-stone-400">
            <button onClick={onGoToDigitalMenu} className="hover:text-amber-400 transition-colors">
              Cardápio Digital
            </button>
            <button onClick={onEnterSystem} className="hover:text-amber-400 transition-colors">
              Acessar Painel
            </button>
          </div>

          <p className="text-[11px] text-stone-600">
            &copy; {new Date().getFullYear()} SaborGourmet. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Internal Helper Receipt Icon
function ReceiptIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6" />
      <path d="M16 12h-6" />
      <path d="M16 16h-6" />
    </svg>
  );
}
