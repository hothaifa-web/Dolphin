import React from 'react'

function defaultPromos(){
  try{ return JSON.parse(localStorage.getItem('PROMOS')||'[]') }catch(e){return []}
}

export default function PromoManager(){
  const [code,setCode] = React.useState('')
  const [type,setType] = React.useState('percent')
  const [value,setValue] = React.useState(10)
  const [exp,setExp] = React.useState('')
  const [usage,setUsage] = React.useState(0)
  const [promos,setPromos] = React.useState(()=> defaultPromos())

  function save(){
    if(!code) return alert('Enter code')
    const p = {id:Date.now(), code, type, value: Number(value), exp: exp||null, usage: Number(usage)}
    const next = [p, ...promos]
    setPromos(next)
    try{ localStorage.setItem('PROMOS', JSON.stringify(next)) }catch(e){}
    setCode('')
  }

  function remove(id){ if(!confirm('Remove promo?')) return; const next = promos.filter(p=>p.id!==id); setPromos(next); try{ localStorage.setItem('PROMOS', JSON.stringify(next)) }catch(e){} }

  return (
    <div className="rounded bg-slate-800 p-4">
      <h3 className="font-semibold mb-3">Promo Codes</h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input placeholder="Code" value={code} onChange={e=>setCode(e.target.value)} className="px-2 py-1 bg-slate-700 rounded" />
        <select value={type} onChange={e=>setType(e.target.value)} className="px-2 py-1 bg-slate-700 rounded">
          <option value="percent">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>
        <input type="number" value={value} onChange={e=>setValue(e.target.value)} className="px-2 py-1 bg-slate-700 rounded" />
        <input type="date" value={exp} onChange={e=>setExp(e.target.value)} className="px-2 py-1 bg-slate-700 rounded" />
        <input type="number" value={usage} onChange={e=>setUsage(e.target.value)} className="px-2 py-1 bg-slate-700 rounded col-span-2" placeholder="Usage count" />
        <button onClick={save} className="px-3 py-1 bg-indigo-600 rounded col-span-2">Save Promo</button>
      </div>

      <div>
        {promos.length === 0 ? <div className="text-slate-400">No promos</div> : (
          <ul className="space-y-2">
            {promos.map(p=> (
              <li key={p.id} className="flex items-center justify-between bg-slate-700 p-2 rounded">
                <div>
                  <div className="font-medium">{p.code} <span className="text-xs text-slate-400">({p.type})</span></div>
                  <div className="text-xs text-slate-400">Value: {p.value} • Expires: {p.exp || '—'} • Uses: {p.usage}</div>
                </div>
                <div className="space-x-2">
                  <button onClick={()=>remove(p.id)} className="px-2 py-1 bg-red-600 rounded text-xs">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
