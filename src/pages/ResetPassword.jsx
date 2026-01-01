import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { USERS, saveUsers } from '../data/mock'

const RESET_KEY = 'password_reset_tokens_v1'

function loadTokenRecord(token){
  try{ const all = JSON.parse(localStorage.getItem(RESET_KEY)||'{}'); return all[token] }catch(e){ return null }
}

export default function ResetPassword(){
  const { token } = useParams()
  const navigate = useNavigate()
  const [valid, setValid] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(()=>{
    const rec = loadTokenRecord(token)
    if(!rec) return setValid(false)
    if(rec.expiresAt && Date.now() > rec.expiresAt) return setValid(false)
    setValid(true)
    setEmail(rec.email || '')
  },[token])

  function handleSubmit(e){
    e.preventDefault()
    if(!valid) return alert('Invalid or expired token')
    // find user by email
    const idx = USERS.findIndex(u => (u.email||'').toLowerCase() === (email||'').toLowerCase())
    if(idx === -1) return alert('User not found')
    USERS[idx].password = password
    try{ saveUsers() }catch(e){}
    // remove token
    try{ const all = JSON.parse(localStorage.getItem(RESET_KEY)||'{}'); delete all[token]; localStorage.setItem(RESET_KEY, JSON.stringify(all)) }catch(e){}
    alert('Password reset — you can now login')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-semibold text-center mb-2">Set a new password</h2>
        {!valid ? (
          <div className="text-center py-8 text-slate-500">Invalid or expired reset link.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-sm text-slate-600">Resetting for: <strong>{email}</strong></div>
            <label className="block">
              <span className="text-sm text-gray-700">New Password</span>
              <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm p-2" />
            </label>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Set Password</button>
              <button type="button" onClick={()=>navigate('/login')} className="flex-1 border border-gray-200 py-2 rounded-lg">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
