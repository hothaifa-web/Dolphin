import React from 'react'
import Layout from '../components/Layout'
import { getOrders, subscribe, getProducts } from '../data/mock'
import { playNewOrder, playDriverArrived, playPickedUp, ensureAudioContext } from '../services/sounds'
import { useAuth } from '../components/AuthProvider'
import { useNavigate } from 'react-router-dom'

export default function StoreOrders(){
  const { user } = useAuth()
  const side = [ {label:'Dashboard', to:'/store'}, {label:'Products', to:'/store/products'}, {label:'Orders', to:'/store/orders'} ]
  const [orders, setOrders] = React.useState(() => getOrders().filter(o=> !user || o.store === user.name))
  const products = React.useMemo(()=> getProducts(), [])
  const navigate = useNavigate()

  React.useEffect(()=>{
    const unsub = subscribe(ev => {
      if(ev.type === 'tick'){
        try{ ensureAudioContext() }catch(e){}
      }
      if(ev.type === 'order' || ev.type === 'update' || ev.type === 'tick') setOrders(getOrders().filter(o=> !user || o.store === user.name))
      if(user && ev.order && (ev.type === 'order' || ev.type === 'update')){
        try{
          if(ev.type === 'order' && ev.order.store === user.name) playNewOrder()
          if(ev.type === 'update' && ev.order.store === user.name){
            if(ev.order.status === 'ready_for_pickup') playDriverArrived()
            if(ev.order.status === 'picked_up') playPickedUp()
          }
        }catch(e){}
      }
    })
    return () => unsub()
  }, [user])

  return (
    <Layout sideItems={side}>
      {/* Count prepared today */}
      {(() => {
        const preparedStatuses = ['preparing','ready_for_pickup','picked_up']
        const today = (d) => {
          if(!d) return false
          const dt = new Date(d)
          const now = new Date()
          return dt.getFullYear() === now.getFullYear() && dt.getMonth() === now.getMonth() && dt.getDate() === now.getDate()
        }
        const preparedToday = orders.filter(o => preparedStatuses.includes(o.status) && (today(o.readyAt) || today(o.date))).length
        return <h2 className="text-xl font-semibold mb-4">طلبات المتجر {preparedToday > 0 ? `(${preparedToday} جاهزة اليوم)` : ''}</h2>
      })()}

      {orders.length === 0 ? (
        <div className="p-6 bg-slate-800 rounded text-slate-300">لا توجد طلبات حالياً</div>
      ) : (
        (() => {
          // show cancelled + prepared orders only
          const visible = orders.filter(o => o.status === 'cancelled' || ['preparing','ready_for_pickup','picked_up'].includes(o.status))
          if(visible.length === 0) return <div className="p-6 bg-slate-800 rounded text-slate-300">لا توجد طلبات ملغاة أو مُجهزة</div>
          return (
            <div className="space-y-3">
              {visible.map(o => (
                <div key={o.id} onClick={() => navigate(`/store/orders/${o.id}`)} className="cursor-pointer bg-slate-800 p-4 rounded">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">طلب #{o.id}</div>
                      <div className="text-sm text-slate-400">{(o.items||[]).length} أصناف — ${o.total}</div>
                    </div>
                    <div className="text-sm text-slate-300">{o.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        })()
      )}
    </Layout>
  )
}
