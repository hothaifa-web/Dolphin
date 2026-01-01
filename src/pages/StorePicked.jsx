import React from 'react'
import Layout from '../components/Layout'
import { getOrders, getProducts } from '../data/mock'
import { useAuth } from '../components/AuthProvider'
import { useLocation, useNavigate } from 'react-router-dom'

export default function StorePicked(){
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const orders = React.useMemo(()=> getOrders(), [])
  const products = React.useMemo(()=> getProducts(), [])
  const navState = location.state || {}
  const filterOrderId = navState.orderId ? String(navState.orderId) : null

  // gather picked items across orders for this store or for a specific order if provided
  const picked = []
  for(const o of orders){
    if(user && o.store !== user.name) continue
    if(filterOrderId && String(o.id) !== filterOrderId) continue
    (o.items||[]).forEach(it => {
      if((it.pickedQty && it.pickedQty > 0) || it.preparing) {
        picked.push({ orderId: o.id, orderStatus: o.status, item: it, order: o })
      }
    })
  }

  return (
    <Layout sideItems={[ {label:'Dashboard',to:'/store'}, {label:'Products', to:'/store/products'}, {label:'Orders', to:'/store/orders'}, {label:'تم التقاطه', to:'/store/picked'} ]}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-4">صفحة: تم التقاطه</h2>
        {filterOrderId && <button onClick={()=> navigate(`/store/orders/${filterOrderId}`)} className="px-3 py-1 bg-slate-600 rounded text-white">رجوع للطلب</button>}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {picked.length === 0 && <div className="col-span-3 p-4 bg-slate-800 rounded">لا توجد عناصر تم التقاطها بعد.</div>}
        {picked.map((p, idx) => {
          const prod = products.find(x=> x.id === p.item.productId) || {}
          return (
            <div key={idx} className="bg-slate-900 p-3 rounded">
              <img src={prod.image} className="w-full h-28 object-cover rounded mb-2" />
              <div className="font-semibold text-white">{prod.name?.en || prod.name}</div>
              <div className="text-slate-400">Order #{p.orderId} — Status: {p.orderStatus}</div>
              <div className="text-slate-400">Picked: {p.item.pickedQty || (p.item.requestedQty || p.item.qty || p.item.quantity)}</div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
