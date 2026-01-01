import React, { useState, useEffect, useMemo } from 'react'
import Layout from '../components/Layout'

const STAGES = [
  { key: 'placed', label: 'Order Placed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'on_the_way', label: 'On the way' },
  { key: 'delivered', label: 'Delivered' }
]

function StageIcon({ stageKey, state }){
  // state: 'completed' | 'current' | 'upcoming'
  const base = 'w-6 h-6 inline-block'
  if(stageKey === 'on_the_way'){
    return (
      <svg className={`${base} ${state === 'current' ? 'text-orange-400 animate-pulse' : state === 'completed' ? 'text-green-400' : 'text-slate-500'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12h3l3-6h6l3 6h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  }
  // generic check / dot
  return (
    <div className={`${base} ${state === 'completed' ? 'bg-green-400 rounded-full' : state === 'current' ? 'bg-orange-400 rounded-full' : 'bg-slate-500 rounded-full'}`} />
  )
}

function formatRemaining(ms){
  if(ms <= 0) return '0:00'
  const sec = Math.floor(ms/1000)
  const m = Math.floor(sec/60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2,'0')}`
}

export default function Tracking(){
  const [orderStatus, setOrderStatus] = useState('placed')
  const [targetTs, setTargetTs] = useState(() => Date.now() + 20*60*1000) // default 20m
  const [now, setNow] = useState(Date.now())

  useEffect(()=>{
    const t = setInterval(()=> setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(()=>{
    // set a reasonable ETA per status
    let mins = 0
    if(orderStatus === 'placed') mins = 20
    if(orderStatus === 'preparing') mins = 15
    if(orderStatus === 'on_the_way') mins = 10
    if(orderStatus === 'delivered') mins = 0
    setTargetTs(Date.now() + mins*60*1000)
  },[orderStatus])

  const remaining = Math.max(0, targetTs - now)

  const currentIndex = useMemo(()=> STAGES.findIndex(s => s.key === orderStatus), [orderStatus])

  // placeholder driver data
  const driver = { name: 'Mohamed Ali', phone: '+201234567890', photo: 'https://via.placeholder.com/80' }

  return (
    <Layout>
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-white mb-4">Order Live Tracking</h2>

        <div className="bg-slate-800 p-4 rounded mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-slate-400 text-sm">Estimated delivery</p>
              <p className="text-xl font-semibold text-white">{formatRemaining(remaining)}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Status</p>
              <p className="text-lg font-medium text-white capitalize">{STAGES[currentIndex]?.label}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              {/* Stepper */}
              <div className="space-y-6">
                {STAGES.map((s, idx) => {
                  const state = idx < currentIndex ? 'completed' : idx === currentIndex ? 'current' : 'upcoming'
                  return (
                    <div key={s.key} className="flex items-center gap-3">
                      <div className="w-8"> <StageIcon stageKey={s.key} state={state} /> </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`${state === 'completed' ? 'text-green-400' : state === 'current' ? 'text-orange-400' : 'text-slate-400'} font-semibold`}>{s.label}</p>
                            {state === 'completed' && <p className="text-xs text-slate-400">Completed</p>}
                            {state === 'current' && <p className="text-xs text-slate-400">In progress</p>}
                          </div>
                        </div>
                        <div className={`h-1 mt-3 ${idx < currentIndex ? 'bg-green-500' : idx === currentIndex ? 'bg-orange-400' : 'bg-slate-600'} rounded`} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="w-full md:w-56">
              <div className="bg-slate-900 p-4 rounded">
                <div className="flex items-center gap-3">
                  <img src={driver.photo} alt={driver.name} className="w-16 h-16 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-white font-semibold">{driver.name}</p>
                    <p className="text-slate-400 text-sm">Driver</p>
                  </div>
                </div>

                <div className="mt-4">
                  {orderStatus === 'on_the_way' ? (
                    <a href={`tel:${driver.phone}`} className="block w-full text-center px-3 py-2 bg-indigo-600 rounded text-white">Call Driver</a>
                  ) : (
                    <p className="text-slate-400 text-sm">Call driver will appear when the order is on the way.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <button onClick={() => setOrderStatus('placed')} className="px-3 py-1 bg-slate-700 rounded text-white">Placed</button>
            <button onClick={() => setOrderStatus('preparing')} className="px-3 py-1 bg-slate-700 rounded text-white">Preparing</button>
            <button onClick={() => setOrderStatus('on_the_way')} className="px-3 py-1 bg-slate-700 rounded text-white">On the way</button>
            <button onClick={() => setOrderStatus('delivered')} className="px-3 py-1 bg-slate-700 rounded text-white">Delivered</button>
            <button onClick={() => { setTargetTs(Date.now() + 2*60*1000) }} className="ml-auto px-3 py-1 bg-yellow-500 rounded text-black">Short test ETA (2m)</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
