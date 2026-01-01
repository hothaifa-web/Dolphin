import React from 'react'
import Layout from '../components/Layout'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getProducts, PRODUCTS, updateOrder, getOrders } from '../data/mock'
import AppEngine from '../services/AppEngine'
import { useAuth } from '../components/AuthProvider'

export default function StoreProductDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const product = React.useMemo(()=> getProducts().find(p=> String(p.id) === String(id)), [id])
  const location = useLocation()
  const navState = location.state || {}
  const initialMax = navState.maxQty || product?.stock || 1
  const [qty, setQty] = React.useState(Math.min(initialMax, 1))
  const [maxQty, setMaxQty] = React.useState(initialMax)
  const unitPrice = product ? Number(product.price || 0) : 0
  const isWeightable = product && product.unitType === 'weightable'
  const [weight, setWeight] = React.useState(() => isWeightable ? (navState.weight || 1) : 0)
  const [price, setPrice] = React.useState(() => {
    if(isWeightable){
      const w = navState.weight || 1
      return Math.round((unitPrice * w) * 100) / 100
    }
    return typeof navState.price === 'number' ? navState.price : (product ? product.price : 0)
  })
  const [showAlternatives, setShowAlternatives] = React.useState(false)
  const [alternatives, setAlternatives] = React.useState([])
  const [selected, setSelected] = React.useState([])
  const [barcodeQuery, setBarcodeQuery] = React.useState('')
  const [showInvoiceWorkflow, setShowInvoiceWorkflow] = React.useState(false)
  const [invoiceHtml, setInvoiceHtml] = React.useState('')
  const [invoiceSaved, setInvoiceSaved] = React.useState(false)
  const [showToast, setShowToast] = React.useState(false)

  // no-op

  if(!product) return (
    <Layout>
      <div>Product not found</div>
    </Layout>
  )

  function inc(){ setQty(q => Math.min(maxQty || (product.stock||9999), q+1)) }
  function dec(){ setQty(q => Math.max(1, q-1)) }

  function handlePriceChange(val){
    const p = Number(val) || 0
    setPrice(p)
    if(isWeightable && unitPrice > 0){
      const w = Math.round((p / unitPrice) * 1000) / 1000
      setWeight(w)
    }
  }

  function handleWeightChange(val){
    const w = Number(val) || 0
    setWeight(w)
    setPrice(Math.round((w * unitPrice) * 100) / 100)
  }

  function pickup(){
    console.log('pickup() clicked', { productId: product?.id, qty, navState })
    // if we were opened from an order, update that order's item to mark picked qty
    const navOrderId = navState.orderId
    if(navOrderId){
      try{
        const all = getOrders()
        const ord = all.find(o=> String(o.id) === String(navOrderId))
        if(!ord){
          console.warn('pickup: parent order not found', { navOrderId, ordersCount: all.length })
          alert('لم أتمكن من إيجاد الطلب الأصلي. افتح المنتج من صفحة الطلب ثم جرب مرة أخرى.')
          return
        }
        if(ord){
          const newItems = (ord.items||[]).map(it => {
            if(String(it.productId) === String(product.id)){
              const requested = navState.requestedQty || it.qty || it.quantity || 1
              const picked = navState.action === 'pickup' ? requested : (isWeightable ? weight : qty)
              return { ...it, requestedQty: requested, pickedQty: picked }
            }
            return it
          })
          // mark order status if any item has been picked
          const anyPicked = newItems.some(i=> i.pickedQty && i.pickedQty > 0)
          const updated = updateOrder(ord.id, { items: newItems, status: anyPicked ? 'partial_picked' : ord.status })
          if(!updated){
            console.error('pickup: updateOrder returned null', ord.id)
            alert('حدث خطأ أثناء تحديث الطلب. راجع وحدة التخزين أو سجلات المتصفح.')
            return
          }
          // show a short toast only (no invoice/modal)
          setShowToast(true)
          setTimeout(()=> setShowToast(false), 1400)
          // navigate to the order's items page so the user sees remaining unpicked items
          const target = `/store/orders/${ord.id}`
          console.log('pickup: navigating to', target)
          try{
            // use SPA navigation to preserve auth state
            navigate(target, { replace: true })
          }catch(e){ console.error(e) }
          return
        }
      }catch(e){ console.error('pickup error', e); alert('حدث خطأ'); }
    }
    // fallback: create a ready_for_pickup small order for this product
    try{
      const created = AppEngine.placeOrder({ userId: null, items: [{ productId: product.id, qty: (isWeightable ? weight : qty) }], total: isWeightable ? Math.round((price||unitPrice||0) * 100)/100 : Math.round((price||product.price || 0) * qty * 100)/100, status: 'ready_for_pickup', store: product.store })
      alert('Marked ready for pickup')
      const target = `/store/orders/${created.id}`
      console.log('pickup: fallback navigate to', target, { orderId: created.id })
      try{ navigate(target, { state: { orderId: created.id }, replace: true }) }catch(e){ navigate('/store') }
    }catch(e){ console.error('createOrder error', e); alert('حدث خطأ أثناء إنشاء الطلب') }
  }

  function openAlternatives(){
    console.log('openAlternatives clicked', { productId: product?.id })
    try{
      // find similar products (same store or price proximity)
      const others = getProducts().filter(p=> p.id !== product.id)
      const byStore = others.filter(p=> p.store === product.store)
      const candidates = byStore.length ? byStore : others
      // pick top 12 closest by price
      candidates.sort((a,b)=> Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
      setAlternatives(candidates.slice(0,12))
      setSelected([])
      setShowAlternatives(true)
    }catch(e){ console.error('openAlternatives error', e); alert('حدث خطأ') }
  }

  function toggleSelect(prod){
    setSelected(s => {
      if(s.find(x=>x.id===prod.id)) return s.filter(x=>x.id!==prod.id)
      if(s.length >= 6) return s
      return [...s, prod]
    })
  }

  function searchByBarcode(){
    const code = barcodeQuery.trim()
    if(!code) return
    const found = getProducts().filter(p=> String(p.barcode||'') === code)
    if(found.length) setAlternatives(prev => [found[0], ...prev.filter(p=> p.id !== found[0].id)].slice(0,12))
    else alert('No product with that barcode')
  }

  function sendAlternatives(){
    if(selected.length < 6){ alert('Select 6 alternatives') ; return }
    // if we came from an order, attach alternatives to that order's item
    const navOrderId = navState.orderId
    if(navOrderId){
      try{
        const all = getOrders()
        const ord = all.find(o=> String(o.id) === String(navOrderId))
        if(ord){
          const newItems = (ord.items||[]).map(it => {
            if(String(it.productId) === String(product.id)){
              return { ...it, fulfilledFromStock: selected.map(p=> p.id), fulfilledQty: selected.length }
            }
            return it
          })
          updateOrder(ord.id, { items: newItems, status: 'fulfilled_from_stock' })
          alert('البدائل تم ارسالها وتم تحديث الطلب')
          setShowAlternatives(false)
          navigate(-1)
          return
        }
      }catch(e){ /* ignore */ }
    }
    const items = selected.map(p=> ({ productId: p.id, qty: 1 }))
    AppEngine.placeOrder({ userId: null, items, total: Math.round(items.reduce((s,it)=> s + ((PRODUCTS.find(pp=>pp.id===it.productId)?.price||0)*it.qty),0)*100)/100, status: 'pending', store: product.store })
    alert('Alternatives sent to customer')
    setShowAlternatives(false)
    navigate('/store')
  }

  function generateInvoiceHtml(order, product, pickedQty){
    const now = new Date()
    const lines = []
    lines.push(`<h2>فاتورة الطلب #${order.id}</h2>`)
    lines.push(`<div>Store: ${order.store || ''}</div>`)
    lines.push(`<div>Date: ${now.toLocaleString()}</div>`)
    lines.push(`<hr/>`)
    lines.push(`<div><strong>Item</strong> - <strong>Qty</strong> - <strong>Price</strong></div>`)
    lines.push(`<div>${product.name?.en || product.name} - ${pickedQty} - ${product.price}</div>`)
    lines.push(`<hr/>`)
    lines.push(`<div>Total: ${(product.price||0) * pickedQty}</div>`)
    return lines.join('')
  }

  function saveInvoice(){
    const navOrderId = navState.orderId
    if(!navOrderId) return
    try{
      const all = getOrders()
      const ord = all.find(o=> String(o.id) === String(navOrderId))
      if(ord){
        updateOrder(ord.id, { invoice: { html: invoiceHtml, savedAt: Date.now() } })
        setInvoiceSaved(true)
        alert('الفاتورة محفوظة')
        return
      }
    }catch(e){ /* ignore */ }
  }

  function markReady(){
    const navOrderId = navState.orderId
    if(!navOrderId) return
    try{
      const all = getOrders()
      const ord = all.find(o=> String(o.id) === String(navOrderId))
      if(ord){
        updateOrder(ord.id, { status: 'ready_for_pickup', readyAt: Date.now(), driverNotified: true })
        alert('تم وضع الطلب جاهزاً وتم ابلاغ السائق')
        setShowInvoiceWorkflow(false)
        navigate(-1)
        return
      }
    }catch(e){ /* ignore */ }
  }

  // Auto-actions when opened from an order
  React.useEffect(()=>{
    if(navState.action === 'fulfill'){
      // open alternatives modal automatically
      openAlternatives()
    }
    if(navState.action === 'pickup'){
      // prefill qty to requested
      setQty(Math.min(navState.requestedQty || 1, initialMax))
    }
    if(navState.action === 'pickup_partial' || navState.action === 'partial_pickup'){
      // prefill qty to be less than requested (one less by default)
      const req = Math.max(1, Number(navState.requestedQty || 1))
      setQty(Math.min(initialMax, Math.max(1, req - 1)))
    }
    if(navState.action === 'preparing' || navState.action === 'prepairing'){
      // mark the parent order as preparing
      const navOrderId = navState.orderId
      if(navOrderId){
        try{
          const all = getOrders()
          const ord = all.find(o=> String(o.id) === String(navOrderId))
          if(ord){
            updateOrder(ord.id, { status: 'preparing' })
            navigate(-1)
            return
          }
        }catch(e){ /* ignore */ }
      }
    }
    if(navState.action === 'picked'){
      const navOrderId = navState.orderId
      if(navOrderId){
        try{
          const all = getOrders()
          const ord = all.find(o=> String(o.id) === String(navOrderId))
          if(ord){
            const newItems = (ord.items||[]).map(it => {
              if(String(it.productId) === String(product.id)){
                const rq = navState.requestedQty || it.qty || it.quantity || 1
                return { ...it, requestedQty: rq, pickedQty: rq }
              }
              return it
            })
            updateOrder(ord.id, { items: newItems, status: 'picked_up' })
            alert('الكمية تم التقاطها وتم تحديث الطلب')
            navigate(-1)
            return
          }
        }catch(e){ /* ignore */ }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <button onClick={()=> navigate(-1)} className="mb-4 text-sm underline">Back</button>
        <div className="bg-slate-800 p-6 rounded">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <img src={product.image} alt={product.name?.en || product.name} className="w-full h-48 object-cover rounded" />
            </div>
            <div className="col-span-2">
              <h2 className="text-lg font-semibold">{product.name?.en || product.name}</h2>
              <div className="mt-2 flex items-center gap-6">
                <div>
                  <div className="text-sm text-slate-400">Barcode</div>
                  <div className="font-mono text-xl">{product.barcode || product.id}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Price</div>
                  <div className="text-green-400 text-2xl">${price}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button onClick={dec} className="px-3 py-1 bg-slate-700 rounded">-</button>
                  <div className="px-4 py-2 bg-slate-900 rounded">{qty}</div>
                  <button onClick={inc} className="px-3 py-1 bg-slate-700 rounded">+</button>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-sm">Change price</div>
                    <input value={price} onChange={e=> handlePriceChange(e.target.value)} className="p-2 rounded bg-slate-700" />
                  </div>
                  {isWeightable && (
                    <div>
                      <div className="text-sm">Weight (kg)</div>
                      <input value={weight} onChange={e=> handleWeightChange(e.target.value)} className="p-2 rounded bg-slate-700 w-28" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={pickup} className="px-4 py-2 bg-blue-600 text-white rounded">التقاط</button>
                <button onClick={openAlternatives} className="px-4 py-2 bg-violet-600 text-white rounded">نفّذ من المخزن</button>
              </div>
            </div>
          </div>
        </div>

        {showAlternatives && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-3/4 max-w-4xl">
              <h3 className="text-lg font-bold mb-2">Select up to 6 alternatives</h3>
              <div className="mb-2 flex gap-2">
                <input value={barcodeQuery} onChange={e=> setBarcodeQuery(e.target.value)} placeholder="Search by barcode" className="p-2 rounded flex-1" />
                <button onClick={searchByBarcode} className="px-3 py-2 bg-indigo-600 text-white rounded">Search</button>
              </div>
              <div className="grid grid-cols-4 gap-3 max-h-72 overflow-auto mb-4">
                {alternatives.map(p=> (
                  <div key={p.id} className={`p-3 rounded border ${selected.find(s=>s.id===p.id)? 'border-indigo-500 bg-slate-100':'border-slate-200'}`}>
                    <img src={p.image} className="w-full h-20 object-cover rounded mb-2" />
                    <div className="text-sm font-semibold">{p.name?.en || p.name}</div>
                    <div className="text-sm text-slate-500">${p.price}</div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={()=> toggleSelect(p)} className="px-2 py-1 bg-indigo-600 text-white rounded">{selected.find(s=>s.id===p.id)? 'Selected':'Select'}</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={()=> setShowAlternatives(false)} className="px-3 py-2 bg-slate-400 rounded">Close</button>
                <button onClick={sendAlternatives} className="px-3 py-2 bg-green-600 text-white rounded" disabled={selected.length!==6}>Send ({selected.length}/6)</button>
              </div>
            </div>
          </div>
        )}
        {showInvoiceWorkflow && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-3/4 max-w-3xl">
              <h3 className="text-lg font-bold mb-2">فاتورة و خيارات الطباعة</h3>
              <div className="mb-4 overflow-auto max-h-64 p-2 bg-slate-100 dark:bg-slate-700" dangerouslySetInnerHTML={{ __html: invoiceHtml }} />
              <div className="flex gap-2">
                <button onClick={() => { const w = window.open(); if(w){ w.document.write(invoiceHtml); w.document.close(); w.print(); } }} className="px-3 py-2 bg-indigo-600 text-white rounded">طباعة فاتورة</button>
                <button onClick={saveInvoice} className="px-3 py-2 bg-green-600 text-white rounded">حفظ الفاتورة</button>
                {invoiceSaved && <button onClick={markReady} className="px-3 py-2 bg-amber-500 text-white rounded">جاهز</button>}
                <button onClick={() => { setShowInvoiceWorkflow(false); setInvoiceHtml('') }} className="px-3 py-2 bg-slate-400 rounded">إغلاق</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
