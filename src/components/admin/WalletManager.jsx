import React from 'react'

const KEY = 'WALLETS'

export default function WalletManager(){
  function readInitialWallets(){
    try{
      return JSON.parse(localStorage.getItem(KEY) || '{}')
    }catch(e){
      return {drivers:{},stores:{}}
    }
  }
  const [wallets,setWallets] = React.useState(readInitialWallets)
  const [entity,setEntity] = React.useState('driver')
  const [id,setId] = React.useState('')
  const [amount,setAmount] = React.useState(0)

  function adjust(){
    if(!id) return alert('Enter id')
    const copy = JSON.parse(JSON.stringify(wallets || {drivers:{},stores:{}}))
    const bucket = entity === 'driver' ? 'drivers' : 'stores'
    copy[bucket] = copy[bucket] || {}
    copy[bucket][id] = (copy[bucket][id] || 0) + Number(amount)
    setWallets(copy)
    try{ localStorage.setItem(KEY, JSON.stringify(copy)) }catch(e){}
    setId(''); setAmount(0)
  }

  function reset(){ if(!confirm('Reset all wallets?')) return; const empty = {drivers:{},stores:{}}; setWallets(empty); try{ localStorage.setItem(KEY, JSON.stringify(empty)) }catch(e){} }

  return (
    <div className="rounded bg-slate-800 p-4">
      <h3 className="font-semibold mb-3">Wallets (Driver cash / Store payouts)</h3>
      <div className="flex gap-2 mb-3">
        <select value={entity} onChange={e=>setEntity(e.target.value)} className="px-2 py-1 bg-slate-700 rounded">
          <option value="driver">Driver</option>
          <option value="store">Store</option>
        </select>
        <input placeholder="ID" value={id} onChange={e=>setId(e.target.value)} className="px-2 py-1 bg-slate-700 rounded" />
        <input placeholder="Amount (+/-)" type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} className="px-2 py-1 bg-slate-700 rounded" />
        <button onClick={adjust} className="px-3 py-1 bg-indigo-600 rounded">Adjust</button>
      </div>

      <div className="mb-3">
        <button onClick={reset} className="px-3 py-1 bg-red-600 rounded">Reset Wallets</button>
      </div>

      <div>
        <h4 className="text-sm mb-2">Drivers</h4>
        <ul className="space-y-1 mb-3">
          {Object.entries(wallets.drivers||{}).length === 0 ? <li className="text-slate-400">No driver balances</li> : Object.entries(wallets.drivers||{}).map(([k,v]) => (
            <li key={k} className="flex justify-between bg-slate-700 p-2 rounded"><span>{k}</span><span>${v.toFixed(2)}</span></li>
          ))}
        </ul>
        <h4 className="text-sm mb-2">Stores</h4>
        <ul className="space-y-1">
          {Object.entries(wallets.stores||{}).length === 0 ? <li className="text-slate-400">No store balances</li> : Object.entries(wallets.stores||{}).map(([k,v]) => (
            <li key={k} className="flex justify-between bg-slate-700 p-2 rounded"><span>{k}</span><span>${v.toFixed(2)}</span></li>
          ))}
        </ul>
      </div>
    </div>
  )
}
