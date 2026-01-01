import React from 'react'
import LeafletMapPlaceholder from './LeafletMapPlaceholder'

const SAMPLE_DRIVERS = Array.from({length:6}).map((_,i)=>({id:1000+i, name:`Driver ${i+1}`, status: ['online','busy','offline'][i%3], task: i%2 ? `Order #${200+i}` : 'Idle'}))

export default function LiveTracking(){
  const [drivers,setDrivers] = React.useState(()=>{
    try{ const saved = JSON.parse(localStorage.getItem('DRIVERS')) ; return saved || SAMPLE_DRIVERS }catch(e){return SAMPLE_DRIVERS}
  })

  React.useEffect(()=>{
    const id = setInterval(()=>{
      setDrivers(prev => prev.map(d => {
        if(Math.random() < 0.25){
          const nextStatus = d.status === 'online' ? 'busy' : (d.status === 'busy' ? 'online' : (Math.random()<0.5?'online':'offline'))
          return {...d, status: nextStatus, task: nextStatus==='busy' ? `Order #${Math.floor(Math.random()*400)+200}` : 'Idle'}
        }
        return d
      }))
    }, 6000)
    return ()=>clearInterval(id)
  },[])

  React.useEffect(()=>{ try{ localStorage.setItem('DRIVERS', JSON.stringify(drivers)) }catch(e){} }, [drivers])

  function contact(d){ alert('Contacting ' + d.name) }
  function block(d){ if(!confirm('Block '+d.name+'?')) return; setDrivers(prev=>prev.map(p=>p.id===d.id?{...p,status:'offline',task:'Blocked'}:p)) }

  return (
    <div className="rounded bg-slate-800 p-4">
      <h3 className="font-semibold mb-3">Live Tracking</h3>
      <table className="w-full text-sm">
        <thead className="text-slate-400"><tr><th>ID</th><th>Name</th><th>Status</th><th>Task</th><th>Action</th></tr></thead>
        <tbody>
          {drivers.map(d=> (
            <tr key={d.id} className="border-t border-slate-700">
              <td className="py-2">{d.id}</td>
              <td>{d.name}</td>
              <td className={d.status==='online' ? 'text-green-400' : (d.status==='busy' ? 'text-yellow-400' : 'text-slate-400')}>{d.status}</td>
              <td>{d.task}</td>
              <td className="space-x-2">
                <button onClick={()=>contact(d)} className="px-2 py-1 bg-indigo-600 rounded text-xs">Contact</button>
                <button onClick={()=>block(d)} className="px-2 py-1 bg-red-600 rounded text-xs">Block</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <LeafletMapPlaceholder />
      </div>
    </div>
  )
}
