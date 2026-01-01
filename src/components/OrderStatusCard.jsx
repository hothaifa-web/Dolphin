import React, { useEffect, useState, useRef, useCallback } from 'react'
import AppEngine from '../services/AppEngine'

const STORAGE_KEY = 'active_order_v1'

function formatCountdown(ms){
  if(ms <= 0) return '0m'
  const mins = Math.ceil(ms/60000)
  return `${mins}m`
}

export default function OrderStatusCard(){
  const [order, setOrder] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) }catch(e){ return null }
  })
  const [now, setNow] = useState(Date.now())

  useEffect(()=>{
    const t = setInterval(()=> setNow(Date.now()), 1000)
    return ()=> clearInterval(t)
  },[])

  useEffect(()=>{
    function handleEvent(ev){
      if(!ev || !ev.type) return
      // AppEngine events: { type: 'order:updated', order }
      if(ev.type === 'order:updated' && ev.order){
        setOrder(ev.order)
        try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(ev.order)) }catch(e){}
      }
      if(ev.type === 'order:placed' && ev.order){
        setOrder(ev.order)
        try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(ev.order)) }catch(e){}
      }
      if(ev.type === 'order:cleared'){
        setOrder(null)
        try{ localStorage.removeItem(STORAGE_KEY) }catch(e){}
      }
    }
    const unsub = AppEngine.subscribe(handleEvent)
    // also listen to storage (cross-tab / restart)
    function onStorage(e){ if(e.key === STORAGE_KEY) setOrder(e.newValue ? JSON.parse(e.newValue) : null) }
    window.addEventListener('storage', onStorage)
    return ()=>{ unsub && unsub(); window.removeEventListener('storage', onStorage) }
  },[])

  const clearOrder = useCallback(()=>{
    setOrder(null)
    try{ localStorage.removeItem(STORAGE_KEY) }catch(e){}
    AppEngine.emit && AppEngine.emit({ type: 'order:cleared' })
  },[])

  if(!order) return null

  // normalize statuses from mock: treat 'pending'|'preparing' as preparing, 'ready'|'prepared' as ready,
  // 'on_the_way'|'in_transit'|'on_the_way' as in_transit
  const rawStatus = (order && order.status) ? order.status : 'pending'
  let status = 'preparing'
  if(['ready','prepared','ready_for_pickup'].includes(rawStatus)) status = 'ready'
  else if(['on_the_way','in_transit','on_the_way','out_for_delivery'].includes(rawStatus)) status = 'in_transit'
  else status = 'preparing'

  // ETA: use `estimatedReadyAt` or `estimatedReadyAt` fallback
  const eta = order.estimatedReadyAt || order.estimatedReadyAt || (Date.now() + (15*60000))
  const msLeft = eta - now

  if(status === 'preparing'){
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-50 bg-white text-black rounded-lg shadow-lg p-4 touch-manage">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded flex items-center justify-center">☕</div>
          <div className="flex-1">
            <div className="font-bold text-black">We're preparing your order</div>
            <div className="text-sm font-bold text-black">Estimated time: {formatCountdown(msLeft)} • Preparing</div>
            <div className="mt-2 flex gap-2">
              <button onClick={()=> navigator.vibrate && navigator.vibrate(50)} className="px-3 py-1 rounded bg-slate-100 font-bold text-black">Ping</button>
              <button onClick={clearOrder} className="px-3 py-1 rounded bg-red-100 text-red-700 font-bold">Cancel Order</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if(status === 'ready'){
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-50 bg-white text-black rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-emerald-100 rounded flex items-center justify-center">✅</div>
          <div className="flex-1">
            <div className="font-bold text-black">Order Prepared!</div>
            <div className="text-sm font-bold text-black">Your driver is on the way.</div>
            <div className="mt-2 flex gap-2">
              <button onClick={()=> AppEngine.emit && AppEngine.emit({ type: 'order:in_transit', order })} className="px-3 py-1 rounded bg-emerald-200 font-bold text-black">Driver Picked Up</button>
              <button onClick={clearOrder} className="px-3 py-1 rounded bg-red-100 text-red-700 font-bold">Dismiss</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // in_transit -> nothing here, LiveTracking component will show
  return null
}
