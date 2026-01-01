import React from 'react'
import Layout from '../components/Layout'
import { getOrders, getProducts, updateOrder } from '../data/mock'
import OrderCard from '../components/OrderCard'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'

export default function StoreOrderDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const orders = React.useMemo(()=> getOrders(), [])
  const products = React.useMemo(()=> getProducts(), [])
  const order = orders.find(o => String(o.id) === String(id) && (!user || o.store === user.name))

  // status helpers
  const isPreparing = order && (order.status === 'preparing' || order.status === 'تجهيز الأوردر' || order.status === 'قيد التجهيز')
  const isPrepared = order && (order.status === 'ready_for_pickup' || order.status === 'picked_up' || order.status === 'ready')

  const [expandedItemId, setExpandedItemId] = React.useState(null)
  const [showInvoiceFor, setShowInvoiceFor] = React.useState(null)
  const [inlineInvoiceHtml, setInlineInvoiceHtml] = React.useState('')
  const [inlineInvoiceSaved, setInlineInvoiceSaved] = React.useState(false)
  const [showPickedToast, setShowPickedToast] = React.useState(false)
  const [showProceed, setShowProceed] = React.useState(false)
  const [showFinalModal, setShowFinalModal] = React.useState(false)
  const [finalInvoiceHtml, setFinalInvoiceHtml] = React.useState('')

  if(!order) return (
    <Layout sideItems={[ {label:'Dashboard',to:'/store'}, {label:'Products', to:'/store/products'}, {label:'Orders', to:'/store/orders'} ]}>
      <div className="p-6 bg-slate-800 rounded">Order not found.</div>
    </Layout>
  )

  function openItemDetail(it){
    const qty = it.qty || it.quantity || 1
    const prod = products.find(p=> p.id === it.productId) || {}
    navigate(`/store/product/${it.productId}`, { state: { maxQty: qty, price: prod.price || 0, action: 'pickup', orderId: order.id, requestedQty: qty } })
  }

  function generateInvoiceHtml(order, prod, pickedQty){
    const now = new Date()
    return `<h2>فاتورة الطلب #${order.id}</h2><div>Item: ${prod.name?.en || prod.name}</div><div>Qty: ${pickedQty}</div><div>Price: ${prod.price}</div><div>Total: ${(prod.price||0)*pickedQty}</div><div>Date: ${now.toLocaleString()}</div>`
  }

  function handlePreparing(){
    try{ updateOrder(order.id, { status: 'preparing' }); alert('Order set to preparing') }catch(e){}
  }

  function startPreparingItem(prod, it){
    try{
      const newItems = (order.items||[]).map(i => {
        if(String(i.productId) === String(prod.id)){
          return { ...i, preparing: true }
        }
        return i
      })
      updateOrder(order.id, { items: newItems, status: 'preparing' })
      alert('Item marked preparing')
    }catch(e){ console.error(e) }
  }

  function allItemsPicked(ord){
    if(!ord) return false
    return (ord.items||[]).every(i => (i.pickedQty && i.pickedQty >= (i.qty||i.quantity||1)))
  }

  React.useEffect(()=>{
    if(order && allItemsPicked(order)) setShowProceed(true)
  }, [order])

  function markItemPicked(prod){
    try{
      const newItems = (order.items||[]).map(i => i.productId === prod.id ? { ...i, requestedQty: (i.qty||i.quantity||1), pickedQty: (i.qty||i.quantity||1) } : i)
      const updated = updateOrder(order.id, { items: newItems })
      // show short toast
      setShowPickedToast(true)
      setTimeout(()=> setShowPickedToast(false), 1400)
      // if all picked now, navigate to the items page which contains the proceed button
      if(allItemsPicked(updated)) try{ navigate(`/store/orders/${order.id}/items`) }catch(e){}
    }catch(e){ console.error(e) }
  }

  function handlePartialPickup(prod, it){
    const req = it.qty || it.quantity || 1
    const picked = Math.max(1, req - 1)
    try{
      const newItems = (order.items||[]).map(i=> i.productId === prod.id ? { ...i, requestedQty: req, pickedQty: picked } : i)
      updateOrder(order.id, { items: newItems, status: 'partial_picked' })
      const invoice = generateInvoiceHtml(order, prod, picked)
      setInlineInvoiceHtml(invoice)
      setInlineInvoiceSaved(false)
      setShowInvoiceFor(prod.id)
    }catch(e){}
  }

  function handlePicked(prod, it){
    const req = it.qty || it.quantity || 1
    try{
      const newItems = (order.items||[]).map(i=> i.productId === prod.id ? { ...i, requestedQty: req, pickedQty: req } : i)
      const updated = updateOrder(order.id, { items: newItems })
      const invoice = generateInvoiceHtml(order, prod, req)
      setInlineInvoiceHtml(invoice)
      setInlineInvoiceSaved(false)
      setShowInvoiceFor(prod.id)
      // show short toast and check completion
      setShowPickedToast(true)
      setTimeout(()=> setShowPickedToast(false), 1400)
      if(allItemsPicked(updated)) try{ navigate(`/store/orders/${order.id}/items`) }catch(e){}
    }catch(e){}
  }

  function setStatus(status){
    try{ updateOrder(order.id, { status }) }catch(e){}
    try{ alert('Order status updated') }catch(e){}
  }

  function markAllPicked(){
    try{
      const newItems = (order.items||[]).map(i => ({ ...i, requestedQty: (i.qty||i.quantity||1), pickedQty: (i.qty||i.quantity||1) }))
      const updated = updateOrder(order.id, { items: newItems, status: 'picked_up' })
      setShowPickedToast(true)
      setTimeout(()=> setShowPickedToast(false), 1400)
      if(allItemsPicked(updated)) try{ navigate(`/store/orders/${order.id}/items`) }catch(e){}
    }catch(e){ console.error(e) }
  }

  function generateOrderInvoiceHtml(ord){
    const now = new Date()
    const lines = []
    lines.push(`<h2>فاتورة الطلب #${ord.id}</h2>`)
    lines.push(`<div>Store: ${ord.store || ''}</div>`)
    lines.push(`<div>Date: ${now.toLocaleString()}</div>`)
    lines.push(`<hr/>`)
    lines.push(`<div><strong>Item</strong> - <strong>Qty</strong> - <strong>Price</strong></div>`)
    let total = 0
    const items = (ord.items||[]).filter(it => !(it.pickedQty && it.pickedQty >= (it.qty||it.quantity||1)))
    for(const it of items){
      const prod = products.find(p=> p.id === it.productId) || {}
      const qty = it.requestedQty || it.qty || it.quantity || 0
      const price = prod.price || 0
      const lineTotal = price * qty
      total += lineTotal
      const fulfilled = it.fulfilledFromStock && it.fulfilledFromStock.length
      lines.push(`<div>${prod.name?.en || prod.name} - ${qty} - ${price} ${fulfilled ? '(نفّذ من المخزن)' : ''}</div>`)
    }
    lines.push(`<hr/>`)
    lines.push(`<div><strong>Total: ${total.toFixed(2)}</strong></div>`)
    return lines.join('')
  }

  // action helpers that navigate to relevant flows for first applicable item
  function gotoPartialPickup(){
    const it = (order.items||[]).find(i => !(i.pickedQty && i.pickedQty >= (i.qty||i.quantity||1)))
    if(!it) return alert('لا يوجد عنصر متاح للتقاط جزئي')
    const prod = products.find(p=> p.id === it.productId) || {}
    navigate(`/store/product/${prod.id}`, { state: { action: 'pickup_partial', orderId: order.id, requestedQty: it.qty || it.quantity || 1 } })
  }

  function gotoFulfill(){
    const it = (order.items||[]).find(i => !(i.fulfilledFromStock || i.fulfilledQty))
    if(!it) return alert('لا يوجد عنصر مناسب للتنفيذ من المخزن')
    const prod = products.find(p=> p.id === it.productId) || {}
    navigate(`/store/product/${prod.id}`, { state: { action: 'fulfill', orderId: order.id, requestedQty: it.qty || it.quantity || 1 } })
  }

  function gotoPreparing(){
    try{ updateOrder(order.id, { status: 'preparing' }) }catch(e){}
    navigate('/store')
  }

  function gotoPickedPage(){
    try{ navigate('/store/picked', { state: { orderId: order.id } }) }catch(e){}
  }

  return (
    <Layout sideItems={[ {label:'Dashboard',to:'/store'}, {label:'Products', to:'/store/products'}, {label:'Orders', to:'/store/orders'} ]}>
      <div className="mb-6">
        <div className="glass-card p-4 rounded-2xl flex items-center justify-between shadow-lux">
          <div className="flex items-center gap-4">
            <img src="/1.png" alt="Dolphin" className="w-14 h-14 dolphin-float rounded-full object-cover border border-white/10" />
            <div>
              <div className="text-deep-navy font-bold text-lg">Order #{order.id}</div>
              <div className="text-slate-500 text-sm">{order.userId || 'Guest'} • {new Date(order.createdAt||Date.now()).toLocaleString()}</div>
            </div>
          </div>
          <div>
            {!isPreparing && !isPrepared && (
              <button onClick={gotoPreparing} className="px-4 py-2 rounded-xl text-white font-semibold" style={{ background: 'linear-gradient(90deg,#0077be,#00a8ff)', boxShadow: '0 10px 30px rgba(0,119,190,0.18)' }}>قيد التجهيز</button>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="glass-card p-6 rounded-2xl">
          <div className="mb-3 text-slate-400">Customer: {(order.userId || 'Guest')}</div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(order.items||[]).filter(it => !(it.preparing || (it.pickedQty && it.pickedQty >= (it.qty||it.quantity||1)))).map((it, idx) => {
              const prod = products.find(p=> p.id === it.productId) || {}
              return (
                <OrderCard
                  key={idx}
                  item={it}
                  product={prod}
                  status={order.status}
                  onPick={() => markItemPicked(prod)}
                  onDetails={() => openItemDetail(it)}
                />
              )
            })}
          </div>

          {expandedItemId && (() => {
            const activeItem = order.items.find(it => String(it.productId) === String(expandedItemId))
            if(!activeItem) return null
            const activeProd = products.find(p => p.id === activeItem.productId) || {}
            const qty = activeItem.qty || activeItem.quantity || 1
            return (
              <div className="mt-4 bg-slate-900 p-4 rounded">
                <div className="flex items-center gap-4">
                  <img src={activeProd.image} className="w-28 h-20 object-cover rounded" />
                  <div>
                    <div className="font-semibold">{activeProd.name?.en || activeProd.name}</div>
                    <div className="text-slate-400">Barcode: {activeProd.barcode || activeProd.sku || activeProd.id}</div>
                    <div className="text-slate-400">Qty: {qty}</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="text-slate-400">معلومات الصنف معروضة أعلاه.</div>
                  <button onClick={() => setExpandedItemId(null)} className="ml-auto px-3 py-2 bg-slate-400 rounded">إغلاق</button>
                </div>
              </div>
            )
          })()}

          {showPickedToast && (
            <div className="fixed left-1/2 -translate-x-1/2 top-1/4 bg-amber-500 text-white px-6 py-3 rounded shadow-lg z-50">تم التقاط الصنف</div>
          )}

          {showProceed && order.status !== 'ready_for_pickup' && (
            <div className="mt-4 p-4 bg-slate-900 rounded flex items-center gap-4">
              <div className="font-semibold">جميع الأصناف تم التقاطها</div>
              <button onClick={() => {
                const html = (function build(){
                  const now = new Date()
                  const lines = []
                  lines.push(`<h2>فاتورة الطلب #${order.id}</h2>`)
                  lines.push(`<div>Date: ${now.toLocaleString()}</div>`)
                  lines.push(`<hr/>`)
                  let total = 0
                  for(const it of (order.items||[])){
                    const prod = products.find(p=> p.id === it.productId) || {}
                    const pq = it.pickedQty || it.requestedQty || it.qty || it.quantity || 0
                    const lineTotal = (prod.price||0) * pq
                    total += lineTotal
                    lines.push(`<div>${prod.name?.en || prod.name} - ${pq} x ${prod.price || 0} = ${lineTotal.toFixed(2)}</div>`)
                  }
                  lines.push(`<hr/>`)
                  lines.push(`<div><strong>Total: ${total.toFixed(2)}</strong></div>`)
                  return lines.join('')
                })()
                setFinalInvoiceHtml(html)
                setShowFinalModal(true)
              }} className="px-4 py-2 bg-green-600 text-white rounded">الانتقال للدفع</button>
            </div>
          )}

          {showFinalModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-3/4 max-w-3xl">
                <h3 className="text-lg font-bold mb-2">ملخص الطلب - #{order.id}</h3>
                <div className="mb-2 text-slate-400">حالة الطلب: <span className="font-semibold text-white">{order.status}</span></div>
                <div className="mb-4 overflow-auto max-h-64 p-2 bg-slate-100 dark:bg-slate-700">
                  <div className="space-y-2">
                    {(order.items||[]).filter(it => !(it.pickedQty && it.pickedQty >= (it.qty||it.quantity||1))).map((it, idx) => {
                      const prod = products.find(p=> p.id === it.productId) || {}
                      const qty = it.requestedQty || it.qty || it.quantity || 0
                      const fulfilled = (it.fulfilledFromStock && it.fulfilledFromStock.length) || (it.fulfilledQty && it.fulfilledQty > 0)
                      return (
                        <div key={idx} className="p-3 bg-white dark:bg-slate-800 border rounded flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{prod.name?.en || prod.name}</div>
                            <div className="text-slate-400">Qty: {qty} — Price: ${(prod.price||0).toFixed(2)}</div>
                          </div>
                          {fulfilled ? <div className="px-2 py-1 bg-red-600 text-white rounded text-sm">نفّذ من المخزن</div> : null}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { const html = generateOrderInvoiceHtml(order); const w = window.open(); if(w){ w.document.write(html); w.document.close(); w.print(); } }} className="px-3 py-2 bg-indigo-600 text-white rounded">طباعة فاتورة</button>
                  <button onClick={() => { const html = generateOrderInvoiceHtml(order); updateOrder(order.id, { invoice: { html, savedAt: Date.now() } }); alert('الفاتورة محفوظة') }} className="px-3 py-2 bg-green-600 text-white rounded">حفظ الفاتورة</button>
                  <button onClick={() => { updateOrder(order.id, { status: 'ready_for_pickup', readyAt: Date.now(), driverNotified: true }); setShowFinalModal(false); setShowProceed(false); alert('تم وضع الطلب جاهزاً وتم ابلاغ السائق') }} className="px-3 py-2 bg-amber-500 text-white rounded">جاهز للاستلام</button>
                  <button onClick={() => setShowFinalModal(false)} className="px-3 py-2 bg-slate-400 rounded">إغلاق</button>
                </div>
              </div>
            </div>
          )}

          {showInvoiceFor && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-3/4 max-w-3xl">
                <h3 className="text-lg font-bold mb-2">فاتورة - الطلب #{order.id}</h3>
                <div className="mb-4 overflow-auto max-h-64 p-2 bg-slate-100 dark:bg-slate-700" dangerouslySetInnerHTML={{ __html: inlineInvoiceHtml }} />
                <div className="flex gap-2">
                  <button onClick={() => { const w = window.open(); if(w){ w.document.write(inlineInvoiceHtml); w.document.close(); w.print(); } }} className="px-3 py-2 bg-indigo-600 text-white rounded">طباعة فاتورة</button>
                  <button onClick={() => { updateOrder(order.id, { invoice: { html: inlineInvoiceHtml, savedAt: Date.now() } }); setInlineInvoiceSaved(true); alert('الفاتورة محفوظة') }} className="px-3 py-2 bg-green-600 text-white rounded">حفظ الفاتورة</button>
                  {inlineInvoiceSaved && <button onClick={() => { updateOrder(order.id, { status: 'ready_for_pickup', readyAt: Date.now(), driverNotified: true }); setShowInvoiceFor(null); alert('تم وضع الطلب جاهزاً وتم ابلاغ السائق') }} className="px-3 py-2 bg-amber-500 text-white rounded">جاهز</button>}
                  <button onClick={() => { setShowInvoiceFor(null); setInlineInvoiceHtml('') }} className="px-3 py-2 bg-slate-400 rounded">إغلاق</button>
                </div>
              </div>
            </div>
          )}

          {isPreparing && !isPrepared && (
            <div className="mt-4 p-4 bg-slate-900 rounded">
              <div className="mb-2 text-slate-300 font-semibold">حالة الطلب: pending</div>
              <div className="flex gap-2">
                {order.status !== 'ready_for_pickup' && (
                  <button onClick={() => setShowFinalModal(true)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">الانتقال للدفع</button>
                )}
                <button onClick={gotoFulfill} className="px-3 py-1 bg-green-700 text-white rounded text-sm">نفّذ من المخزن</button>
                <button onClick={gotoPartialPickup} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">التقاط جزئي</button>
                <button onClick={gotoPickedPage} className="px-3 py-1 bg-slate-700 text-white rounded text-sm">تم التقاطه</button>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3">
            <div className="text-slate-300">حالة الطلب: <span className="font-semibold text-white">{order.status}</span></div>
            <div className="flex justify-end gap-2">
              <button onClick={() => navigate('/store/orders')} className="px-3 py-1 bg-slate-600 rounded">Back</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
