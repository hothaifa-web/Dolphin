import React, { useEffect, useMemo, useState, useCallback } from 'react'
import Layout from '../components/Layout'
import { PRODUCTS } from '../data/mock'
import { useI18n } from '../i18n'
import ProductCard from '../components/ProductCard'
import CartDrawer from '../components/CartDrawer'
import SkeletonLoader from '../components/SkeletonLoader'
import OrdersTab from '../components/OrdersTab'
import AddressesTab from '../components/AddressesTab'
// useLocalStorage removed; cart is managed by CartContext
import { useCart } from '../contexts/CartContext'
import { Search } from 'lucide-react'
import GlassNavbar from '../components/GlassNavbar'
import GlassCard from '../components/GlassCard'
import { motion, AnimatePresence } from 'framer-motion'

// hero slides will use first few products

export default function Customer(){
  const side = [ {label:'Shop',to:'/customer'}, {label:'Cart',to:'/customer/cart'} ]
  const { lang, t } = useI18n()

  const [query,setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])

  const { items: cartLocal, addItem, itemCount } = useCart()
  const [wishlist, setWishlist] = useLocalStorage('wishlist_v1', [])
  const [cartOpen, setCartOpen] = useState(false)

  const [tab, setTab] = useState('shop')
  const [slideIndex, setSlideIndex] = useState(0)

  const heroSlides = useMemo(()=> products.slice(0,3), [products])

  useEffect(()=>{
    if(!heroSlides || heroSlides.length <= 1) return
    const id = setInterval(()=> setSlideIndex(s => (s+1) % heroSlides.length), 4000)
    return () => clearInterval(id)
  },[heroSlides])

  useEffect(()=>{
    function onOpenCart(){ setCartOpen(true) }
    window.addEventListener('app:openCart', onOpenCart)
    return ()=> window.removeEventListener('app:openCart', onOpenCart)
  },[])

  useEffect(()=>{
    // simulate API load
    setLoading(true)
    const tId = setTimeout(()=>{ setProducts(PRODUCTS); setLoading(false) }, 400)
    return ()=>clearTimeout(tId)
  },[])

  const categories = useMemo(()=>{
    const uniq = new Set(products.map(p=>p.store))
    return Array.from(uniq)
  },[products])

  const filtered = useMemo(()=>{
    let list = products.slice()
    if(query) list = list.filter(p=> (p.name?.en || '').toLowerCase().includes(query.toLowerCase()))
    if(category) list = list.filter(p=> p.store === category)
    return list
  },[products,query,category])

  const addToCart = useCallback((product) => { addItem(product, 1) }, [addItem])

  const handleToggleWishlist = useCallback((product) => {
    setWishlist(prev => prev.find(p=>p.id===product.id) ? prev.filter(p=>p.id!==product.id) : [{...product}, ...prev])
  }, [setWishlist])

  const wishedSet = useMemo(()=> new Set(wishlist.map(w=>w.id)), [wishlist])

  return (
    <Layout sideItems={side}>
      <GlassNavbar onOpenCart={()=>setCartOpen(true)} />
      <div className="pt-28">
        <div className="mx-auto mb-6 w-full sm:w-[95%] lg:w-[88%]">
          <div className="relative h-52 rounded-xl overflow-hidden glass-card">
            <AnimatePresence mode="wait">
              {heroSlides.map((s,idx)=> idx === slideIndex && (
                <motion.div key={s.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.6 }} className="absolute inset-0">
                  <img src={s.image} alt={s.name?.en} className="hero-slide-img" />
                  <div className="absolute left-6 bottom-6 text-white">
                    <div className="text-2xl font-bold">{s.name?.en}</div>
                    <div className="mt-1 text-sm text-slate-200">Exclusive offer at {s.store}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Customer</h2>
          <div className="hidden sm:flex items-center bg-slate-800 rounded p-1">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products" className="bg-transparent px-2 py-1 outline-none" />
            <Search className="text-slate-400" />
          </div>
        </div>
          <div className="flex items-center gap-2">
          <button onClick={()=>setTab('shop')} className={`px-3 py-1 rounded ${tab==='shop'? 'bg-indigo-600' : 'bg-slate-800'}`}>Shop</button>
          <button onClick={()=>setTab('orders')} className={`px-3 py-1 rounded ${tab==='orders'? 'bg-indigo-600' : 'bg-slate-800'}`}>My Orders</button>
          <button onClick={()=>setTab('addresses')} className={`px-3 py-1 rounded ${tab==='addresses'? 'bg-indigo-600' : 'bg-slate-800'}`}>Saved Addresses</button>
          <button onClick={()=>setCartOpen(true)} className="px-3 py-1 bg-emerald-600 rounded">Open Cart ({itemCount})</button>
        </div>
      </div>

      {tab === 'shop' && (
        <div>
          <div className="mb-4 flex gap-2 flex-wrap">
            <button onClick={()=>setCategory('')} className={`px-2 py-1 rounded ${category===''? 'bg-indigo-600' : 'bg-slate-800'}`}>All</button>
            {categories.map(c=> (
              <button key={c} onClick={()=>setCategory(c)} className={`px-2 py-1 rounded ${category===c? 'bg-indigo-600' : 'bg-slate-800'}`}>{c}</button>
            ))}
          </div>

          {loading ? <SkeletonLoader cols={3} rows={2} /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(p=> (
                <ProductCard key={p.id} product={p} lang={lang} onAdd={addToCart} onToggleWishlist={handleToggleWishlist} wished={wishedSet.has(p.id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && <OrdersTab />}
      {tab === 'addresses' && <AddressesTab />}

      <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} />
    </Layout>
  )
}
