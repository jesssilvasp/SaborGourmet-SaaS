import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'gerente' | 'atendente' | 'garcom' | 'cozinha' | 'caixa' | 'entregador' | 'cliente';
  phone?: string;
  cpf?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Establishment {
  id: string;
  name: string;
  logo: string;
  banner: string;
  description: string;
  cnpj: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  openingHours: string;
  deliveryFee: number;
  minOrder: number;
  avgPreparationTime: number; // minutes
  isOpen: boolean;
  themeColor: string;
  currency: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface AdditionalItem {
  id: string;
  name: string;
  price: number;
}

export interface AdditionalGroup {
  id: string;
  title: string;
  required: boolean;
  minSelect: number;
  maxSelect: number;
  items: AdditionalItem[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  costPrice: number;
  categoryId: string;
  image: string;
  code: string;
  prepTime: number;
  stock: number;
  minStock: number;
  unit: string;
  isActive: boolean;
  isFeatured: boolean;
  additionalGroups?: AdditionalGroup[];
  ingredients?: { ingredientId: string; name: string; quantity: number; unit: string }[];
}

export interface Table {
  id: string;
  number: number;
  name: string;
  seats: number;
  status: 'disponivel' | 'ocupada' | 'reservada' | 'aguardando_fechamento';
  currentOrderId?: string;
  waiterName?: string;
  customerName?: string;
  qrCodeUrl?: string;
}

export interface OrderItemAdditional {
  groupTitle: string;
  itemName: string;
  price: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  observation?: string;
  additionals: OrderItemAdditional[];
  sector?: 'cozinha' | 'chapa' | 'bar' | 'pizzaria' | 'geral';
  status: 'pendente' | 'em_preparo' | 'pronto';
}

export interface Order {
  id: string;
  orderNumber: number;
  type: 'balcao' | 'mesa' | 'comanda' | 'retirada' | 'entrega';
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  tableNumber?: number;
  waiterName?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  paymentMethod: string; // Dinheiro, Pix, Cartao_Debito, Cartao_Credito, Dividido
  paymentStatus: 'pendente' | 'pago' | 'estornado';
  changeFor?: number;
  status: 'novo' | 'confirmado' | 'em_preparo' | 'pronto' | 'saiu_entrega' | 'concluido' | 'cancelado';
  cancelReason?: string;
  driverName?: string;
  createdAt: string;
  updatedAt: string;
  timeline: { status: string; timestamp: string; note?: string }[];
}

export interface CashRegister {
  id: string;
  openedAt: string;
  closedAt?: string;
  openedBy: string;
  closedBy?: string;
  initialCash: number;
  currentCash: number;
  status: 'aberto' | 'fechado';
  movements: {
    id: string;
    type: 'entrada' | 'saida' | 'sangria' | 'suprimento' | 'venda';
    amount: number;
    description: string;
    method?: string;
    timestamp: string;
    createdBy: string;
  }[];
  closingSummary?: {
    totalSales: number;
    salesByMethod: Record<string, number>;
    expectedCash: number;
    countedCash: number;
    difference: number;
    notes?: string;
  };
}

export interface StockItem {
  id: string;
  name: string;
  unit: string; // kg, g, un, L, ml
  currentQuantity: number;
  minQuantity: number;
  costPerUnit: number;
  supplier: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_delivery';
  discountValue: number;
  minOrderValue: number;
  isActive: boolean;
  usedCount: number;
  maxUses: number;
  validUntil: string;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  dueDate: string;
  status: 'pendente' | 'pago';
  paymentDate?: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  status: 'disponivel' | 'em_entrega' | 'indisponivel';
  completedDeliveries: number;
}

export interface AuditLog {
  id: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface DBData {
  establishment: Establishment;
  users: User[];
  categories: Category[];
  products: Product[];
  tables: Table[];
  orders: Order[];
  cashRegisters: CashRegister[];
  stockItems: StockItem[];
  coupons: Coupon[];
  expenses: Expense[];
  drivers: Driver[];
  auditLogs: AuditLog[];
  nextOrderNumber: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getDefaultData(): DBData {
  const adminPasswordHash = bcrypt.hashSync('admin123', 8);
  const gerentePasswordHash = bcrypt.hashSync('gerente123', 8);
  const caixaPasswordHash = bcrypt.hashSync('caixa123', 8);
  const garcomPasswordHash = bcrypt.hashSync('garcom123', 8);
  const cozinhaPasswordHash = bcrypt.hashSync('cozinha123', 8);
  const entregadorPasswordHash = bcrypt.hashSync('entregador123', 8);

  const now = new Date().toISOString();

  return {
    establishment: {
      id: 'est_1',
      name: 'Burger & Pizza Gourmet',
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
      banner: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      description: 'As melhores hamburguerias, pizzas artesanais, porções e bebidas geladas da região!',
      cnpj: '12.345.678/0001-90',
      phone: '(11) 98765-4321',
      whatsapp: '5511987654321',
      email: 'contato@burgerpizzagourmet.com.br',
      address: {
        street: 'Av. Paulista',
        number: '1500',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-200',
      },
      openingHours: 'Ter a Dom: 18:00 às 23:30',
      deliveryFee: 7.50,
      minOrder: 25.00,
      avgPreparationTime: 35,
      isOpen: true,
      themeColor: '#e11d48',
      currency: 'BRL',
    },
    users: [
      { id: 'u_1', name: 'Administrador Principal', email: 'admin@restaurante.com', passwordHash: adminPasswordHash, role: 'admin', phone: '(11) 99999-1111', isActive: true, createdAt: now },
      { id: 'u_2', name: 'Carlos Gerente', email: 'gerente@restaurante.com', passwordHash: gerentePasswordHash, role: 'gerente', phone: '(11) 99999-2222', isActive: true, createdAt: now },
      { id: 'u_3', name: 'Mariana Caixa', email: 'caixa@restaurante.com', passwordHash: caixaPasswordHash, role: 'caixa', phone: '(11) 99999-3333', isActive: true, createdAt: now },
      { id: 'u_4', name: 'Roberto Garçom', email: 'garcom@restaurante.com', passwordHash: garcomPasswordHash, role: 'garcom', phone: '(11) 99999-4444', isActive: true, createdAt: now },
      { id: 'u_5', name: 'Chef João Cozinha', email: 'cozinha@restaurante.com', passwordHash: cozinhaPasswordHash, role: 'cozinha', phone: '(11) 99999-5555', isActive: true, createdAt: now },
      { id: 'u_6', name: 'Paulo Entregador', email: 'entregador@restaurante.com', passwordHash: entregadorPasswordHash, role: 'entregador', phone: '(11) 99999-6666', isActive: true, createdAt: now },
    ],
    categories: [
      { id: 'cat_1', name: 'Hambúrgueres Artesanais', icon: 'Burger', order: 1, isActive: true },
      { id: 'cat_2', name: 'Pizzas Especiais', icon: 'Pizza', order: 2, isActive: true },
      { id: 'cat_3', name: 'Porções & Acompanhamentos', icon: 'Fries', order: 3, isActive: true },
      { id: 'cat_4', name: 'Bebidas & Sucos', icon: 'Drink', order: 4, isActive: true },
      { id: 'cat_5', name: 'Sobremesas', icon: 'Dessert', order: 5, isActive: true },
      { id: 'cat_6', name: 'Combos Promocionais', icon: 'Tag', order: 6, isActive: true },
    ],
    products: [
      {
        id: 'prod_1',
        name: 'Smash Burger Bacon Supreme',
        description: 'Dois discos de 90g de blend angus, cheddar fatiado, bacon crocante em dobro e molho da casa no pão brioche.',
        price: 34.90,
        promoPrice: 29.90,
        costPrice: 12.50,
        categoryId: 'cat_1',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        code: 'BUR01',
        prepTime: 15,
        stock: 50,
        minStock: 10,
        unit: 'un',
        isActive: true,
        isFeatured: true,
        additionalGroups: [
          {
            id: 'g_1',
            title: 'Ponto da Carne',
            required: true,
            minSelect: 1,
            maxSelect: 1,
            items: [
              { id: 'i_1', name: 'Ao Ponto', price: 0 },
              { id: 'i_2', name: 'Bem Passado', price: 0 },
              { id: 'i_3', name: 'Mal Passado', price: 0 }
            ]
          },
          {
            id: 'g_2',
            title: 'Adicionais Extras',
            required: false,
            minSelect: 0,
            maxSelect: 5,
            items: [
              { id: 'i_4', name: 'Queijo Cheddar Extra', price: 4.50 },
              { id: 'i_5', name: 'Bacon Extra', price: 6.00 },
              { id: 'i_6', name: 'Ovo Frito', price: 3.00 },
              { id: 'i_7', name: 'Maionese Temperada da Casa (50g)', price: 3.50 }
            ]
          }
        ]
      },
      {
        id: 'prod_2',
        name: 'Pizza Calabresa Gourmet (8 fatias)',
        description: 'Molho artesanal de tomate pelado, muçarela especial, calabresa artesanal fatiada, cebola roxa, azeitonas pretas e orégano.',
        price: 59.90,
        costPrice: 22.00,
        categoryId: 'cat_2',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        code: 'PIZ01',
        prepTime: 25,
        stock: 40,
        minStock: 5,
        unit: 'un',
        isActive: true,
        isFeatured: true,
        additionalGroups: [
          {
            id: 'g_3',
            title: 'Borda Recheada',
            required: false,
            minSelect: 0,
            maxSelect: 1,
            items: [
              { id: 'i_8', name: 'Borda de Catupiry Original', price: 9.90 },
              { id: 'i_9', name: 'Borda de Cheddar', price: 8.90 },
              { id: 'i_10', name: 'Borda de Chocolate com Granulado', price: 11.90 }
            ]
          }
        ]
      },
      {
        id: 'prod_3',
        name: 'Batata Rústica com Cheddar e Bacon',
        description: '400g de batata palito crocante temperada com alecrim e sal de parrilla, coberta com creme cheddar cremoso e bacon crispy.',
        price: 28.90,
        costPrice: 9.00,
        categoryId: 'cat_3',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
        code: 'POR01',
        prepTime: 12,
        stock: 60,
        minStock: 15,
        unit: 'un',
        isActive: true,
        isFeatured: false
      },
      {
        id: 'prod_4',
        name: 'Coca-Cola Zero 350ml',
        description: 'Lata de refrigerante super gelada.',
        price: 7.50,
        costPrice: 3.20,
        categoryId: 'cat_4',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
        code: 'BEB01',
        prepTime: 2,
        stock: 120,
        minStock: 24,
        unit: 'un',
        isActive: true,
        isFeatured: false
      },
      {
        id: 'prod_5',
        name: 'Suco Natural de Laranja 500ml',
        description: 'Suco feito na hora da fruta 100% natural, sem adição de conserva.',
        price: 11.00,
        costPrice: 4.00,
        categoryId: 'cat_4',
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
        code: 'BEB02',
        prepTime: 5,
        stock: 80,
        minStock: 10,
        unit: 'un',
        isActive: true,
        isFeatured: false
      },
      {
        id: 'prod_6',
        name: 'Grand Gateau com Gelato de Baunilha',
        description: 'Bolo quente de chocolate belga, picolé Magnum de baunilha, calda de chocolate meio amargo e morangos frescos.',
        price: 26.90,
        costPrice: 9.80,
        categoryId: 'cat_5',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
        code: 'DES01',
        prepTime: 10,
        stock: 25,
        minStock: 5,
        unit: 'un',
        isActive: true,
        isFeatured: true
      },
      {
        id: 'prod_7',
        name: 'Combo Casal Smash + Batata + 2 Refris',
        description: '2 Smash Burgers Bacon Supreme + 1 Batata Rústica Grande + 2 Refrigerantes em lata.',
        price: 89.90,
        promoPrice: 79.90,
        costPrice: 35.00,
        categoryId: 'cat_6',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
        code: 'CMB01',
        prepTime: 20,
        stock: 30,
        minStock: 5,
        unit: 'un',
        isActive: true,
        isFeatured: true
      }
    ],
    tables: [
      { id: 'tab_1', number: 1, name: 'Mesa 01 (Janela)', seats: 4, status: 'disponivel', qrCodeUrl: '/cardapio?mesa=1' },
      { id: 'tab_2', number: 2, name: 'Mesa 02 (Salão Principal)', seats: 2, status: 'ocupada', currentOrderId: 'ord_101', waiterName: 'Roberto Garçom', customerName: 'Lucas Silva' },
      { id: 'tab_3', number: 3, name: 'Mesa 03 (Salão Principal)', seats: 4, status: 'disponivel', qrCodeUrl: '/cardapio?mesa=3' },
      { id: 'tab_4', number: 4, name: 'Mesa 04 (Varanda)', seats: 6, status: 'reservada', qrCodeUrl: '/cardapio?mesa=4' },
      { id: 'tab_5', number: 5, name: 'Mesa 05 (Varanda)', seats: 4, status: 'aguardando_fechamento', currentOrderId: 'ord_102', waiterName: 'Roberto Garçom', customerName: 'Camila Rocha' },
      { id: 'tab_6', number: 6, name: 'Mesa 06 (Cabine VIP)', seats: 8, status: 'disponivel', qrCodeUrl: '/cardapio?mesa=6' }
    ],
    orders: [
      {
        id: 'ord_101',
        orderNumber: 101,
        type: 'mesa',
        tableNumber: 2,
        waiterName: 'Roberto Garçom',
        customerName: 'Lucas Silva',
        items: [
          {
            id: 'item_1',
            productId: 'prod_1',
            productName: 'Smash Burger Bacon Supreme',
            price: 29.90,
            quantity: 2,
            observation: 'Um sem cebola',
            additionals: [
              { groupTitle: 'Ponto da Carne', itemName: 'Ao Ponto', price: 0 },
              { groupTitle: 'Adicionais Extras', itemName: 'Maionese Temperada da Casa (50g)', price: 3.50 }
            ],
            sector: 'chapa',
            status: 'em_preparo'
          },
          {
            id: 'item_2',
            productId: 'prod_4',
            productName: 'Coca-Cola Zero 350ml',
            price: 7.50,
            quantity: 2,
            additionals: [],
            sector: 'bar',
            status: 'pronto'
          }
        ],
        subtotal: 74.30,
        discount: 0,
        deliveryFee: 0,
        serviceFee: 7.43,
        total: 81.73,
        paymentMethod: 'Pix',
        paymentStatus: 'pendente',
        status: 'em_preparo',
        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        timeline: [
          { status: 'novo', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), note: 'Pedido aberto na Mesa 2' },
          { status: 'em_preparo', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), note: 'Enviado para a Chapa' }
        ]
      },
      {
        id: 'ord_102',
        orderNumber: 102,
        type: 'entrega',
        customerName: 'Fernanda Oliveira',
        customerPhone: '(11) 98888-7777',
        customerAddress: 'Rua Augusta, 450 - Apt 12, Consolação, SP',
        items: [
          {
            id: 'item_3',
            productId: 'prod_2',
            productName: 'Pizza Calabresa Gourmet (8 fatias)',
            price: 59.90,
            quantity: 1,
            additionals: [
              { groupTitle: 'Borda Recheada', itemName: 'Borda de Catupiry Original', price: 9.90 }
            ],
            sector: 'pizzaria',
            status: 'pronto'
          }
        ],
        subtotal: 69.80,
        discount: 5.00,
        deliveryFee: 7.50,
        serviceFee: 0,
        total: 72.30,
        paymentMethod: 'Cartao_Credito',
        paymentStatus: 'pago',
        status: 'saiu_entrega',
        driverName: 'Paulo Entregador',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        timeline: [
          { status: 'novo', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
          { status: 'confirmado', timestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
          { status: 'em_preparo', timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString() },
          { status: 'pronto', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
          { status: 'saiu_entrega', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), note: 'A caminho com Paulo Entregador' }
        ]
      }
    ],
    cashRegisters: [
      {
        id: 'cash_1',
        openedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        openedBy: 'Mariana Caixa',
        initialCash: 150.00,
        currentCash: 450.00,
        status: 'aberto',
        movements: [
          {
            id: 'mov_1',
            type: 'suprimento',
            amount: 150.00,
            description: 'Fundo de troco inicial',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
            createdBy: 'Mariana Caixa'
          },
          {
            id: 'mov_2',
            type: 'venda',
            amount: 72.30,
            description: 'Venda Pedido #102 - Cartao_Credito',
            method: 'Cartao_Credito',
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            createdBy: 'Mariana Caixa'
          }
        ]
      }
    ],
    stockItems: [
      { id: 'stk_1', name: 'Blend Angus Hambúrguer (90g)', unit: 'un', currentQuantity: 150, minQuantity: 30, costPerUnit: 3.50, supplier: 'Açougue Central', updatedAt: now },
      { id: 'stk_2', name: 'Pão Brioche Selado', unit: 'un', currentQuantity: 120, minQuantity: 25, costPerUnit: 1.80, supplier: 'Panificadora Bella', updatedAt: now },
      { id: 'stk_3', name: 'Queijo Cheddar Fatiado', unit: 'kg', currentQuantity: 8.5, minQuantity: 2.0, costPerUnit: 42.00, supplier: 'Laticínios Vale', updatedAt: now },
      { id: 'stk_4', name: 'Massa de Pizza Artesanal', unit: 'un', currentQuantity: 40, minQuantity: 10, costPerUnit: 4.00, supplier: 'Produção Própria', updatedAt: now },
      { id: 'stk_5', name: 'Calabresa Artesanal', unit: 'kg', currentQuantity: 12.0, minQuantity: 3.0, costPerUnit: 32.00, supplier: 'Embutidos Brasil', updatedAt: now },
      { id: 'stk_6', name: 'Batata Rústica Congelada', unit: 'kg', currentQuantity: 25.0, minQuantity: 5.0, costPerUnit: 14.00, supplier: 'Distribuidora Fria', updatedAt: now }
    ],
    coupons: [
      { id: 'coup_1', code: 'BEMVINDO10', discountType: 'percentage', discountValue: 10, minOrderValue: 30.00, isActive: true, usedCount: 14, maxUses: 100, validUntil: '2026-12-31' },
      { id: 'coup_2', code: 'FRETEGRATIS', discountType: 'free_delivery', discountValue: 0, minOrderValue: 50.00, isActive: true, usedCount: 8, maxUses: 50, validUntil: '2026-12-31' },
      { id: 'coup_3', code: 'BURGER5', discountType: 'fixed', discountValue: 5.00, minOrderValue: 25.00, isActive: true, usedCount: 22, maxUses: 200, validUntil: '2026-12-31' }
    ],
    expenses: [
      { id: 'exp_1', description: 'Aluguel do Imóvel Comercial', category: 'Fixa', amount: 3500.00, dueDate: '2026-08-05', status: 'pendente', createdAt: now },
      { id: 'exp_2', description: 'Conta de Energia Elétrica', category: 'Utilidades', amount: 820.40, dueDate: '2026-08-10', status: 'pendente', createdAt: now },
      { id: 'exp_3', description: 'Compra Hortifruti Fresco', category: 'Insumos', amount: 340.00, dueDate: '2026-07-26', status: 'pago', paymentDate: '2026-07-26', createdAt: now }
    ],
    drivers: [
      { id: 'drv_1', name: 'Paulo Entregador', phone: '(11) 99999-6666', vehicle: 'Moto Honda CG 160', plate: 'ABC-1234', status: 'em_entrega', completedDeliveries: 142 },
      { id: 'drv_2', name: 'Marcos Motoboy', phone: '(11) 97777-5555', vehicle: 'Moto Yamaha Factor', plate: 'XYZ-5678', status: 'disponivel', completedDeliveries: 98 }
    ],
    auditLogs: [
      { id: 'aud_1', userName: 'Mariana Caixa', action: 'Abertura de Caixa', details: 'Caixa aberto com saldo inicial de R$ 150,00', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
      { id: 'aud_2', userName: 'Roberto Garçom', action: 'Criação de Pedido', details: 'Pedido #101 criado para Mesa 2', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() }
    ],
    nextOrderNumber: 103
  };
}

let cachedData: DBData | null = null;

export function getDB(): DBData {
  if (cachedData) return cachedData;
  ensureDirectoryExists();
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = getDefaultData();
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    cachedData = defaultData;
    return cachedData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    cachedData = JSON.parse(content);
    return cachedData!;
  } catch (err) {
    console.error('Error reading database file, resetting to defaults:', err);
    const defaultData = getDefaultData();
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    cachedData = defaultData;
    return cachedData;
  }
}

export function saveDB(data: DBData): void {
  ensureDirectoryExists();
  cachedData = data;
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function logAudit(userName: string, action: string, details: string): void {
  const db = getDB();
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    userName,
    action,
    details,
    timestamp: new Date().toISOString()
  });
  if (db.auditLogs.length > 200) {
    db.auditLogs = db.auditLogs.slice(0, 200);
  }
  saveDB(db);
}
