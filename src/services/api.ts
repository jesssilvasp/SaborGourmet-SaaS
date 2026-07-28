import {
  User, Establishment, Category, Product, Table, Order,
  CashRegister, StockItem, Coupon, Expense, Driver, AuditLog
} from '../types';

const API_BASE = '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    }
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Ocorreu um erro na requisição.');
  }

  return data as T;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  getMe: () => request<{ user: User }>('/auth/me'),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    }),

  getUsers: () => request<User[]>('/users'),

  createUser: (userData: any) =>
    request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  toggleUserStatus: (id: string) =>
    request<{ message: string; isActive: boolean }>(`/users/${id}/toggle`, {
      method: 'PATCH'
    }),

  // Establishment
  getEstablishment: () => request<Establishment>('/establishment'),

  updateEstablishment: (data: Partial<Establishment>) =>
    request<Establishment>('/establishment', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Categories & Products
  getCategories: () => request<Category[]>('/categories'),

  createCategory: (data: Partial<Category>) =>
    request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getProducts: () => request<Product[]>('/products'),

  createProduct: (data: Partial<Product>) =>
    request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateProduct: (id: string, data: Partial<Product>) =>
    request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  toggleProductStatus: (id: string) =>
    request<{ message: string; isActive: boolean }>(`/products/${id}/toggle`, {
      method: 'PATCH'
    }),

  // Tables
  getTables: () => request<Table[]>('/tables'),

  createTable: (data: { number: number; name?: string; seats: number }) =>
    request<Table>('/tables', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateTableStatus: (id: string, status: Table['status'], waiterName?: string, customerName?: string) =>
    request<Table>(`/tables/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, waiterName, customerName })
    }),

  // Orders & KDS
  getOrders: (params?: { type?: string; status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<Order[]>(`/orders${query ? `?${query}` : ''}`);
  },

  createOrder: (orderData: any) =>
    request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),

  updateOrderStatus: (id: string, status: Order['status'], details?: { note?: string; cancelReason?: string; driverName?: string }) =>
    request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, ...details })
    }),

  // Cashier
  getCurrentCashier: () => request<CashRegister | null>('/cashier/current'),

  openCashier: (initialCash: number) =>
    request<CashRegister>('/cashier/open', {
      method: 'POST',
      body: JSON.stringify({ initialCash })
    }),

  addCashMovement: (type: 'sangria' | 'suprimento', amount: number, description: string) =>
    request<CashRegister>('/cashier/movement', {
      method: 'POST',
      body: JSON.stringify({ type, amount, description })
    }),

  closeCashier: (countedCash: number, notes?: string) =>
    request<CashRegister>('/cashier/close', {
      method: 'POST',
      body: JSON.stringify({ countedCash, notes })
    }),

  // Stock
  getStock: () => request<StockItem[]>('/stock'),

  createStockItem: (item: Partial<StockItem>) =>
    request<StockItem>('/stock', {
      method: 'POST',
      body: JSON.stringify(item)
    }),

  updateStockQuantity: (id: string, delta?: number, newQuantity?: number) =>
    request<StockItem>(`/stock/${id}/quantity`, {
      method: 'PATCH',
      body: JSON.stringify({ delta, newQuantity })
    }),

  // Coupons & Drivers
  getCoupons: () => request<Coupon[]>('/coupons'),

  validateCoupon: (code: string, subtotal: number) =>
    request<Coupon>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal })
    }),

  createCoupon: (coupon: Partial<Coupon>) =>
    request<Coupon>('/coupons', {
      method: 'POST',
      body: JSON.stringify(coupon)
    }),

  getDrivers: () => request<Driver[]>('/drivers'),

  // Financial
  getExpenses: () => request<Expense[]>('/expenses'),

  createExpense: (expense: Partial<Expense>) =>
    request<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense)
    }),

  // Reports
  getSummaryReport: () =>
    request<{
      totalRevenue: number;
      totalOrders: number;
      avgTicket: number;
      lowStockCount: number;
      activeOrdersCount: number;
      salesByPaymentMethod: Record<string, number>;
      salesByType: Record<string, number>;
    }>('/reports/summary'),

  // Audit
  getAuditLogs: () => request<AuditLog[]>('/audit'),

  // Backup
  exportBackup: () => request<any>('/backup/export'),

  importBackup: (data: any) =>
    request<{ message: string }>('/backup/import', {
      method: 'POST',
      body: JSON.stringify({ data })
    })
};
