import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Minus, Trash2, ShoppingBag, CreditCard,
  DollarSign, QrCode, CheckCircle2, Printer, User, AlertCircle
} from 'lucide-react';
import { Product, Category, OrderItem } from '../types';
import { api } from '../services/api';

export const PosView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Cart State
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState('Cliente Balcão');
  const [orderType, setOrderType] = useState<'balcao' | 'retirada' | 'entrega'>('balcao');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [changeFor, setChangeFor] = useState<number | undefined>(undefined);

  // Additional Modal State
  const [selectedProductForAdd, setSelectedProductForAdd] = useState<Product | null>(null);
  const [itemAdditionals, setItemAdditionals] = useState<{ groupTitle: string; itemName: string; price: number }[]>([]);
  const [itemObservation, setItemObservation] = useState('');

  // Checkout Success Modal State
  const [lastCreatedOrder, setLastCreatedOrder] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        api.getCategories(),
        api.getProducts()
      ]);
      setCategories(cats);
      setProducts(prods.filter(p => p.isActive));
    } catch (err) {
      console.error('Erro ao carregar produtos para o PDV:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleProductClick = (product: Product) => {
    if (product.additionalGroups && product.additionalGroups.length > 0) {
      setSelectedProductForAdd(product);
      setItemAdditionals([]);
      setItemObservation('');
    } else {
      addToCart(product, [], '');
    }
  };

  const addToCart = (product: Product, additionals: { groupTitle: string; itemName: string; price: number }[], observation: string) => {
    const additionalsTotal = additionals.reduce((acc, a) => acc + a.price, 0);
    const itemPrice = (product.promoPrice || product.price) + additionalsTotal;

    const existingIndex = cartItems.findIndex(
      item => item.productId === product.id &&
              JSON.stringify(item.additionals) === JSON.stringify(additionals) &&
              item.observation === observation
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      setCartItems(updated);
    } else {
      const newItem: OrderItem = {
        id: `pos_item_${Date.now()}_${Math.random()}`,
        productId: product.id,
        productName: product.name,
        price: itemPrice,
        quantity: 1,
        observation,
        additionals,
        status: 'pendente'
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...cartItems];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    setCartItems(updated);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  const handleFinishSale = async () => {
    if (cartItems.length === 0) {
      setErrorMessage('O carrinho está vazio.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        type: orderType,
        customerName: customerName || 'Cliente Balcão',
        items: cartItems,
        subtotal,
        discount,
        total,
        paymentMethod,
        changeFor: paymentMethod === 'Dinheiro' ? changeFor : undefined
      };

      const created = await api.createOrder(orderPayload);
      setLastCreatedOrder(created);
      setCartItems([]);
      setDiscount(0);
      setCustomerName('Cliente Balcão');
      setChangeFor(undefined);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao finalizar venda.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* Product Catalog Column */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* Search & Barcode Scan */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
          <Search className="w-5 h-5 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Buscar por nome ou código do produto (Ex: BUR01)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden py-2"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Todas ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredProducts.map(prod => (
            <button
              key={prod.id}
              onClick={() => handleProductClick(prod)}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-left shadow-2xs hover:border-rose-400 hover:shadow-md transition-all flex flex-col justify-between group h-full"
            >
              <div className="space-y-2 w-full">
                <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {prod.promoPrice && (
                    <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      PROMO
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-semibold text-slate-400">{prod.code}</span>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2">{prod.name}</h4>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between w-full">
                <span className="text-xs font-black text-rose-600">
                  R$ {(prod.promoPrice || prod.price).toFixed(2)}
                </span>
                <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  +
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Column */}
      <div className="w-full lg:w-96 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-[calc(100vh-6rem)] sticky top-20">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-800">Carrinho de Venda</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {cartItems.reduce((a, b) => a + b.quantity, 0)} itens
          </span>
        </div>

        {/* Customer & Type Selection */}
        <div className="py-3 border-b border-slate-100 space-y-2 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Nome do Cliente</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => setOrderType('balcao')}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                orderType === 'balcao' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Balcão
            </button>
            <button
              onClick={() => setOrderType('retirada')}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                orderType === 'retirada' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Retirada
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 scrollbar-thin">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <ShoppingBag className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-xs font-medium">Nenhum item selecionado.</p>
              <p className="text-[11px]">Clique em um produto ao lado para adicionar ao carrinho.</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-start justify-between text-xs">
                  <div className="font-bold text-slate-800">{item.productName}</div>
                  <div className="font-black text-rose-600">R$ {(item.price * item.quantity).toFixed(2)}</div>
                </div>

                {item.additionals.length > 0 && (
                  <div className="text-[10px] text-slate-500 space-y-0.5 pl-2 border-l-2 border-rose-200">
                    {item.additionals.map((add, aIdx) => (
                      <div key={aIdx}>+ {add.itemName} ({add.price > 0 ? `R$ ${add.price.toFixed(2)}` : 'Grátis'})</div>
                    ))}
                  </div>
                )}

                {item.observation && (
                  <div className="text-[10px] text-amber-700 italic">Obs: {item.observation}</div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">R$ {item.price.toFixed(2)}/un</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(idx, -1)}
                      className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-slate-800 w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(idx, 1)}
                      className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Payment Controls */}
        <div className="pt-3 border-t border-slate-200 space-y-3">
          {errorMessage && (
            <div className="p-2 bg-rose-50 text-rose-700 text-[11px] font-semibold rounded-lg flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Discounts */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">Desconto (R$):</span>
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-right font-bold text-slate-800 focus:outline-hidden"
            />
          </div>

          {/* Payment Method Tabs */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Forma de Pagamento</label>
            <div className="grid grid-cols-3 gap-1">
              {['Pix', 'Dinheiro', 'Cartao_Credito'].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    paymentMethod === method
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {method === 'Cartao_Credito' ? 'Cartão' : method}
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === 'Dinheiro' && (
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600">Troco para (R$):</span>
              <input
                type="number"
                placeholder="Ex: 50"
                value={changeFor || ''}
                onChange={(e) => setChangeFor(Number(e.target.value))}
                className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-right font-bold text-slate-800 focus:outline-hidden"
              />
            </div>
          )}

          {/* Totals & Submit */}
          <div className="p-3 bg-slate-900 rounded-xl text-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Subtotal:</span>
              <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-black pt-1 border-t border-slate-800">
              <span className="text-rose-400">TOTAL FINAL:</span>
              <span className="text-rose-400 text-lg">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleFinishSale}
            disabled={submitting || cartItems.length === 0}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-900/20 transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{submitting ? 'Gravando Venda...' : 'Finalizar Venda'}</span>
          </button>
        </div>
      </div>

      {/* Additionals Selection Modal */}
      {selectedProductForAdd && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{selectedProductForAdd.name}</h3>
                <p className="text-xs text-slate-500">{selectedProductForAdd.description}</p>
              </div>
              <button
                onClick={() => setSelectedProductForAdd(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Additionals Groups */}
            <div className="space-y-4">
              {selectedProductForAdd.additionalGroups?.map(group => (
                <div key={group.id} className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{group.title}</span>
                    {group.required && (
                      <span className="text-[10px] font-bold text-rose-600 uppercase bg-rose-50 px-1.5 py-0.5 rounded">
                        Obrigatório
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {group.items.map(item => {
                      const isSelected = itemAdditionals.some(
                        a => a.groupTitle === group.title && a.itemName === item.name
                      );

                      const handleToggle = () => {
                        if (isSelected) {
                          setItemAdditionals(itemAdditionals.filter(a => !(a.groupTitle === group.title && a.itemName === item.name)));
                        } else {
                          if (group.maxSelect === 1) {
                            // Replace in group
                            const filtered = itemAdditionals.filter(a => a.groupTitle !== group.title);
                            setItemAdditionals([...filtered, { groupTitle: group.title, itemName: item.name, price: item.price }]);
                          } else {
                            setItemAdditionals([...itemAdditionals, { groupTitle: group.title, itemName: item.name, price: item.price }]);
                          }
                        }
                      };

                      return (
                        <button
                          key={item.id}
                          onClick={handleToggle}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-rose-600 text-white font-semibold'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
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

              {/* Observation Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Observação do Item</label>
                <input
                  type="text"
                  placeholder="Ex: Sem cebola, pão bem passado..."
                  value={itemObservation}
                  onChange={(e) => setItemObservation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              onClick={() => {
                addToCart(selectedProductForAdd, itemAdditionals, itemObservation);
                setSelectedProductForAdd(null);
              }}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-rose-900/20"
            >
              Confirmar Adição ao Carrinho
            </button>
          </div>
        </div>
      )}

      {/* Sale Success / Receipt Printable Modal */}
      {lastCreatedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-800">Venda Realizada com Sucesso!</h3>
              <p className="text-xs text-slate-500">Pedido #{lastCreatedOrder.orderNumber} registrado no sistema</p>
            </div>

            {/* Simulated Printed Receipt View */}
            <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-left font-mono text-[11px] space-y-2 text-slate-800">
              <div className="text-center border-b border-slate-200 pb-2">
                <p className="font-bold">SABOR GOURMET - COMPROVANTE</p>
                <p className="text-[10px] text-slate-500">Data: {new Date(lastCreatedOrder.createdAt).toLocaleString('pt-BR')}</p>
              </div>

              <div className="space-y-1">
                {lastCreatedOrder.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.quantity}x {it.productName}</span>
                    <span>R$ {(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-2 font-bold flex justify-between text-xs">
                <span>TOTAL PAGO ({lastCreatedOrder.paymentMethod}):</span>
                <span>R$ {lastCreatedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Imprimir Comprovante
              </button>
              <button
                onClick={() => setLastCreatedOrder(null)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl"
              >
                Nova Venda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
