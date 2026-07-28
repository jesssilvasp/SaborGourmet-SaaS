import React, { useState, useEffect } from 'react';
import {
  UtensilsCrossed, ShoppingBag, Clock, MapPin, Search,
  Tag, ChevronRight, CheckCircle2, ArrowLeft, ShieldCheck, AlertCircle
} from 'lucide-react';
import { Establishment, Category, Product, Order } from '../types';
import { api } from '../services/api';

interface DigitalMenuViewProps {
  onGoToLanding?: () => void;
}

export const DigitalMenuView: React.FC<DigitalMenuViewProps> = ({ onGoToLanding }) => {
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Cart & Order Options
  const [cart, setCart] = useState<{
    product: Product;
    quantity: number;
    additionals: { groupTitle: string; itemName: string; price: number }[];
    observation: string;
    itemPrice: number;
  }[]>([]);

  const [orderType, setOrderType] = useState<'entrega' | 'retirada' | 'mesa'>('entrega');
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponError, setCouponError] = useState('');

  // Modals
  const [selectedProdForModal, setSelectedProdForModal] = useState<Product | null>(null);
  const [modalAdditionals, setModalAdditionals] = useState<{ groupTitle: string; itemName: string; price: number }[]>([]);
  const [modalObs, setModalObs] = useState('');
  const [modalQuantity, setModalQuantity] = useState(1);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const [est, cats, prods] = await Promise.all([
        api.getEstablishment(),
        api.getCategories(),
        api.getProducts()
      ]);
      setEstablishment(est);
      setCategories(cats);
      setProducts(prods.filter(p => p.isActive));

      // Check if URL has table parameter
      const params = new URLSearchParams(window.location.search);
      const mesa = params.get('mesa');
      if (mesa) {
        setTableNumber(mesa);
        setOrderType('mesa');
      }
    } catch (err) {
      console.error('Erro ao carregar o cardápio público:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProdForModal(product);
    setModalAdditionals([]);
    setModalObs('');
    setModalQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedProdForModal) return;

    const addsTotal = modalAdditionals.reduce((acc, a) => acc + a.price, 0);
    const unitPrice = (selectedProdForModal.promoPrice || selectedProdForModal.price) + addsTotal;

    setCart([
      ...cart,
      {
        product: selectedProdForModal,
        quantity: modalQuantity,
        additionals: modalAdditionals,
        observation: modalObs,
        itemPrice: unitPrice
      }
    ]);

    setSelectedProdForModal(null);
    setIsCartOpen(true);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.itemPrice * item.quantity, 0);
  const deliveryFee = orderType === 'entrega' ? (establishment?.deliveryFee || 0) : 0;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
    } else if (appliedCoupon.discountType === 'fixed') {
      discount = appliedCoupon.discountValue;
    } else if (appliedCoupon.discountType === 'free_delivery') {
      discount = deliveryFee;
    }
  }

  const total = Math.max(0, subtotal + deliveryFee - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    try {
      const c = await api.validateCoupon(couponCode, subtotal);
      setAppliedCoupon(c);
    } catch (err: any) {
      setCouponError(err.message || 'Cupom inválido.');
      setAppliedCoupon(null);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName || !customerPhone) {
      setSubmitError('Por favor, informe seu nome e telefone WhatsApp.');
      return;
    }
    if (orderType === 'entrega' && !customerAddress) {
      setSubmitError('Por favor, informe o endereço completo para entrega.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const orderPayload = {
        type: orderType,
        customerName,
        customerPhone,
        customerAddress: orderType === 'entrega' ? customerAddress : undefined,
        tableNumber: orderType === 'mesa' ? Number(tableNumber) : undefined,
        items: cart.map(c => ({
          productId: c.product.id,
          productName: c.product.name,
          price: c.itemPrice,
          quantity: c.quantity,
          observation: c.observation,
          additionals: c.additionals
        })),
        subtotal,
        discount,
        deliveryFee,
        total,
        paymentMethod
      };

      const newOrd = await api.createOrder(orderPayload);
      setPlacedOrder(newOrd);
      setCart([]);
      setIsCartOpen(false);
    } catch (err: any) {
      setSubmitError(err.message || 'Erro ao processar o pedido.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {onGoToLanding && (
        <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between border-b border-slate-800">
          <span className="font-bold text-slate-300">📱 Cardápio Digital do Cliente</span>
          <button
            onClick={onGoToLanding}
            className="text-rose-400 hover:text-rose-300 font-bold transition-colors"
          >
            &larr; Voltar para Página Inicial
          </button>
        </div>
      )}
      {/* Banner & Restaurant Info Header */}
      <div className="relative h-48 sm:h-64 bg-slate-900">
        <img
          src={establishment?.banner || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'}
          alt={establishment?.name}
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 max-w-5xl mx-auto flex items-end gap-4">
          <img
            src={establishment?.logo}
            alt={establishment?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-white shadow-xl object-cover bg-white"
            referrerPolicy="no-referrer"
          />
          <div className="text-white space-y-1">
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
              establishment?.isOpen ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {establishment?.isOpen ? 'Aberto Agora' : 'Fechado'}
            </span>
            <h1 className="text-lg sm:text-2xl font-black">{establishment?.name}</h1>
            <p className="text-xs text-slate-300 hidden sm:block">{establishment?.description}</p>
          </div>
        </div>
      </div>

      {/* Info Pills Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-2xs">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-rose-600" />
            <span>Tempo Médio: {establishment?.avgPreparationTime || 35} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-600" />
            <span>Taxa de Entrega: R$ {(establishment?.deliveryFee || 0).toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-rose-600" />
            <span>Pedido Mínimo: R$ {(establishment?.minOrder || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <main className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Search */}
        <div className="relative bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="O que você deseja saborear hoje?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent pl-10 pr-4 py-1.5 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Todos os Itens
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => handleOpenProduct(product)}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer flex gap-3 group"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 rounded-xl object-cover bg-slate-100 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="space-y-1">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-800 truncate">{product.name}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{product.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="font-black text-rose-600 text-sm">
                    R$ {(product.promoPrice || product.price).toFixed(2)}
                  </span>
                  <span className="px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-lg group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    Adicionar
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Cart Button */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between font-bold text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Ver Pedido ({cart.reduce((a, b) => a + b.quantity, 0)} itens)</span>
            </div>
            <span>R$ {total.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Item Customization Modal */}
      {selectedProdForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex gap-3">
                <img src={selectedProdForModal.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{selectedProdForModal.name}</h3>
                  <p className="text-xs text-rose-600 font-bold">R$ {(selectedProdForModal.promoPrice || selectedProdForModal.price).toFixed(2)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedProdForModal(null)} className="font-bold text-slate-400">✕</button>
            </div>

            {/* Additional Groups */}
            {selectedProdForModal.additionalGroups?.map(group => (
              <div key={group.id} className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{group.title}</span>
                  {group.required && <span className="text-[10px] text-rose-600 bg-rose-50 px-1 rounded">Obrigatório</span>}
                </div>
                <div className="space-y-1">
                  {group.items.map(item => {
                    const isSelected = modalAdditionals.some(a => a.groupTitle === group.title && a.itemName === item.name);
                    const toggle = () => {
                      if (isSelected) {
                        setModalAdditionals(modalAdditionals.filter(a => !(a.groupTitle === group.title && a.itemName === item.name)));
                      } else {
                        if (group.maxSelect === 1) {
                          setModalAdditionals([...modalAdditionals.filter(a => a.groupTitle !== group.title), { groupTitle: group.title, itemName: item.name, price: item.price }]);
                        } else {
                          setModalAdditionals([...modalAdditionals, { groupTitle: group.title, itemName: item.name, price: item.price }]);
                        }
                      }
                    };

                    return (
                      <button
                        key={item.id}
                        onClick={toggle}
                        className={`w-full flex justify-between p-2 rounded-lg text-xs font-medium transition-all ${
                          isSelected ? 'bg-rose-600 text-white font-semibold' : 'bg-white border text-slate-700'
                        }`}
                      >
                        <span>{item.name}</span>
                        <span>{item.price > 0 ? `+ R$ ${item.price.toFixed(2)}` : 'Grátis'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Obs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Observações do Pedido</label>
              <input
                type="text"
                placeholder="Ex: Retirar cebola, molho à parte..."
                value={modalObs}
                onChange={(e) => setModalObs(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden"
              />
            </div>

            {/* Quantity and Add */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white text-slate-800 font-bold flex items-center justify-center shadow-xs"
                >
                  -
                </button>
                <span className="font-bold text-xs text-slate-800">{modalQuantity}</span>
                <button
                  onClick={() => setModalQuantity(modalQuantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white text-slate-800 font-bold flex items-center justify-center shadow-xs"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="py-3 px-6 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-900/20"
              >
                Adicionar ao Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer & Checkout Form */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 space-y-4 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-rose-600" />
                  Seu Carrinho
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="font-bold text-slate-400">✕</button>
              </div>

              {submitError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Order Type Toggle */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setOrderType('entrega')}
                  className={`py-2 rounded-lg transition-colors ${orderType === 'entrega' ? 'bg-rose-600 text-white' : 'text-slate-600'}`}
                >
                  Entrega
                </button>
                <button
                  onClick={() => setOrderType('retirada')}
                  className={`py-2 rounded-lg transition-colors ${orderType === 'retirada' ? 'bg-rose-600 text-white' : 'text-slate-600'}`}
                >
                  Retirada
                </button>
                <button
                  onClick={() => setOrderType('mesa')}
                  className={`py-2 rounded-lg transition-colors ${orderType === 'mesa' ? 'bg-rose-600 text-white' : 'text-slate-600'}`}
                >
                  Na Mesa
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                {cart.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-800">{item.quantity}x {item.product.name}</span>
                      {item.additionals.length > 0 && (
                        <p className="text-[10px] text-slate-500">
                          + {item.additionals.map(a => a.itemName).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-rose-600">R$ {(item.itemPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Form details */}
              <form onSubmit={handleCheckout} className="space-y-3 text-xs pt-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ana Souza"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp de Contato</label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 99999-8888"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-hidden"
                  />
                </div>

                {orderType === 'entrega' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Endereço de Entrega</label>
                    <input
                      type="text"
                      required
                      placeholder="Rua, número, complemento, bairro"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-hidden"
                    />
                  </div>
                )}

                {orderType === 'mesa' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Número da Mesa</label>
                    <input
                      type="number"
                      required
                      placeholder="Ex: 2"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-hidden"
                    />
                  </div>
                )}

                {/* Coupon input */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cupom de Desconto</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: BEMVINDO10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono uppercase font-bold focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 bg-slate-800 text-white font-bold rounded-xl"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-rose-600 font-bold mt-1">{couponError}</p>}
                  {appliedCoupon && <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Cupom {appliedCoupon.code} aplicado!</p>}
                </div>

                {/* Payment method */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Forma de Pagamento</label>
                  <div className="grid grid-cols-3 gap-1.5 font-bold text-[11px]">
                    {['Pix', 'Dinheiro', 'Cartao_Credito'].map(pm => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setPaymentMethod(pm)}
                        className={`py-2 rounded-xl transition-all ${paymentMethod === pm ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
                      >
                        {pm === 'Cartao_Credito' ? 'Cartão' : pm}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>

            {/* Totals and submit */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {orderType === 'entrega' && (
                  <div className="flex justify-between text-slate-600">
                    <span>Taxa de Entrega:</span>
                    <span>R$ {deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Desconto:</span>
                    <span>- R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-rose-600 pt-1 border-t border-slate-200">
                  <span>TOTAL:</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={submitting}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-900/20 disabled:opacity-50"
              >
                {submitting ? 'Confirmando Pedido...' : 'Enviar Pedido ao Estabelecimento'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Order Tracking Modal */}
      {placedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-800">Pedido #{placedOrder.orderNumber} Recebido!</h3>
              <p className="text-xs text-slate-500">Acompanhe o andamento da sua refeição em tempo real</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-3 text-xs">
              <div className="font-bold text-slate-800 flex justify-between">
                <span>Status Atual:</span>
                <span className="uppercase text-rose-600 font-black">{placedOrder.status}</span>
              </div>

              <div className="space-y-2 relative border-l-2 border-rose-200 pl-3 ml-1">
                {placedOrder.timeline.map((t, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <p className="font-bold text-slate-800 text-[11px] capitalize">{t.status}</p>
                    <p className="text-[10px] text-slate-400">{new Date(t.timestamp).toLocaleTimeString('pt-BR')}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPlacedOrder(null)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl"
            >
              Fazer Outro Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
