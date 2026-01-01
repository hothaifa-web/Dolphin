import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { getOrders, getUsers, getProducts, subscribe, REGIONS, updateOrder, deleteOrder } from '../data/mock'

export default function AdminOrders() {
  const navigate = useNavigate()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderList, setOrderList] = useState(() => getOrders())
  const [newOrderIds, setNewOrderIds] = React.useState(() => new Set())
  const [users] = React.useState(() => getUsers())
  const [products] = React.useState(() => getProducts())

  React.useEffect(()=>{
    const unsub = subscribe(ev => {
      if(ev.type === 'tick' || ev.type === 'order' || ev.type === 'app:newOrder'){
        const all = getOrders()
        setOrderList([...all])
      }
      // if new order arrived, mark it
      if(ev.type === 'order' || ev.type === 'app:newOrder'){
        try{
          const id = (ev.order && ev.order.id) ? ev.order.id : null
          if(id){
            setNewOrderIds(prev => {
              const next = new Set(prev)
              next.add(id)
              return next
            })
            // play short beep via WebAudio
            try{
              const ctx = new (window.AudioContext || window.webkitAudioContext)()
              const o = ctx.createOscillator()
              const g = ctx.createGain()
              o.type = 'sine'
              o.frequency.value = 880
              g.gain.value = 0.02
              o.connect(g)
              g.connect(ctx.destination)
              o.start()
              setTimeout(()=>{ o.stop(); ctx.close().catch(()=>{}) }, 120)
            }catch(e){}
            // clear marker after 12s
            setTimeout(() => {
              setNewOrderIds(prev => {
                const next = new Set(prev)
                next.delete(id)
                return next
              })
            }, 12000)
          }
        }catch(e){}
      }
    })
    return () => unsub()
  }, [])

  const [query, setQuery] = React.useState('')
  const [region, setRegion] = React.useState('')
  const [searchParams] = useSearchParams()
  const stat = searchParams.get('stat')

  // compute available regions from stores (if stores have `region` field)
  const storeRegions = REGIONS

  // attach remaining minutes to each order (computed from estimatedReadyAt)
  const withRemaining = orderList.map(o => {
    // allow negative remaining (late) so we can count minutes overdue
    const remaining = o.estimatedReadyAt ? Math.ceil((o.estimatedReadyAt - Date.now()) / 60000) : (o.prepMinutes || 0)
    return { ...o, remaining }
  })
  // By default show pending statuses in the orders table, but if `stat` query is provided
  // show the appropriate subset (e.g. cancelled, today, late, outOfStock, etc.)
  const pendingStatuses = new Set(['pending','accepted','processing'])

  const filterByQuery = (list) => list.filter(o => {
    if(!query) return true
    const q = query.toString().toLowerCase()
    const cust = (users.find(u=>u.id===o.userId)||{}).name || ''
    const storeName = o.store || ( (o.items||[])[0] && products.find(p=>p.id === (o.items[0].productId))?.store ) || ''
    return (''+o.id).includes(q) || cust.toLowerCase().includes(q) || (''+((o.items||[]).length)).includes(q) || (''+o.total).includes(q) || storeName.toLowerCase().includes(q)
  }).filter(o => {
    if(!region) return true
    const storeName = o.store || ( (o.items||[])[0] && products.find(p=>p.id === (o.items[0].productId))?.store ) || ''
    const storeUser = users.find(u => u.role === 'store' && (u.name === storeName || u.username === storeName))
    return storeUser ? (storeUser.region === region) : false
  })

  const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()

  let displayOrders = []
  if(stat){
    const s = stat.toLowerCase()
    if(s === 'total') displayOrders = withRemaining
    else if(s === 'today') displayOrders = withRemaining.filter(o => o.date && isSameDay(new Date(o.date), new Date()))
    else if(s === 'revenue') displayOrders = withRemaining.filter(o => o.date && isSameDay(new Date(o.date), new Date()) && (o.status !== 'cancelled'))
    else if(s === 'late') displayOrders = withRemaining.filter(o => (o.status !== 'delivered' && o.status !== 'cancelled') && o.estimatedReadyAt && Date.now() > o.estimatedReadyAt)
    else if(s === 'outofstock') displayOrders = withRemaining.filter(o => (o.items||[]).some(it => {
      const p = products.find(p => p.id === it.productId)
      return !p || (p.stock ?? 0) <= 0
    }))
    else if(s === 'avg') displayOrders = withRemaining.filter(o => o.status !== 'cancelled')
    else if(s === 'cancelled') displayOrders = withRemaining.filter(o => (o.status||'').toLowerCase() === 'cancelled')
    else displayOrders = withRemaining.filter(o => pendingStatuses.has((o.status||'').toLowerCase()))
    // apply query/region filters too
    displayOrders = filterByQuery(displayOrders)
  } else {
    displayOrders = filterByQuery(withRemaining.filter(o => pendingStatuses.has((o.status||'').toLowerCase())))
  }

  const filteredOrders = displayOrders.sort((a,b) => (a.remaining||0) - (b.remaining||0))

  const side = [
    {label:'Dashboard',to:'/admin'},
    {label:'Orders',to:'/admin/orders'},
    {label:'Revenue',to:'/admin/revenue'},
    {label:'statistics',to:'/admin/stats'},
    {label:'Users online',to:'/admin/users'},
    {label:'Products',to:'/admin/products'},
    {label:'Create',to:'/admin/create-store'}
  ]

  // (ship action removed from admin UI; keep helper if needed elsewhere)

  const handleCancel = (id) => {
    // mark as cancelled (keep record)
    updateOrder(id, { status: 'cancelled' })
    setOrderList([...getOrders()])
  }

  const handleDelete = (id) => {
    // mark as cancelled by default; hard delete reserved for maintenance
    updateOrder(id, { status: 'cancelled' })
    setOrderList([...getOrders()])
  }

  

  return (
    <Layout sideItems={side}>
      <div className="mb-6">
        <button 
          onClick={() => navigate('/admin')}
          className="mb-4 px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
        >
          ← Back to Dashboard
        </button>
        
        <h2 className="text-3xl font-bold text-white mb-6">All Orders ({orderList.length})</h2>
      </div>

      {selectedOrder ? (
        <div className="p-6 bg-slate-800 rounded mb-6">
          <button 
            onClick={() => setSelectedOrder(null)}
            className="mb-4 px-4 py-2 bg-slate-700 rounded text-white hover:bg-slate-600"
          >
            ← Back to Orders
          </button>
          
          <h3 className="text-2xl font-bold text-white mb-4">Order #{selectedOrder.id}</h3>
          <p className="text-slate-400">Date: {selectedOrder.date ? new Date(selectedOrder.date).toLocaleString() : '—'}</p>
          <div className="bg-slate-900 p-4 rounded">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-slate-400">Customer:</p>
                <p className="text-white font-semibold">{(users.find(u=>u.id===selectedOrder.userId)||{}).name}</p>
              </div>
              <div>
                <p className="text-slate-400">Status:</p>
                {(() => {
                  const st = (selectedOrder.status || '').toLowerCase()
                  if(st === 'cancelled') return <p className="font-bold text-red-400">Order cancelled</p>
                  if(st === 'delivered') return <p className="font-bold text-green-400">Delivered</p>
                  const remaining = selectedOrder.estimatedReadyAt ? Math.max(0, Math.ceil((selectedOrder.estimatedReadyAt - Date.now())/60000)) : (selectedOrder.prepMinutes||0)
                  if(remaining <= 0) return <p className="font-bold text-yellow-300">Ready</p>
                  return <p className="font-bold text-yellow-400">Processing</p>
                })()}
                {selectedOrder.cancelledAt && (
                  <p className="text-slate-400 text-sm mt-2">Cancelled at: {new Date(selectedOrder.cancelledAt).toLocaleString()}</p>
                )}
                {selectedOrder.cancelReason && (
                  <p className="text-slate-400 text-sm mt-1">Cancel reason: {selectedOrder.cancelReason}</p>
                )}
              </div>
            </div>
            <div className="mb-4">
              <p className="text-slate-400">Store:</p>
                <p className="text-white">{selectedOrder.store || (selectedOrder.items && selectedOrder.items[0] && products.find(p=>p.id===selectedOrder.items[0].productId)?.store) || ''} {selectedOrder.region ? `- ${selectedOrder.region}` : ''}</p>
                <p className="text-slate-400">Preparation time:</p>
                <div className="mt-2"><PrepBadge minutes={ selectedOrder.estimatedReadyAt ? Math.max(0, Math.ceil((selectedOrder.estimatedReadyAt - Date.now())/60000)) : (selectedOrder.prepMinutes||0) } /></div>
            </div>
            
            <div>
              <p className="text-slate-400 mb-2">Items ({(selectedOrder.items||[]).length}):</p>
              <ul className="list-disc ml-6">
                {selectedOrder.items.map((it, idx) => {
                  const prod = products.find(p => p.id === it.productId) || {name:{en:'Unknown',ar:'غير معروف'}, image: ''}
                  const qty = it.qty || it.quantity || 1
                  return (
                    <li key={idx} className="text-white flex items-center gap-3">
                      {prod.image ? <img src={prod.image} alt={prod.name?.en || prod.name} className="w-12 h-8 object-cover rounded" /> : null}
                      <span>{prod.name?.en || prod.name} × {qty}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
            
            <div className="mt-4 text-right">
              <p className="text-slate-400">Total:</p>
              <p className="text-3xl font-bold text-green-400">${selectedOrder.total}</p>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button onClick={() => navigate(`/admin/invoice/${selectedOrder.id}`)} className="px-4 py-2 bg-indigo-600 rounded text-white">Invoice</button>
                {/* show actions only when preparing: admin should only be able to view or cancel */}
                { (selectedOrder.status || '').toLowerCase() !== 'cancelled' && (selectedOrder.status || '').toLowerCase() !== 'delivered' && (() => {
                  const remaining = selectedOrder.estimatedReadyAt ? Math.max(0, Math.ceil((selectedOrder.estimatedReadyAt - Date.now())/60000)) : (selectedOrder.prepMinutes||0)
                  // whether ready or preparing, admin sees "View" and "Cancel Order" only
                  return (
                    <>
                      <button onClick={() => handleCancel(selectedOrder.id)} className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700">✕ Cancel</button>
                    </>
                  )
                })() }
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 p-4 rounded mb-4">
          <div className="flex gap-3 items-center mb-3">
            <input
              type="text"
              placeholder="Search by order ID, customer name, item count, total, or store name"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 px-3 py-2 rounded bg-slate-700 text-white"
            />
            <div className="flex items-center gap-2">
              <label className="text-slate-300">Region</label>
              <select value={region} onChange={e=>setRegion(e.target.value)} className="px-2 py-2 rounded bg-slate-700 text-white">
                <option value=''>All</option>
                {storeRegions.map(r=> <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <OrdersTable
            orders={filteredOrders}
            users={users}
            products={products}
            onSelect={setSelectedOrder}
            onDelete={handleDelete}
            stat={stat}
            newOrderIds={newOrderIds}
          />

          {region && (
            <RegionStoresList region={region} users={users} orderList={orderList} products={products} />
          )}

          
        </div>
      )}
    </Layout>
  )
}

function OrdersTable({orders, users, products, onSelect, onDelete, stat, newOrderIds}){
  const hideActions = ['avg','today','revenue'].includes((stat||'').toLowerCase())
  const isAvg = (stat||'').toLowerCase() === 'avg'
  const isToday = (stat||'').toLowerCase() === 'today'
  const isLate = (stat||'').toLowerCase() === 'late'

  function arabicStatus(o){
    const st = (o.status||'').toLowerCase()
    if(st === 'cancelled') return 'Cancelled'
    if(st === 'delivered') return 'Delivered'
    if(st === 'processing' || st === 'accepted') return 'Processing'
    if(st === 'pending') return 'Pending'
    if(st === 'delivering' || st === 'out_for_delivery' || st === 'on_delivery') return 'Out for delivery'
    return o.status || '—'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs table-auto min-w-[1000px]">
        <thead>
          <tr className="bg-white text-black text-[11px] uppercase">
            <th className="px-3 py-2 text-left">Order</th>
            <th className="px-3 py-2 text-left">Code</th>
            <th className="px-3 py-2 text-left">Store</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Placed At</th>
            <th className="px-3 py-2 text-left">Time Left</th>
            <th className="px-3 py-2 text-left">Customer</th>
            <th className="px-3 py-2 text-left">Phone</th>
            <th className="px-3 py-2 text-left">Payment</th>
            <th className="px-3 py-2 text-right">Amount</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => {
            const customer = users.find(u=>u.id===o.userId) || {}
            const storeName = o.store || (o.items && o.items[0] && products.find(p=>p.id===o.items[0].productId)?.store) || ''
            const storeUser = users.find(u => u.role === 'store' && (u.name === storeName || u.username === storeName))
            const itemCount = new Set((o.items||[]).map(it => it.productId)).size
            // ensure region value is only from allowed REGIONS list
            let regionVal = (storeUser && storeUser.region) || o.region || ''
            const allowedRegions = new Set(REGIONS || [])
            if(!regionVal || !allowedRegions.has(regionVal)) regionVal = ''

            const placedAt = o.date ? new Date(o.date).toLocaleString() : '—'
            const timeLeft = o.estimatedReadyAt ? Math.max(0, Math.ceil((o.estimatedReadyAt - Date.now())/60000)) + ' m' : (o.prepMinutes ? o.prepMinutes + ' m' : '—')
            const phone = customer.phone || ''
            const payment = o.paymentMethod || (o.paid ? 'Paid' : '—')

            return (
              <tr key={o.id} className="border-b border-slate-200/10 hover:bg-slate-900 transition text-slate-300">
                <td className="px-3 py-2">{o.id}</td>
                <td className="px-3 py-2">{o.id}</td>
                <td className="px-3 py-2">{storeName}</td>
                <td className="px-3 py-2">{arabicStatus(o)}</td>
                <td className="px-3 py-2">{placedAt}</td>
                <td className="px-3 py-2">{timeLeft}</td>
                <td className="px-3 py-2">{customer.name || o.userId}</td>
                <td className="px-3 py-2">{phone}</td>
                <td className="px-3 py-2">{payment}</td>
                <td className="px-3 py-2 text-right font-semibold text-green-400">${o.total}</td>
                <td className="px-3 py-2 text-right">
                  {!hideActions && (
                    <>
                      <button onClick={()=>onSelect(o)} className="text-blue-400 hover:underline ml-2">View</button>
                      {stat !== 'cancelled' && (
                        <button onClick={()=>onDelete(o.id)} className="text-red-400 hover:underline ml-2">Cancel</button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

  function PrepBadge({minutes}){
    const m = Number(minutes || 0)
      let color = 'bg-red-600'
      const isLate = m < 0
      const abs = Math.abs(m)
      if(!isLate){
        if(abs >= 30) color = 'bg-green-600/60'
        else if(abs >= 10) color = 'bg-orange-500'
      } else {
        // late -> use strong red
        color = 'bg-red-700'
      }
      const text = isLate ? (`Late ${abs} m`) : (abs ? (abs + ' m') : '—')
    return (
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color} text-white font-semibold`}>{text}</div>
      </div>
    )
  }

function RegionStoresList({region, users, orderList, products}){
  const pendingStatuses = new Set(['pending','accepted','processing'])
  const stores = users.filter(u=> u.role === 'store' && u.region === region)
    .filter(s => orderList.some(o => pendingStatuses.has((o.status||'').toLowerCase()) && (o.store === s.name || (o.items||[]).some(it => products.find(p=>p.id===it.productId && p.store === s.name)))))

  if(stores.length === 0) return <div className="mt-3 text-slate-400">No stores in this region with pending orders.</div>

  return (
    <div className="mt-3">
      <h4 className="text-white font-semibold">Stores in {region} with pending orders</h4>
      <ul className="list-disc pl-6 mt-2 text-slate-300">
        {stores.map(s => <li key={s.id}>{s.name}</li>)}
      </ul>
    </div>
  )
}
