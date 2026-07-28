import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDB, saveDB, logAudit, Order, OrderItem, Product, StockItem, Table } from './db';
import { authenticateToken, authorizeRoles, generateToken, AuthRequest } from './auth';

const router = Router();

// ==================== AUTH ROUTES ====================

// Login
router.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  const db = getDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || !user.isActive) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos ou conta inativa.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  const { passwordHash, ...userClean } = user;
  const token = generateToken(userClean);

  logAudit(user.name, 'Login', `Usuário ${user.email} realizou login`);

  return res.json({
    token,
    user: userClean
  });
});

// Current User info
router.get('/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  return res.json({ user: req.user });
});

// Change Password
router.post('/auth/change-password', authenticateToken, (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Preencha a senha atual e a nova senha.' });
  }

  const db = getDB();
  const user = db.users.find(u => u.id === req.user?.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  if (!bcrypt.compareSync(currentPassword, user.passwordHash)) {
    return res.status(400).json({ error: 'Senha atual incorreta.' });
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 8);
  saveDB(db);
  logAudit(req.user!.name, 'Alteração de Senha', 'Usuário alterou a própria senha');

  return res.json({ message: 'Senha alterada com sucesso.' });
});

// Users Management (Admin / Gerente)
router.get('/users', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const db = getDB();
  const usersClean = db.users.map(({ passwordHash, ...u }) => u);
  return res.json(usersClean);
});

router.post('/users', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const { name, email, password, role, phone, cpf } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Nome, e-mail, senha e cargo são obrigatórios.' });
  }

  const db = getDB();
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'Já existe um usuário cadastrado com este e-mail.' });
  }

  const newUser = {
    id: `u_${Date.now()}`,
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 8),
    role,
    phone,
    cpf,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDB(db);

  logAudit(req.user!.name, 'Novo Funcionário', `Cadastrou o funcionário ${name} (${role})`);
  const { passwordHash, ...createdClean } = newUser;
  return res.status(201).json(createdClean);
});

router.patch('/users/:id/toggle', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDB();
  const user = db.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  user.isActive = !user.isActive;
  saveDB(db);
  logAudit(req.user!.name, 'Status de Usuário', `${user.isActive ? 'Ativou' : 'Desativou'} o usuário ${user.name}`);
  return res.json({ message: 'Status atualizado', isActive: user.isActive });
});

// ==================== ESTABLISHMENT ROUTES ====================
router.get('/establishment', (req: Request, res: Response) => {
  const db = getDB();
  return res.json(db.establishment);
});

router.put('/establishment', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const db = getDB();
  db.establishment = { ...db.establishment, ...req.body };
  saveDB(db);
  logAudit(req.user!.name, 'Configuração do Estabelecimento', 'Atualizou as informações da empresa');
  return res.json(db.establishment);
});

// ==================== CATEGORIES & PRODUCTS ====================
router.get('/categories', (req: Request, res: Response) => {
  const db = getDB();
  return res.json(db.categories.sort((a, b) => a.order - b.order));
});

router.post('/categories', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const { name, icon, order } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });

  const db = getDB();
  const newCat = {
    id: `cat_${Date.now()}`,
    name,
    icon: icon || 'Tag',
    order: order || db.categories.length + 1,
    isActive: true
  };
  db.categories.push(newCat);
  saveDB(db);
  logAudit(req.user!.name, 'Nova Categoria', `Criou a categoria ${name}`);
  return res.status(201).json(newCat);
});

router.get('/products', (req: Request, res: Response) => {
  const db = getDB();
  return res.json(db.products);
});

router.post('/products', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const { name, description, price, costPrice, categoryId, image, code, prepTime, stock, minStock, additionalGroups } = req.body;
  if (!name || !price || !categoryId) {
    return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios.' });
  }

  const db = getDB();
  const newProd: Product = {
    id: `prod_${Date.now()}`,
    name,
    description: description || '',
    price: Number(price),
    costPrice: Number(costPrice || 0),
    categoryId,
    image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    code: code || `PRD${Math.floor(Math.random() * 1000)}`,
    prepTime: Number(prepTime || 15),
    stock: Number(stock || 0),
    minStock: Number(minStock || 5),
    unit: 'un',
    isActive: true,
    isFeatured: req.body.isFeatured || false,
    additionalGroups: additionalGroups || []
  };

  db.products.push(newProd);
  saveDB(db);
  logAudit(req.user!.name, 'Novo Produto', `Cadastrou o produto ${name}`);
  return res.status(201).json(newProd);
});

router.put('/products/:id', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDB();
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Produto não encontrado.' });

  db.products[index] = { ...db.products[index], ...req.body };
  saveDB(db);
  logAudit(req.user!.name, 'Editar Produto', `Atualizou o produto ${db.products[index].name}`);
  return res.json(db.products[index]);
});

router.patch('/products/:id/toggle', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const db = getDB();
  const product = db.products.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });

  product.isActive = !product.isActive;
  saveDB(db);
  logAudit(req.user!.name, 'Status de Produto', `${product.isActive ? 'Ativou' : 'Desativou'} ${product.name}`);
  return res.json({ message: 'Status alterado', isActive: product.isActive });
});

// ==================== TABLES & TABS ====================
router.get('/tables', (req: Request, res: Response) => {
  const db = getDB();
  return res.json(db.tables);
});

router.post('/tables', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const { number, name, seats } = req.body;
  if (!number || !seats) return res.status(400).json({ error: 'Número da mesa e lugares são obrigatórios.' });

  const db = getDB();
  if (db.tables.some(t => t.number === Number(number))) {
    return res.status(400).json({ error: 'Já existe uma mesa com este número.' });
  }

  const newTable: Table = {
    id: `tab_${Date.now()}`,
    number: Number(number),
    name: name || `Mesa ${number}`,
    seats: Number(seats),
    status: 'disponivel',
    qrCodeUrl: `/cardapio?mesa=${number}`
  };

  db.tables.push(newTable);
  saveDB(db);
  logAudit(req.user!.name, 'Nova Mesa', `Adicionou a ${newTable.name}`);
  return res.status(201).json(newTable);
});

router.patch('/tables/:id/status', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, waiterName, customerName } = req.body;
  const db = getDB();
  const table = db.tables.find(t => t.id === id);
  if (!table) return res.status(404).json({ error: 'Mesa não encontrada.' });

  table.status = status;
  if (waiterName !== undefined) table.waiterName = waiterName;
  if (customerName !== undefined) table.customerName = customerName;
  if (status === 'disponivel') {
    table.currentOrderId = undefined;
    table.waiterName = undefined;
    table.customerName = undefined;
  }

  saveDB(db);
  logAudit(req.user?.name || 'Sistema', 'Status da Mesa', `Mesa #${table.number} alterada para ${status}`);
  return res.json(table);
});

// ==================== ORDERS & KDS ====================
router.get('/orders', (req: Request, res: Response) => {
  const db = getDB();
  const { type, status, date } = req.query;
  let result = [...db.orders];

  if (type) result = result.filter(o => o.type === type);
  if (status) result = result.filter(o => o.status === status);

  // Sort newest first
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json(result);
});

router.post('/orders', (req: Request, res: Response) => {
  const { type, customerName, customerPhone, customerAddress, tableNumber, waiterName, items, subtotal, discount, deliveryFee, serviceFee, total, paymentMethod, changeFor } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'O pedido precisa conter ao menos um item.' });
  }

  const db = getDB();
  const orderNum = db.nextOrderNumber++;

  const formattedItems: OrderItem[] = items.map((it: any, idx: number) => {
    const prod = db.products.find(p => p.id === it.productId);
    let sector: OrderItem['sector'] = 'cozinha';
    if (prod) {
      if (prod.categoryId === 'cat_1') sector = 'chapa';
      else if (prod.categoryId === 'cat_2') sector = 'pizzaria';
      else if (prod.categoryId === 'cat_4') sector = 'bar';
    }

    return {
      id: `item_${Date.now()}_${idx}`,
      productId: it.productId,
      productName: it.productName || prod?.name || 'Item do Cardápio',
      price: Number(it.price),
      quantity: Number(it.quantity),
      observation: it.observation || '',
      additionals: it.additionals || [],
      sector,
      status: 'pendente'
    };
  });

  const newOrder: Order = {
    id: `ord_${Date.now()}`,
    orderNumber: orderNum,
    type: type || 'balcao',
    customerName: customerName || 'Cliente Balcão',
    customerPhone: customerPhone || '',
    customerAddress: customerAddress || '',
    tableNumber: tableNumber ? Number(tableNumber) : undefined,
    waiterName: waiterName || '',
    items: formattedItems,
    subtotal: Number(subtotal),
    discount: Number(discount || 0),
    deliveryFee: Number(deliveryFee || 0),
    serviceFee: Number(serviceFee || 0),
    total: Number(total),
    paymentMethod: paymentMethod || 'Dinheiro',
    paymentStatus: paymentMethod === 'Pix' || paymentMethod.includes('Cartao') ? 'pago' : 'pendente',
    changeFor: changeFor ? Number(changeFor) : undefined,
    status: 'novo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      { status: 'novo', timestamp: new Date().toISOString(), note: 'Pedido realizado' }
    ]
  };

  db.orders.unshift(newOrder);

  // If order is on a table, update table status
  if (tableNumber) {
    const table = db.tables.find(t => t.number === Number(tableNumber));
    if (table) {
      table.status = 'ocupada';
      table.currentOrderId = newOrder.id;
      table.customerName = newOrder.customerName;
    }
  }

  // Deduct stock if products have stock management
  formattedItems.forEach(it => {
    const prod = db.products.find(p => p.id === it.productId);
    if (prod && prod.stock >= it.quantity) {
      prod.stock -= it.quantity;
    }
  });

  // Log in cash movement if paid
  const openCash = db.cashRegisters.find(c => c.status === 'aberto');
  if (openCash && newOrder.paymentStatus === 'pago') {
    openCash.movements.push({
      id: `mov_${Date.now()}`,
      type: 'venda',
      amount: newOrder.total,
      description: `Venda Pedido #${newOrder.orderNumber} (${newOrder.type})`,
      method: newOrder.paymentMethod,
      timestamp: new Date().toISOString(),
      createdBy: waiterName || customerName || 'Sistema'
    });
    openCash.currentCash += newOrder.total;
  }

  saveDB(db);
  logAudit(waiterName || customerName || 'Cliente', 'Novo Pedido', `Pedido #${orderNum} registrado (${newOrder.type}) total R$ ${newOrder.total.toFixed(2)}`);

  return res.status(201).json(newOrder);
});

router.patch('/orders/:id/status', authenticateToken, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, note, cancelReason, driverName } = req.body;

  const db = getDB();
  const order = db.orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado.' });

  order.status = status;
  order.updatedAt = new Date().toISOString();
  if (cancelReason) order.cancelReason = cancelReason;
  if (driverName) order.driverName = driverName;

  order.timeline.push({
    status,
    timestamp: new Date().toISOString(),
    note: note || cancelReason || (driverName ? `Atribuído ao entregador ${driverName}` : undefined)
  });

  // If completed and on a table, offer table release
  if (status === 'concluido' || status === 'cancelado') {
    if (order.tableNumber) {
      const table = db.tables.find(t => t.number === order.tableNumber);
      if (table && table.currentOrderId === order.id) {
        table.status = 'disponivel';
        table.currentOrderId = undefined;
        table.waiterName = undefined;
        table.customerName = undefined;
      }
    }
  }

  saveDB(db);
  logAudit(req.user!.name, 'Status do Pedido', `Pedido #${order.orderNumber} alterado para ${status}`);
  return res.json(order);
});

// ==================== CASH REGISTER ====================
router.get('/cashier/current', (req: Request, res: Response) => {
  const db = getDB();
  const current = db.cashRegisters.find(c => c.status === 'aberto');
  return res.json(current || null);
});

router.post('/cashier/open', authenticateToken, authorizeRoles('caixa', 'gerente'), (req: AuthRequest, res: Response) => {
  const { initialCash } = req.body;
  const db = getDB();
  const existingOpen = db.cashRegisters.find(c => c.status === 'aberto');
  if (existingOpen) {
    return res.status(400).json({ error: 'Já existe um caixa aberto.' });
  }

  const initialAmount = Number(initialCash || 0);
  const newRegister = {
    id: `cash_${Date.now()}`,
    openedAt: new Date().toISOString(),
    openedBy: req.user!.name,
    initialCash: initialAmount,
    currentCash: initialAmount,
    status: 'aberto' as const,
    movements: [
      {
        id: `mov_${Date.now()}`,
        type: 'suprimento' as const,
        amount: initialAmount,
        description: 'Fundo de Troco Inicial',
        timestamp: new Date().toISOString(),
        createdBy: req.user!.name
      }
    ]
  };

  db.cashRegisters.unshift(newRegister);
  saveDB(db);
  logAudit(req.user!.name, 'Abertura de Caixa', `Caixa aberto com fundo inicial de R$ ${initialAmount.toFixed(2)}`);
  return res.status(201).json(newRegister);
});

router.post('/cashier/movement', authenticateToken, authorizeRoles('caixa', 'gerente'), (req: AuthRequest, res: Response) => {
  const { type, amount, description } = req.body; // type: sangria or suprimento
  if (!amount || !type || !description) {
    return res.status(400).json({ error: 'Tipo, valor e descrição são obrigatórios.' });
  }

  const db = getDB();
  const openCash = db.cashRegisters.find(c => c.status === 'aberto');
  if (!openCash) return res.status(400).json({ error: 'Nenhum caixa está aberto no momento.' });

  const val = Number(amount);
  if (type === 'sangria') {
    openCash.currentCash -= val;
  } else {
    openCash.currentCash += val;
  }

  openCash.movements.push({
    id: `mov_${Date.now()}`,
    type,
    amount: val,
    description,
    timestamp: new Date().toISOString(),
    createdBy: req.user!.name
  });

  saveDB(db);
  logAudit(req.user!.name, `Caixa: ${type.toUpperCase()}`, `${type === 'sangria' ? 'Sangria' : 'Suprimento'} de R$ ${val.toFixed(2)} - ${description}`);
  return res.json(openCash);
});

router.post('/cashier/close', authenticateToken, authorizeRoles('caixa', 'gerente'), (req: AuthRequest, res: Response) => {
  const { countedCash, notes } = req.body;
  const db = getDB();
  const openCash = db.cashRegisters.find(c => c.status === 'aberto');
  if (!openCash) return res.status(400).json({ error: 'Nenhum caixa está aberto.' });

  const counted = Number(countedCash || 0);
  const salesByMethod: Record<string, number> = {};
  let totalSales = 0;

  openCash.movements.forEach(m => {
    if (m.type === 'venda') {
      totalSales += m.amount;
      const method = m.method || 'Dinheiro';
      salesByMethod[method] = (salesByMethod[method] || 0) + m.amount;
    }
  });

  openCash.status = 'fechado';
  openCash.closedAt = new Date().toISOString();
  openCash.closedBy = req.user!.name;
  openCash.closingSummary = {
    totalSales,
    salesByMethod,
    expectedCash: openCash.currentCash,
    countedCash: counted,
    difference: counted - openCash.currentCash,
    notes: notes || ''
  };

  saveDB(db);
  logAudit(req.user!.name, 'Fechamento de Caixa', `Caixa fechado. Total em vendas: R$ ${totalSales.toFixed(2)}. Diferença de troco: R$ ${(counted - openCash.currentCash).toFixed(2)}`);
  return res.json(openCash);
});

// ==================== STOCK & SUPPLIERS ====================
router.get('/stock', (req: Request, res: Response) => {
  const db = getDB();
  return res.json(db.stockItems);
});

router.post('/stock', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const { name, unit, currentQuantity, minQuantity, costPerUnit, supplier } = req.body;
  if (!name || !unit) return res.status(400).json({ error: 'Nome e unidade são obrigatórios.' });

  const db = getDB();
  const newItem: StockItem = {
    id: `stk_${Date.now()}`,
    name,
    unit,
    currentQuantity: Number(currentQuantity || 0),
    minQuantity: Number(minQuantity || 5),
    costPerUnit: Number(costPerUnit || 0),
    supplier: supplier || 'Geral',
    updatedAt: new Date().toISOString()
  };

  db.stockItems.push(newItem);
  saveDB(db);
  logAudit(req.user!.name, 'Novo Item Estoque', `Cadastrou o insumo ${name}`);
  return res.status(201).json(newItem);
});

router.patch('/stock/:id/quantity', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { delta, newQuantity } = req.body;
  const db = getDB();
  const item = db.stockItems.find(s => s.id === id);
  if (!item) return res.status(404).json({ error: 'Item de estoque não encontrado.' });

  if (newQuantity !== undefined) {
    item.currentQuantity = Number(newQuantity);
  } else if (delta !== undefined) {
    item.currentQuantity += Number(delta);
  }

  item.updatedAt = new Date().toISOString();
  saveDB(db);
  logAudit(req.user!.name, 'Ajuste de Estoque', `Ajustou quantidade de ${item.name} para ${item.currentQuantity} ${item.unit}`);
  return res.json(item);
});

// ==================== COUPONS & DELIVERIES ====================
router.get('/coupons', (req: Request, res: Response) => {
  const db = getDB();
  return res.json(db.coupons);
});

router.post('/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ error: 'Código de cupom obrigatório.' });

  const db = getDB();
  const coupon = db.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);

  if (!coupon) {
    return res.status(400).json({ error: 'Cupom inválido ou expirado.' });
  }

  if (subtotal && Number(subtotal) < coupon.minOrderValue) {
    return res.status(400).json({ error: `Valor mínimo do pedido para este cupom é R$ ${coupon.minOrderValue.toFixed(2)}.` });
  }

  return res.json(coupon);
});

router.post('/coupons', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const { code, discountType, discountValue, minOrderValue, maxUses, validUntil } = req.body;
  if (!code || !discountType || discountValue === undefined) {
    return res.status(400).json({ error: 'Código, tipo e valor do desconto são obrigatórios.' });
  }

  const db = getDB();
  const newCoupon = {
    id: `coup_${Date.now()}`,
    code: code.toUpperCase(),
    discountType,
    discountValue: Number(discountValue),
    minOrderValue: Number(minOrderValue || 0),
    isActive: true,
    usedCount: 0,
    maxUses: Number(maxUses || 100),
    validUntil: validUntil || '2026-12-31'
  };

  db.coupons.push(newCoupon);
  saveDB(db);
  logAudit(req.user!.name, 'Novo Cupom', `Criou o cupom ${newCoupon.code}`);
  return res.status(201).json(newCoupon);
});

router.get('/drivers', (req: Request, res: Response) => {
  const db = getDB();
  return res.json(db.drivers);
});

// ==================== EXPENSES & FINANCIAL ====================
router.get('/expenses', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const db = getDB();
  return res.json(db.expenses);
});

router.post('/expenses', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const { description, category, amount, dueDate, status } = req.body;
  if (!description || !amount || !dueDate) {
    return res.status(400).json({ error: 'Descrição, valor e data de vencimento são obrigatórios.' });
  }

  const db = getDB();
  const newExp = {
    id: `exp_${Date.now()}`,
    description,
    category: category || 'Outros',
    amount: Number(amount),
    dueDate,
    status: status || 'pendente',
    createdAt: new Date().toISOString()
  };

  db.expenses.unshift(newExp);
  saveDB(db);
  logAudit(req.user!.name, 'Nova Despesa', `Lançou despesa "${description}" de R$ ${Number(amount).toFixed(2)}`);
  return res.status(201).json(newExp);
});

// ==================== REPORTS & DASHBOARD ====================
router.get('/reports/summary', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const db = getDB();
  
  const totalOrders = db.orders.length;
  const completedOrders = db.orders.filter(o => o.status === 'concluido' || o.status === 'saiu_entrega' || o.status === 'pronto' || o.status === 'em_preparo');
  
  const totalRevenue = db.orders
    .filter(o => o.status !== 'cancelado')
    .reduce((acc, o) => acc + o.total, 0);

  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const lowStockCount = db.stockItems.filter(s => s.currentQuantity <= s.minQuantity).length;

  const activeOrdersCount = db.orders.filter(o => !['concluido', 'cancelado'].includes(o.status)).length;

  const salesByPaymentMethod: Record<string, number> = {};
  db.orders.forEach(o => {
    if (o.status !== 'cancelado') {
      const m = o.paymentMethod || 'Dinheiro';
      salesByPaymentMethod[m] = (salesByPaymentMethod[m] || 0) + o.total;
    }
  });

  const salesByType: Record<string, number> = {};
  db.orders.forEach(o => {
    if (o.status !== 'cancelado') {
      salesByType[o.type] = (salesByType[o.type] || 0) + 1;
    }
  });

  return res.json({
    totalRevenue,
    totalOrders,
    avgTicket,
    lowStockCount,
    activeOrdersCount,
    salesByPaymentMethod,
    salesByType
  });
});

// ==================== AUDIT LOGS ====================
router.get('/audit', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const db = getDB();
  return res.json(db.auditLogs);
});

// ==================== BACKUP DATA EXPORT & IMPORT ====================
router.get('/backup/export', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const db = getDB();
  return res.json(db);
});

router.post('/backup/import', authenticateToken, authorizeRoles('gerente'), (req: AuthRequest, res: Response) => {
  const { data } = req.body;
  if (!data || !data.establishment || !data.users) {
    return res.status(400).json({ error: 'Arquivo de backup inválido.' });
  }

  saveDB(data);
  logAudit(req.user!.name, 'Restauração de Backup', 'Backup do banco de dados restaurado com sucesso');
  return res.json({ message: 'Backup restaurado com sucesso!' });
});

export default router;
