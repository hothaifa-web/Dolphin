import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'

export default function AdminOffers(){
  const [pending, setPending] = useState([])
  const [approved, setApproved] = useState([])
  const [filterRegion, setFilterRegion] = useState('All')

  useEffect(()=>{
    const p = JSON.parse(localStorage.getItem('PENDING_OFFERS')||'[]')
    const a = JSON.parse(localStorage.getItem('APPROVED_OFFERS')||'[]')
    setPending(p)
    setApproved(a)
    // seed demo pending offers if none
    if(p.length === 0){
      // seed two specific demo pending offers with fixed dates
      const demo = [
        { id: 'demo1', title: 'خصم 20% على القهوة', subtitle: 'لفترة محدودة', image: '', discount:20, region: 'North', store: 'Coffee Bazaar', status:'pending', startDate: new Date('2025-12-28').toISOString(), endDate: new Date('2026-01-04').toISOString() },
        { id: 'demo2', title: 'توصيل مجاني', subtitle: 'فوق $15', image: '', discount:0, region: 'All', store: 'Bistro 21', status:'pending', startDate: new Date('2025-12-28').toISOString(), endDate: new Date('2025-12-31').toISOString() }
      ]
      localStorage.setItem('PENDING_OFFERS', JSON.stringify(demo))
      setPending(demo)
    }
    if(a.length === 0){
      const approvedDemo = [
        { id: 'app1', title: 'عرض افتتاحي', subtitle: 'خصم 15% للزبائن الجدد', image:'', discount:15, region: 'All', store: 'Coffee Bazaar', status:'approved', startDate: new Date('2025-12-28').toISOString(), endDate: new Date('2026-01-11').toISOString() }
      ]
      localStorage.setItem('APPROVED_OFFERS', JSON.stringify(approvedDemo))
      setApproved(approvedDemo)
    }
  }, [])

  function refresh(){
    setPending(JSON.parse(localStorage.getItem('PENDING_OFFERS')||'[]'))
    setApproved(JSON.parse(localStorage.getItem('APPROVED_OFFERS')||'[]'))
  }

  function approve(o){
    const now = Date.now()
    const pend = JSON.parse(localStorage.getItem('PENDING_OFFERS')||'[]').filter(p=>p.id!==o.id)
    const app = JSON.parse(localStorage.getItem('APPROVED_OFFERS')||'[]')
    const approvedOffer = {...o, status:'approved', approvedAt: now}
    app.unshift(approvedOffer)
    localStorage.setItem('PENDING_OFFERS', JSON.stringify(pend))
    localStorage.setItem('APPROVED_OFFERS', JSON.stringify(app))
    // add to admin notifs as info
    const notifs = JSON.parse(localStorage.getItem('ADMIN_NOTIFS')||'[]')
    notifs.unshift({ id: 'n'+now, type: 'info', title: `تمت الموافقة على ${o.title}`, ts: now })
    localStorage.setItem('ADMIN_NOTIFS', JSON.stringify(notifs))
    refresh()
  }

  function reject(o){
    const pend = JSON.parse(localStorage.getItem('PENDING_OFFERS')||'[]').filter(p=>p.id!==o.id)
    localStorage.setItem('PENDING_OFFERS', JSON.stringify(pend))
    const now = Date.now()
    const notifs = JSON.parse(localStorage.getItem('ADMIN_NOTIFS')||'[]')
    notifs.unshift({ id: 'n'+now, type: 'info', title: `تم رفض ${o.title}`, ts: now })
    localStorage.setItem('ADMIN_NOTIFS', JSON.stringify(notifs))
    refresh()
  }

  const side = [
    {label:'Dashboard',to:'/admin'},
    {label:'Orders',to:'/admin/orders'},
    {label:'Offers',to:'/admin/offers'}
  ]

  const shown = pending.filter(p => filterRegion === 'All' ? true : p.region === filterRegion)

  return (
    <Layout sideItems={side}>
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">طلبات عروض المتاجر</h2>
          <div className="flex items-center gap-2">
            <select value={filterRegion} onChange={e=>setFilterRegion(e.target.value)} className="border px-2 py-1 rounded">
              <option value="All">الكل</option>
              <option value="North">المنطقة الشمالية</option>
              <option value="South">المنطقة الجنوبية</option>
              <option value="East">المنطقة الشرقية</option>
              <option value="West">المنطقة الغربية</option>
            </select>
            <button onClick={refresh} className="px-3 py-1 bg-slate-800 text-white rounded">تحديث</button>
          </div>
        </div>

        <div className="space-y-4">
          {shown.length === 0 ? <div className="p-4 bg-slate-800 rounded text-slate-300">لا توجد طلبات في المنطقة المحددة.</div> : shown.map(o => (
            <div key={o.id} className="p-4 bg-black/60 text-white rounded shadow flex items-start gap-4">
              <div className="w-36 h-24 bg-black/30 rounded overflow-hidden border border-white/10"><img src={o.image || 'https://via.placeholder.com/160x120'} className="w-full h-full object-cover"/></div>
              <div className="flex-1">
                <div className="font-bold text-lg">{o.title}</div>
                <div className="text-sm text-white/80">{o.subtitle}</div>
                <div className="text-xs text-white/60 mt-2">Store: {o.store || '—'} • Region: {o.region}</div>
                <div className="text-xs text-white/60 mt-1">من: {o.startDate ? new Date(o.startDate).toLocaleDateString() : '—'} • إلى: {o.endDate ? new Date(o.endDate).toLocaleDateString() : '—'}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={()=>approve(o)} className="px-3 py-2 bg-green-600 text-white rounded">موافق</button>
                <button onClick={()=>reject(o)} className="px-3 py-2 bg-red-500 text-white rounded">رفض</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
