import React from 'react'
import Layout from '../components/Layout'
import { useParams, useNavigate } from 'react-router-dom'
import { getOrders, getProducts, updateOrder } from '../data/mock'
import { useAuth } from '../components/AuthProvider'

export default function StoreOrderItems(){
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth() || {}
  React.useEffect(()=>{
    try{
      if(user === null && typeof navigate === 'function') navigate('/login')
    }catch(e){ /* ignore */ }
  },[user,navigate])
  const orders = React.useMemo(()=> getOrders(), [])
  const products = React.useMemo(()=> getProducts(), [])
  const order = orders.find(o => String(o.id) === String(id) && (!user || o.store === user.name))
  const [showToast, setShowToast] = React.useState(false)
  const [showInvoice, setShowInvoice] = React.useState(false)
  const [invoiceHtml, setInvoiceHtml] = React.useState('')
  const [showProceed, setShowProceed] = React.useState(false)
  const [showRequestMsg, setShowRequestMsg] = React.useState(false)
  const [requestDetails, setRequestDetails] = React.useState(null)

  React.useEffect(()=>{
    if(!order) return
    const allPicked = (order.items||[]).every(it => it.pickedQty && it.pickedQty >= (it.qty||it.quantity||1))
    if(allPicked) setShowProceed(true)
  }, [order])

  if(!order) return (
    <Layout>
      <div className="p-6 bg-slate-800 rounded">Order not found.</div>
    </Layout>
  )

  function markItemPicked(prod){
    try{
      const newItems = (order.items||[]).map(i => i.productId === prod.id ? { ...i, requestedQty: (i.qty||i.quantity||1), pickedQty: (i.qty||i.quantity||1) } : i)
      const updated = updateOrder(order.id, { items: newItems })
      setShowToast(true)
      setTimeout(()=> setShowToast(false), 1400)
      if((updated.items||[]).every(it => it.pickedQty && it.pickedQty >= (it.qty||it.quantity||1))){
        setShowProceed(true)
      }
    }catch(e){ console.error(e) }
  }

  function handleProceedToPayment(){
    const now = new Date()
    const orderLatest = getOrders().find(o=> String(o.id) === String(order.id)) || order
    const itemsCount = (orderLatest.items||[]).length
    let total = 0
    for(const it of (orderLatest.items||[])){
      const p = products.find(x=> x.id === it.productId) || {}
      const pq = it.pickedQty || it.requestedQty || it.qty || it.quantity || 0
      total += (p.price||0) * pq
    }
    setRequestDetails({ orderId: order.id, date: now.toLocaleString(), total: total.toFixed(2), itemsCount })
    setShowRequestMsg(true)
  }

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">الأصناف - Order #{order.id}</h2>
      {/* Hide items when on the proceed flow; show only the proceed CTA */}
      {!showProceed && (
        <div className="grid grid-cols-3 gap-4">
          {(order.items||[]).map((it, idx) => {
            const prod = products.find(p=> p.id === it.productId) || {}
            const qty = it.requestedQty || it.qty || it.quantity || 1
            return (
              <div key={idx} className="bg-slate-900 p-3 rounded">
                {prod.image && <img src={prod.image} className="w-full h-28 object-cover rounded mb-2" />}
                  <div className="font-semibold text-white">{prod.name?.en || prod.name}</div>
                  <div className="text-slate-400">{prod && prod.unitType === 'weightable' ? `Weight: ${qty} kg` : `Qty: ${qty}`}</div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => markItemPicked(prod)} className="px-3 py-1 bg-amber-500 text-white rounded">التقط</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showToast && <div className="fixed left-1/2 -translate-x-1/2 top-1/4 bg-amber-500 text-white px-6 py-3 rounded z-50">تم التقاط الصنف</div>}

      {showInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-3/4 max-w-3xl">
            <h3 className="text-lg font-bold mb-2">فاتورة - الطلب #{order.id}</h3>
            <div className="mb-4 overflow-auto max-h-64 p-2 bg-slate-100 dark:bg-slate-700" dangerouslySetInnerHTML={{ __html: invoiceHtml }} />
            <div className="flex gap-2">
              <button onClick={() => { const w = window.open(); if(w){ w.document.write(invoiceHtml); w.document.close(); w.print(); } }} className="px-3 py-2 bg-indigo-600 text-white rounded">طباعة فاتورة</button>
              <button onClick={() => { updateOrder(order.id, { invoice: { html: invoiceHtml, savedAt: Date.now() } }); alert('الفاتورة محفوظة') }} className="px-3 py-2 bg-green-600 text-white rounded">حفظ الفاتورة</button>
              <button onClick={() => setShowInvoice(false)} className="px-3 py-2 bg-slate-400 rounded">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {showRequestMsg && requestDetails && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-3/4 max-w-2xl">
            <div className="mb-4">
              تم طلب طباعة الفاتورة للأوردر رقم {requestDetails.orderId} بتاريخ {requestDetails.date} — قيمته {requestDetails.total} — عدد الأصناف {requestDetails.itemsCount}
            </div>
            <div className="flex gap-2">
              <button onClick={() => {
                try{
                  updateOrder(order.id, { status: 'ready_for_pickup', readyAt: Date.now(), driverNotified: true })
                }catch(e){ console.error(e) }
                // clear local UI state before navigating
                setShowRequestMsg(false)
                setShowProceed(false)
                setShowInvoice(false)
                setShowToast(false)
                setRequestDetails(null)
                // navigate to prepared list
                navigate('/store/prepared')
              }} className="px-3 py-2 bg-amber-500 text-white rounded">جاهز للاستلام</button>
              <button onClick={() => setShowRequestMsg(false)} className="px-3 py-2 bg-slate-400 rounded">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {showProceed && (
        <div className="mt-6 p-4 bg-slate-800 rounded flex justify-center">
          <button onClick={handleProceedToPayment} className="px-4 py-3 bg-amber-500 text-white rounded-lg">الانتقال للدفع</button>
        </div>
      )}

    </Layout>
  )
}
