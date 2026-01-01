import React, { useState, useEffect } from 'react'
import OfferSlider from '../components/OfferSlider'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getProducts, getUsers } from '../data/mock'
import { useI18n } from '../i18n'
import { useCart } from '../contexts/CartContext'



function BigOffersHero({offers, onClose}){
  const has = offers && offers.length
  const a = has ? offers[0] : { productName: 'لا توجد عروض', discountValue: 'لا توجد عروض معتمداً حالياً', image: '', offerPrice: '' }
  return (
    <div className="professional-offer mb-6">
      <div className="relative rounded-3xl overflow-hidden w-full h-60 md:h-80 lg:h-96" style={{ background: 'linear-gradient(90deg,#ff6fb0,#6b5bff)' }}>
        <div className="slide p-8 flex items-center gap-8 h-full">
          <div className="left w-56 md:w-72 h-full flex-shrink-0">
            <div className="w-full h-full rounded-xl overflow-hidden bg-white/8 flex items-center justify-center">
              <img src={a.image || 'https://via.placeholder.com/560x360'} alt={a.productName} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="right flex-1 text-white h-full flex flex-col justify-center">
            <div className="flex items-center gap-4">
              <span className="offer-badge">Limited Time Offer</span>
            </div>
            <h3 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">{a.productName || 'عرض مميز'}</h3>
            <p className="mt-2 opacity-90 text-base md:text-lg">{a.discountValue || 'عرض لفترة محدودة — لا تفوّت'}</p>
            <div className="mt-4 flex items-center gap-8">
              <div className="offer-price text-3xl md:text-5xl">${a.offerPrice ?? a.price ?? '0.00'}</div>
              {a.originalPrice ? <div className="text-slate-200 line-through text-lg">${a.originalPrice}</div> : null}
              <div className="ml-auto">
                <button className="btn-shine px-6 py-3 rounded-xl bg-white/12 text-white text-lg">اطلب الآن</button>
              </div>
            </div>
          </div>
          <div className="w-12 text-white flex-shrink-0">
            <button onClick={onClose} className="px-3 py-2 bg-white/12 rounded-lg text-xl">×</button>
          </div>
        </div>
        <div className="glass-overlay" />
      </div>
    </div>
  )
}

function AutoOffersBox({offers, onClick}){
  const [index, setIndex] = useState(0)
  const has = offers && offers.length
  useEffect(()=>{
    if(!has) return
    const id = setInterval(()=> setIndex(i => (i + 1) % offers.length), 3000)
    return () => clearInterval(id)
  }, [offers, has])
  const a = has ? offers[index] : { productName: 'لا توجد عروض معتمدة', discountValue: '', image: '', offerPrice: '' }
  return (
    <div onClick={onClick} className="cursor-pointer rounded-lg overflow-hidden border p-2 bg-white/60 shadow-sm w-72 md:w-80">
      <div className="flex items-center gap-3">
        <div className="w-20 h-14 rounded overflow-hidden bg-slate-100 flex items-center justify-center">
          <img src={a.image || 'https://via.placeholder.com/160x100'} alt={a.productName} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">{a.productName}</div>
          <div className="text-xs text-slate-500 truncate">{a.discountValue}</div>
          <div className="text-sm font-bold mt-1">{a.offerPrice ? `$${a.offerPrice}` : ''}</div>
        </div>
      </div>
    </div>
  )
}

export default function CustomerStore(){
  const { storeName } = useParams()
  const { lang, t } = useI18n()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const { items: cart, addItem, changeQty } = useCart()
  const CATS = [
    'الدواجن واللحوم والاسماك','مخبوزات','أطعمة طازجة','الفواكه والخضروات','المعلبات','العناية الشخصية','الصحة والجمال','المستلزمات المنزلية','التبغ','الطهي والخبز','منتجات الالبان والبيض','حليب','المشروبات','طعام الافطار','البروتين والنظام الغذائي','ركن الاطفال','لوازم المكتب والالعاب','الوجبات الخفيفة والشوكلاته','القهوه والشاي','للاستخدام الواحد','الاطعمه المجمده','ايس كريم','التوابل والصلصات','التنظيف والغسيل','جاهز للاكل','Main Meals','Sides','Drinks','Desserts'
  ]
  const [showOffersModal, setShowOffersModal] = useState(false)
  const [approvedOffers, setApprovedOffers] = useState([])

  useEffect(()=>{
    const all = getProducts().filter(p=> p.store === decodeURIComponent(storeName) && (p.active !== false))
    setItems(all)
    try{ setApprovedOffers(JSON.parse(localStorage.getItem('approved_offers')||'[]').filter(o => !o.store || o.store === decodeURIComponent(storeName))) }catch(e){ setApprovedOffers([]) }
  }, [storeName])

  const storeUser = React.useMemo(()=> getUsers().find(u=> u.role === 'store' && (u.name === decodeURIComponent(storeName) || u.username === decodeURIComponent(storeName))), [storeName])
  const isOpen = storeUser ? (storeUser.status === 'active') : true

  function changeQtyHandler(p, delta){
    const inCart = cart.find(c=> c.id === p.id)
    const nextQty = inCart ? Math.max(0, (inCart.qty||0) + delta) : Math.max(0, delta)
    if(nextQty <= 0){ changeQty(p.id, 0) }
    else { changeQty(p.id, nextQty) }
  }

  function addToCart(p){ addItem(p, 1) }

  return (
    <Layout sideItems={[]}> 
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header logo with subtle float animation */}
        <div className="flex items-center gap-4 mb-4">
          <motion.img src="/1.png" alt="logo" className="w-14 h-14 rounded-full shadow-lg" animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
          <div>
            <h1 className="text-2xl font-bold">{decodeURIComponent(storeName)}</h1>
            <div className="text-sm text-slate-500">متجر — عروض حصرية</div>
          </div>
        </div>

        <OfferSlider storeName={storeName} />
        {/* Categories header + 'عرض كل العروض' button */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold mb-2">التصنيفات</h3>
          <div>
            <AutoOffersBox offers={approvedOffers} onClick={() => setShowOffersModal(true)} />
          </div>
        </div>
        {/* Big Offers Hero shown inline when toggled */}
        {showOffersModal && (
          <BigOffersHero offers={approvedOffers} onClose={() => setShowOffersModal(false)} />
        )}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {CATS.map((c, i) => (
              <button key={i} className="px-3 py-1 bg-slate-100 rounded text-sm" onClick={() => alert(c)}>{c}</button>
            ))}
          </div>
        </div>

        {showOffersModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 max-w-3xl w-full">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">جميع العروض</h4>
                <button onClick={()=> setShowOffersModal(false)} className="px-2 py-1">إغلاق</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {approvedOffers.length ? approvedOffers.map(o => (
                  <div key={o.id} onClick={() => {
                    // when customer clicks an approved offer: add corresponding product to cart and navigate to its category
                    const prod = (items || []).find(p => {
                      const pname = (p.name && typeof p.name === 'object') ? (p.name.en || p.name.ar || '') : (p.name || '')
                      return o.productName && pname.toLowerCase().includes((o.productName||'').toLowerCase())
                    }) || (items && items[0])
                    if(prod){
                      addItem(prod, 1)
                      // close modal; do not redirect — keep add non-interruptive
                      setShowOffersModal(false)
                    }else{
                      setShowOffersModal(false)
                    }
                  }} className="p-3 hover:bg-slate-100/80 cursor-pointer bg-slate-100 rounded flex items-center gap-3">
                    <img src={o.image || 'https://via.placeholder.com/160x120'} alt="offer" className="w-24 h-20 object-cover rounded" />
                    <div>
                      <div className="font-semibold">{o.productName || o.title}</div>
                      <div className="text-sm text-slate-600">{o.discountValue || o.subtitle || ''} {o.offerPrice ? `— $${o.offerPrice}` : ''}</div>
                    </div>
                  </div>
                )) : (
                  <div className="p-4 text-slate-500">لا توجد عروض معتمدة حالياً.</div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">{decodeURIComponent(storeName)}</h2>
          <div className="ml-auto">
            <button onClick={()=> navigate('/customer/cart')} className="px-3 py-1 bg-indigo-600 rounded text-white">السلة</button>
          </div>
        </div>
        {!isOpen && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded">
            المتجر مغلق حالياً — قد لا تتوفر المنتجات للطلب
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map(p=> (
            <div key={p.id} className={`bg-slate-800 p-4 rounded ${!isOpen ? 'filter grayscale opacity-60' : ''}`}>
              <img src={p.image} alt="" className="mb-2 w-full h-32 object-cover rounded" />
              <div className="font-semibold">{p.name[lang] || p.name.en}</div>
              <div className="text-sm">${p.price}</div>
              <div className="mt-2 flex items-center justify-end gap-2">
                {(() => {
                  const inCart = cart.find(c=> c.id === p.id)
                  const qty = inCart ? (inCart.qty || 0) : 0
                  if(!inCart || qty === 0){
                    return (
                      <button onClick={()=> addToCart(p)} className="px-3 py-1 bg-green-600 rounded text-white">أضف للسلة</button>
                    )
                  }
                  return (
                    <div className="flex items-center bg-white rounded px-2 py-1 text-gray-900">
                      <button onClick={()=> changeQty(p, -1)} className="px-2">−</button>
                      <div className="px-3 font-semibold">{qty}</div>
                      <button onClick={()=> changeQty(p, 1)} className="px-2">+</button>
                    </div>
                  )
                })()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
