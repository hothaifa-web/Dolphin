import React, { useState, useEffect } from 'react'
import { getSurgeConfig, setSurgeConfig } from '../../data/mock'

export default function SurgePricing(){
  const [config, setConfig] = useState(() => getSurgeConfig() || { mode: 'off', multiplier: 1, schedule: [] })
  const [mult, setMult] = useState(config.multiplier || 1)
  const [mode, setMode] = useState(config.mode || 'off')
  const [schedule, setSchedule] = useState(config.schedule || [])
  const [newStart, setNewStart] = useState(18)
  const [newEnd, setNewEnd] = useState(21)
  const [newMult, setNewMult] = useState(1.5)

  useEffect(()=>{
    setMult(config.multiplier || 1)
    setMode(config.mode || 'off')
    setSchedule(config.schedule || [])
  },[])

  function save(){
    const updated = setSurgeConfig({ mode, multiplier: Number(mult) || 1, schedule })
    setConfig(updated)
    alert('Saved surge config')
  }

  function addSchedule(){
    const entry = { start: Number(newStart), end: Number(newEnd), multiplier: Number(newMult) }
    const updated = [...schedule, entry]
    setSchedule(updated)
  }

  function removeSchedule(idx){
    const updated = schedule.filter((_,i)=>i!==idx)
    setSchedule(updated)
  }

  function reset(){
    setMode('off'); setMult(1); setSchedule([])
    setSurgeConfig({ mode: 'off', multiplier: 1, schedule: [] })
  }

  return (
    <div className="bg-slate-800 p-6 rounded mb-6">
      <h3 className="text-xl font-bold text-white mb-3">⚡ Surge Pricing (End-to-end)</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-300">Mode:</label>
          <select value={mode} onChange={e=>setMode(e.target.value)} className="bg-slate-900 text-white px-2 py-1 rounded">
            <option value="off">Off</option>
            <option value="manual">Manual</option>
            <option value="auto">Auto (scheduled)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-300">Multiplier:</label>
          <input type="number" step="0.1" value={mult} onChange={e=>setMult(e.target.value)} className="bg-slate-900 text-white px-2 py-1 rounded w-28" />
          <span className="text-slate-400 text-sm">Applied to order totals when active.</span>
        </div>

        <div>
          <h4 className="text-sm text-white font-semibold">Schedule (auto mode)</h4>
          <div className="flex items-center gap-2 mt-2">
            <label className="text-slate-400">Start (hour)</label>
            <input type="number" min="0" max="23" value={newStart} onChange={e=>setNewStart(e.target.value)} className="bg-slate-900 text-white px-2 py-1 rounded w-20" />
            <label className="text-slate-400">End (hour)</label>
            <input type="number" min="1" max="24" value={newEnd} onChange={e=>setNewEnd(e.target.value)} className="bg-slate-900 text-white px-2 py-1 rounded w-20" />
            <label className="text-slate-400">Mult</label>
            <input type="number" step="0.1" value={newMult} onChange={e=>setNewMult(e.target.value)} className="bg-slate-900 text-white px-2 py-1 rounded w-24" />
            <button onClick={addSchedule} className="px-3 py-1 bg-green-600 rounded text-white">Add</button>
          </div>

          <div className="mt-3 space-y-2">
            {schedule.length === 0 && <p className="text-slate-400 text-sm">No scheduled intervals.</p>}
            {schedule.map((s,idx)=> (
              <div key={idx} className="flex items-center justify-between bg-slate-900 p-2 rounded">
                <div className="text-sm text-slate-300">{s.start}:00 — {s.end}:00 — x{s.multiplier}</div>
                <button onClick={()=>removeSchedule(idx)} className="px-2 py-1 bg-red-600 rounded text-white text-sm">Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={save} className="px-4 py-2 bg-indigo-600 rounded text-white">Save</button>
          <button onClick={reset} className="px-4 py-2 bg-red-600 rounded text-white">Reset</button>
        </div>

        <p className="text-slate-400 text-sm">Note: This affects newly created orders and updates the revenue total accordingly.</p>
      </div>
    </div>
  )
}
