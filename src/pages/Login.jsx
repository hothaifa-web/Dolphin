import React, { useState } from 'react'
import { useAuth } from '../components/AuthProvider'
import { useI18n } from '../i18n'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Login(){
  const { login } = useAuth()
  const { lang, setLang, t } = useI18n()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [focusField, setFocusField] = useState(null)

  async function submit(e){
    e.preventDefault()
    setErr('')
    setLoading(true)
    try{
      const res = await Promise.resolve(login({ username, password }))
      setLoading(false)
      if(res && !res.ok){ setErr('Invalid credentials') }
    }catch(e){
      setLoading(false)
      setErr('Login error')
    }
  }

  function handleSocial(provider){
    // open a popup for OAuth and listen for a postMessage from oauth-callback.html
    const w = 600, h = 700
    const left = (window.screen.width / 2) - (w / 2)
    const top = (window.screen.height / 2) - (h / 2)
    let url = '#'
    if(provider === 'Google'){
      const client = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
      url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client}&response_type=id_token&scope=openid%20email%20profile&redirect_uri=${location.origin}/oauth-callback.html&nonce=${Math.random().toString(36).slice(2)}`
    } else if(provider === 'Facebook'){
      const client = import.meta.env.VITE_FB_APP_ID || ''
      url = `https://www.facebook.com/v14.0/dialog/oauth?client_id=${client}&response_type=token&scope=email,public_profile&redirect_uri=${location.origin}/oauth-callback.html`
    }
    const popup = window.open(url, 'oauth', `width=${w},height=${h},left=${left},top=${top}`)

    function onMessage(e){
      try{
        if(!e.data) return
        const d = e.data
        if(d.type === 'oauth:result'){
          window.removeEventListener('message', onMessage)
          try{ popup.close() }catch(e){}
          // d.payload may contain id_token or access_token
          const payload = d.payload || {}
          if(payload.id_token){
            const parts = payload.id_token.split('.')
            if(parts.length >= 2){
              const raw = parts[1].replace(/-/g, '+').replace(/_/g, '/')
              const json = JSON.parse(decodeURIComponent(escape(window.atob(raw))))
              socialLogin(provider, json)
              return
            }
          }
          if(payload.access_token){
            // best-effort: call socialLogin with token present
            socialLogin(provider, { id: payload.access_token })
            return
          }
        }
      }catch(err){ console.warn(err) }
    }
    window.addEventListener('message', onMessage)
  }

  const fieldLabelClass = (field, val) => `absolute left-3 transition-all duration-150 ${focusField===field || (val||'').length>0 ? '-top-3 text-xs bg-slate-900 px-1' : 'top-3 text-sm text-slate-300'}`

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto' }}>

      {/* language toggle top-right */}
      <div className="fixed top-4 right-4 z-50">
        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/6 rounded-full px-2 py-1 text-sm">
          <button onClick={() => setLang('ar')} className={`px-2 py-0.5 rounded-full ${lang==='ar' ? 'bg-white/10 text-white' : 'text-slate-300'}`}>AR</button>
          <button onClick={() => setLang('en')} className={`px-2 py-0.5 rounded-full ${lang==='en' ? 'bg-white/10 text-white' : 'text-slate-300'}`}>EN</button>
        </div>
      </div>

      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }} className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-md bg-white/5 border border-white/6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-bl from-indigo-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">L</div>
          <h1 className="mt-4 text-3xl font-semibold text-white">{t('login') || 'Login'}</h1>
          <p className="text-sm text-slate-300 mt-1">Welcome back — sign in to continue</p>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <button onClick={() => handleSocial('Google')} className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/6 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" className="inline-block"><path fill="#EA4335" d="M24 24v8.5h11.9C33.9 36.9 29.4 39 24 39c-7.7 0-14-6.3-14-14s6.3-14 14-14c3.6 0 6.8 1.3 9.3 3.5l6.4-6.2C36.2 5.3 30.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.7-.4-4H24z"/></svg>
            <span>Continue with Google</span>
          </button>

          <button onClick={() => handleSocial('Facebook')} className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/6 text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="inline-block" xmlns="http://www.w3.org/2000/svg"><path d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.62.77-1.62 1.56v1.87h2.77l-.44 2.89h-2.33V22C18.34 21.13 22 17 22 12z" fill="#1877F2"/></svg>
            <span>Continue with Facebook</span>
          </button>
        </div>

        {/* OR separator */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-white/10 flex-1" />
          <div className="text-sm text-slate-300">OR</div>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* Email form with floating labels */}
        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <label className={fieldLabelClass('username', username)}>{t('username') || 'Username or Email'}</label>
            <input
              placeholder=" "
              value={username}
              onChange={e=>setUsername(e.target.value)}
              onFocus={()=>setFocusField('username')}
              onBlur={()=>setFocusField(null)}
              className="w-full bg-transparent border border-white/8 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <label className={fieldLabelClass('password', password)}>{t('password') || 'Password'}</label>
            <input
              placeholder=" "
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e=>setPassword(e.target.value)}
              onFocus={()=>setFocusField('password')}
              onBlur={()=>setFocusField(null)}
              className="w-full bg-transparent border border-white/8 rounded-md py-3 px-3 pr-10 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button type="button" onClick={()=>setShowPass(s=>!s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300">
              {showPass ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.58 10.58a3 3 0 0 0 4.24 4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </button>
          </div>

          {err && <div className="text-red-400 text-sm">{err}</div>}

          <div className="flex justify-end">
            <button type="button" onClick={()=>navigate('/forgot-password')} className="text-sm text-slate-300 hover:underline">Forgot Password?</button>
          </div>

          <div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-3 rounded-md">
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
              )}
              <span>{loading ? 'Signing in...' : (t('login') || 'Sign in')}</span>
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-slate-400">
          <span>Don't have an account? </span>
          <button onClick={()=>navigate('/register')} className="text-indigo-400 hover:underline">Create one</button>
        </div>
      </motion.div>
    </div>
  )
}
