import React, { useEffect, useState } from 'react'

const WALLET_KEY = 'app_wallet_balance_v1'
const TX_KEY = 'app_wallet_txs_v1'

function loadBalance(){
  try{ return Number(localStorage.getItem(WALLET_KEY) || 0) }catch(e){return 0}
}

function loadTxs(){
  try{ return JSON.parse(localStorage.getItem(TX_KEY) || '[]') }catch(e){return []}
}

export default function Wallet(){
  const [balance, setBalance] = useState(loadBalance())
  const [txs, setTxs] = useState(loadTxs())
  const [adding, setAdding] = useState(false)
  const [amount, setAmount] = useState('')

  useEffect(()=>{
    localStorage.setItem(WALLET_KEY, String(balance))
  },[balance])

  useEffect(()=>{
    localStorage.setItem(TX_KEY, JSON.stringify(txs))
  },[txs])

  // react to external wallet updates (from admin or global actions)
  useEffect(()=>{
    function onUpdate(){
      setBalance(loadBalance())
      setTxs(loadTxs())
    }
    window.addEventListener('wallet:updated', onUpdate)
    return () => window.removeEventListener('wallet:updated', onUpdate)
  }, [])

  function doAddFunds(){
    const v = Math.max(0, Number(amount) || 0)
    if(v <= 0) return alert('Enter a positive amount')
    const tx = { id: Date.now(), type: 'topup', amount: v, date: new Date().toISOString() }
    setTxs(prev => [tx, ...prev])
    setBalance(prev => +(prev + v).toFixed(2))
    setAmount('')
    setAdding(false)
  }

  function addFakeExpense(){
    const v = 5
    const tx = { id: Date.now(), type: 'spend', amount: v, date: new Date().toISOString(), note:'Test spend' }
    setTxs(prev => [tx, ...prev])
    setBalance(prev => +(prev - v).toFixed(2))
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="backdrop-blur-sm bg-white/5 dark:bg-black/20 border border-white/5 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white">Wallet</h3>
        <p className="text-slate-400 text-sm mt-1">Balance</p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <div className="text-3xl font-bold text-white">${(balance||0).toFixed(2)}</div>
            <div className="text-xs text-slate-400">Available to spend</div>
          </div>
          <div className="space-y-2">
            <button onClick={() => setAdding(true)} className="px-3 py-1 bg-indigo-600 rounded text-white">Add Funds</button>
            <button onClick={addFakeExpense} className="px-3 py-1 bg-slate-700 rounded text-white text-sm">Test Spend -$5</button>
          </div>
        </div>

        {adding && (
          <div className="mt-4">
            <input value={amount} onChange={(e)=>setAmount(e.target.value)} type="number" min="0" step="0.01" className="w-full px-3 py-2 rounded bg-slate-900 text-white" placeholder="Amount" />
            <div className="flex gap-2 mt-2">
              <button onClick={doAddFunds} className="px-3 py-1 bg-green-500 rounded text-black">Confirm</button>
              <button onClick={() => setAdding(false)} className="px-3 py-1 bg-red-600 rounded text-white">Cancel</button>
            </div>
          </div>
        )}

        <div className="mt-4">
          <h4 className="text-sm font-medium text-white">Transactions</h4>
          {txs.length === 0 ? (
            <p className="text-slate-400 text-sm mt-2">No transactions yet.</p>
          ) : (
            <ul className="mt-2 space-y-2 max-h-44 overflow-auto">
              {txs.map(tx => (
                <li key={tx.id} className="flex items-center justify-between bg-slate-900 p-2 rounded">
                  <div>
                    <div className="text-sm text-white">{tx.type === 'topup' ? 'Top up' : 'Spent'} — ${tx.amount.toFixed(2)}</div>
                    <div className="text-xs text-slate-400">{new Date(tx.date).toLocaleString()}</div>
                  </div>
                  <div className={`${tx.type === 'topup' ? 'text-green-400' : 'text-red-400'} font-semibold`}>{tx.type === 'topup' ? '+' : '-'}${tx.amount.toFixed(2)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
