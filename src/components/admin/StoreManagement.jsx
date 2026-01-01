import React from 'react'

function sampleReviews(){
  return [
    {id:1, user:'Ali', text:'Great service!', approved:false},
    {id:2, user:'Sara', text:'Package damaged', approved:false},
    {id:3, user:'Omar', text:'Fast delivery', approved:true}
  ]
}

export default function StoreManagement(){
  function readInitialOpen(){
    try{ return JSON.parse(localStorage.getItem('STORE_OPEN')) ?? true }catch(e){ return true }
  }
  function readInitialReviews(){
    try{ return JSON.parse(localStorage.getItem('REVIEWS')) || sampleReviews() }catch(e){ return sampleReviews() }
  }
  const [open,setOpen] = React.useState(readInitialOpen)
  const [reviews,setReviews] = React.useState(readInitialReviews)

  React.useEffect(()=>{ try{ localStorage.setItem('STORE_OPEN', JSON.stringify(open)) }catch(e){} },[open])
  React.useEffect(()=>{ try{ localStorage.setItem('REVIEWS', JSON.stringify(reviews)) }catch(e){} },[reviews])

  function approve(id){ setReviews(prev => prev.map(r => r.id===id?{...r,approved:true}:r)) }
  function remove(id){ if(!confirm('Delete review?')) return; setReviews(prev => prev.filter(r=>r.id!==id)) }

  return (
    <div className="rounded bg-slate-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Store Management</h3>
        <div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={open} onChange={e=>setOpen(e.target.checked)} /> Open</label>
        </div>
      </div>

      <div>
        <h4 className="text-sm mb-2">Review Moderation</h4>
        {reviews.length===0 ? <div className="text-slate-400">No reviews</div> : (
          <ul className="space-y-2">
            {reviews.map(r=> (
              <li key={r.id} className="bg-slate-700 p-2 rounded flex items-start justify-between">
                <div>
                  <div className="font-medium">{r.user} {r.approved ? <span className="text-xs text-green-400">(approved)</span> : null}</div>
                  <div className="text-sm text-slate-300">{r.text}</div>
                </div>
                <div className="flex flex-col gap-2">
                  {!r.approved && <button onClick={()=>approve(r.id)} className="px-2 py-1 bg-indigo-600 rounded text-xs">Approve</button>}
                  <button onClick={()=>remove(r.id)} className="px-2 py-1 bg-red-600 rounded text-xs">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
