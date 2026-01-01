import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getProducts, getUsers } from '../data/mock'
import { useCart } from '../contexts/CartContext'
import { motion } from 'framer-motion'
import '../styles/dolphin-store.css'

const CATS = [
  'عرض كل العروض',
  'الدواجن واللحوم والاسماك',
  'مخبوزات',
  'أطعمة طازجة',
  'الفواكه والخضروات',
  'المعلبات',
  'العناية الشخصية',
  'الصحة والجمال',
  'المستلزمات المنزلية',
  'التبغ',
  'الطهي والخبز',
  'منتجات الالبان والبيض',
  'حليب',
  'المشروبات',
  'طعام الافطار',
  'البروتين والنظام الغذائي',
  'ركن الاطفال',
  'لوازم المكتب والالعاب',
  'الوجبات الخفيفة والشوكلاته',
  'القهوه والشاي',
  'للاستخدام الواحد',
  'الاطعمه المجمده',
  'ايس كريم',
  'التوابل والصلصات',
  'التنظيف والغسيل',
  'جاهز للاكل',
  'Main Meals',
  'Sides',
  'Drinks',
  'Desserts'
]

function ProfessionalOfferSlider({ storeName }){
  const [offers, setOffers] = useState([])
  const [index, setIndex] = useState(0)
  const timer = useRef(null)

  useEffect(()=>{
    try{
      const approved = JSON.parse(localStorage.getItem('approved_offers')||'[]')
      const list = approved.filter(o => {
        if(!storeName) return true
        return !o.store || o.store === decodeURIComponent(storeName)
      })
      setOffers(list)
      setIndex(0)
    }catch(e){ setOffers([]) }
  }, [storeName])

  useEffect(()=>{
    if(timer.current) clearInterval(timer.current)
    if(!offers || offers.length <= 1) return
    timer.current = setInterval(()=>{
      setIndex(i => (i+1) % offers.length)
    }, 3000)
    return ()=> clearInterval(timer.current)
  }, [offers])

  if(!offers || !offers.length) return null

  const active = offers[index]

  return (
    <div className="professional-offer mb-4" aria-hidden={false}>
      <div className="relative rounded-2xl overflow-hidden shadow-xl professional-offer-card" style={{ background: 'linear-gradient(90deg,#0077be 0%, #01203a 100%)' }}>
        <div className={`slide offer-appear`}>
          <div className="left">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-white/6 flex items-center justify-center">
              <img src={active.image || '/food-illustration.jpg'} alt={active.productName} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="right text-white pr-4">
            <div className="flex items-center gap-3">
              <span className="offer-badge">Limited Time Offer</span>
              <div className="ml-auto text-sm opacity-80">{active.store || decodeURIComponent(storeName)}</div>
            </div>
            <h3 className="mt-3 text-2xl font-extrabold tracking-tight">{active.productName}</h3>
            <p className="mt-2 opacity-90">{active.discountValue || 'عرض محدود — لا تفوّت الفرصة'}</p>
            <div className="mt-4 flex items-end gap-4">
              <div className="offer-price">${active.offerPrice ?? active.price ?? '0.00'}</div>
              {active.originalPrice ? <div className="text-slate-200 line-through">${active.originalPrice}</div> : null}
              <div className="ml-auto">
                <button className="btn-shine px-4 py-2 rounded-lg bg-white/10 text-white">اطلب الآن</button>
              </div>
            </div>
          </div>
        </div>
        <div className="glass-overlay" />
      </div>
      <div className="dots mt-2">
        {offers.map((_, i) => <div key={i} className={`dot ${i===index? 'active':''}`} onClick={()=> setIndex(i)} />)}
      </div>
    </div>
  )
}

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 }
}

const listVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const itemVariant = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.28 } } }

export default function StoreDetail(){
  const { storeName } = useParams()
  const navigate = useNavigate()
  const products = useMemo(()=> getProducts().filter(p=> p.store === decodeURIComponent(storeName) && (p.active !== false)), [storeName])
  const storeUser = useMemo(()=> getUsers().find(u=> u.role === 'store' && (u.name === decodeURIComponent(storeName) || u.username === decodeURIComponent(storeName))), [storeName])
  const isOpen = storeUser ? (storeUser.status === 'active') : true
  const { items: cart, addItem, changeQty } = useCart()
  const [activeCat, setActiveCat] = useState('عرض كل العروض')
  const headerRef = useRef(null)

  const filtered = useMemo(()=>{
    if(!activeCat || activeCat === 'عرض كل العروض') return products
    return products.filter(p=> (p.category||'') === activeCat || (p.tags||[]).includes(activeCat) || (p.name?.ar || '').includes(activeCat) || (p.name?.en || '').toLowerCase().includes(activeCat.toLowerCase()))
  }, [products, activeCat])

  return (
    <Layout sideItems={[]}>
      <div className="min-h-screen pb-32 dolphin-store-page">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Header - The Dolphin Crown */}
          <div ref={headerRef} className="dolphin-header sticky top-0 z-40">
            <div className="dolphin-header-inner flex items-center">
              <motion.img src="/1.png" alt="Dolphin" className="dolphin-logo" animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }} />
              <div className="dolphin-store-name ml-3 text-right">
                <div className="text-xl font-extrabold">{decodeURIComponent(storeName)}</div>
                <div className="text-sm text-slate-400">Dolphin — تجربة فاخرة</div>
              </div>
              <div className="ml-auto" />
            </div>

            <div className="mt-3">
              <div className="relative">
                <input className="store-search" placeholder="ابحث في المتجر..." />
                {/* Floating Offer Card positioned under search */}
                <div className="offer-floating-wrapper">
                  <ProfessionalOfferSlider storeName={storeName} />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery fee info */}
          <div className="mt-4 p-3 glass-card text-sm">
            رسوم التوصيل: ابتداءً من <strong>0.50 د.أ</strong>. كل دقيقة على الطريق تُضاف رسوم، وكل 100 متر يخصم السائق <strong>0.15 د.أ</strong>.
          </div>

          {/* Horizontal Category Tabs */}
          <div className="mt-6">
            <div className="cat-tabs overflow-x-auto no-scrollbar">
              <motion.div className="flex gap-3 px-1" initial="hidden" whileInView="show" viewport={{ once: true }} variants={listVariants}>
                {CATS.slice(0,12).map((c, i) => (
                  <motion.button key={c} onClick={() => setActiveCat(c)} className={`cat-pill ${activeCat===c ? 'active' : ''}`} variants={itemVariant}>
                    <span className="cat-icon">☕</span>
                    <span className="cat-text">{c}</span>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Products grid */}
          <div className="mt-4">
            {!isOpen && (
              <div className="mb-4 p-3 bg-red-600 text-white rounded">المتجر مغلق حالياً</div>
            )}

            {filtered.length === 0 ? (
              <div className="empty-state p-8 text-center">
                <div className="empty-svg mb-4" aria-hidden>
                  {/* Dolphin diving SVG */}
                  <svg width="240" height="160" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 120 C60 60, 180 60, 220 120" stroke="#0077be" strokeWidth="6" strokeLinecap="round" fill="none"/>
                    <circle cx="90" cy="70" r="16" fill="#00a1d6" />
                    <path d="M110 80 C120 60, 150 60, 160 80" stroke="#0077be" strokeWidth="4" strokeLinecap="round" fill="#00a1d6" opacity="0.9"/>
                    <g transform="translate(40,80)">
                      <path d="M0 30 Q30 0 60 30 Q80 45 110 20" stroke="#005f9a" strokeWidth="3" fill="none"/>
                    </g>
                  </svg>
                </div>
                <div className="text-lg font-semibold">Finding the best deals for you...</div>
                <div className="text-sm text-slate-500 mt-2">نبحث في المتجر عن أفضل العروض — انتظر لحظة</div>
              </div>
            ) : (
              <motion.div initial="hidden" animate="show" variants={listVariants} className="grid grid-cols-2 gap-4">
                {filtered.map(p => {
                  const inCart = cart.find(c => c.id === p.id)
                  const qty = inCart ? (inCart.qty || 0) : 0
                  return (
                    <motion.article key={p.id} className="product-card-glass" variants={itemVariant}>
                      <div className="thumb relative">
                        <img src={p.image || '/food-illustration.jpg'} alt={typeof p.name === 'object' ? (p.name.ar||p.name.en) : p.name} className="w-full h-36 object-cover rounded-lg" />
                        <button className="quick-add" onClick={() => addItem(p,1)} aria-label={`إضافة ${p.name}`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 12H19" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                      </div>
                      <div className="p-2 text-right">
                        <div className="text-sm font-medium">{typeof p.name === 'object' ? (p.name.ar||p.name.en) : p.name}</div>
                        <div className="text-xs text-slate-400 mt-1">{p.short || ''}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-lg font-bold text-ocean">${p.price?.toFixed(2)}</div>
                          <div>
                            {qty > 0 ? (
                              <div className="qty-controls flex items-center gap-2">
                                <button className="px-2 py-1 border rounded" onClick={() => changeQty(p.id, Math.max(0, qty-1))}>−</button>
                                <div className="px-3 py-1 border rounded-full">{qty}</div>
                                <button className="px-2 py-1 bg-ocean-blue text-white rounded" onClick={() => changeQty(p.id, qty+1)}>+</button>
                              </div>
                            ) : (
                              <button className="add-btn-glass px-3 py-1 bg-ocean-blue text-white rounded" onClick={() => addItem(p,1)}>Quick Add</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </motion.div>
            )}
          </div>

        </div>

        {/* Floating Dock Navigation (custom high-end mobile style) */}
        <div className="floating-dock">
          <button className="dock-item" onClick={()=> navigate('/')}>الصفحة الرئيسية</button>
          <button className="dock-item dock-cart" onClick={()=> navigate('/customer/cart')}>السلة ({cart.reduce((s,i)=> s + (i.qty||0),0)})</button>
          <button className="dock-item" onClick={()=> window.scrollTo({ top: 0, behavior: 'smooth' })}>أعلى</button>
        </div>
      </div>
    </Layout>
  )
}
