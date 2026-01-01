import React, { useEffect, useState } from 'react'
import useLocalStorage from './useLocalStorage'

export default function AddressesTab(){
  const [addresses, setAddresses] = useLocalStorage('addresses_v1', [])
  const [editing, setEditing] = useState(null)

  function save(addr){
    if(!addr.id){ addr.id = Date.now() }
    setAddresses(prev => {
      const idx = prev.findIndex(p=>p.id===addr.id)
      if(idx === -1) return [addr, ...prev]
      const copy = [...prev]; copy[idx] = addr; return copy
    })
    setEditing(null)
  }

  function remove(id){ setAddresses(prev => prev.filter(p=>p.id !== id)) }

  return (
    <div>
      <div className="mb-3">
        <button onClick={()=>setEditing({})} className="px-3 py-1 bg-indigo-600 rounded">Add Address</button>
      </div>
      {editing ? (
        <AddressForm initial={editing} onCancel={()=>setEditing(null)} onSave={save} />
      ) : (
        <div className="space-y-2">
          {addresses.length === 0 ? <div className="text-sm text-slate-400">No saved addresses</div> : addresses.map(a=> (
            <div key={a.id} className="p-3 bg-slate-800 rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{a.name}</div>
                <div className="text-sm text-slate-400">{a.line}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>setEditing(a)} className="px-2 py-1 bg-slate-700 rounded">Edit</button>
                <button onClick={()=>remove(a.id)} className="px-2 py-1 bg-rose-600 rounded">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AddressForm({initial={}, onCancel, onSave}){
  const [form, setForm] = useState(initial)
  function update(k,v){ setForm(f=>({ ...f, [k]: v })) }
  return (
    <div className="p-3 bg-slate-800 rounded">
      <input value={form.name||''} onChange={e=>update('name', e.target.value)} placeholder="Label (Home)" className="w-full mb-2 p-2 bg-slate-900 rounded" />
      <textarea value={form.line||''} onChange={e=>update('line', e.target.value)} placeholder="Address line" className="w-full mb-2 p-2 bg-slate-900 rounded" />
      <div className="flex gap-2">
        <button onClick={()=>onSave(form)} className="px-3 py-1 bg-emerald-600 rounded">Save</button>
        <button onClick={onCancel} className="px-3 py-1 bg-slate-700 rounded">Cancel</button>
      </div>
    </div>
  )
}
