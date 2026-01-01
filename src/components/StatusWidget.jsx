import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { getOrders } from '../data/mock'
import AppEngine from '../services/AppEngine'

export default function StatusWidget({ className = 'w-full', compact = false }){
  const navigate = useNavigate()
  const { user } = useAuth() || {}
  const [activeOrder, setActiveOrder] = useState(null)

  const findActiveOrder = () => {
    try{
      if(!user) return null
      const orders = getOrders().filter(o => o.userId === user.id && o.status !== 'delivered' && o.status !== 'cancelled')
      if(!orders || orders.length === 0) return null
      return orders.sort((a,b)=> (b.date || 0) - (a.date || 0))[0]
    }catch(e){ return null }
  }

  useEffect(()=>{
    setActiveOrder(findActiveOrder())
    const unsub = AppEngine.subscribe(ev => {
      // update when relevant app events occur for this user
      if(!user) return
      if(ev && ev.order && ev.order.userId === user.id) setActiveOrder(findActiveOrder())
      if(ev && ev.type === 'app:newOrder' && ev.order && ev.order.userId === user.id) setActiveOrder(findActiveOrder())
      if(ev && ev.type === 'app:driverAssigned' && ev.order && ev.order.userId === user.id) setActiveOrder(findActiveOrder())
    })
    return () => unsub && unsub()
  }, [user])

  const initials = useMemo(()=>{
    if(!user) return 'U'
    const parts = (user.name || user.username || '').toString().split(' ').filter(Boolean)
    if(parts.length === 0) return 'U'
    if(parts.length === 1) return parts[0].slice(0,1).toUpperCase()
    return (parts[0].slice(0,1) + parts[parts.length-1].slice(0,1)).toUpperCase()
  }, [user])

  return (
    <div className={`bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow ${className}`}>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-xl text-white font-semibold">{user ? (user.picture ? <img src={user.picture} alt="avatar" className="w-20 h-20 rounded-full object-cover" /> : initials) : initials}</div>

        <div className="flex-1">
          {user ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">مرحبًا، {user.name || user.username}</div>
                  <div className="text-sm text-slate-400">{user.email || user.phone || 'عميل'}</div>
                </div>
                <div>
                  <button onClick={()=> navigate('/customer/profile')} className="text-xs text-indigo-500">الملف ▸</button>
                </div>
              </div>

              {activeOrder ? (
                <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="text-sm text-slate-400">طلب جاري</div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="font-semibold">#{activeOrder.id} — {activeOrder.store}</div>
                    <div className="text-sm text-slate-500">{activeOrder.status}</div>
                  </div>
                  <div className="text-sm text-slate-400 mt-2">المجموع: ${activeOrder.total} • تحضير ~{activeOrder.prepMinutes || '—'} د</div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={()=> navigate('/customer/orders')} className="px-3 py-1 bg-indigo-600 text-white rounded">تتبع الطلب</button>
                    <button onClick={()=>{ if(window.confirm('الغاء الطلب؟')){ AppEngine.emit({ type: 'app:cancelRequest', orderId: activeOrder.id }); alert('طلبك تم إرساله للإلغاء (محاكاة)') } }} className="px-3 py-1 bg-slate-100 rounded">إلغاء</button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-sm text-slate-400">لا توجد طلبات حالية — هذا مكوّن مؤقت لعرض الحالة، سيُستبدل لاحقًا.</div>
              )}
            </>
          ) : (
            <div>
              <div className="font-semibold">لا يوجد حساب مسجل</div>
              <div className="text-sm text-slate-400">سجّل الدخول لرؤية حالة طلباتك</div>
              <div className="mt-3">
                <button onClick={()=> navigate('/login')} className="px-3 py-1 bg-indigo-600 text-white rounded">تسجيل الدخول</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
