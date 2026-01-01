import React from 'react'

const STORAGE_KEY = 'GEOFENCES'

export default function GeofenceManager(){
  function readInitialList(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]') }catch(e){ return [] }
  }
  const [list,setList] = React.useState(readInitialList)
  const [name,setName] = React.useState('')
  const [lat,setLat] = React.useState('')
  const [lng,setLng] = React.useState('')
  const [radius,setRadius] = React.useState(3000)
  const [price,setPrice] = React.useState(0)

  function addZone(){
    if(!name || !lat || !lng) return alert('Enter name and coords')
    const z = {id:Date.now(), name, center:{lat:Number(lat), lng:Number(lng)}, radius:Number(radius), price: Number(price)}
    const next = [z, ...list]
    setList(next)
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }catch(e){}
    setName(''); setLat(''); setLng(''); setRadius(3000); setPrice(0)
  }

  function remove(id){ if(!confirm('Remove zone?')) return; const next = list.filter(z=>z.id!==id); setList(next); try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }catch(e){} }

  return (
    <div className="rounded bg-slate-800 p-4">
      <h3 className="font-semibold mb-3">Geofencing & Delivery Pricing</h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input placeholder="Zone name" value={name} onChange={e=>setName(e.target.value)} className="px-2 py-1 bg-slate-700 rounded" />
        <input placeholder="Price" type="number" value={price} onChange={e=>setPrice(e.target.value)} className="px-2 py-1 bg-slate-700 rounded" />
        <input placeholder="Latitude" value={lat} onChange={e=>setLat(e.target.value)} className="px-2 py-1 bg-slate-700 rounded" />
        <input placeholder="Longitude" value={lng} onChange={e=>setLng(e.target.value)} className="px-2 py-1 bg-slate-700 rounded" />
        <input placeholder="Radius (m)" type="number" value={radius} onChange={e=>setRadius(e.target.value)} className="px-2 py-1 bg-slate-700 rounded col-span-2" />
        <button onClick={addZone} className="px-3 py-1 bg-indigo-600 rounded col-span-2">Add Zone</button>
      </div>

      <div>
        {list.length===0 ? <div className="text-slate-400">No zones defined</div> : (
          <ul className="space-y-2">
            {list.map(z=> (
              <li key={z.id} className="bg-slate-700 p-2 rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{z.name} — ${z.price}</div>
                  <div className="text-xs text-slate-400">Center: {z.center.lat},{z.center.lng} • Radius: {z.radius}m</div>
                </div>
                <div>
                  <button onClick={()=>remove(z.id)} className="px-2 py-1 bg-red-600 rounded text-xs">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
