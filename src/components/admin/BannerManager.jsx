import React from 'react'

const KEY = 'BANNERS'

export default function BannerManager(){
  function readInitialBanners(){
    try{ return JSON.parse(localStorage.getItem(KEY)||'[]') }catch(e){ return [] }
  }
  const [banners,setBanners] = React.useState(readInitialBanners)
  const [image,setImage] = React.useState('')
  const [title,setTitle] = React.useState('')
  const [start,setStart] = React.useState('')
  const [end,setEnd] = React.useState('')

  function add(){ if(!image) return alert('Enter image url'); const b = {id:Date.now(), image, title, start: start||null, end: end||null}; const next=[b,...banners]; setBanners(next); try{ localStorage.setItem(KEY, JSON.stringify(next)) }catch(e){}; setImage(''); setTitle(''); setStart(''); setEnd('') }
  function remove(id){ if(!confirm('Remove banner?')) return; const next=banners.filter(b=>b.id!==id); setBanners(next); try{ localStorage.setItem(KEY, JSON.stringify(next)) }catch(e){} }

  return (
    <div className="rounded bg-slate-800 p-4">
      <h3 className="font-semibold mb-3">Banner Manager</h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input placeholder="Image URL" value={image} onChange={e=>setImage(e.target.value)} className="px-2 py-1 bg-slate-700 rounded col-span-2" />
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="px-2 py-1 bg-slate-700 rounded" />
        <input type="date" value={start} onChange={e=>setStart(e.target.value)} className="px-2 py-1 bg-slate-700 rounded" />
        <input type="date" value={end} onChange={e=>setEnd(e.target.value)} className="px-2 py-1 bg-slate-700 rounded" />
        <button onClick={add} className="px-3 py-1 bg-indigo-600 rounded col-span-2">Add Banner</button>
      </div>

      <div className="space-y-2">
        {banners.length === 0 ? <div className="text-slate-400">No banners</div> : banners.map(b => (
          <div key={b.id} className="bg-slate-700 p-2 rounded flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={b.image} alt={b.title} className="w-20 h-12 object-cover rounded" />
              <div>
                <div className="font-medium">{b.title || '—'}</div>
                <div className="text-xs text-slate-400">{b.start||'—'} → {b.end||'—'}</div>
              </div>
            </div>
            <div>
              <button onClick={()=>remove(b.id)} className="px-2 py-1 bg-red-600 rounded text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
