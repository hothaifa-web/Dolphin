import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers } from '../data/mock'

// Simple token store key
const RESET_KEY = 'password_reset_tokens_v1'

function saveTokenRecord(record){
  try{ const all = JSON.parse(localStorage.getItem(RESET_KEY)||'{}'); all[record.token]=record; localStorage.setItem(RESET_KEY, JSON.stringify(all)) }catch(e){}
}

export default function ForgotPassword(){
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [link, setLink] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e){
    e.preventDefault()
    const users = getUsers()
    const u = users.find(x=> (x.email||'').toLowerCase() === (email||'').toLowerCase())
    if(!u) return alert('No account found for that email')
    const token = Math.random().toString(36).slice(2,9)
    const record = { token, email: u.email, userId: u.id, createdAt: Date.now(), expiresAt: Date.now() + 1000*60*30 }
    saveTokenRecord(record)
    const resetLink = `${location.origin}/reset-password/${token}`
    setLink(resetLink)
    setSent(true)
    // simulate email delivery delay
    setTimeout(()=>{
      // keep displayed, do not auto-navigate so user can click link in demo
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-semibold text-center mb-2">Reset your password</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Enter the email for your account and we'll send a reset link (simulated).</p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-700">Email</span>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm p-2" />
            </label>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Send reset</button>
              <button type="button" onClick={()=>navigate('/login')} className="flex-1 border border-gray-200 py-2 rounded-lg">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="text-green-600 font-medium mb-2">Reset link generated</div>
            <div className="text-sm text-gray-500 mb-3">Use the link below to reset your password (demo).</div>
            <div className="bg-slate-100 p-3 rounded text-sm break-all">{link}</div>
            <div className="mt-4 flex gap-2">
              <button onClick={()=> navigator.clipboard && link ? navigator.clipboard.writeText(link) : alert(link)} className="px-3 py-2 bg-indigo-600 text-white rounded">Copy</button>
              <button onClick={()=> navigate('/login')} className="px-3 py-2 border rounded">Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
