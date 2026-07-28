export type UserRole = 'admin' | 'gerente' | 'atendente' | 'garcom' | 'cozinha' | 'caixa' | 'entregador' | 'cliente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
  avgPreparationTime: number;
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

export type OrderType = 'balcao' | 'mesa' | 'comanda' | 'retirada' | 'entrega';
export type OrderStatus = 'novo' | 'confirmado' | 'em_preparo' | 'pronto' | 'saiu_entrega' | 'concluido' | 'cancelado';

export interface Order {
  id: string;
  orderNumber: number;
  type: OrderType;
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
  paymentMethod: string;
  paymentStatus: 'pendente' | 'pago' | 'estornado';
  changeFor?: number;
  status: OrderStatus;
  cancelReason?: string;
  driverName?: string;
  createdAt: string;
  updatedAt: string;
  timeline: { status: string; timestamp: string; note?: string }[];
}

export interface CashMovement {
  id: string;
  type: 'entrada' | 'saida' | 'sangria' | 'suprimento' | 'venda';
  amount: number;
  description: string;
  method?: string;
  timestamp: string;
  createdBy: string;
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
  movements: CashMovement[];
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
  unit: string;
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
