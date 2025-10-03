export type OrderItem = {
  id: string;
  name: string;
  qty: number;
  price: number;
  subtotal: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  feePct: number;
  platformFee: number;
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
  address?: string;
};

const KEY = "lr_orders";
const FEE_PCT_DEFAULT = 0.09; // 9%

export function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function saveOrders(list: Order[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function createOrder(payload: {
  items: OrderItem[];
  total: number;
  customerName?: string;
  customerPhone?: string;
  address?: string;
  feePct?: number;
}): Order {
  const id = "ord_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  const feePct = typeof payload.feePct === "number" ? payload.feePct : FEE_PCT_DEFAULT;
  const platformFee = Math.round(payload.total * feePct);

  const order: Order = {
    id,
    items: payload.items,
    total: payload.total,
    feePct,
    platformFee,
    createdAt: new Date().toISOString(),
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    address: payload.address,
  };

  const list = getOrders();
  saveOrders([order, ...list]);
  return order;
}

export function getOrdersSummary() {
  const orders = getOrders();
  const totalOrders = orders.length;
  const gross = orders.reduce((s, o) => s + o.total, 0);
  const fees = orders.reduce((s, o) => s + o.platformFee, 0);
  return { totalOrders, gross, fees };
}