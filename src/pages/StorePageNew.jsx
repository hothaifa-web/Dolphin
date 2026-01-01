import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, useViewportScroll, useTransform } from 'framer-motion'
import { getProducts, getUsers, subscribe as mockSubscribe } from '../data/mock'
import { useI18n } from '../i18n'
import { useAuth } from '../components/AuthProvider'
import { useCart } from '../contexts/CartContext'
import QuickViewModal from '../components/QuickViewModal'
import CoffeeSteam from '../components/CoffeeSteam'
import PaymentModal from '../components/PaymentModal'
import ProductTile from '../components/ProductTile'
import * as Lucide from 'lucide-react'
import OfferHero from '../components/OfferHero'

const PRESETS = {
  tech: ['Laptops','Smartphones','Accessories','Gaming','PC Components','Offers'],
  supermarket: ['Snacks','Dairy','Frozen','Beverages','Personal Care'],
  restaurant: ['Main Meals','Sides','Drinks','Desserts']
}

function detectType(storeUser, storeName, products){
  const cat = (storeUser && storeUser.category) || ''
  const name = (storeName||'').toLowerCase()
  if(/tech|electronics|computer|gadget/.test(cat) || /tech|electronics|computer|gadget/.test(name)) return 'tech'
  if(/groc|supermarket|grocery|market/.test(cat) || /grocery|supermarket|market/.test(name)) return 'supermarket'
  if(/restaur|restaurant|cafe|food/.test(cat) || /restaurant|cafe|bistro/.test(name)) return 'restaurant'
  const txt = (products||[]).map(p=> ((p.name?.en || p.name || '') + ' ' + (p.description||''))).join(' ').toLowerCase()
  if(txt.includes('laptop') || txt.includes('smartphone') || txt.includes('gpu')) return 'tech'
  if(txt.includes('milk') || txt.includes('snack') || txt.includes('frozen')) return 'supermarket'
  return 'restaurant'
}

function getStoreTheme(storeUser, storeName, storeType){
  const name = (storeName||'').toLowerCase()
  const defaultTheme = { primary: '#f97316', accent: '#06b6d4', bg: 'rgba(15,23,42,0.55)', text: '#ffffff' }
  if((storeUser && /caf/.test((storeUser.category||'').toLowerCase())) || /coffee|cafe|espresso/.test(name) || storeType === 'restaurant'){
    return { primary: '#2D1B13', accent: '#d4a373', bg: 'rgba(45,27,19,0.6)', text: '#f8efe6' }
  }
  if(storeType === 'tech') return { primary: '#0ea5e9', accent: '#8b5cf6', bg: 'rgba(6,8,17,0.6)', text: '#e6f7ff' }
  if(storeType === 'supermarket') return { primary: '#16a34a', accent: '#f59e0b', bg: 'rgba(6,17,10,0.6)', text: '#f3fff4' }
  return defaultTheme
}

export default function StorePageNew(){
  const { storeName } = useParams()
  const navigate = useNavigate()
  const { lang } = useI18n()
  const { user } = useAuth() || {}

  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState(()=> getProducts())
  const [storeUser, setStoreUser] = useState(null)
  // Simulated order/driver state for demo purposes
  const [orderState, setOrderState] = useState('preparing') // preparing | ready | enroute | delivered
  const [driverInfo, setDriverInfo] = useState(null)
  const customerMock = useMemo(()=> ({ name: (user && user.name) || 'أحمد الزبون', phone: '0912345678', location: 'شارع النصر 12' }), [user])
  const { items: cartItems, addItem, changeQty: ctxChangeQty } = useCart()
  const [offerPreview, setOfferPreview] = useState(null)
  const [query, setQuery] = useState('')
  const [activeSection, setActiveSection] = useState(null)
  const sectionsRef = useRef({})
  const [quickProduct, setQuickProduct] = useState(null)
  const [quickOpen, setQuickOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [showOffersPage, setShowOffersPage] = useState(false)

  useEffect(()=>{
    setLoading(true)
    const name = decodeURIComponent(storeName||'')
    const list = getProducts().filter(p => p.store === name && p.active !== false)
    // ensure every product has an id to avoid runtime errors
    const safeList = (list || []).map(p => ({ ...p, id: (typeof p.id === 'undefined' || p.id === null) ? `generated-${Math.random().toString(36).slice(2,9)}` : p.id }))
    setProducts(safeList)
    setStoreUser(getUsers().find(u=> u.role === 'store' && (u.name === name || u.username === name)) || null)
    setTimeout(()=> setLoading(false), 120)
    // play a short notification tone for incoming orders and refresh product list on updates
    function playNotificationTone(){
      try{
        const ac = new (window.AudioContext || window.webkitAudioContext)()
        const o = ac.createOscillator(); const g = ac.createGain();
        o.type = 'sine'; o.frequency.value = 880; g.gain.value = 0.05;
        o.connect(g); g.connect(ac.destination);
        o.start();
        setTimeout(()=>{ o.stop(); ac.close().catch(()=>{}) }, 120)
      }catch(e){}
    }

    const unsub = mockSubscribe(ev => {
      if(!ev) return
      if(ev.type === 'order') playNotificationTone()
      if(ev && (ev.type === 'update' || ev.type === 'order' || ev.type === 'tick')){
        const refreshed = getProducts().filter(p => p.store === name && p.active !== false)
        setProducts(refreshed)
      }
    })
    return () => unsub()
  }, [storeName])

  // Safety: ensure products is always an array
  useEffect(()=>{ if(!Array.isArray(products)) setProducts([]) }, [products])

  const displayName = decodeURIComponent(storeName || (storeUser && storeUser.name) || 'Store')
  const storeType = useMemo(()=> detectType(storeUser, displayName, products), [storeUser, displayName, products])
  let sections = PRESETS[storeType] || PRESETS.restaurant
  const theme = useMemo(()=> getStoreTheme(storeUser, displayName, storeType), [storeUser, displayName, storeType])

  const ALL_CATEGORIES = [
    'الدواجن واللحوم والاسماك', 'مخبوزات', 'أطعمة طازجة', 'الفواكه والخضروات', 'المعلبات', 'العناية الشخصية', 'الصحة والجمال', 'المستلزمات المنزلية', 'التبغ', 'الطهي والخبز',
    'منتجات الالبان والبيض', 'حليب', 'المشروبات', 'طعام الافطار', 'البروتين والنظام الغذائي', 'ركن الاطفال', 'لوازم المكتب والالعاب', 'الوجبات الخفيفة والشوكلاته', 'القهوه والشاي', 'للاستخدام الواحد',
    'الاطعمه المجمده', 'ايس كريم', 'التوابل والصلصات', 'التنظيف والغسيل', 'جاهز للاكل'
  ]

  const ICON_MAP = {
    'الدواجن واللحوم والاسماك': Lucide.Fish,
    'مخبوزات': Lucide.Bread,
    'أطعمة طازجة': Lucide.Leaf,
    'الفواكه والخضروات': Lucide.Apple,
    'المعلبات': Lucide.Archive,
    'العناية الشخصية': Lucide.Smile,
    'الصحة والجمال': Lucide.Heart,
    'المستلزمات المنزلية': Lucide.Home,
    'التبغ': Lucide.Zap,
    'الطهي والخبز': Lucide.ChefHat,
    'منتجات الالبان والبيض': Lucide.Egg,
    'حليب': Lucide.Milk,
    'المشروبات': Lucide.Coffee,
    'طعام الافطار': Lucide.Coffee,
    'البروتين والنظام الغذائي': Lucide.Dumbbell,
    'ركن الاطفال': Lucide.ToyBrick,
    'لوازم المكتب والالعاب': Lucide.PenTool,
    'الوجبات الخفيفة والشوكلاته': Lucide.Donut,
    'القهوه والشاي': Lucide.Coffee,
    'للاستخدام الواحد': Lucide.Trash2,
    'الاطعمه المجمده': Lucide.Snowflake,
    'ايس كريم': Lucide.IceCream,
    'التوابل والصلصات': Lucide.Seed,
    'التنظيف والغسيل': Lucide.Washer,
    'جاهز للاكل': Lucide.Box
  }

  // Sample items (one per category) with white-background placeholder images to show when a
  // category has no real products in the current store. These are lightweight placeholders
  // so the UI always shows at least one representative product for each category.
  const SAMPLE_ITEMS = {
    'الدواجن واللحوم والاسماك': [{ id: 'sample-meat', name: { ar: 'صدر دجاج', en: 'Chicken Breast' }, price: 7.5, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Meat' }],
    'مخبوزات': [{ id: 'sample-bakery', name: { ar: 'خبز طازج', en: 'Fresh Bread' }, price: 1.2, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Bakery' }],
    'أطعمة طازجة': [{ id: 'sample-fresh', name: { ar: 'خضار طازج', en: 'Fresh Salad' }, price: 3.5, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Fresh' }],
    'الفواكه والخضروات': [{ id: 'sample-fruit', name: { ar: 'تفاح طازج', en: 'Apple' }, price: 0.9, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Fruits' }],
    'المعلبات': [{ id: 'sample-canned', name: { ar: 'معلبات خضار', en: 'Canned Vegetables' }, price: 2.5, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Canned' }],
    'العناية الشخصية': [{ id: 'sample-personal', name: { ar: 'شامبو', en: 'Shampoo' }, price: 4.5, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Personal' }],
    'الصحة والجمال': [{ id: 'sample-beauty', name: { ar: 'كريم مرطب', en: 'Moisturizer' }, price: 9.9, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Beauty' }],
    'المستلزمات المنزلية': [{ id: 'sample-home', name: { ar: 'منظف متعدد', en: 'Multi Cleaner' }, price: 5.0, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Home' }],
    'التبغ': [{ id: 'sample-tobacco', name: { ar: 'تبغ', en: 'Tobacco' }, price: 6.0, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Tobacco' }],
    'الطهي والخبز': [{ id: 'sample-cook', name: { ar: 'طحين للخبز', en: 'Baking Flour' }, price: 2.2, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Cooking' }],
    'منتجات الالبان والبيض': [{ id: 'sample-dairy', name: { ar: 'جبنة', en: 'Cheese' }, price: 3.75, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Dairy' }],
    'حليب': [{ id: 'sample-milk', name: { ar: 'حليب كامل الدسم', en: 'Whole Milk' }, price: 1.5, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Milk' }],
    'المشروبات': [{ id: 'sample-drink', name: { ar: 'عصير برتقال', en: 'Orange Juice' }, price: 2.8, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Drinks' }],
    'طعام الافطار': [{ id: 'sample-breakfast', name: { ar: 'رقائق الفطور', en: 'Cereal' }, price: 3.2, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Breakfast' }],
    'البروتين والنظام الغذائي': [{ id: 'sample-protein', name: { ar: 'مسحوق بروتين', en: 'Protein Powder' }, price: 19.99, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Protein' }],
    'ركن الاطفال': [{ id: 'sample-kids', name: { ar: 'حليب للأطفال', en: 'Baby Milk' }, price: 6.5, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Kids' }],
    'لوازم المكتب والالعاب': [{ id: 'sample-office', name: { ar: 'دفتر ملاحظات', en: 'Notebook' }, price: 1.1, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Office' }],
    'الوجبات الخفيفة والشوكلاته': [{ id: 'sample-snack', name: { ar: 'شوكولا', en: 'Chocolate' }, price: 1.75, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Snacks' }],
    'القهوه والشاي': [{ id: 'sample-coffee', name: { ar: 'قهوة عربية', en: 'Coffee' }, price: 5.5, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Coffee' }],
    'للاستخدام الواحد': [{ id: 'sample-disposable', name: { ar: 'أطباق一次性', en: 'Disposable Plates' }, price: 2.0, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Disposable' }],
    'الاطعمه المجمده': [{ id: 'sample-frozen', name: { ar: 'نقانق مجمدة', en: 'Frozen Sausages' }, price: 4.5, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Frozen' }],
    'ايس كريم': [{ id: 'sample-icecream', name: { ar: 'ايس كريم فانيلا', en: 'Vanilla Ice Cream' }, price: 2.99, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=IceCream' }],
    'التوابل والصلصات': [{ id: 'sample-spice', name: { ar: 'بهارات مشكلة', en: 'Mixed Spices' }, price: 1.8, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Spices' }],
    'التنظيف والغسيل': [{ id: 'sample-clean', name: { ar: 'مسحوق غسيل', en: 'Laundry Detergent' }, price: 6.0, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Cleaning' }],
    'جاهز للاكل': [{ id: 'sample-ready', name: { ar: 'سندوتش جاهز', en: 'Ready Sandwich' }, price: 3.99, image: 'https://via.placeholder.com/400x300/FFFFFF/000000?text=Ready' }]
  }

  const displayedCategories = useMemo(()=>{
    const q = (query||'').toLowerCase().trim()
    if(!q) return ALL_CATEGORIES
    return ALL_CATEGORIES.filter(c => c.toLowerCase().includes(q))
  }, [ALL_CATEGORIES, query])

  // mapping Arabic categories to keywords to match product fields
  const CATEGORY_KEYWORDS = {
    'الدواجن واللحوم والاسماك': ['chicken','meat','fish','poultry','دواجن','لحوم','اسماك'],
    'مخبوزات': ['bread','bakery','muffin','مخبوزات','bakery'],
    'أطعمة طازجة': ['fresh','fresh food','طازج'],
    'الفواكه والخضروات': ['fruit','vegetable','apple','banana','فواكه','خضروات'],
    'المعلبات': ['canned','can','معلبات'],
    'العناية الشخصية': ['shampoo','soap','toothpaste','personal','العناية'],
    'الصحة والجمال': ['beauty','cosmetic','skincare','makeup','جمال'],
    'المستلزمات المنزلية': ['home','cleaner','kitchen','household','منزل'],
    'التبغ': ['tobacco','cigarette','تبغ'],
    'الطهي والخبز': ['cook','cooking','baking','flour','bakery','طهي','خبز'],
    'منتجات الالبان والبيض': ['dairy','cheese','yogurt','egg','البان','بيض'],
    'حليب': ['milk','حليب'],
    'المشروبات': ['drink','beverage','juice','soda','coffee','tea','مشروب','مشروبات'],
    'طعام الافطار': ['breakfast','cereal','granola','فطور'],
    'البروتين والنظام الغذائي': ['protein','protein powder','diet','protein'],
    'ركن الاطفال': ['baby','kids','طفل','اطفال'],
    'لوازم المكتب والالعاب': ['office','stationery','pen','toy','game'],
    'الوجبات الخفيفة والشوكلاته': ['snack','chips','cookie','chocolate','sweet'],
    'القهوه والشاي': ['coffee','tea','قهوه','شاي'],
    'للاستخدام الواحد': ['disposable','single-use','一次性','للاستخدام'],
    'الاطعمه المجمده': ['frozen','مجمد','frozen food'],
    'ايس كريم': ['ice cream','ايس كريم'],
    'التوابل والصلصات': ['spice','sauce','salt','pepper','توابل','صلصة'],
    'التنظيف والغسيل': ['detergent','cleaner','laundry','soap','تنظيف','غسيل'],
    'جاهز للاكل': ['ready','ready meal','meal','جاهز','pack']
  }

  // Group products by the Arabic category list using the keyword map
  const groupedByArabicCategory = useMemo(()=>{
    const map = {}
    for(const cat of ALL_CATEGORIES) map[cat] = []
    const others = []
    for(const p of products){
      const combined = `${(p.name && typeof p.name==='object' ? (p.name.ar||p.name.en) : (p.name||''))} ${(p.description||'')} ${(p.category||'')} ${(p.tags||[]).join(' ')}`.toLowerCase()
      let placed = false
      for(const cat of ALL_CATEGORIES){
        const keys = CATEGORY_KEYWORDS[cat] || []
        for(const k of keys){
          if(k && combined.includes(k)){
            map[cat].push(p)
            placed = true
            break
          }
        }
        if(placed) break
      }
      if(!placed) others.push(p)
    }
    // put others into 'جاهز للاكل' as fallback if exists
    if(others.length && map['جاهز للاكل']) map['جاهز للاكل'] = map['جاهز للاكل'].concat(others)
    // ensure every category has at least one representative sample item when empty
    for(const cat of ALL_CATEGORIES){
      if((map[cat] || []).length === 0 && SAMPLE_ITEMS[cat] && SAMPLE_ITEMS[cat].length){
        map[cat] = (map[cat] || []).concat(SAMPLE_ITEMS[cat])
      }
    }
    return map
  }, [products])

  function itemsFor(section){
    const q = (query||'').toLowerCase().trim()
    const list = (groupedByArabicCategory[section] || [])
    if(!q) return list
    return list.filter(p=> {
      const title = (p.name && typeof p.name==='object') ? (p.name[lang]||p.name.en||'') : (p.name||'')
      return title.toString().toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q)
    })
  }

  function addToCart(item){ addItem(item, 1) }

  function changeQty(itemId, delta){
    const inCart = cartItems.find(i=> i.id === itemId)
    const nextQty = inCart ? Math.max(0, (inCart.qty||0) + delta) : Math.max(0, delta)
    ctxChangeQty(itemId, nextQty)
  }

  function addCategorySample(cat){
    const base = (cat||'Item').split(/[ ,]+/)[0]
    const item = { id: `sample-${base}-${Date.now()}`, name: base, price: Number((Math.random()*12+1).toFixed(2)), image: `https://source.unsplash.com/400x300/?${encodeURIComponent(base)}` }
    addToCart(item)
  }

  // navigate to full category page when a category is selected
  function openCategory(cat){
    navigate(`/customer/category/${encodeURIComponent(cat)}`)
  }

  const filteredProducts = useMemo(()=>{
    const q = (query||'').toLowerCase().trim()
    if(!q) return products
    return products.filter(p=> ((p.name && typeof p.name==='object' ? (p.name[lang]||p.name.en) : (p.name||'')).toString().toLowerCase().includes(q) ) )
  }, [products, query, lang])

  const itemCount = cartItems.reduce((s,i)=> s + (i.qty||0), 0)
  const total = cartItems.reduce((s,i)=> s + ((i.qty||0)*(i.price||0)), 0)

  function scrollToSection(s){ const el = sectionsRef.current[s]; if(el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); setActiveSection(s) }

  return (
    <div className="min-h-screen bg-white pb-28">
      <div className="sticky top-0 z-30 bg-white border-b py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={()=> navigate(-1)} className="px-2 py-1 rounded bg-slate-100">←</button>
            <div className="font-black text-black">{displayName}</div>
          </div>
          <div className="flex-1 px-4">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search" className="w-full border-2 border-black rounded-2xl px-4 py-2 font-black text-black" />
          </div>
          <div />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
          <OfferHero storeName={storeName} onCustomerClick={(offer) => {
            const prod = products.find(p => {
              const pname = (p.name && typeof p.name === 'object') ? (p.name[lang]||p.name.en||'') : (p.name||'')
              return offer && offer.title && pname.toString().toLowerCase().includes((offer.title||'').toLowerCase())
            }) || products[0]
            if(prod) setOfferPreview(prod)
          }} />
        {/* Simulation box moved to home page; removed from store page */}
        {offerPreview && (
          <div className="mt-4 bg-white rounded-lg p-3 shadow flex items-center gap-4">
            <div className="w-24 h-20 rounded overflow-hidden bg-gray-100">
              <img src={offerPreview.image || 'https://via.placeholder.com/160x120'} alt={typeof offerPreview.name === 'object' ? (offerPreview.name.en || offerPreview.name.ar) : offerPreview.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">{typeof offerPreview.name === 'object' ? (offerPreview.name[lang] || offerPreview.name.en || offerPreview.name.ar || '') : offerPreview.name}</div>
              <div className="text-sm text-slate-500">${(offerPreview.price||0).toFixed(2)}</div>
            </div>
            <div>
              {(() => {
                const inCart = cartItems.find(i=> i.productId === offerPreview.id)
                const qty = inCart ? (inCart.qty||0) : 0
                if(!inCart || qty === 0){
                  return <button onClick={()=> addToCart(offerPreview)} className="px-4 py-2 bg-green-600 text-white rounded">أضف للسلة</button>
                }
                return (
                  <div className="flex items-center gap-3">
                    <button onClick={()=> changeQty(offerPreview.id, -1)} className="px-3 py-2 bg-slate-100 rounded">−</button>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold">{qty}</div>
                    <button onClick={()=> changeQty(offerPreview.id, 1)} className="px-3 py-2 bg-slate-100 rounded">+</button>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-black">التصنيفات والعروض</h2>
          <div className="flex gap-2">
            <button onClick={()=> setShowOffersPage(true)} className="px-3 py-2 rounded bg-black text-white font-black">عرض كل العروض</button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {displayedCategories.map((cat, idx) => {
            const IconComp = ICON_MAP[cat]
            return (
              <div key={idx} onClick={() => openCategory(cat)} role="button" tabIndex={0} className="bg-white rounded-lg p-3 cursor-pointer" style={{ border: '2px solid #000' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {IconComp ? <IconComp size={18} className="text-black"/> : null}
                    <div className="font-black text-black text-sm">{cat}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sections (product groups) */}
        <div className="mt-6 space-y-8">
          {sections.map(s=> (
            <section key={s} ref={el => sectionsRef.current[s] = el}>
              <h3 className="text-xl font-black text-black mb-3">{s}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {(loading ? Array.from({length:6}) : itemsFor(s)).map((p, idx)=> (
                  <ProductTile key={p?.id ?? `p-${idx}`} product={p} lang={lang} onQuickView={(prod)=>{ setQuickProduct(prod); setQuickOpen(true) }} />
                ))}
              </div>
            </section>
          ))}
        </div>

      </div>

      <QuickViewModal open={quickOpen} product={quickProduct} onClose={()=> setQuickOpen(false)} />

      {/* category modal removed — navigation to full category page is used instead */}

      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <button onClick={()=> navigate('/customer/cart')} className="w-full rounded-lg bg-black text-white font-black py-3">Checkout • ${total.toFixed(2)} ({itemCount})</button>
          </div>
        </div>
      )}

      {showOffersPage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-6 overflow-auto">
          <div className="bg-white rounded-lg w-full max-w-6xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black">العروض المتاحة</h2>
              <div className="flex items-center gap-3">
                <button onClick={()=> setShowOffersPage(false)} className="px-3 py-2 rounded bg-slate-100">إغلاق</button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.filter(p=> p.offer).map((p, idx) => (
                <div key={p?.id ?? `offer-${idx}`} className="relative">
                  <div className="absolute -top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-black">{(p.discount||0)}%</div>
                  <ProductTile product={{...p, price: ((p.price||0)*(1-(p.discount||0)/100))}} lang={lang} onQuickView={(prod)=>{ setQuickProduct(prod); setQuickOpen(true) }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <PaymentModal open={paymentOpen} total={Math.round(total*100)/100} items={cartItems} user={user} onClose={()=> setPaymentOpen(false)} onSuccess={()=> { setCartItems([]); navigate('/customer/orders') }} />
    </div>
  )
}
