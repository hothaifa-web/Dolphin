import React, { useEffect, useState } from 'react'

const LAST_ORDER_KEY = 'app_last_order_v1'

export default function ReorderCard({ order }){
  const [lastOrder, setLastOrder] = useState(order || null)

  useEffect(()=>{
    if(!order){
      try{ const stored = JSON.parse(localStorage.getItem(LAST_ORDER_KEY) || 'null'); if(stored) setLastOrder(stored) }catch(e){}
    } else {
      try{ localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order)) }catch(e){}
      setLastOrder(order)
    }
  },[order])

  function emitReorder(){
    if(!lastOrder) return alert('No last order to reorder')
    // Emits a global event; your cart or admin UI can listen to this
    window.dispatchEvent(new CustomEvent('app:reorder', { detail: { order: lastOrder } }))
    alert('Re-order emitted (check console or listen to app:reorder)')
  }

  if(!lastOrder) return (
    <div className="p-3 bg-slate-800 rounded text-center">
      <p className="text-slate-400">No recent order found.</p>
    </div>
  )

  return (
    <div className="p-3 bg-slate-800 rounded">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">Last Order — {lastOrder.storeName || lastOrder.store || '#'+(lastOrder.id||'')}</p>
          <p className="text-slate-400 text-sm">{(lastOrder.items||[]).length} items • ${Number(lastOrder.total||0).toFixed(2)}</p>
        </div>
        <div className="space-y-2">
          <button onClick={emitReorder} className="px-3 py-1 bg-indigo-600 rounded text-white">Re-order</button>
        </div>
      </div>

      <div className="mt-3 text-sm text-slate-300">
        {(lastOrder.items||[]).slice(0,3).map((it, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <div>{it.name || it.title || `#${it.productId}`}</div>
            <div className="text-slate-400">{(it.quantity||it.qty||1)}x</div>
          </div>
        ))}
        { (lastOrder.items||[]).length > 3 && <div className="text-xs text-slate-500">+{(lastOrder.items||[]).length - 3} more</div> }
      </div>
    </div>
  )
}
