import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, getProducts, getUsers, getOrders } from '../data/mock'
import BottomNav from '../components/BottomNav'
import StatusWidget from '../components/StatusWidget'
import AppEngine from '../services/AppEngine'
import { useAuth } from '../components/AuthProvider'
import { useCart } from '../contexts/CartContext'

function SkeletonCard(){
  return (
    <div className="bg-white rounded-lg p-4 shadow animate-pulse">
      <div className="bg-slate-200 h-36 rounded mb-3" />
      <div className="h-4 bg-slate-200 rounded w-2/3 mb-2" />
      <div className="h-3 bg-slate-200 rounded w-1/3" />
    </div>
  )
}

export default function CustomerHome(){
  const navigate = useNavigate()
  const { user, unreadNotifications } = useAuth() || {}
  const { items: cart, addItem, changeQty, removeItem, clearCart, total } = useCart()
  const [query, setQuery] = useState('')
  const [hasNotifications, setHasNotifications] = useState(Boolean(unreadNotifications))
  const [expandedSearch, setExpandedSearch] = useState(false)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)
  

  useEffect(()=>{
    setTimeout(()=>{
      const prods = getProducts()
      setProducts(prods)
      const uniq = Array.from(new Set(prods.map(p=>p.store)))
      setStores(uniq)
      setLoading(false)
    }, 400)
  },[])

  // Carousel removed: Hot Offer box is now static (no auto-rotation)

  useEffect(()=>{ setHasNotifications(Boolean(unreadNotifications)) }, [unreadNotifications])

  const offersByStore = useMemo(()=>{
    const map = {}
    for(const p of products){
      if(p.offer || (p.tags||[]).includes('offer')){
        map[p.store] = map[p.store] || []
        map[p.store].push(p)
      }
    }
    return map
  }, [products])

  const categories = CATEGORIES
  const filteredCategories = useMemo(()=> categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase())), [categories, query])
  const lastOrders = useMemo(()=>{ if(!user) return []; return getOrders().filter(o=> o.userId === user.id).slice(-3).reverse() }, [user])

  function addToCart(product){
    // single-store rule: prompt and clear if adding from different store
    if(cart.length > 0 && cart[0].store && cart[0].store !== product.store){
      const confirmed = window.confirm(`Your cart has items from ${cart[0].store}.\n\nAdd items from ${product.store}? (This will clear your cart)`)
      if(!confirmed) return
      clearCart()
    }
    addItem(product, 1)
  }

  function cartTotal(){ return total.toFixed(2) }

  async function placeOrder(){
    if(!user){ navigate('/login'); return }
    if(cart.length === 0) return alert('Cart is empty')
    try{
      const items = cart.map(i=> ({ productId: i.id, quantity: i.qty }))
      const tot = Number(total)
      setLoading(true)
      await AppEngine.placeOrder({ userId: user.id, items, total: tot, payment: { method: 'wallet' }, store: cart[0]?.store || '' })
      setShowSuccess(true)
      setTimeout(()=>{
        clearCart()
        setShowSuccess(false)
        setLoading(false)
        navigate('/customer/orders')
      }, 1600)
    }catch(e){
      setLoading(false)
      alert(e.message || 'Order failed')
    }
  }

  const storeUsers = useMemo(()=> getUsers(), [])

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-28">
      {/* Glass header */}
      <div className="sticky top-0 z-30 backdrop-blur-md bg-white/60 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold">E</div>
            <div>
              <div className="text-xs text-slate-500">Delivery to</div>
              <button className="text-sm font-semibold" onClick={()=> alert('Change address (mock)')}>Home — 23 Elm St ▾</button>
            </div>
          </div>
          <div className="flex-1">
            <div className={`mx-auto max-w-xl transition-all ${expandedSearch ? 'scale-100' : ''}`}>
              <div className="relative">
                <input value={query} onChange={e=>setQuery(e.target.value)} onFocus={()=>setExpandedSearch(true)} onBlur={()=>setTimeout(()=>setExpandedSearch(false), 150)} placeholder="Search for dishes, stores or offers" className="w-full px-4 py-2 rounded-full border border-gray-200 shadow-sm focus:ring-1 focus:ring-indigo-300" />
                {expandedSearch && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg p-3">
                    <div className="text-sm text-slate-500">Recent searches</div>
                    <div className="flex gap-2 mt-2">
                      <button className="px-3 py-1 bg-slate-100 rounded">Burger</button>
                      <button className="px-3 py-1 bg-slate-100 rounded">Pizza</button>
                      <button className="px-3 py-1 bg-slate-100 rounded">Sushi</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative" onClick={()=>{ setHasNotifications(false); navigate('/customer/orders') }}>
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              {hasNotifications && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Dynamic Status Widget: shows map, order state, driver/customer info */}
        <div className="relative mb-6" style={{ marginTop: '-1cm' }}>
          <div className="overflow-hidden rounded-2xl">
            <div className="p-4 bg-transparent">
              <StatusWidget />
            </div>
          </div>
        </div>

        {/* Categories horizontal */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">Categories</h4>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {filteredCategories.map(c=> (
              <button key={c.id} onClick={()=> navigate(`/customer/category/${c.id}`)} className="flex-none flex flex-col items-center gap-2 w-20">
                <div className="w-16 h-16 rounded-full bg-white shadow flex items-center justify-center text-2xl hover:scale-105 transition">{c.icon}</div>
                <div className="text-xs text-center">{c.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Order again */}
        {lastOrders.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">Order Again</h4>
            <div className="flex gap-3 overflow-x-auto">
              {lastOrders.map(o=> (
                <div key={o.id} className="flex-none bg-white rounded-lg p-3 shadow w-56">
                  <div className="text-sm text-slate-500">#{o.id}</div>
                  <div className="font-semibold mt-1">{o.store || 'Store'}</div>
                  <div className="text-sm text-slate-500 mt-2">{(o.items||[]).slice(0,2).map(it=> `${it.quantity||it.qty||1}x`).join(' ')}</div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={()=>{ /* quick reorder: add items to cart */ alert('Reorder (mock)') }} className="px-3 py-1 bg-indigo-600 text-white rounded">Reorder</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stores grid */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Nearby Stores</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(loading ? Array.from({length:6}) : stores).map((store, idx) => {
              if(loading) return <SkeletonCard key={idx} />
              const sample = products.find(p=> p.store === store) || {}
              const storeUser = storeUsers.find(u=> (u.name===store || u.username===store)) || {}
              const closed = storeUser.status !== 'active'
              return (
                <div key={store} onClick={()=> navigate(`/customer/store/${encodeURIComponent(store)}`)} role="button" tabIndex={0} className={`bg-white rounded-lg shadow overflow-hidden relative ${closed? 'filter grayscale opacity-70' : ''} cursor-pointer`}>
                  <div className="relative">
                    <img src={sample.image} alt={store} className="w-full h-44 object-cover" />
                    <div className="absolute top-3 left-3 bg-white/90 text-sm rounded-full px-3 py-1 font-semibold">{sample.prepMinutes || '25'} min</div>
                    <div className="absolute top-3 right-3 bg-white/90 text-sm rounded-full px-2 py-1 flex items-center gap-1">⭐ { (sample.rating || 4.5) }</div>
                    {closed && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xl font-bold">Closed Now</div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{store}</div>
                      <div className="text-sm text-slate-500">{getUsers().find(u=>u.name===store)?.region || ''}</div>
                    </div>
                    <div className="mt-2 text-sm text-slate-500">{sample.name?.en || sample.name || 'Popular items'}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <div />
                      <div />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* Floating cart bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-50 flex justify-center">
          <div className="max-w-6xl w-full px-4">
            <div className="bg-white rounded-full shadow-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center">🛒</div>
                <div>
                  <div className="font-semibold">{cart.length} items — ${cartTotal()}</div>
                  <div className="text-xs text-slate-500">Quick checkout</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={()=> navigate('/customer/cart')} className="px-4 py-2 bg-slate-100 rounded">View Cart</button>
                <button onClick={placeOrder} className="px-4 py-2 bg-green-500 text-white rounded">Place Order</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success modal (simple animation) */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-black/70 p-6 rounded-lg flex flex-col items-center gap-4 text-white">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-3xl">✓</div>
            <div className="font-semibold">Order Confirmed</div>
            <div className="text-sm text-slate-500">Your order is on the way — tracking will appear in Orders.</div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

