import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getOrders, getProducts, getUsers } from '../data/mock'

function formatCurrency(n){ return '$' + (Math.round((n||0)*100)/100).toFixed(2) }

export default function AdminStats(){
  const navigate = useNavigate()
  const [modalType, setModalType] = useState(null) // 'total'|'today'|'late'|'outOfStock'|'avg'|'cancelled'|'revenue'
  const orders = React.useMemo(()=> getOrders(), [])
  const products = React.useMemo(()=> getProducts(), [])
  const users = React.useMemo(()=> getUsers(), [])

  const totalOrders = orders.length
  const lateOrders = orders.filter(o=> o.status !== 'delivered' && o.estimatedReadyAt && o.estimatedReadyAt < Date.now()).length
  const lateOrdersList = orders
    .filter(o=> o.status !== 'delivered' && o.estimatedReadyAt && o.estimatedReadyAt < Date.now())
    .map(o=> ({
      id: o.id,
      store: o.store,
      userId: o.userId,
      lateMinutes: Math.ceil((Date.now() - o.estimatedReadyAt) / 60000)
    }))
  const oosOrders = orders.filter(o=> (o.items||[]).some(it => {
    const p = products.find(pp=>pp.id === it.productId)
    return p ? (it.qty || it.quantity || 1) > (p.stock || 0) : false
  })).length

  const avgOrderValue = orders.length ? (orders.reduce((s,o)=> s + (o.total||0),0)/orders.length) : 0
  const avgPrep = orders.length ? (orders.reduce((s,o)=> s + (o.prepMinutes||0),0)/orders.length) : 0

  // today's revenue (orders with date on same local day)
  const startOfToday = new Date(); startOfToday.setHours(0,0,0,0)
  const endOfToday = new Date(); endOfToday.setHours(23,59,59,999)
  const todaysOrders = orders.filter(o => o.date && new Date(o.date) >= startOfToday && new Date(o.date) <= endOfToday)
  const todaysRevenue = todaysOrders.reduce((s,o)=> s + (o.total||0), 0)

  // top customers by total spent
  const custMap = {}
  for(const o of orders){
    if(!o.userId) continue
    custMap[o.userId] = (custMap[o.userId]||0) + (o.total||0)
  }
  const topCustomers = Object.entries(custMap).sort((a,b)=> b[1]-a[1]).slice(0,5).map(([id,total])=> ({ user: users.find(u=>u.id==id) || { name: 'Unknown' }, total }))

  // discounts: look for orders with discountAmount or discountCode
  const discountOrders = orders.filter(o=> o.discountAmount || o.discountValue || o.discount)
  const discountsCount = discountOrders.length
  const discountsSum = discountOrders.reduce((s,o)=> s + (o.discountAmount || o.discountValue || (o.discount && o.discount.amount) || 0), 0)

  const side = [ {label:'Dashboard',to:'/admin'}, {label:'Orders',to:'/admin/orders'}, {label:'Revenue',to:'/admin/revenue'}, {label:'statistics',to:'/admin/stats'}, {label:'Users online',to:'/admin/users'}, {label:'Products',to:'/admin/products'}, {label:'Create',to:'/admin/create-store'} ]

  // build revenue series for last N days (exclude cancelled orders)
  function buildRevenueSeries(days = 14){
    const result = []
    const today = new Date()
    today.setHours(0,0,0,0)
    for(let i = days-1; i >= 0; i--){
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      result.push({ date: new Date(d), label: `${d.getMonth()+1}/${d.getDate()}`, value: 0 })
    }
    const dayIndex = (dt) => {
      const D = new Date(dt); D.setHours(0,0,0,0)
      return Math.floor((D - result[0].date) / (24*60*60*1000))
    }
    for(const o of orders){
      if(!o.date) continue
      if((o.status||'').toLowerCase() === 'cancelled') continue
      const idx = dayIndex(o.date)
      if(idx >=0 && idx < result.length) result[idx].value += (o.total||0)
    }
    return result
  }

  const revenueSeries = React.useMemo(()=> buildRevenueSeries(14), [orders])

  function isSameDay(d1,d2){ return d1.getFullYear()===d2.getFullYear() && d1.getMonth()===d2.getMonth() && d1.getDate()===d2.getDate() }
  const totalOrdersList = orders
  const todaysOrdersList = orders.filter(o => o.date && isSameDay(new Date(o.date), new Date()))
  const cancelledOrdersList = orders.filter(o => (o.status||'').toLowerCase() === 'cancelled')
  const lateOrdersListFull = orders.filter(o=> o.status !== 'delivered' && o.estimatedReadyAt && o.estimatedReadyAt < Date.now())
  const outOfStockOrdersList = orders.filter(o=> (o.items||[]).some(it => {
    const p = getProducts().find(pp=>pp.id === it.productId)
    return p ? (it.qty || it.quantity || 1) > (p.stock || 0) : false
  }))
  const avgOrdersList = orders.filter(o => (o.status||'').toLowerCase() !== 'cancelled')

  function renderModal(){
    if(!modalType) return null
    let list = []
    if(modalType === 'total') list = totalOrdersList
    if(modalType === 'today' || modalType === 'revenue') list = todaysOrdersList
    if(modalType === 'late') list = lateOrdersListFull
    if(modalType === 'outOfStock') list = outOfStockOrdersList
    if(modalType === 'avg') list = avgOrdersList
    if(modalType === 'cancelled') list = cancelledOrdersList

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-11/12 max-w-4xl max-h-[90vh] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{modalType === 'total' ? 'All Orders' : modalType === 'today' ? "Today's Orders" : modalType === 'late' ? 'Late Orders' : modalType === 'outOfStock' ? 'Out-of-Stock Orders' : modalType === 'avg' ? 'Orders (non-cancelled)' : modalType === 'cancelled' ? 'Cancelled Orders' : 'Orders'}</h3>
            <div className="flex items-center gap-2">
              <button onClick={()=> setModalType(null)} className="px-3 py-1 bg-red-600 text-white rounded">Close</button>
              <button onClick={()=> { navigate(`/admin/orders?stat=${modalType}`); setModalType(null) }} className="px-3 py-1 bg-indigo-600 text-white rounded">Open details page</button>
            </div>
          </div>
          {list.length === 0 && <p className="text-slate-400">No orders to display.</p>}
          <div className="space-y-3">
            {list.map(o => (
              <div key={o.id} className="bg-slate-900 p-3 rounded">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold">Order #{o.id} — ${o.total}</p>
                    <p className="text-slate-400 text-sm">Store: {o.store} — User: {(users.find(u=>u.id===o.userId)||{}).name || o.userId}</p>
                    <p className="text-slate-400 text-sm">Status: {o.status}</p>
                  </div>
                  <div className="text-right text-sm text-slate-400">
                    {o.date && <p>Date: {new Date(o.date).toLocaleString()}</p>}
                    {o.estimatedReadyAt && <p>ETA: {new Date(o.estimatedReadyAt).toLocaleString()}</p>}
                    {o.cancelledAt && <p>Cancelled: {new Date(o.cancelledAt).toLocaleString()}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout sideItems={side}>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-6">Statistics</h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div onClick={() => navigate('/admin/orders?stat=total')} className="p-4 bg-slate-800 rounded cursor-pointer">
          <p className="text-slate-400">Total Orders</p>
          <p className="text-3xl font-bold text-white">{totalOrders}</p>
        </div>
        <div onClick={() => navigate('/admin/orders?stat=revenue')} className="p-4 bg-slate-800 rounded cursor-pointer">
          <p className="text-slate-400">Today's Revenue</p>
          <p className="text-3xl font-bold text-green-400">{formatCurrency(todaysRevenue)}</p>
          <p className="text-slate-400 text-sm mt-1">Orders today: {todaysOrders.length}</p>
        </div>
        <div onClick={() => navigate('/admin/orders?stat=today')} className="p-4 bg-slate-800 rounded cursor-pointer">
          <p className="text-slate-400">Orders Today</p>
          <p className="text-3xl font-bold text-white">{todaysOrders.length}</p>
        </div>
        <div onClick={() => navigate('/admin/orders?stat=late')} className="p-4 bg-slate-800 rounded cursor-pointer">
          <p className="text-slate-400">Late Orders</p>
          <p className="text-3xl font-bold text-red-400">{lateOrders}</p>
        </div>
        <div onClick={() => navigate('/admin/orders?stat=outOfStock')} className="p-4 bg-slate-800 rounded cursor-pointer">
          <p className="text-slate-400">Out-of-Stock Orders</p>
          <p className="text-3xl font-bold text-orange-400">{oosOrders}</p>
        </div>
        <div onClick={() => navigate('/admin/orders?stat=avg')} className="p-4 bg-slate-800 rounded cursor-pointer">
          <p className="text-slate-400">Average Order Value</p>
          <p className="text-3xl font-bold text-green-400">{formatCurrency(avgOrderValue)}</p>
        </div>
        <div onClick={() => navigate('/admin/orders?stat=cancelled')} className="p-4 bg-slate-800 rounded cursor-pointer">
          <p className="text-slate-400">Canceled orders</p>
          <p className="text-3xl font-bold text-red-400">{orders.filter(o=> (o.status||'').toLowerCase() === 'cancelled').length}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-800 rounded">
          <p className="text-slate-400">Average Prep Time (min)</p>
          <p className="text-3xl font-bold text-yellow-400">{Math.round(avgPrep)}</p>
        </div>
        <div className="p-4 bg-slate-800 rounded">
          <p className="text-slate-400">Discounts Used</p>
          <p className="text-3xl font-bold text-blue-400">{discountsCount} ({formatCurrency(discountsSum)})</p>
        </div>
      </div>

      <div className="mt-6 bg-slate-800 p-4 rounded">
        <h3 className="text-white font-semibold mb-3">Top Customers</h3>
        <ol className="list-decimal pl-6 text-slate-200">
          {topCustomers.map((c,idx)=> (
            <li key={idx}>{c.user.name} — {formatCurrency(c.total)}</li>
          ))}
        </ol>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-800 rounded">
          <p className="text-slate-400">Late Orders</p>
          <p className="text-3xl font-bold text-red-400">{lateOrders}</p>
          <div className="mt-3 text-slate-200 text-sm max-h-40 overflow-auto">
            {lateOrdersList.length === 0 ? <div>No late orders</div> : (
              <ul>
                {lateOrdersList.map(l => (
                  <li key={l.id}>#{l.id} — {l.lateMinutes} د — {l.store}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="p-4 bg-slate-800 rounded">
          <p className="text-slate-400">Today's Revenue (quick)</p>
          <p className="text-3xl font-bold text-green-400">{formatCurrency(todaysRevenue)}</p>
          <p className="text-slate-400 text-sm mt-1">Orders today: {todaysOrders.length}</p>
        </div>
      </div>

      <div className="mt-6 bg-slate-800 p-4 rounded">
        <h3 className="text-white font-semibold mb-3">Statistics Table</h3>
        <div className="mt-4">
          <p className="text-slate-400 mb-2">Revenue Trend (last 14 days)</p>
          <div className="bg-slate-900 p-3 rounded">
            <RevenueChart series={revenueSeries} />
          </div>
        </div>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b"><td className="py-2 text-slate-300">Total Orders</td><td className="py-2 text-white">{totalOrders}</td></tr>
            <tr className="border-b"><td className="py-2 text-slate-300">Late Orders</td><td className="py-2 text-white">{lateOrders}</td></tr>
            <tr className="border-b"><td className="py-2 text-slate-300">Out-of-Stock Orders</td><td className="py-2 text-white">{oosOrders}</td></tr>
            <tr className="border-b"><td className="py-2 text-slate-300">Average Order Value</td><td className="py-2 text-white">{formatCurrency(avgOrderValue)}</td></tr>
            <tr className="border-b"><td className="py-2 text-slate-300">Average Prep (min)</td><td className="py-2 text-white">{Math.round(avgPrep)}</td></tr>
            <tr className="border-b"><td className="py-2 text-slate-300">Discounts (count / sum)</td><td className="py-2 text-white">{discountsCount} / {formatCurrency(discountsSum)}</td></tr>
            <tr className="border-b"><td className="py-2 text-slate-300">Today's Revenue</td><td className="py-2 text-white">{formatCurrency(todaysRevenue)}</td></tr>
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

function RevenueChart({series, width=640, height=140, padding=24}){
  if(!series || series.length === 0) return <div className="text-slate-400">No data</div>
  const values = series.map(s => s.value)
  const max = Math.max(...values, 1)
  const w = width - padding*2
  const h = height - padding*2
  const stepX = w / Math.max(1, series.length-1)
  const points = series.map((s,i) => {
    const x = padding + (i * stepX)
    const y = padding + (h - ( (s.value / max) * h ))
    return `${x},${y}`
  }).join(' ')
  const areaPath = (() => {
    const first = `M ${padding},${padding+h}`
    const poly = series.map((s,i) => {
      const x = padding + (i * stepX)
      const y = padding + (h - ( (s.value / max) * h ))
      return `${x} ${y}`
    }).join(' L ')
    return `${first} L ${poly} L ${padding + w},${padding+h} Z`
  })()

  return (
    <div className="w-full overflow-auto">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="120" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="transparent" />
        <path d={areaPath} fill="url(#revGrad)" stroke="none" />
        <polyline fill="none" stroke="#10b981" strokeWidth="2" points={points} />
        {series.map((s,i) => {
          const x = padding + (i * stepX)
          const y = padding + (h - ( (s.value / max) * h ))
          return <circle key={i} cx={x} cy={y} r={3} fill="#10b981" />
        })}
        {/* x labels */}
        {series.map((s,i) => {
          const x = padding + (i * stepX)
          return <text key={'l'+i} x={x} y={height - 6} fontSize="10" fill="#94a3b8" textAnchor="middle">{s.label}</text>
        })}
      </svg>
      <div className="text-slate-400 text-sm mt-2">Total (last 14 days): {formatCurrency(series.reduce((a,b)=>a+b.value,0))}</div>
    </div>
  )
}
