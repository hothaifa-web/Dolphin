import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { USERS, saveUsers } from '../data/mock'
// Render standalone registration page without global Layout

function validateEmail(email){
  return /\S+@\S+\.\S+/.test(email)
}

function passwordStrength(pw){
  let score = 0
  if(!pw) return {score, label:'', color:'bg-gray-400'}
  if(pw.length >= 8) score++
  if(/[A-Z]/.test(pw)) score++
  if(/[0-9]/.test(pw)) score++
  if(/[^A-Za-z0-9]/.test(pw)) score++
  const label = score <= 1 ? 'Weak' : score === 2 ? 'Medium' : 'Strong'
  const color = score <= 1 ? 'bg-red-500' : score === 2 ? 'bg-yellow-400' : 'bg-green-400'
  return {score, label, color}
}

export default function Register(){
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: account, 2: details

  // Step 1
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  // Step 2
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('customer')
  const [terms, setTerms] = useState(false)

  const passInfo = useMemo(()=> passwordStrength(password), [password])
  const emailValid = useMemo(()=> validateEmail(email), [email])
  const passwordsMatch = password && (password === confirm)

  function handleSocial(provider){
    alert(`Social auth (${provider}) is not connected in mock.`)
  }

  function goNext(){
    if(!emailValid) return alert('Enter a valid email')
    if(password.length < 6) return alert('Password too short')
    setStep(2)
  }

  function submit(){
    if(!name) return alert('Enter name')
    if(!terms) return alert('Please agree to Terms & Conditions')
    if(!passwordsMatch) return alert('Passwords do not match')
    // Create user in mock USERS and persist
    try{
      const nextId = (USERS && USERS.length) ? Math.max(...USERS.map(u=>u.id)) + 1 : Date.now()
      const newUser = {
        id: nextId,
        username: email, // use email as username for simplicity
        password,
        role: role || 'customer',
        name,
        phone,
        email,
        status: 'active'
      }
      USERS.push(newUser)
      try{ saveUsers() }catch(e){}
      alert('Registration successful — you can now sign in')
      navigate('/login')
    }catch(e){
      console.error('Register error', e)
      alert('Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 bg-slate-900">
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.35}} className="w-full max-w-4xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-xl shadow-xl overflow-hidden flex">
          {/* Illustration / left column (hidden on small screens) */}
          <div className="hidden lg:block lg:w-1/2 bg-[url('/public/food-illustration.jpg')] bg-cover bg-center"></div>

          {/* Form column */}
          <div className="w-full lg:w-1/2 p-8">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.05}}>
              <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
              <p className="text-slate-400 mb-6">Two quick steps to get started — choose a role and finish your profile.</p>

              {/* Social buttons */}
              <div className="flex gap-3 mb-4">
                <button onClick={()=>handleSocial('Google')} className="flex-1 px-3 py-2 bg-white/5 text-white rounded flex items-center justify-center gap-2 hover:bg-white/10 transition">
                  <img src="/logo-google.png" alt="Google" className="w-5 h-5"/> Sign up with Google
                </button>
                <button onClick={()=>handleSocial('Facebook')} className="px-3 py-2 bg-blue-700 text-white rounded flex items-center gap-2 hover:brightness-95 transition">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.5 9.88v-6.99H8.9v-2.9h1.6V9.3c0-1.6.94-2.5 2.38-2.5.69 0 1.42.12 1.42.12v1.56h-.8c-.79 0-1.03.49-1.03.99v1.18h1.76l-.28 2.9h-1.48v6.99A10 10 0 0022 12z"/></svg>
                  Facebook
                </button>
              </div>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-700" />
                <div className="text-slate-400 text-sm">or</div>
                <div className="flex-1 h-px bg-slate-700" />
              </div>

              <motion.form onSubmit={(e)=>{ e.preventDefault(); step===1?goNext():submit() }} className="space-y-4">
                {step === 1 && (
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Email</label>
                    <div className="relative">
                      <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full px-4 py-3 bg-slate-900 text-white rounded" placeholder="you@domain.com" />
                      <div className="absolute right-3 top-3">
                        {email ? (emailValid ? <span className="text-green-400">✓</span> : <span className="text-red-400">✕</span>) : null}
                      </div>
                    </div>

                    <label className="block text-sm text-slate-300 mt-3 mb-2">Password</label>
                    <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full px-4 py-3 bg-slate-900 text-white rounded" placeholder="Choose a strong password" />
                    <div className="mt-2 h-2 w-full bg-slate-700 rounded overflow-hidden">
                      <div className={`h-2 ${passInfo.color} rounded`} style={{width: `${(passInfo.score/4)*100}%`}} />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <div>Password strength: <span className="text-white">{passInfo.label || '—'}</span></div>
                      <div>{password.length >= 8 ? <span className="text-green-400">8+ chars</span> : <span className="text-slate-500">8+ chars</span>}</div>
                    </div>

                    <label className="block text-sm text-slate-300 mt-3 mb-2">Confirm Password</label>
                    <input value={confirm} onChange={(e)=>setConfirm(e.target.value)} type="password" className="w-full px-4 py-3 bg-slate-900 text-white rounded" placeholder="Repeat your password" />
                    <div className="text-xs mt-1">{confirm ? (passwordsMatch ? <span className="text-green-400">Passwords match</span> : <span className="text-red-400">Passwords do not match</span>) : null}</div>

                    <div className="flex justify-between items-center mt-4">
                      <button type="button" onClick={()=>navigate('/login')} className="text-sm text-slate-400 hover:underline">Already have an account?</button>
                      <button type="submit" className="px-4 py-2 bg-indigo-600 rounded text-white">Next</button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <motion.div initial={{x:20,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:0.25}}>
                    <label className="block text-sm text-slate-300 mb-2">Full name</label>
                    <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-4 py-3 bg-slate-900 text-white rounded" placeholder="Your name" />

                    <label className="block text-sm text-slate-300 mt-3 mb-2">Phone</label>
                    <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full px-4 py-3 bg-slate-900 text-white rounded" placeholder="Optional phone number" />

                    <label className="block text-sm text-slate-300 mt-4 mb-2">Choose role</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={()=>setRole('customer')} className={`p-3 rounded border ${role==='customer' ? 'border-indigo-500 bg-indigo-600/10' : 'border-transparent bg-slate-900'} transition`}>👤 Customer</button>
                      <button type="button" onClick={()=>setRole('driver')} className={`p-3 rounded border ${role==='driver' ? 'border-indigo-500 bg-indigo-600/10' : 'border-transparent bg-slate-900'} transition`}>🚴 Driver</button>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={terms} onChange={(e)=>setTerms(e.target.checked)} className="w-4 h-4" />
                        <span className="text-sm text-slate-300">I agree to the <button onClick={()=>alert('Show T&C (mock)')} className="underline">Terms & Conditions</button></span>
                      </label>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                      <button type="button" onClick={()=>setStep(1)} className="px-4 py-2 bg-slate-700 rounded text-white">Back</button>
                      <button type="submit" className="px-4 py-2 bg-green-500 rounded text-white">Create account</button>
                    </div>
                  </motion.div>
                )}
              </motion.form>
            </motion.div>
          </div>
        </motion.div>
    </div>
  )
}

