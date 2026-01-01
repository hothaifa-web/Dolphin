import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { useCart } from '../contexts/CartContext'
import AppEngine from '../services/AppEngine'
import { getUsers } from '../data/mock'
import { getCurrentPosition } from '../utils/capacitorGeolocation'
import DolphinSuccess from '../components/DolphinSuccess'

export default function CustomerCheckout() {
  const navigate = useNavigate()
  const { items: cartItems, clearCart, total } = useCart()
  const [address, setAddress] = useState('')
  const [location, setLocation] = useState(null)
  const [payment, setPayment] = useState('cash')
  const [card, setCard] = useState({ number: '', exp: '', cvv: '' })
  const [coupon, setCoupon] = useState({ code: '', applied: false })
  const [suggestions, setSuggestions] = useState(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markerRef = useRef(null)
  const leafletLoaded = useRef(false)

  useEffect(()=>{
    try{ const cp = JSON.parse(localStorage.getItem('coupon')||'null'); if(cp) setCoupon(cp) }catch(e){}
  },[])

  async function useMyLocation(){
    setLoadingLocation(true)
    try{
      const pos = await getCurrentPosition()
      setLocation(pos)
      try{ await ensureLeaflet(); initOrMoveMap(pos.lat, pos.lng) }catch(e){}
      try{
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.lat}&lon=${pos.lng}`
        const res = await fetch(url, { headers: { 'User-Agent': 'dolphin-app' } })
        const data = await res.json()
        const addr = data.address || {}
        const suggested = [addr.neighbourhood, addr.suburb, addr.village, addr.town, addr.city].filter(Boolean)[0]
        if(suggested){
          setSuggestions({ suggested, formatted: data.display_name })
          setAddress(prev => prev ? prev : `${suggested}`)
        }else{
          setAddress(`lat:${pos.lat.toFixed(4)}, lng:${pos.lng.toFixed(4)}`)
        }
      }catch(e){
        setAddress(`lat:${pos.lat.toFixed(4)}, lng:${pos.lng.toFixed(4)}`)
      }
    }catch(e){
      alert('فشل في الحصول على الموقع')
    }finally{ setLoadingLocation(false) }
  }

  async function ensureLeaflet(){
    if(leafletLoaded.current) return
    const cssHref = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    if(!document.querySelector(`link[href="${cssHref}"]`)){
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = cssHref
      document.head.appendChild(link)
    }
    if(!window.L){
      await new Promise((resolve, reject)=>{
        const s = document.createElement('script')
        s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        s.async = true
        s.onload = () => resolve()
        s.onerror = (e) => reject(e)
        document.body.appendChild(s)
      })
    }
    leafletLoaded.current = true
  }

  function initOrMoveMap(lat, lng){
    if(!leafletLoaded.current || !mapRef.current) return
    const L = window.L
    if(!mapInstance.current){
      mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([lat, lng], 15)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(mapInstance.current)
      mapInstance.current.on('click', async (e)=>{
        const { lat: clat, lng: clng } = e.latlng
        placeMarker(clat, clng)
        try{
          const data = await reverseGeocode(clat, clng)
          if(data){ setAddress(data.suggested || data.formatted || `lat:${clat.toFixed(4)}, lng:${clng.toFixed(4)}`); setSuggestions(data.suggested ? { suggested: data.suggested, formatted: data.formatted } : null) }
        }catch(e){}
      })
    }else{
      mapInstance.current.setView([lat,lng], 15)
    }
    placeMarker(lat, lng)
  }

  function placeMarker(lat, lng){
    const L = window.L
    if(!L || !mapInstance.current) return
    if(!markerRef.current){
      markerRef.current = L.marker([lat,lng], { draggable: true }).addTo(mapInstance.current)
      markerRef.current.on('dragend', async (ev)=>{
        const p = ev.target.getLatLng()
        try{ const data = await reverseGeocode(p.lat, p.lng); if(data){ setAddress(data.suggested || data.formatted || `lat:${p.lat.toFixed(4)}, lng:${p.lng.toFixed(4)}`); setSuggestions(data.suggested ? { suggested: data.suggested, formatted: data.formatted } : null) } }catch(e){}
      })
    }else{
      markerRef.current.setLatLng([lat,lng])
    }
  }

  async function reverseGeocode(lat, lng){
    try{
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      const res = await fetch(url, { headers: { 'User-Agent': 'dolphin-app' } })
      const data = await res.json()
      const addr = data.address || {}
      const suggested = [addr.neighbourhood, addr.suburb, addr.village, addr.town, addr.city].filter(Boolean)[0]
      return { suggested, formatted: data.display_name }
    }catch(e){ return null }
  }

  function acceptSuggestion(){ if(suggestions){ setAddress(suggestions.suggested); setSuggestions(null) } }

  async function handlePlaceOrder(){
    if(cartItems.length === 0) return alert('السلة فارغة')
    if(!address) return alert('يرجى إدخال العنوان أو استخدام الموقع')

    const byStore = cartItems.reduce((acc,item)=>{ (acc[item.store]=acc[item.store]||[]).push(item); return acc }, {})
    const cpApplied = coupon && coupon.applied
    let couponRemaining = cpApplied ? 3 : 0

    try{
      Object.keys(byStore).forEach((store, idx)=>{
        const items = byStore[store]
        const subtotal = items.reduce((s,it)=> s + (it.price * it.qty), 0)
        const itemsCount = items.reduce((s,it)=> s + (it.qty||0), 0)
        const prepMinutes = Math.min(60, Math.max(10, itemsCount * 10))
        const storeUser = (getUsers && getUsers().find ? getUsers().find(u => u.role === 'store' && (u.name === store || u.username === store)) : null) || {}
        const region = storeUser.region || ''
        const estimatedReadyAt = Date.now() + prepMinutes * 60_000

        let discount = 0
        if(couponRemaining > 0){ discount = Math.min(couponRemaining, subtotal); couponRemaining -= discount }
        const orderTotal = Math.max(0, subtotal - discount)

        const paymentDetails = { method: payment, ...(payment === 'card' ? { card } : {}) }

        AppEngine.placeOrder({ userId: 999, items: items.map(it=>({ productId: it.id, qty: it.qty })), total: orderTotal, store, location: address, prepMinutes, region, estimatedReadyAt, payment: paymentDetails })
      })

      try{ clearCart(); localStorage.removeItem('coupon') }catch(e){}
      setShowSuccess(true)
    }catch(e){ console.error('placeOrder error', e); alert('خطأ في إنشاء الطلب: ' + (e.message||'')) }
  }

  function onSuccessDone(){ setShowSuccess(false); navigate('/customer/orders') }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-32 text-black">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <h1 className="text-2xl font-bold text-black">إتمام الطلب - Dolphin Store</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 w-full">
        <div className="bg-white rounded p-4 shadow grid md:grid-cols-[1fr_320px] gap-6">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">العنوان والتوصيل</h3>
            <div ref={mapRef} className="w-full h-64 rounded mb-2 border" />
            <div className="flex gap-2 items-center mb-2">
              <button onClick={async () => { await ensureLeaflet(); await useMyLocation() }} className="px-3 py-2 bg-indigo-600 text-white rounded">{loadingLocation ? '...جارٍ' : 'استخدام موقعي'}</button>
            </div>
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="أدخل عنوان التوصيل" className="w-full border rounded p-2 mb-2" />
            {suggestions && (
              <div className="mb-2 p-2 bg-blue-50 border rounded flex items-center justify-between">
                <div className="text-sm">اقتراح عنوان: <strong>{suggestions.suggested}</strong></div>
                <div className="flex gap-2">
                  <button onClick={acceptSuggestion} className="px-2 py-1 bg-blue-600 text-white rounded text-sm">استخدم</button>
                  <button onClick={() => setSuggestions(null)} className="px-2 py-1 border rounded text-sm">رفض</button>
                </div>
              </div>
            )}

            <h3 className="font-semibold mb-2 mt-4">طريقة الدفع</h3>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2"><input type="radio" checked={payment === 'cash'} onChange={() => setPayment('cash')} /> نقداً</label>
              <label className="flex items-center gap-2"><input type="radio" checked={payment === 'card'} onChange={() => setPayment('card')} /> بطاقة</label>
            </div>
            {payment === 'card' && (
              <div className="space-y-2">
                <input placeholder="رقم البطاقة" value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} className="w-full border rounded p-2" />
                <div className="flex gap-2">
                  <input placeholder="MM/YY" value={card.exp} onChange={e => setCard({ ...card, exp: e.target.value })} className="flex-1 border rounded p-2" />
                  <input placeholder="CVV" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} className="w-24 border rounded p-2" />
                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-80 min-w-[260px] flex flex-col gap-4">
            <div>
              <h3 className="font-semibold">ملخص الطلب</h3>
              <div className="mt-3 space-y-3">
                {cartItems.length === 0 && <div className="text-sm text-slate-500">السلة فارغة</div>}
                {cartItems.map(it => (
                  <div key={it.id} className="flex items-center gap-3">
                    <img src={it.image || '/food-illustration.jpg'} alt="thumb" className="w-14 h-14 object-cover rounded" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{typeof it.name === 'object' ? (it.name.en || it.name.ar || Object.values(it.name)[0]) : it.name}</div>
                      <div className="text-xs text-slate-500">x{it.qty}</div>
                    </div>
                    <div className="text-sm font-semibold">${(it.price * it.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between text-sm"><div>المجموع</div><div className="font-bold">${total.toFixed(2)}</div></div>
              <div className="text-xs text-slate-500 mt-1">شامل الضرائب والتوصيل (إن وجد)</div>
            </div>

            <div className="flex gap-2 items-center mt-2">
              <div className="flex items-center gap-2 bg-white border p-2 rounded shadow-sm">
                <div className="text-lg">🔒</div>
                <div className="text-xs">دفع آمن</div>
              </div>
              <div className="flex items-center gap-2 bg-white border p-2 rounded shadow-sm">
                <div className="text-lg">⚡</div>
                <div className="text-xs">توصيل سريع</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handlePlaceOrder}
            style={{ boxShadow: '0 6px 24px rgba(0,119,190,0.45)' }}
            className="px-6 py-4 rounded-full text-white font-bold text-lg bg-[#0077be]"
          >
            Confirm Order
          </button>
        </div>
      </div>

      {showSuccess && <DolphinSuccess onDone={onSuccessDone} />}

      <BottomNav />
    </div>
  )
}
