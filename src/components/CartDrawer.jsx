import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash, CreditCard } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import AppEngine from '../services/AppEngine'

export default function CartDrawer({open, onClose}){
  const { items: cart, changeQty, removeItem, clearCart, total } = useCart()
  const [loading, setLoading] = useState(false)
  // changeQty and removeItem are from context

  async function checkout(){
    if(cart.length === 0) return alert('Cart is empty')
    setLoading(true)
      try{
        const items = cart.map(i=>({ productId: i.id, qty: i.qty || 1 }))
        const order = AppEngine.placeOrder({ userId: 2, items, total, payment: { method: 'card' }, store: cart[0]?.store || '' })
      // persist order history
      try{
        const s = JSON.parse(localStorage.getItem('orders_history_v1') || '[]')
        s.unshift(order)
        localStorage.setItem('orders_history_v1', JSON.stringify(s))
      }catch(e){}
      clearCart()
      alert('Order placed successfully')
      onClose && onClose()
    }catch(e){ console.error(e); alert('Failed to place order: ' + (e.message||e)) }
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring' }} className="fixed right-0 top-0 h-full w-96 bg-slate-900 shadow-xl z-50">
          <div className="p-4 flex items-center justify-between border-b border-slate-700">
            <div className="text-lg font-semibold">Your Cart</div>
            <button onClick={onClose} className="p-2"><X /></button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-160px)]">
              {(!cart || cart.length === 0) ? (
              <div className="text-sm text-slate-400">Your cart is empty</div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2 border-b border-slate-800">
                  <img src={item.image} alt={item.name?.en} className="w-16 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-semibold">{item.name?.en || item.name}</div>
                    <div className="text-sm text-slate-400">${item.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>changeQty(item.id, Math.max(0, (item.qty||1) - 1))} className="p-1"><Minus size={14} /></button>
                    <div className="text-sm">{item.qty || 1}</div>
                    <button onClick={()=>changeQty(item.id, (item.qty||1) + 1)} className="p-1"><Plus size={14} /></button>
                    <button onClick={()=>removeItem(item.id)} className="p-1 text-rose-400"><Trash size={16} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <div className="text-sm text-slate-400">Total</div>
              <div className="text-xl font-bold">${Math.round(total*100)/100}</div>
            </div>
            <button disabled={loading} onClick={checkout} className="w-full inline-flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-500 rounded">
              <CreditCard /> Checkout
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
