import React, {useState} from 'react'
import Layout from '../components/Layout'
import { getProducts, getOrders, subscribe, PRODUCTS, getUsers, deleteOrder, updateOrder, saveProducts } from '../data/mock'
import { playNewOrder, playDriverArrived, playPickedUp, ensureAudioContext } from '../services/sounds'
import AppEngine from '../services/AppEngine'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { useI18n } from '../i18n'

export default function StoreDashboard(){
  const {t,lang} = useI18n()
  const { user } = useAuth()
  const side = [ {label:t('dashboard'),to:'/store'}, {label:t('products'),to:'/store/products'}, {label:t('orders'),to:'/store/orders'}, { label: 'طلبات مُجهزة', to: '/store/prepared' } ]
  const [items, setItems] = useState(() => getProducts().filter(p=> !user || p.store === user.name))
  const [showOpen, setShowOpen] = useState(true)
  const [orders, setOrders] = useState(() => getOrders().filter(o => !user || o.store === user.name))
  const [tab, setTab] = useState('pending') // 'pending' | 'active' | 'completed'
  const [now, setNow] = useState(Date.now())
  const [form, setForm] = useState({title:'', image:'', barcode:'', sku:'', price:'', description:'', unitType: 'piece', categories: [], subcategory: ''})
  const navigate = useNavigate()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [offerForm, setOfferForm] = useState({ productName: '', image: '', discountImage: '', originalPrice: '', offerPrice: '', discountValue: '', platformMargin: '' })

  const sideWithAction = [...side, { label: 'Add Product', action: ()=> setShowProductModal(true) }, { label: 'إضافة عرض', action: () => setShowOfferModal(true) }]

  function onChange(e){
    setForm({...form, [e.target.name]: e.target.value})
  }

  function onFileChange(e){
    const file = e.target.files && e.target.files[0]
    if(!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setForm(prev => ({...prev, image: ev.target.result}))
    }
    reader.readAsDataURL(file)
  }
  const CATEGORY_LIST_AR = [
    'الدواجن واللحوم والاسماك', 'مخبوزات', 'أطعمة طازجة', 'الفواكه والخضروات', 'المعلبات', 'العناية الشخصية', 'الصحة والجمال', 'المستلزمات المنزلية', 'التبغ', 'الطهي والخبز', 'منتجات الالبان والبيض', 'حليب', 'المشروبات', 'طعام الافطار', 'البروتين والنظام الغذائي', 'ركن الاطفال', 'لوازم المكتب والالعاب', 'الوجبات الخفيفة والشوكلاته', 'القهوه والشاي', 'للاستخدام الواحد', 'الاطعمه المجمده', 'ايس كريم', 'التوابل والصلصات', 'التنظيف والغسيل', 'جاهز للاكل'
  ]

  const SUBCATEGORIES = {
    'الدواجن واللحوم والاسماك': ['الدجاج الكامل','أجزاء الدجاج','أحشاء الدواجن','طيور أخرى','لحم بقري','لحم خروف','أجزاء اللحوم','ستيك','لحم مفروم','روبيان وسلطعون','قطع السمك','سمك طازج'],
    'مخبوزات': ['خبز البرجر والرول','المعجنات','توست','مخبوزات حلوة','باجيت','بريوش','خبز البرجر','رول','كعك','أعواد الخبز','كروسان','حلويات مخبوزة','بانكيك ووافل','كيك','خبز خاص','تورتيلا','خبز عربي','الحبوب الكاملة والنخالة','أبيض','متعدد البذور','أسمر'],
    'أطعمة طازجة': ['بهارات طعام','بذور','عدس','بقوليات مجففة','حبوب'],
    'الفواكه والخضروات': ['تمور','فواكه مجففة','أعشاب','خس','فواكه نادرة واستوائية','فواكه','خضروات جذريه','خضروات'],
    'المعلبات': ['معجون طماطم','حمص','فول','ترمس','ذرة','أناناس','لانشون بقري','لانشون لحم','نقانق','سردين','تونة','زيتون','بقوليات أخرى','فطر معلب','مخللات'],
    'العناية الشخصية': ['العناية بالشفاه','كريم للوجه','واقي شمس','غسول للوجه','ماسك للوجه','صابون','معقمات ومناديل مبلله','اكسسوارات الحمام','بخاخ جسم','لوشن وكريمات','العناية بالأظافر والقدمين','جل الاستحمام','غسول الفم','معجون الاسنان','خيوط تنظيف الاسنان','فرشاة الاسنان','فوط نسائيه','العناية اليومية','العناية بالشعر','اكسسوارات الشعر','زيوت وماسكات الشعر','صبغة الشعر','تصفيف الشعر','شامبو','بلسم','شفرات نسائيه','الشمع وازالة الشعر','موس وشفرات رجاليه','كريمات الحلاقة والجيل'],
    'المستلزمات المنزلية': ['مستلزمات السفر','مستلزمات الشواء','اكسسوارات السيارة','ادوات المطبخ','اواني زجاجيه','مبيدات حشريه','محولات ومقابس','بطاريات','مصابيح','مستلزمات الحمام','العناية بالاحذيه','شموع','الزينة الموسمية والاكسسوارات','بطانيات واغطيه','معطرات الهواء','سجادات صلاة'],
    'التبغ': ['الدخان','السيجار','فحم','معسل','قداحات','شيشه','ورق قصدير','جوس','سجائر الكترونيه','كويلات','اكسسوارات الاراجيل'],
    'الطهي والخبز': ['أرز','زيت ذرة وعباد الشمس','زيت كانولا وزيوت اخرى','خليط الكيك','اضافات وحشوات','كاسترد وحلويات اخرى','الوان طعام ومنكهات','خميره وطحين','سميد','مسحوق الكاكاو','مسحوق الجيلي','السمن','النودلز','نودلز كوري','شوربه','سكر','معكرونه','زيت الزيتون','الصلصات'],
    'منتجات الالبان والبيض': ['طازجه','خفق','زبدة','جميد','زبادي عادي','زبادي يوناني','لبنه طازجه','زبادي الشرب','بيض','جبنه شرائح','جبنه كريميه','اجبان خاصه','اجبان مبشوره','ايدام','لبنه','موتزاريلا','حلومي','قطع لحوم'],
    'حليب': ['حليب سائل','حليب مطعمات','حليب بودره','حليب مكثف ومبخر','حليب جوز الهند'],
    'المشروبات': ['شاي مثلج','شراب الشعير','قهوه مثلجه','مسحوق العصير','مشروبات طاقه','نكهة الليمون','نكهة البرتقال','مشروبات مكربنه','مياه الشرب','مياه فواره','مشروبات مركزه','عصائر طازجه','عصير طويل الامد'],
    'البروتين والنظام الغذائي': ['بدون سكر','خالي من الجلوتين','بروتين اخر','واحات شوكلاته','سكويت','قابل للدهن','مشروبات'],
    'ركن الاطفال': ['العاب اطفال','وجبات خفيفه للاطفال','حليب الاطفال','عضاضات اسنان','زجاجات','مراييل','اكسسوارات','حفاظات','منتجات للاستحمام','زيوت للاطفال'],
    'لوازم المكتب والالعاب': ['ورق','كتب وروايات','دفاتر','اقلام','اكسسوارات','وصلات','ملفات وفايلات'],
    'الوجبات الخفيفة والشوكلاته': ['فشار','مكسرات','كيك','بسكويت','شوكولاته','كاندي','شيبس','مارشميلو','بريتزلز'],
    'القهوه والشاي': ['شاي','قهوه','فلاتر القهوة','حبوب','كبسولات','شاي كرك','نسكافيه','زهورات'],
    'للاستخدام الواحد': ['مناديل','رولات مناديل','قفازات','اكياس تفريز','صحون واوعية','اغطية المائده','اكواب ومصاصات','ورق المنيوم','ورق زبده','اكياس نفايات'],
    'الاطعمه المجمده': ['زينجر وستريبس','وجبات نباتيه','المقبلات والجوانب','البرغر والنقانق','البيتزا المجمده','دجاج كامل','ماكولات بحريه','لحوم','ثلج','بطاطس','لحم مفروم','خضروات مجمده','فواكه مجمده'],
    'ايس كريم': ['اكواب ايس كريم','عبوات عائليه','سوربيت','مخروط','سندويشات والواح','ايس كريم بروتين'],
    'التوابل والصلصات': ['ملح','صلصات','صوصات','كاتشب','مايونيز','توابل اعشاب','توابل مطحونه','خل','سلطات'],
    'التنظيف والغسيل': ['منعمات اقمشه','اقراص وكبسولات','العناية بالاقمشه','مساحيق منظفه','منظفات سائله','اقراص وبودره','سائل غسيل الصحون','ادوات التنظيف','منظفات المطبخ','منظفات المرحاض','منظفات الحمام','مطهرات','منظف اثاث','معطرات للجو','معطر ارضيات'],
    'جاهز للاكل': ['العصائر الطازجه','قطع الفاكهه','المقبلات والاصناف الجانبيه','وجبات خفيفه وحلويات','سلطات','سندويشات','سوشي']
  }

  function toggleCategory(cat){
    setForm(prev => {
      const set = new Set(prev.categories || [])
      if(set.has(cat)) set.delete(cat)
      else set.add(cat)
      return { ...prev, categories: Array.from(set) }
    })
  }

  function selectSubcategory(sub){
    setForm(prev => ({ ...prev, subcategory: sub }))
  }
  function addProduct(e){
    e.preventDefault()
    const id = Date.now()
    // prevent duplicate barcode
    if(form.barcode && PRODUCTS.some(pp => pp.barcode && pp.barcode === form.barcode)){
      alert('Barcode already exists — choose a unique barcode')
      return
    }
    const p = {
      id,
      name: { en: form.title || 'Untitled', ar: form.title || 'منتج' },
      price: parseFloat(form.price) || 0,
      image: form.image || ('https://picsum.photos/seed/'+id+'/200/150'),
      barcode: form.barcode || '',
      sku: form.sku || '',
      description: form.description || '',
      unitType: form.unitType || 'piece',
      categories: form.categories || [],
      subcategory: form.subcategory || '',
      store: user?.name || 'Unknown',
      storeId: user?.id,
      active: true
    }
    PRODUCTS.push(p)
    try{ saveProducts() }catch(e){/* ignore */}
    // update local items from getter
    setItems(getProducts().filter(pp=> pp.store === (user?.name)))
      setForm({title:'', image:'', barcode:'', sku:'', price:'', description:'', unitType: 'piece', categories: [], subcategory: ''})
    alert('Product added')
    setShowProductModal(false)
  }

  function onOfferChange(e){
    setOfferForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function onOfferFileChange(e){
    const file = e.target.files && e.target.files[0]
    if(!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setOfferForm(prev => ({ ...prev, image: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  function onOfferDiscountFileChange(e){
    const file = e.target.files && e.target.files[0]
    if(!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setOfferForm(prev => ({ ...prev, discountImage: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  function submitOffer(e){
    e.preventDefault()
    try{
      const pending = JSON.parse(localStorage.getItem('pending_offers')||'[]')
      const id = Date.now()
      const payload = { id, store: user?.name || 'Unknown', productName: offerForm.productName, image: offerForm.image, discountImage: offerForm.discountImage, originalPrice: Number(offerForm.originalPrice)||0, offerPrice: Number(offerForm.offerPrice)||0, discountValue: offerForm.discountValue || '', platformMargin: offerForm.platformMargin || '', status: 'pending_approval', createdAt: Date.now() }
      pending.push(payload)
      localStorage.setItem('pending_offers', JSON.stringify(pending))
      alert('تم إرسال العرض للموافقة من قبل الإدارة')
      setOfferForm({ productName: '', image: '', discountImage: '', originalPrice: '', offerPrice: '', discountValue: '', platformMargin: '' })
      setShowOfferModal(false)
    }catch(err){ console.error(err); alert('حدث خطأ أثناء إرسال العرض') }
  }

  React.useEffect(()=>{
    const unsub = subscribe(ev => {
      if(ev.type === 'tick'){
        const all = getProducts().filter(p=> !user || p.store === user.name)
        setItems(all.filter(p => showOpen ? (p.active !== false) : (p.active === false)))
        setOrders(getOrders().filter(o => !user || o.store === user.name))
        // resume audio context on first tick if needed (user interaction recommended)
        try{ ensureAudioContext() }catch(e){}
      }else if(ev.type === 'order'){
        setOrders(prev => [ev.order, ...prev].filter(o => !user || o.store === user.name))
        try{ if(user && ev.order && ev.order.store === user.name) playNewOrder() }catch(e){}
      }
    })
    return () => unsub()
  }, [user, showOpen])

  // live clock to update countdowns every second
  React.useEffect(()=>{
    const id = setInterval(()=> setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const users = React.useMemo(()=> getUsers(), [])

  function openOrderModal(o){
    setSelectedOrder(o)
    setShowOrderModal(true)
  }

  function closeOrderModal(){
    setSelectedOrder(null)
    setShowOrderModal(false)
  }

  function cancelOrderAction(){
    // do not delete order, just close modal and navigate back to dashboard
    closeOrderModal()
    navigate('/store')
  }

  function acceptOrderAction(){
    if(!selectedOrder) return
    closeOrderModal()
    navigate(`/store/orders/${selectedOrder.id}`)
  }

  function acceptOrderRow(o){
    navigate(`/store/orders/${o.id}`)
  }

  function cancelOrderRow(o){
    if(!o || !o.id) return
    if(!confirm('Cancel this order?')) return
    try{
      deleteOrder(o.id, { by: user?.name || null, reason: 'Cancelled by store' })
      alert('Order cancelled')
    }catch(e){
      console.error(e)
      alert('Could not cancel order')
    }
  }

  function pickupOrder(o){
    if(!o || !o.id) return
    try{
      updateOrder(o.id, { status: 'ready_for_pickup' })
      alert('Order marked ready for pickup')
    }catch(e){
      console.error(e)
      alert('Could not mark ready')
    }
  }

  function fulfillFromStock(o){
    if(!o || !o.id) return
    if(!confirm('Fulfill this order from stock? This will decrement product stock.')) return
    try{
      // decrement product stock
      for(const it of (o.items||[])){
        const prod = PRODUCTS.find(p=> p.id === it.productId)
        if(prod){
          prod.stock = Math.max(0, (prod.stock || 0) - (it.qty || it.quantity || 1))
        }
      }
      try{ saveProducts() }catch(e){}
      updateOrder(o.id, { status: 'fulfilled' })
      alert('Order fulfilled from stock')
    }catch(e){
      console.error(e)
      alert('Could not fulfill order')
    }
  }

  function seedJordanProducts(count = 1000){
    if(!user) return alert('No store user')
    if(!confirm(`Create ${count} demo Jordan products for store ${user.name}? This may take a moment.`)) return
    const start = Date.now()
    const baseId = Date.now()
    for(let i=0;i<count;i++){
      const idx = baseId + i
      const price = (Math.round((Math.random() * 50 + 1) * 100) / 100)
      const sku = `JOR-${String(idx).slice(-6)}`
      const barcode = `JOR${String(100000 + (i % 900000))}`
      const nameEn = `Jordan Product ${i+1}`
      const nameAr = `منتج أردني ${i+1}`
      const img = `https://picsum.photos/seed/jor${idx}/200/150`
      const prod = { id: idx, name: { en: nameEn, ar: nameAr }, price, image: img, stock: 100 + Math.floor(Math.random()*200), sku, barcode, store: user.name }
      PRODUCTS.push(prod)
    }
    try{ saveProducts() }catch(e){ console.error('saveProducts failed', e) }
    setItems(getProducts().filter(p=> !user || p.store === user.name))
    alert(`Created ${count} products in ${(Date.now()-start)/1000}s`)
  }

  // Auto-send demo orders once per store (hidden — no button)
  React.useEffect(()=>{
    if(!user) return
    try{
      const key = `demo_orders_sent_${user.name}`
      // only run for store users
      if(user.role !== 'store') return
      const storeProducts = getProducts().filter(p => p.store === user?.name)
      const fallbackProducts = storeProducts.length ? storeProducts : getProducts()
      // if there are already orders for this store, skip creating demo ones
      const existing = getOrders().filter(o => o.store === user?.name)
      if(existing.length > 0){
        if(typeof localStorage !== 'undefined') localStorage.setItem(key, '1')
        return
      }
      if(typeof localStorage !== 'undefined' && localStorage.getItem(key)) return
      const customers = getUsers().filter(u=> u.role === 'customer')
      for(let i=0;i<3;i++){
        if(fallbackProducts.length === 0) break
        const itemsCount = 1 + Math.floor(Math.random()*3)
        const items = []
        let total = 0
        for(let k=0;k<itemsCount;k++){
          const prod = fallbackProducts[Math.floor(Math.random()*fallbackProducts.length)]
          const qty = 1 + Math.floor(Math.random()*2)
          items.push({ productId: prod.id, qty })
          total += (prod.price || 0) * qty
        }
        const customer = customers.length ? customers[Math.floor(Math.random()*customers.length)] : null
        AppEngine.placeOrder({ userId: customer ? customer.id : null, items, total: Math.round(total*100)/100, status: 'pending', store: user?.name })
      }
      if(typeof localStorage !== 'undefined') localStorage.setItem(key, '1')
      alert('Demo orders created for your store')
    }catch(e){ /* ignore */ }
  }, [user])

  function generateDemoOrders(){
    if(!user) return
    const storeProducts = getProducts().filter(p => p.store === user?.name)
    const fallbackProducts = storeProducts.length ? storeProducts : getProducts()
    const customers = getUsers().filter(u=> u.role === 'customer')
    for(let i=0;i<3;i++){
      if(fallbackProducts.length === 0) break
      const itemsCount = 1 + Math.floor(Math.random()*3)
      const items = []
      let total = 0
      for(let k=0;k<itemsCount;k++){
        const prod = fallbackProducts[Math.floor(Math.random()*fallbackProducts.length)]
        const qty = 1 + Math.floor(Math.random()*2)
        items.push({ productId: prod.id, qty })
        total += (prod.price || 0) * qty
      }
      const customer = customers.length ? customers[Math.floor(Math.random()*customers.length)] : null
      AppEngine.placeOrder({ userId: customer ? customer.id : null, items, total: Math.round(total*100)/100, status: 'pending', store: user?.name })
    }
    alert('Demo orders created')
  }

  return (
    <Layout sideItems={sideWithAction}>
      <h2 className="text-xl font-semibold mb-4">Store Dashboard</h2>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button onClick={()=> setShowOpen(true)} className={`px-3 py-1 rounded ${showOpen? 'bg-green-600 text-white' : 'bg-slate-700 text-white'}`}>عرض المفتوحة</button>
          <button onClick={()=> setShowOpen(false)} className={`px-3 py-1 rounded ${!showOpen? 'bg-red-600 text-white' : 'bg-slate-700 text-white'}`}>عرض المغلقة</button>
          <div className="ml-2 text-sm text-slate-300">{items.filter(p=> p.active).length} منتج</div>
          <button onClick={() => seedJordanProducts(1000)} className="ml-2 px-3 py-1 bg-purple-600 text-white rounded text-sm">إنشاء 1000 منتج أردني</button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-400">{orders.length} طلبات</div>
          <button onClick={()=> setShowProductModal(true)} className="px-3 py-1 bg-indigo-600 text-white rounded">إضافة منتج</button>
          <button onClick={()=> setShowOfferModal(true)} className="px-3 py-1 bg-emerald-500 text-white rounded">إضافة عرض</button>
          <button onClick={generateDemoOrders} className="px-3 py-1 bg-amber-500 text-black rounded">Generate Demo Orders</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-800 rounded">
          <h3 className="font-semibold mb-2">Welcome, {user?.name}</h3>
          <p className="text-slate-400">Quick overview and actions for your store.</p>
        </div>
        <div className="p-4 bg-slate-800 rounded">Sales stats</div>
      </div>

      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-96">
            <h3 className="text-lg font-bold mb-2">Order #{selectedOrder.id}</h3>
            <p className="text-slate-400 mb-4">Customer: {(users.find(u=>u.id===selectedOrder.userId)||{}).name || 'Guest'}</p>
            <div className="flex gap-2 justify-end">
              <button onClick={acceptOrderAction} className="px-3 py-1 bg-green-600 text-white rounded">Accept</button>
              <button onClick={cancelOrderAction} className="px-3 py-1 bg-red-600 text-white rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-96">
            <h3 className="text-lg font-bold mb-2">Add Product</h3>
            <form onSubmit={addProduct} className="space-y-2">
              <div>
                <label className="block text-sm">Title</label>
                <input name="title" value={form.title} onChange={onChange} className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700" />
              </div>
              <div>
                <label className="block text-sm">القسم (اختر واحد أو أكثر)</label>
                <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-auto">
                  {CATEGORY_LIST_AR.map(cat => (
                    <button type="button" key={cat} onClick={() => toggleCategory(cat)} className={`px-2 py-1 border rounded text-sm ${ (form.categories||[]).includes(cat) ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white' }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              {form.categories && form.categories.length === 1 && SUBCATEGORIES[form.categories[0]] && (
                <div>
                  <label className="block text-sm mt-2">القوائم داخل {form.categories[0]}</label>
                  <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-auto">
                    {SUBCATEGORIES[form.categories[0]].map(sc => (
                      <button type="button" key={sc} onClick={() => selectSubcategory(sc)} className={`px-2 py-1 border rounded text-sm ${ form.subcategory === sc ? 'bg-green-600 text-white' : 'bg-slate-700 text-white' }`}>
                        {sc}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm">Price</label>
                <input name="price" value={form.price} onChange={onChange} className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700" />
              </div>
              <div>
                <label className="block text-sm">Unit Type</label>
                <div className="flex items-center gap-4 mt-1">
                  <label className="inline-flex items-center gap-2"><input type="radio" name="unitType" value="piece" checked={form.unitType==='piece'} onChange={onChange} /> Piece</label>
                  <label className="inline-flex items-center gap-2"><input type="radio" name="unitType" value="weightable" checked={form.unitType==='weightable'} onChange={onChange} /> Weightable</label>
                </div>
              </div>
              <div>
                <label className="block text-sm">Barcode</label>
                <input name="barcode" value={form.barcode} onChange={onChange} className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700" />
              </div>
              <div>
                <label className="block text-sm">Image</label>
                <input type="file" accept="image/*" onChange={onFileChange} className="w-full" />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={()=> setShowProductModal(false)} className="px-3 py-1 bg-slate-400 rounded">Close</button>
                <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-96">
              <h3 className="text-lg font-bold mb-2">إضافة عرض</h3>
              <form onSubmit={submitOffer} className="space-y-2">
                <div>
                  <label className="block text-sm">اسم المنتج</label>
                  <input name="productName" value={offerForm.productName} onChange={onOfferChange} className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700" />
                </div>
                <div>
                  <label className="block text-sm">السعر قبل العرض</label>
                  <input name="originalPrice" value={offerForm.originalPrice} onChange={onOfferChange} className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700" />
                </div>
                <div>
                  <label className="block text-sm">سعر العرض</label>
                  <input name="offerPrice" value={offerForm.offerPrice} onChange={onOfferChange} className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700" />
                </div>
                <div>
                  <label className="block text-sm">قيمة الخصم (اختياري)</label>
                  <input name="discountValue" value={offerForm.discountValue} onChange={onOfferChange} className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700" />
                </div>
                <div>
                  <label className="block text-sm">نسبة ربح الموقع (٪) (اختياري)</label>
                  <input name="platformMargin" value={offerForm.platformMargin} onChange={onOfferChange} className="w-full p-2 rounded bg-slate-100 dark:bg-slate-700" />
                </div>
                <div>
                  <label className="block text-sm">صورة العرض</label>
                  <input type="file" accept="image/*" onChange={onOfferFileChange} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm">صورة الخصم (اختياري)</label>
                  <input type="file" accept="image/*" onChange={onOfferDiscountFileChange} className="w-full" />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" onClick={()=> setShowOfferModal(false)} className="px-3 py-1 bg-slate-400 rounded">إلغاء</button>
                  <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">إرسال للموافقة</button>
                </div>
              </form>
            </div>
          </div>
      )}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold mb-2">Orders</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setTab('pending')} className={`px-3 py-1 rounded ${tab==='pending' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-white'}`}>لكي يفعل</button>
            <button onClick={() => setTab('active')} className={`px-3 py-1 rounded ${tab==='active' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-white'}`}>نشيط</button>
            <button onClick={() => setTab('completed')} className={`px-3 py-1 rounded ${tab==='completed' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-white'}`}>مكتمل</button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-slate-400">No orders yet</div>
        ) : (
          (() => {
            // derive lists
            const pendingList = orders.filter(o => !['preparing','ready_for_pickup','picked_up','fulfilled','cancelled'].includes(o.status))
            const activeList = orders.filter(o => ['preparing','partial_picked','fulfilled'].includes(o.status))
            const completedList = orders.filter(o => ['ready_for_pickup','picked_up'].includes(o.status))

            const list = tab === 'pending' ? pendingList : (tab === 'active' ? activeList : completedList)

            if(list.length === 0) return <div className="p-4 bg-slate-800 rounded text-slate-300">لا توجد طلبات في هذه الفئة</div>

            return (
              <div className="space-y-2">
                {list.map(o => {
                  let timeLabel = ''
                  // if order is ready for pickup, show elapsed since readyAt (counts up from 0)
                  if(o.status === 'ready_for_pickup'){
                    const readyAt = o.readyAt || o.readyAt === 0 ? o.readyAt : null
                    const elapsed = readyAt ? Math.max(0, Math.floor((Date.now() - readyAt)/1000)) : 0
                    const mins = Math.floor(elapsed/60)
                    const secs = elapsed % 60
                    timeLabel = `${mins}m ${secs}s`
                  } else if(o.status === 'picked_up'){
                    timeLabel = 'تم الاستلام'
                  } else {
                    const remainingSec = o.estimatedReadyAt ? Math.max(0, Math.ceil((o.estimatedReadyAt - now)/1000)) : ((o.prepMinutes||0) * 60)
                    const mins = Math.floor(remainingSec / 60)
                    const secs = remainingSec % 60
                    timeLabel = remainingSec > 0 ? `${mins}m ${secs}s` : 'Ready'
                  }
                  return (
                    <div key={o.id} className="bg-slate-900 p-3 rounded flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{(users.find(u=>u.id===o.userId)||{}).name || 'Guest'}</div>
                        <div className="text-slate-400 text-sm">#{o.id} — ${o.total} — {(o.items||[]).filter(i => !i.preparing && !(i.pickedQty && i.pickedQty >= (i.qty||i.quantity||1))).length} items</div>
                      </div>
                        <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-amber-400 text-black rounded font-medium">{o.status === 'ready_for_pickup' ? 'منذ التجهيز:' : (o.status === 'picked_up' ? '' : 'ETA:')} {timeLabel}</div>
                        <div className="flex gap-2">
                                        {tab === 'pending' && (
                                          <>
                                            <button onClick={() => {
                                              try{ updateOrder(o.id, { status: 'preparing', preparingAt: Date.now() }) }catch(e){ console.error(e) }
                                              try{ navigate(`/store/orders/${o.id}`) }catch(e){ /* ignore */ }
                                            }} className="px-3 py-1 bg-green-600 text-white rounded">Accept</button>
                                            <button onClick={() => cancelOrderRow(o)} className="px-3 py-1 bg-red-600 text-white rounded">Cancel</button>
                                          </>
                                        )}
                          {tab === 'active' && (
                            <>
                              <button onClick={() => {
                                try{ updateOrder(o.id, { status: 'ready_for_pickup', readyAt: Date.now() }) }catch(e){ console.error(e) }
                              }} className="px-3 py-1 bg-amber-500 text-white rounded">جاهز للاستلام</button>
                              <button onClick={() => navigate(`/store/orders/${o.id}`)} className="px-3 py-1 bg-slate-700 text-white rounded">تفاصيل</button>
                            </>
                          )}
                          {tab === 'completed' && (
                            <button onClick={() => navigate(`/store/orders/${o.id}`)} className="px-3 py-1 bg-slate-700 text-white rounded">تفاصيل</button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })()
        )}
      </div>
    </Layout>
  )
}
