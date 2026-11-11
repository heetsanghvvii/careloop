/**
 * Diagnostics storage. Two collections, deliberately separate so a patient-facing read of an order
 * can never carry result values:
 *   diagnosticOrders  (workspaces/{ws}/diagnosticOrders/{orderId} in Firestore)
 *   diagnosticResults (workspaces/{ws}/diagnosticResults/{orderId} in Firestore)
 *
 * dataService.js demo mode keeps one JSON object in localStorage key 'careloop_local_data_v1'.
 * createLocalStorageStore() adds `diagnosticOrders` and `diagnosticResults` maps to that same object.
 * In plain node, createMemoryStore() is the default. Store methods may be sync or async.
 */
const clone = v => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

export function createMemoryStore() {
  const orders = new Map();
  const results = new Map();
  return {
    getOrder: id => clone(orders.get(id)) || null,
    putOrder: order => { orders.set(order.id, clone(order)); return clone(order); },
    listOrders: pred => [...orders.values()].filter(o => !pred || pred(o)).map(clone),
    findOrderByProviderBookingId: pbid =>
      clone([...orders.values()].find(o => o.booking?.providerBookingId === pbid)) || null,
    getResult: id => clone(results.get(id)) || null,
    putResult: (id, result) => { results.set(id, clone(result)); },
    _count: () => orders.size
  };
}

export function createLocalStorageStore(key = 'careloop_local_data_v1') {
  const ls = typeof localStorage !== 'undefined' ? localStorage : null;
  if (!ls) return createMemoryStore();
  const load = () => {
    try { return JSON.parse(ls.getItem(key)) || {}; } catch { return {}; }
  };
  const save = db => ls.setItem(key, JSON.stringify(db));
  return {
    getOrder: id => (load().diagnosticOrders || {})[id] || null,
    putOrder: order => {
      const db = load();
      db.diagnosticOrders = { ...(db.diagnosticOrders || {}), [order.id]: order };
      save(db);
      return clone(order);
    },
    listOrders: pred => Object.values(load().diagnosticOrders || {}).filter(o => !pred || pred(o)),
    findOrderByProviderBookingId: pbid =>
      Object.values(load().diagnosticOrders || {}).find(o => o.booking?.providerBookingId === pbid) || null,
    getResult: id => (load().diagnosticResults || {})[id] || null,
    putResult: (id, result) => {
      const db = load();
      db.diagnosticResults = { ...(db.diagnosticResults || {}), [id]: result };
      save(db);
    }
  };
}
