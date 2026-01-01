// Minimal cart helper used by global handlers (merge items, persist cart)
const CART_KEY = 'cart'

function readCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY) || '[]') }catch(e){ return [] }
}

function saveCart(cart){
  try{ localStorage.setItem(CART_KEY, JSON.stringify(cart || [])) }catch(e){}
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: { cart } }))
}

// items: [{ productId, qty, ... }]
export function addItems(items){
  if(!Array.isArray(items)) return
  const curr = readCart() || []
  const map = new Map()
  for(const it of curr){
    const id = String(it.productId || it.id || it.productId)
    map.set(id, { ...it })
  }
  for(const it of items){
    const id = String(it.productId || it.id || it.productId)
    const qty = Number(it.qty || it.quantity || 1) || 1
    if(map.has(id)){
      map.get(id).qty = (Number(map.get(id).qty)||0) + qty
    }else{
      map.set(id, { productId: Number(id), qty })
    }
  }
  const next = Array.from(map.values())
  saveCart(next)
  return next
}

export function clearCart(){ saveCart([]) }

export default { readCart, saveCart, addItems, clearCart }
