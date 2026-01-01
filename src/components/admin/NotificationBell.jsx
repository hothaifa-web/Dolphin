import React from 'react'
import { useNavigate } from 'react-router-dom'

function fmtTime(ts){
  try{ return new Date(ts).toLocaleTimeString() }catch(e){return String(ts)}
}

export default function NotificationBell(){
  const [open,setOpen] = React.useState(false)
  const [items,setItems] = React.useState(()=>{
    try{ return JSON.parse(localStorage.getItem('ADMIN_NOTIFS')||'[]') }catch(e){return []}
  })
  const nav = useNavigate()

  React.useEffect(()=>{
    const id = setInterval(()=>{
      // simulate incoming order
      const now = Date.now()
      const o = {id: 'o'+now, user: 'customer'+(Math.floor(Math.random()*90)+10), total: (Math.random()*50+5).toFixed(2), ts: now}
      setItems(prev => { const next = [o, ...prev].slice(0,20); try{ localStorage.setItem('ADMIN_NOTIFS', JSON.stringify(next)) }catch(e){}; return next })
    }, 10000 + Math.random()*8000)
    return ()=>clearInterval(id)
  },[])

  function viewOrder(id){
    setOpen(false)
    nav('/admin/orders')
  }

  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setOpen(s => !s)} className="p-2 rounded hover:bg-slate-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded shadow-lg z-50 p-2">
          <h4 className="px-2 py-1 text-sm text-slate-300">Live Orders</h4>
          <div className="max-h-56 overflow-auto">
            {items.slice(0,5).map(it => (
              <div key={it.id} className="flex items-center justify-between px-2 py-2 border-t border-slate-700">
                <div>
                  <div className="text-sm">Order <strong>{it.id}</strong></div>
                  <div className="text-xs text-slate-400">{it.user} • ${it.total} • {fmtTime(it.ts)}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => viewOrder(it.id)} className="px-2 py-1 bg-indigo-600 text-white text-xs rounded">View</button>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="p-4 text-slate-400">No live orders yet</div>}
          </div>
          <div className="border-t border-slate-700 mt-2 pt-2">
            <button onClick={() => { setOpen(false); nav('/admin/offers') }} className="w-full text-sm px-2 py-2 bg-slate-700 rounded">عروض المتاجر</button>
          </div>
        </div>
      )}
    </div>
  )
}
