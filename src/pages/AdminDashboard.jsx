import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import NotificationBell from '../components/admin/NotificationBell'
import LiveTracking from '../components/admin/LiveTracking'
import PromoManager from '../components/admin/PromoManager'
import AnalyticsPanel from '../components/admin/AnalyticsPanel'
import StoreManagement from '../components/admin/StoreManagement'
import NoDataFound from '../components/NoDataFound'
import GeofenceManager from '../components/admin/GeofenceManager'
import WalletManager from '../components/admin/WalletManager'
import AutoAssign from '../components/admin/AutoAssign'
import AuditLogs from '../components/admin/AuditLogs'
import BannerManager from '../components/admin/BannerManager'
import { useLocale } from '../contexts/LocaleContext'
import { getStats, getOrders, getUsers, getProducts, subscribe, saveUsers } from '../data/mock'
import { Line, Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)

export default function AdminDashboard(){
  const navigate = useNavigate()
  const {dir, toggle} = useLocale()
  const [stats, setStats] = React.useState(() => getStats())
  const [orders, setOrders] = React.useState(() => getOrders())
  const [users] = React.useState(() => getUsers())
  const [products] = React.useState(() => getProducts())

  React.useEffect(() => {
    const unsub = subscribe((ev)=>{
      if(ev.type === 'tick'){
        setStats({...ev.stats})
        setOrders([...ev.orders])
      }else if(ev.type === 'order'){
        setStats({...ev.stats})
        setOrders(prev => [ev.order, ...prev])
      }
    })
    return () => unsub()
  }, [])
  
  const side = [
    {label:'Dashboard',to:'/admin'},
    {label:'Orders',to:'/admin/orders'},
    {label:'Revenue',to:'/admin/revenue'},
    {label:'statistics',to:'/admin/stats'},
    {label:'Users online',to:'/admin/users'},
    {label:'Products',to:'/admin/products'},
    {label:'العروض المنتظرة', to:'/admin/offers'},
    {label:'Create',to:'/admin/create-store'}
  ]

  const lineData = {labels:['Jan','Feb','Mar','Apr'], datasets:[{label:'Revenue',data:[1200,1900,3000,2500],borderColor:'#60a5fa',backgroundColor:'#60a5fa33'}]}
  const barData = {labels:['A','B','C'], datasets:[{label:'Sales',data:[30,50,70],backgroundColor:['#60a5fa','#34d399','#f472b6']}]}
  const pieData = {labels:['Online','In-store'], datasets:[{data:[60,40],backgroundColor:['#60a5fa','#f59e0b']}]}

  return (
    <Layout sideItems={side}>
      <div className="flex items-center justify-end gap-3 mb-4">
        <NotificationBell />
        <div className="flex items-center gap-2">
          <small className="text-slate-400">RTL</small>
          <button onClick={() => toggle()} className="px-2 py-1 bg-slate-700 rounded">{dir==='ltr' ? 'EN' : 'العربية'}</button>
        </div>
      </div>
      {/* Create Store / Driver moved to dedicated page: /admin/create-store */}

      <div className="grid grid-cols-4 gap-4 mb-6">
        <button onClick={() => navigate('/admin/orders')} className="p-4 bg-slate-800 rounded text-left hover:bg-slate-700 transition cursor-pointer">إجمالي الطلبات<br/><strong>{stats.totalOrders}</strong></button>
        <button onClick={() => navigate('/admin/revenue')} className="p-4 bg-slate-800 rounded text-left hover:bg-slate-700 transition cursor-pointer">إجمالي الإيرادات<br/><strong>${(stats && stats.totalRevenue ? Number(stats.totalRevenue).toFixed(2) : '0.00')}</strong></button>
        <button onClick={() => navigate('/admin/users')} className="p-4 bg-slate-800 rounded text-left hover:bg-slate-700 transition cursor-pointer">المستخدمون النشطون<br/><strong>{stats.activeUsers}</strong></button>
        <button onClick={() => navigate('/admin/products')} className="p-4 bg-slate-800 rounded text-left hover:bg-slate-700 transition cursor-pointer">المتاجر النشطة<br/><strong>{stats.activeStores}</strong></button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <AnalyticsPanel />
          <div className="mt-4">
            <PromoManager />
          </div>
        </div>
        <div className="space-y-4">
          <LiveTracking />
          <StoreManagement />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <GeofenceManager />
        </div>
        <div className="col-span-1">
          <WalletManager />
        </div>
        <div className="col-span-1">
          <BannerManager />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div>
          <AutoAssign orders={orders.slice(0,10)} drivers={users.filter(u=>u.role==='driver').map(d=>({id:d.id, lat: d.lat||(31.95 + Math.random()*0.1), lng: d.lng||35.93 + Math.random()*0.1}))} />
        </div>
        <div>
          <AuditLogs />
        </div>
        <div>
          {/* reserved for future mapping or details */}
          <div className="rounded bg-slate-800 p-4">Operations panel</div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-4 text-white">Recent Transactions</h3>
        {orders.length === 0 ? <NoDataFound message="No transactions yet" /> : (
          <div className="p-4 bg-slate-800 rounded">
            <table className="w-full text-sm">
              <thead className="text-slate-400"><tr><th>ID</th><th>User</th><th>Total</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {orders.map(o=> (
                  <tr key={o.id} className="border-t border-slate-700 hover:bg-slate-900 transition">
                    <td className="py-2">{o.id}</td>
                    <td>{(users.find(u=>u.id===o.userId)||{}).name||o.userId}</td>
                    <td>${o.total}</td>
                    <td><span className={o.status==='delivered' ? 'text-green-400' : 'text-yellow-400'}>{o.status}</span></td>
                    <td><button onClick={() => navigate('/admin/orders')} className="text-blue-400 hover:underline">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}

function formatShortRevenue(value){
  try{
    const n = Math.max(0, Math.floor(Number(value) || 0))
    if(n < 1000) return n.toLocaleString()
    const s = String(n)
    const len = s.length
    const first3 = Number(s.slice(0,3))
    const zeros = len - 3
    const v = first3 * Math.pow(10, zeros)
    return v.toLocaleString()
  }catch(e){ return value }
}

function CreateUserForm(){
  const [username,setUsername] = React.useState('')
  const [password,setPassword] = React.useState('')
  const [role,setRole] = React.useState('store')

  function submit(e){
    e.preventDefault()
    const id = Date.now()
    const newUser = {id, username, password, role, name: username, status: 'active'}
    USERS.push(newUser)
    try{ saveUsers() }catch(e){ /* ignore */ }
    setUsername('')
    setPassword('')
    alert('Created ' + role + ' account: ' + username)
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input required value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" className="px-2 py-1 rounded bg-slate-700" />
      <input required value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" className="px-2 py-1 rounded bg-slate-700" />
      <select value={role} onChange={e=>setRole(e.target.value)} className="px-2 py-1 rounded bg-slate-700">
        <option value="store">Store</option>
        <option value="driver">Driver</option>
      </select>
      <button className="px-3 py-1 bg-indigo-600 rounded">Create</button>
    </form>
  )
}
