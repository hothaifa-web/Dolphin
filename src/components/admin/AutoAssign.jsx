import React from 'react'

// Simple Haversine distance
function haversine(a,b){
  const toRad = v => v * Math.PI / 180
  const R = 6371e3
  const φ1 = toRad(a.lat), φ2 = toRad(b.lat)
  const Δφ = toRad(b.lat - a.lat)
  const Δλ = toRad(b.lng - a.lng)
  const sa = Math.sin(Δφ/2)*Math.sin(Δφ/2) + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(sa), Math.sqrt(1-sa))
  return R * c
}

export default function AutoAssign({orders = [], drivers = []}){
  const [assignments, setAssignments] = React.useState([])

  function assignNearest(){
    const result = []
    orders.forEach(o => {
      if(!o.lat || !o.lng) return
      let best = null
      drivers.forEach(d => {
        if(!d.lat || !d.lng) return
        const dist = haversine({lat:o.lat,lng:o.lng},{lat:d.lat,lng:d.lng})
        if(best === null || dist < best.dist){ best = {driver:d, dist} }
      })
      if(best) result.push({orderId:o.id, driverId: best.driver.id, distance: Math.round(best.dist)})
    })
    setAssignments(result)
  }

  return (
    <div className="rounded bg-slate-800 p-4">
      <h3 className="font-semibold mb-3">Auto-Assignment (Nearest Driver)</h3>
      <div className="mb-3">
        <button onClick={assignNearest} className="px-3 py-1 bg-indigo-600 rounded">Assign Nearest</button>
      </div>
      <div>
        {assignments.length === 0 ? <div className="text-slate-400">No assignments yet</div> : (
          <ul className="space-y-2">
            {assignments.map(a => (
              <li key={a.orderId} className="bg-slate-700 p-2 rounded flex justify-between">
                <div>Order #{a.orderId} → Driver {a.driverId}</div>
                <div className="text-slate-400">{a.distance} m</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
