import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'

const CART_KEY = 'app_cart_v2'
const CartContext = createContext(null)

function readCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY) || '[]') }catch(e){ return [] } }
function saveCart(cart){ try{ localStorage.setItem(CART_KEY, JSON.stringify(cart)) }catch(e){} }

export function CartProvider({ children }){
  const [items, setItems] = useState(()=> readCart())

  useEffect(()=>{ saveCart(items) }, [items])

  useEffect(()=>{
    function onStorage(e){ if(e.key === CART_KEY) setItems(e.newValue ? JSON.parse(e.newValue) : []) }
    window.addEventListener('storage', onStorage)
    return ()=> window.removeEventListener('storage', onStorage)
  },[])

  const addItem = useCallback((product, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i=> i.id === product.id)
      if(idx !== -1){ const copy = [...prev]; copy[idx] = { ...copy[idx], qty: (copy[idx].qty||0) + qty }; return copy }
        return [{ id: product.id, productId: product.id, name: (product.name && typeof product.name==='object') ? (product.name.en || product.name) : product.name, price: product.price||0, store: product.store, image: product.image, qty }, ...prev]
    })
    // notify UI: show short toast and request cart open
    try{ if(typeof window !== 'undefined'){
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'تمت الإضافة إلى السلة', timeout: 1000 } }))
    }}catch(e){}
  },[])

  const changeQty = useCallback((productId, nextQty) => {
    setItems(prev => {
      const idx = prev.findIndex(i=> i.id === productId)
      if(idx === -1) return prev
      const copy = [...prev]
      if(nextQty <= 0) copy.splice(idx,1)
      else copy[idx] = { ...copy[idx], qty: nextQty }
      return copy
    })
  },[])

  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(i=> i.id !== productId))
  },[])

  const clearCart = useCallback(()=> setItems([]), [])

  const itemCount = useMemo(()=> items.reduce((s,i)=> s + (i.qty||0), 0), [items])
  const total = useMemo(()=> items.reduce((s,i)=> s + (i.qty||0) * (i.price||0), 0), [items])

  const value = useMemo(()=> ({ items, addItem, changeQty, removeItem, clearCart, itemCount, total }), [items, addItem, changeQty, removeItem, clearCart, itemCount, total])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(){ const ctx = useContext(CartContext); if(!ctx) throw new Error('useCart must be used within CartProvider'); return ctx }

export default CartContext
