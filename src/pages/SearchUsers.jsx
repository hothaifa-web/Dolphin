import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { getUsers, getOrders, getProducts, subscribe, getActiveStores, USERS, saveUsers } from '../data/mock'
import { useAuth } from '../components/AuthProvider'

export default function SearchUsers(){
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth() || {}
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '')
    const [users, setUsers] = useState(() => getUsers())
    const [orders, setOrders] = useState(() => getOrders())
    const [products, setProducts] = useState(() => getProducts())
  const [selectedResult, setSelectedResult] = useState(null)
  const [historyUser, setHistoryUser] = useState(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [showInvoice, setShowInvoice] = useState(false)
  const [showCancelledModal, setShowCancelledModal] = useState(false)
  const [statsModalType, setStatsModalType] = useState(null) // 'total' | 'today' | 'late' | 'outOfStock' | 'revenue'

  useEffect(()=>{
    const q = searchParams.get('q')
    if(q) setSearchQuery(q)
  },[searchParams])

  React.useEffect(()=>{
    const unsub = subscribe(ev => {
      if(ev.type === 'tick' || ev.type === 'order'){
        setUsers(getUsers())
        setOrders(getOrders())
        setProducts(getProducts())
      }
    })
    return () => unsub()
  }, [])

  const side = [
    {label:'Dashboard',to:'/admin'},
    {label:'Orders',to:'/admin/orders'},
    {label:'Revenue',to:'/admin/revenue'},
    {label:'Users online',to:'/admin/users'},
    {label:'Products',to:'/admin/products'},
    {label:'Create',to:'/admin/create-store'}
  ]

  const [userFilter, setUserFilter] = useState('online') // 'online' | 'all'

  const searchResults = useMemo(()=>{
    const q = (searchQuery||'').toLowerCase().trim()
    if(!q) return { users:[], products:[], orders:[], stores:[] }

    const usersFiltered = users.filter(u => (u.name||'').toLowerCase().includes(q) || (u.username||'').toLowerCase().includes(q) || (u.email||'').toLowerCase().includes(q))
    const productsAll = products.filter(p => (p.name?.en || p.name || '').toString().toLowerCase().includes(q) || (p.sku||'').toLowerCase().includes(q))
    const ordersAll = orders.filter(o => (''+o.id).includes(q) || (o.total && (''+o.total).includes(q)))
    const stores = users.filter(u => u.role === 'store' && ((u.name||'').toLowerCase().includes(q) || (u.email||'').toLowerCase().includes(q)))

    if(user?.role === 'store'){
      const storeName = user.name
      const productsOfStore = productsAll.filter(p => p.store === storeName || p.storeName === storeName)
      const ordersOfStore = ordersAll.filter(o => (o.items||[]).some(it => products.find(p=>p.id===it.productId && (p.store===storeName || p.storeName===storeName))))
      return { users: [], products: productsOfStore, orders: ordersOfStore, stores: [] }
    }

    return { users: usersFiltered, products: productsAll, orders: ordersAll, stores }
  },[searchQuery, user, users, products, orders])

  const displayedUsers = useMemo(()=>{
    if(userFilter === 'all') return users
    // 'online' => consider users with status 'active' or an `online` flag
    return users.filter(u => u.status === 'active' || u.online)
  },[users, userFilter])

  const totalResults = searchResults.orders.length + searchResults.users.length + searchResults.products.length + searchResults.stores.length

  const cancelledOrders = orders.filter(o => o.status === 'cancelled')
  const avgOrderValue = useMemo(() => {
    const paid = orders.filter(o => o.status !== 'cancelled')
    if (!paid || paid.length === 0) return 0
    const sum = paid.reduce((s, o) => s + (Number(o.total) || 0), 0)
    return sum / paid.length
  }, [orders])
  const totalOrders = orders.length
  const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
  const todayOrdersList = orders.filter(o => o.date && isSameDay(new Date(o.date), new Date()))
  const todaysRevenue = todayOrdersList.reduce((s,o) => s + ((o.status === 'cancelled') ? 0 : (Number(o.total)||0)), 0)
  const lateOrdersList = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled' && o.estimatedReadyAt && Date.now() > o.estimatedReadyAt)
  const outOfStockOrdersList = orders.filter(o => (o.items||[]).some(it => {
    const p = products.find(p => p.id === it.productId)
    return !p || (p.stock ?? 0) <= 0
  }))

  function closeModal(){ setSelectedResult(null); setShowInvoice(false) }
  function closeInvoice(){ setShowInvoice(false) }

  function banUser(userId){
    const idx = USERS.findIndex(u=>u.id === userId)
    if(idx === -1) return alert('User not found')
    USERS[idx].status = 'banned'
    try{ saveUsers() }catch(e){}
    setUsers(getUsers())
    alert('تم حظر المستخدم')
  }

  function viewHistoryFor(user){
    setHistoryUser(user)
    setHistoryOpen(true)
  }

  function renderDetail(){
    if(!selectedResult) return null
    const { type, item } = selectedResult
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-11/12 max-w-3xl max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">{type === 'order' ? `Order #${item.id}` : type === 'product' ? item.name?.en || item.name : item.name}</h3>
            <button onClick={closeModal} className="px-3 py-1 bg-red-600 text-white rounded">Close</button>
          </div>

          <div className="prose prose-invert text-sm">
            {type === 'order' && (
              <div>
                <p><strong>ID:</strong> {item.id}</p>
                <p><strong>User:</strong> {(users.find(u=>u.id===item.userId)||{}).name || item.userId}</p>
                <p><strong>Store:</strong> {(users.find(u=>u.id===item.storeId)||{}).name || item.storeName || 'N/A'}</p>
                <p><strong>Status:</strong> {item.status}</p>
                <p><strong>Total:</strong> ${item.total}</p>
                <div className="mt-3">
                  <button onClick={()=>navigate(`/admin/invoice/${item.id}`)} className="px-3 py-1 bg-yellow-500 text-black rounded">فاتورة</button>
                </div>
                <h4 className="mt-3">Items</h4>
                <ul className="list-disc pl-6">
                  {(item.items||[]).map((it,idx)=> {
                    const prod = products.find(p=>p.id === it.productId) || {}
                    const name = prod.name?.en || prod.name || it.name || it.title || `#${it.productId}`
                    const qty = it.quantity || it.qty || 0
                    const price = prod.price ?? it.price ?? 0
                    return (
                      <li key={idx}>{name} — {qty} x ${price} = ${(price * qty).toFixed(2)}</li>
                    )
                  })}
                </ul>
              </div>
            )}

            {type === 'user' && (
              <div>
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Username:</strong> @{item.username}</p>
                {item.email && <p><strong>Email:</strong> {item.email}</p>}
                {item.phone && <p><strong>Phone:</strong> {item.phone}</p>}
                <p><strong>Role:</strong> {item.role}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => banUser(item.id)} className="px-3 py-1 bg-red-600 text-white rounded">حظر</button>
                  <button onClick={() => viewHistoryFor(item)} className="px-3 py-1 bg-indigo-600 text-white rounded">كشف سجل العميل</button>
                </div>
              </div>
            )}

            {type === 'store' && (
              <div>
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Category:</strong> {item.category}</p>
                {item.image && <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded my-3" />}
                <p><strong>Contact:</strong> {item.email || item.phone || 'N/A'}</p>
              </div>
            )}

            {type === 'product' && (
              <div>
                <p><strong>Name (EN):</strong> {item.name?.en || item.name}</p>
                <p><strong>SKU:</strong> {item.sku}</p>
                <p><strong>Price:</strong> ${item.price}</p>
                <p><strong>Stock:</strong> {item.stock ?? 'N/A'}</p>
                {item.image && <img src={item.image} alt={item.name?.en} className="w-full h-48 object-cover rounded my-3" />}
                <p><strong>Description:</strong> {item.description || '—'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  function renderCancelledModal(){
    const cancelled = orders.filter(o => o.status === 'cancelled')
    if(!showCancelledModal) return null
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-11/12 max-w-4xl max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Cancelled Orders ({cancelled.length})</h3>
            <div className="flex items-center gap-2">
              <button onClick={()=>setShowCancelledModal(false)} className="px-3 py-1 bg-red-600 text-white rounded">Close</button>
            </div>
          </div>
          {cancelled.length === 0 && (
            <p className="text-slate-400">لا توجد طلبات ملغاة في الوقت الحالي.</p>
          )}
          <div className="space-y-4">
            {cancelled.map(o => {
              const userObj = users.find(u => u.id === o.userId) || {}
              const storeObj = users.find(u => u.name === o.store || u.username === o.store) || {}
              const cancelledByUser = users.find(u => u.id === o.cancelledBy) || null
              return (
                <div key={o.id} className="bg-slate-900 p-3 rounded">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-semibold">Order #{o.id} — ${o.total}</p>
                      <p className="text-slate-400 text-sm">User: {userObj.name || o.userId} — Store: {storeObj.name || o.store}</p>
                      <p className="text-slate-400 text-sm">Status: {o.status}</p>
                    </div>
                    <div className="text-right text-sm text-slate-400">
                      {o.cancelledAt && <p>Cancelled: {new Date(o.cancelledAt).toLocaleString()}</p>}
                      <p>Prep time (min): {o.timeToPrepareMinutes ?? o.prepMinutes}</p>
                      {o.cancelReason && <p>Reason: {o.cancelReason}</p>}
                      {o.cancelledBy && <p>Cancelled by: {cancelledByUser ? cancelledByUser.name : o.cancelledBy}</p>}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-slate-300">
                    <button onClick={() => { setSelectedResult({type:'order', item:o}); setShowCancelledModal(false) }} className="px-3 py-1 bg-indigo-600 rounded text-white">عرض التفاصيل</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  function renderStatsModal(){
    if(!statsModalType) return null
    let list = []
    if(statsModalType === 'total') list = orders
    if(statsModalType === 'today') list = todayOrdersList
    if(statsModalType === 'revenue') list = todayOrdersList
    if(statsModalType === 'late') list = lateOrdersList
    if(statsModalType === 'outOfStock') list = outOfStockOrdersList
    if(statsModalType === 'avg') list = orders.filter(o => o.status !== 'cancelled')

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-11/12 max-w-4xl max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{statsModalType === 'total' ? 'All Orders' : statsModalType === 'today' ? "Today's Orders" : statsModalType === 'late' ? 'Late Orders' : statsModalType === 'outOfStock' ? 'Out-of-Stock Orders' : statsModalType === 'revenue' ? "Today's Revenue" : 'Orders'}</h3>
            <div className="flex items-center gap-2">
              <button onClick={()=>setStatsModalType(null)} className="px-3 py-1 bg-red-600 text-white rounded">Close</button>
            </div>
          </div>
          {list.length === 0 && (
            <p className="text-slate-400">لا توجد طلبات لعرضها.</p>
          )}
          <div className="space-y-3">
            {list.map(o => (
              <div key={o.id} className="bg-slate-900 p-3 rounded">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold">Order #{o.id} — ${o.total}</p>
                    <p className="text-slate-400 text-sm">User: {(users.find(u=>u.id===o.userId)||{}).name || o.userId} — Store: {o.store}</p>
                    <p className="text-slate-400 text-sm">Status: {o.status}</p>
                  </div>
                  <div className="text-right text-sm text-slate-400">
                    {o.date && <p>Date: {new Date(o.date).toLocaleString()}</p>}
                    {o.estimatedReadyAt && <p>ETA: {new Date(o.estimatedReadyAt).toLocaleString()}</p>}
                    {o.cancelledAt && <p>Cancelled: {new Date(o.cancelledAt).toLocaleString()}</p>}
                  </div>
                </div>
                <div className="mt-2 text-sm text-slate-300">
                  <button onClick={() => { setSelectedResult({type:'order', item:o}); setStatsModalType(null); setShowCancelledModal(false) }} className="px-3 py-1 bg-indigo-600 rounded text-white">عرض التفاصيل</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function renderHistoryModal(){
    if(!historyOpen || !historyUser) return null
    const userOrders = orders.filter(o => o.userId === historyUser.id)
    const cancelled = userOrders.filter(o => o.status === 'cancelled')
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-11/12 max-w-4xl max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">سجل العميل — {historyUser.name}</h3>
            <div className="flex items-center gap-2">
              <button onClick={()=>{ setHistoryOpen(false); setHistoryUser(null) }} className="px-3 py-1 bg-red-600 text-white rounded">Close</button>
            </div>
          </div>
          <div>
            <p className="mb-3">Total orders: {userOrders.length} — Cancelled: {cancelled.length}</p>
            <div className="space-y-3">
              {userOrders.map(o => (
                <div key={o.id} className="p-3 bg-slate-100 rounded">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">Order #{o.id} — ${o.total}</p>
                      <p className="text-sm">Status: {o.status}</p>
                      {o.cancelReason && <p className="text-sm text-red-600">Cancelled reason: {o.cancelReason}</p>}
                    </div>
                    <div className="text-right text-sm">
                      <p>Payment: {o.payment?.method || 'N/A'}</p>
                      <p>Paid: {(o.payment && o.payment.method) || o.status === 'delivered' ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
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
        <h2 className="text-3xl font-bold text-white mb-6">🔍 Search System</h2>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="ابحث عن طلب، مستخدم، متجر، أو منتج..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 text-white border border-indigo-600 rounded text-lg focus:outline-none focus:border-indigo-500"
        />
      </div>

      {searchQuery.trim() && (
        <div>
          <p className="text-slate-400 mb-6">
            {totalResults > 0 ? `Found ${totalResults} result(s)` : '❌ No results found'}
          </p>

          {searchResults.orders.length > 0 && (
            <div className="bg-slate-800 p-6 rounded mb-6">
              <h3 className="text-xl font-bold text-white mb-4">📦 Orders ({searchResults.orders.length})</h3>
              <div className="space-y-2">
                {searchResults.orders.map(order => (
                  <div key={order.id} onClick={()=>setSelectedResult({type:'order', item:order})} className="bg-slate-900 p-3 rounded hover:bg-slate-850 cursor-pointer transition">
                    <p className="text-white font-semibold">Order #{order.id}</p>
                    <p className="text-slate-400 text-sm">${order.total} - Status: {order.status}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.users.length > 0 && (
            <div className="bg-slate-800 p-6 rounded mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">👤 Users ({searchResults.users.length})</h3>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-400">عرض:</label>
                  <select value={userFilter} onChange={(e)=>setUserFilter(e.target.value)} className="bg-slate-900 text-white px-2 py-1 rounded">
                    <option value="online">Users online</option>
                    <option value="all">All Users</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {displayedUsers.filter(u => searchResults.users.find(su => su.id === u.id)).map(u => (
                  <div key={u.id} onClick={()=>setSelectedResult({type:'user', item:u})} className="bg-slate-900 p-3 rounded hover:bg-slate-850 transition cursor-pointer">
                    <p className="text-white font-semibold">{u.name}</p>
                    <p className="text-slate-400 text-sm">@{u.username}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.stores.length > 0 && (
            <div className="bg-slate-800 p-6 rounded mb-6">
              <h3 className="text-xl font-bold text-white mb-4">🏪 Stores ({searchResults.stores.length})</h3>
              <div className="grid grid-cols-2 gap-3">
                {searchResults.stores.map(store => (
                  <div key={store.id} onClick={()=>setSelectedResult({type:'store', item:store})} className="bg-slate-900 p-3 rounded hover:bg-slate-850 transition cursor-pointer">
                    {store.image && <img src={store.image} alt={store.name} className="w-full h-24 object-cover rounded mb-2" />}
                    <p className="text-white font-semibold text-sm">{store.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.products.length > 0 && (
            <div className="bg-slate-800 p-6 rounded mb-6">
              <h3 className="text-xl font-bold text-white mb-4">🛍️ Products ({searchResults.products.length})</h3>
              <div className="grid grid-cols-3 gap-3">
                {searchResults.products.map(product => (
                  <div key={product.id} onClick={()=>setSelectedResult({type:'product', item:product})} className="bg-slate-900 p-3 rounded hover:bg-slate-850 transition cursor-pointer">
                    {product.image && <img src={product.image} alt={product.name?.en} className="w-full h-24 object-cover rounded mb-2" />}
                    <p className="text-white font-semibold text-sm">{product.name?.en || product.name}</p>
                    <p className="text-green-400 font-bold">${(product.price||0).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="bg-slate-800 p-12 rounded text-center">
              <p className="text-slate-400 text-lg">❌ تعذر العثور على نتائج</p>
              <p className="text-slate-500 text-sm mt-2">حاول البحث بكلمات أخرى</p>
            </div>
          )}
        </div>
      )}

      {!searchQuery.trim() && (
        <div className="bg-slate-800 p-6 rounded">
          <h3 className="text-xl font-bold text-white mb-4">👥 Active Users</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div onClick={() => navigate('/admin/orders?stat=total')} className="bg-slate-900 p-4 rounded cursor-pointer">
              <p className="text-slate-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{totalOrders}</p>
            </div>
            <div onClick={() => navigate('/admin/orders?stat=revenue')} className="bg-slate-900 p-4 rounded cursor-pointer">
              <p className="text-slate-400 text-sm">Today's Revenue</p>
              <p className="text-2xl font-bold text-green-400">${todaysRevenue.toFixed(2)}</p>
              <p className="text-slate-400 text-xs mt-1">Orders today: {todayOrdersList.length}</p>
            </div>
            <div onClick={() => navigate('/admin/orders?stat=today')} className="bg-slate-900 p-4 rounded cursor-pointer">
              <p className="text-slate-400 text-sm">Orders Today</p>
              <p className="text-2xl font-bold text-white">{todayOrdersList.length}</p>
            </div>
            <div onClick={() => navigate('/admin/orders?stat=late')} className="bg-slate-900 p-4 rounded cursor-pointer">
              <p className="text-slate-400 text-sm">Late Orders</p>
              <p className="text-2xl font-bold text-red-400">{lateOrdersList.length}</p>
            </div>
            <div onClick={() => navigate('/admin/orders?stat=outOfStock')} className="bg-slate-900 p-4 rounded cursor-pointer">
              <p className="text-slate-400 text-sm">Out-of-Stock Orders</p>
              <p className="text-2xl font-bold text-orange-400">{outOfStockOrdersList.length}</p>
            </div>
            <div onClick={() => navigate('/admin/orders?stat=avg')} className="bg-slate-900 p-4 rounded cursor-pointer">
              <p className="text-slate-400 text-sm">Average Order Value</p>
              <p className="text-2xl font-bold text-yellow-400">${avgOrderValue.toFixed(2)}</p>
            </div>
            <div onClick={() => navigate('/admin/orders?stat=cancelled')} className="bg-slate-900 p-4 rounded cursor-pointer">
              <p className="text-slate-400 text-sm">Canceled orders</p>
              <p className="text-2xl font-bold text-red-400">{cancelledOrders.length}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-900 p-4 rounded text-center">
              <p className="text-slate-400 text-sm">Active Customers</p>
              <p className="text-2xl font-bold text-blue-400">{users.filter(u => u.role === 'customer' && u.status === 'active').length}</p>
            </div>
            <div className="bg-slate-900 p-4 rounded text-center">
              <p className="text-slate-400 text-sm">Active Stores</p>
              <p className="text-2xl font-bold text-green-400">{getActiveStores().length}</p>
            </div>
            <div className="bg-slate-900 p-4 rounded text-center">
              <p className="text-slate-400 text-sm">Active Drivers</p>
              <p className="text-2xl font-bold text-orange-400">{users.filter(u => u.role === 'driver' && u.status === 'active').length}</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-white">👥 Users</h4>
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-400">عرض:</label>
                <select value={userFilter} onChange={(e)=>setUserFilter(e.target.value)} className="bg-slate-900 text-white px-2 py-1 rounded">
                  <option value="online">Users online</option>
                  <option value="all">All Users</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {displayedUsers.map(u => (
                <div key={u.id} className="bg-slate-900 p-3 rounded">
                  <p className="text-white font-semibold">{u.name}</p>
                  <p className="text-slate-400 text-sm">@{u.username}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {renderCancelledModal()}
      {renderDetail()}
      {renderHistoryModal()}
      </Layout>
  )
}
