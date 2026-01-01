import { createOrder, updateOrder, getOrders, getUsers, emit as _emit } from '../data/mock'
import * as walletService from './walletService'

// Central AppEngine for cross-app events and helpers
const TX_KEY = 'app_financial_logs_v1'

function safeGet(key, fallback){
  try{ return JSON.parse(localStorage.getItem(key)) }catch(e){ return fallback }
}

function safeSet(key, val){
  try{ localStorage.setItem(key, JSON.stringify(val)) }catch(e){}
}

function emit(event){
  // re-use existing mock emitter compatibility
  try{ window.dispatchEvent(new CustomEvent(event.type, { detail: event })) }catch(e){}
  // also call mock's emit for subscribers
  try{ _emit && typeof _emit === 'function' && _emit(event) }catch(e){}
}

// expose emit for other modules that may want to trigger custom events
export { emit }

export function placeOrder({ userId, items, total, payment = { method: 'card' }, location = null, coords = null, store = '' }){
  // handle wallet payment first
  if(payment && payment.method === 'wallet'){
    const ok = walletService.deduct(total)
    if(!ok) throw new Error('Insufficient wallet balance')
    // record financial log for user
    const tx = { id: Date.now(), userId, type: 'debit', amount: total, date: new Date().toISOString(), meta: { note: 'Order payment' } }
    addFinancialTx(userId, tx)
  }

  const order = createOrder({ userId, items, total, status: 'pending', store, location, payment, coords })
  // emit app-level event
  emit({ type: 'app:newOrder', order })
  // legacy compatibility
  emit({ type: 'order', order })
  return order
}

export function addFinancialTx(userId, tx){
  const all = safeGet(TX_KEY, {}) || {}
  const list = all[userId] || []
  const next = [tx, ...list]
  all[userId] = next
  safeSet(TX_KEY, all)
  // also keep walletService txs global (if present)
  try{ walletService.addTx({ ...tx }) }catch(e){}
  emit({ type: 'app:financialTx', userId, tx })
  return next
}

export function getFinancialTxs(userId){
  const all = safeGet(TX_KEY, {}) || {}
  return all[userId] || []
}

export function setStoreOpen(storeUsernameOrName, isOpen){
  // update USERS status for store(s)
  try{
    const users = getUsers()
    for(const u of users){
      if(u.role === 'store' && (u.username === storeUsernameOrName || u.name === storeUsernameOrName)){
        u.status = isOpen ? 'active' : 'inactive'
      }
    }
    // persist via existing saveUsers if available
    try{ localStorage.setItem('ecom_users', JSON.stringify(users)) }catch(e){}
    emit({ type: 'app:storeStatusChanged', store: storeUsernameOrName, isOpen })
    return true
  }catch(e){ return false }
}

export function assignDriver(orderId, driverId){
  const updated = updateOrder(orderId, { status: 'on_the_way', driverId })
  emit({ type: 'app:driverAssigned', order: updated, driverId })
  return updated
}

export function recordSearch(userId, query){
  try{
    const key = 'app_searches_v1'
    const s = safeGet(key, []) || []
    s.unshift({ id: Date.now(), userId, query, date: new Date().toISOString() })
    safeSet(key, s)
    emit({ type: 'app:search', userId, query })
    return s
  }catch(e){ return [] }
}

export function createSupportTicket(userId, subject, message){
  const key = 'app_support_tickets_v1'
  const tickets = safeGet(key, []) || []
  const t = { id: Date.now(), userId, subject, message, status: 'open', createdAt: new Date().toISOString() }
  tickets.unshift(t)
  safeSet(key, tickets)
  emit({ type: 'app:supportTicket', ticket: t })
  return t
}

export function addReview(storeName, userId, rating, comment){
  const key = 'app_reviews_v1'
  const reviews = safeGet(key, {}) || {}
  const list = reviews[storeName] || []
  const r = { id: Date.now(), userId, rating, comment, date: new Date().toISOString() }
  reviews[storeName] = [r, ...list]
  safeSet(key, reviews)
  emit({ type: 'app:review', store: storeName, review: r })
  return r
}

export function subscribe(fn){
  if(typeof window !== 'undefined'){
    const handler = (e) => fn(e && e.detail ? e.detail : e)
    window.addEventListener('app:newOrder', handler)
    window.addEventListener('app:financialTx', handler)
    window.addEventListener('app:storeStatusChanged', handler)
    window.addEventListener('app:driverAssigned', handler)
    window.addEventListener('app:search', handler)
    window.addEventListener('app:supportTicket', handler)
    window.addEventListener('app:review', handler)
    // return unsubscribe
    return () => {
      window.removeEventListener('app:newOrder', handler)
      window.removeEventListener('app:financialTx', handler)
      window.removeEventListener('app:storeStatusChanged', handler)
      window.removeEventListener('app:driverAssigned', handler)
      window.removeEventListener('app:search', handler)
      window.removeEventListener('app:supportTicket', handler)
      window.removeEventListener('app:review', handler)
    }
  }
  return () => {}
}

export default {
  placeOrder,
  addFinancialTx,
  getFinancialTxs,
  setStoreOpen,
  assignDriver,
  recordSearch,
  createSupportTicket,
  addReview,
  subscribe,
  emit
}
