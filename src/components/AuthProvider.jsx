import React, {createContext, useContext, useEffect, useState} from 'react'
import { USERS, saveUsers } from '../data/mock'
import { useNavigate } from 'react-router-dom'
import AppEngine from '../services/AppEngine'
import ProfileFormModal from './ProfileFormModal'

const AuthContext = createContext()

export function AuthProvider({children}){
  const [user, setUser] = useState(null)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  function login({username,password}){
    const id = (username || '').toString().trim().toLowerCase()
    const u = USERS.find(x=> {
      const uname = (x.username || '').toString().trim().toLowerCase()
      const email = (x.email || '').toString().trim().toLowerCase()
      return (uname === id || email === id) && x.password === password
    })
    if(!u) return {ok:false}
    // update lastLogin timestamp and persist
    try{ u.lastLogin = Date.now(); saveUsers() }catch(e){}
    setUser(u)
    try{ localStorage.setItem('auth_user', JSON.stringify(u)) }catch(e){}
    // redirect by role
    if(u.role==='admin') navigate('/admin')
    else if(u.role==='customer') navigate('/customer')
    else if(u.role==='store') navigate('/store')
    else if(u.role==='driver') navigate('/driver')
    return {ok:true}
  }

  function logout(){
    setUser(null)
    try{ localStorage.removeItem('auth_user') }catch(e){}
    navigate('/login')
  }

  function markNotificationsRead(){
    setUnreadNotifications(0)
  }

  useEffect(()=>{
    // subscribe to app events to increment unread counter
    const unsub = AppEngine.subscribe(ev => {
      if(!ev) return
      if(ev.type === 'app:newOrder' || ev.type === 'app:driverAssigned' || ev.type === 'app:financialTx'){
        setUnreadNotifications(n => n + 1)
      }
    })
    return () => unsub && unsub()
  }, [])

  function updateUser(updates){
    if(!user) return null
    const idx = USERS.findIndex(u=>u.id === user.id)
    if(idx === -1){
      // user not in USERS array (e.g. social login) — merge into current user and persist in localStorage
      const merged = { ...user, ...updates, profileComplete: true }
      setUser(merged)
      try{ localStorage.setItem('auth_user', JSON.stringify(merged)) }catch(e){}
      return merged
    }
    USERS[idx] = { ...USERS[idx], ...updates }
    try{ saveUsers() }catch(e){}
    const updated = USERS[idx]
    setUser(updated)
    try{ localStorage.setItem('auth_user', JSON.stringify(updated)) }catch(e){}
    return updated
  }

  // social login helper for popup-based OAuth flows
  async function socialLogin(provider, profile){
    try{
      // profile may be { id, email, name, picture }
      const id = profile && (profile.sub || profile.id || profile.email) ? String(profile.sub || profile.id || profile.email) : String(Date.now())
      const name = profile && (profile.name || profile.full_name || profile.given_name) || ('User ' + id)
      const email = profile && (profile.email) || ''
      // create a lightweight mock user and persist in localStorage (not modifying USERS array)
      const u = { id: id, username: email || name, role: 'customer', name, email, socialProvider: provider }
      setUser(u)
      try{ localStorage.setItem('auth_user', JSON.stringify(u)) }catch(e){}
      // navigate to customer area
      navigate('/customer')
      return u
    }catch(e){ console.warn('socialLogin failed', e); return null }
  }

  useEffect(()=>{
    // initialize auth from localStorage (simulate async)
    let mounted = true
    try{
      const raw = localStorage.getItem('auth_user')
      if(raw){ const u = JSON.parse(raw); if(mounted) setUser(u) }
    }catch(e){}
    // small delay to mimic async init
    const t = setTimeout(()=>{ if(mounted) setLoading(false) }, 60)

    // subscribe to app events to increment unread counter
    const unsub = AppEngine.subscribe(ev => {
      if(!ev) return
      if(ev.type === 'app:newOrder' || ev.type === 'app:driverAssigned' || ev.type === 'app:financialTx'){
        setUnreadNotifications(n => n + 1)
      }
    })

    return () => { mounted = false; clearTimeout(t); unsub && unsub() }
  }, [])

  if(loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30">
      <div className="p-4 rounded bg-white/90">Loading…</div>
    </div>
  )

  return (
    <AuthContext.Provider value={{user,login,logout,updateUser, socialLogin, unreadNotifications, markNotificationsRead, loading}}>
      {children}
      <ProfileFormModal />
    </AuthContext.Provider>
  )
}

export function useAuth(){return useContext(AuthContext)}
