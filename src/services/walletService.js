// Simple wallet service wrapper around localStorage and events
const WALLET_KEY = 'app_wallet_balance_v1'
const TX_KEY = 'app_wallet_txs_v1'

function safeGet(key, fallback){
  try{ return JSON.parse(localStorage.getItem(key)) }catch(e){ return fallback }
}

export function getBalance(){
  try{ return Number(localStorage.getItem(WALLET_KEY) || 0) }catch(e){ return 0 }
}

export function setBalance(amount){
  try{ localStorage.setItem(WALLET_KEY, String(Number(amount) || 0)) }catch(e){ }
  window.dispatchEvent(new CustomEvent('wallet:updated'))
}

export function getTxs(){
  return safeGet(TX_KEY, []) || []
}

export function addTx(tx){
  try{
    const txs = getTxs() || []
    const next = [tx, ...txs]
    localStorage.setItem(TX_KEY, JSON.stringify(next))
    window.dispatchEvent(new CustomEvent('wallet:updated'))
    return next
  }catch(e){ return getTxs() }
}

export function addFunds(amount){
  const v = Number(amount) || 0
  if(v <= 0) return false
  const current = getBalance()
  const nextBal = +(current + v).toFixed(2)
  setBalance(nextBal)
  addTx({ id: Date.now(), type: 'topup', amount: v, date: new Date().toISOString() })
  return true
}

export function deduct(amount){
  const v = Number(amount) || 0
  const current = getBalance()
  if(v <= 0) return false
  if(current < v) return false
  const nextBal = +(current - v).toFixed(2)
  setBalance(nextBal)
  addTx({ id: Date.now(), type: 'spend', amount: v, date: new Date().toISOString() })
  return true
}

export default {
  getBalance, setBalance, getTxs, addTx, addFunds, deduct
}
