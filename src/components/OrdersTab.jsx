import React, { useEffect, useState } from 'react'

export default function OrdersTab(){
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    try{ const s = JSON.parse(localStorage.getItem('orders_history_v1') || '[]'); setOrders(s) }catch(e){ setOrders([]) }
  },[])

  if(!orders || orders.length === 0) return <div className="text-sm text-slate-400">No orders yet</div>

  return (
    <div className="space-y-3">
      <table className="w-full text-sm">
        <thead className="text-left text-slate-400">
          <tr><th>Order ID</th><th>Store</th><th>Total</th><th>Status</th></tr>
        </thead>
        <tbody>
          {orders.map(o=> (
            <tr key={o.id} className="border-t border-slate-800">
              <td className="py-2">{o.id}</td>
              <td>{o.store}</td>
              <td>${o.total}</td>
              <td className="capitalize">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
