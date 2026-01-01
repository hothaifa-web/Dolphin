import React from 'react'

const KEY = 'AUDIT_LOGS'

export function logAction(action, details){
  try{
    const cur = JSON.parse(localStorage.getItem(KEY)||'[]')
    cur.unshift({id:Date.now(), action, details, ts: Date.now()})
    localStorage.setItem(KEY, JSON.stringify(cur))
  }catch(e){}
}

export default function AuditLogs(){
  function readInitialLogs(){
    try{ return JSON.parse(localStorage.getItem(KEY)||'[]') }catch(e){ return [] }
  }
  const [logs, setLogs] = React.useState(readInitialLogs)

  React.useEffect(()=>{
    const id = setInterval(()=>{ try{ setLogs(JSON.parse(localStorage.getItem(KEY)||'[]')) }catch(e){} }, 2000)
    return ()=>clearInterval(id)
  },[])

  function clear(){ if(!confirm('Clear logs?')) return; localStorage.setItem(KEY,'[]'); setLogs([]) }

  return (
    <div className="rounded bg-slate-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Audit Logs</h3>
        <button onClick={clear} className="px-2 py-1 bg-red-600 rounded">Clear</button>
      </div>
      <div className="max-h-60 overflow-auto">
        {logs.length === 0 ? <div className="text-slate-400">No logs yet</div> : (
          <ul className="space-y-2 text-sm">
            {logs.map(l => (
              <li key={l.id} className="bg-slate-700 p-2 rounded">
                <div className="flex justify-between"><div>{l.action}</div><div className="text-slate-400">{new Date(l.ts).toLocaleString()}</div></div>
                <div className="text-slate-400 text-xs mt-1">{JSON.stringify(l.details)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
