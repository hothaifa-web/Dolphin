import React, { useState } from 'react'
import { motion } from 'framer-motion'
import walletService from '../services/walletService'
import AppEngine from '../services/AppEngine'

export default function PaymentModal({ open, total, items, user, onClose, onSuccess }){
  const [method, setMethod] = useState('wallet')
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvv: '' })
  const [loading, setLoading] = useState(false)

  if(!open) return null

  async function confirm(){
    setLoading(true)
    try{
      if(method === 'wallet'){
        const ok = walletService.deduct(total)
        if(!ok) return alert('Insufficient wallet balance')
      } else if(method === 'credit'){
        // mock validation
        if(!card.number || !card.name) return alert('Enter mock card details')
      }
      // place order
      const order = AppEngine.placeOrder({ userId: user?.id || 2, items: items.map(i=>({ productId: i.productId, qty: i.qty })), total, payment: { method }, store: items[0]?.store || '' })
      onSuccess && onSuccess(order)
      onClose && onClose()
    }catch(e){ alert(e.message || 'Payment failed') }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
      <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} className="w-11/12 max-w-md bg-white rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Choose Payment</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="radio" checked={method==='wallet'} onChange={()=>setMethod('wallet')} />
            <div>
              <div className="font-semibold">Wallet</div>
              <div className="text-sm text-slate-500">Balance: ${walletService.getBalance()}</div>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input type="radio" checked={method==='credit'} onChange={()=>setMethod('credit')} />
            <div>
              <div className="font-semibold">Credit Card</div>
              <div className="text-sm text-slate-500">Enter mock card details</div>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input type="radio" checked={method==='cash'} onChange={()=>setMethod('cash')} />
            <div>
              <div className="font-semibold">Cash on Delivery</div>
              <div className="text-sm text-slate-500">Pay when the courier arrives</div>
            </div>
          </label>

          {method === 'credit' && (
            <div className="space-y-2">
              <input placeholder="Card number" value={card.number} onChange={e=>setCard({...card, number: e.target.value})} className="w-full border p-2 rounded" />
              <input placeholder="Name on card" value={card.name} onChange={e=>setCard({...card, name: e.target.value})} className="w-full border p-2 rounded" />
              <div className="flex gap-2">
                <input placeholder="MM/YY" value={card.exp} onChange={e=>setCard({...card, exp: e.target.value})} className="flex-1 border p-2 rounded" />
                <input placeholder="CVV" value={card.cvv} onChange={e=>setCard({...card, cvv: e.target.value})} className="w-24 border p-2 rounded" />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-3 py-2 bg-gray-200 rounded">Cancel</button>
            <button onClick={confirm} disabled={loading} className="px-4 py-2 bg-emerald-600 text-white rounded">Confirm ${total.toFixed(2)}</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
