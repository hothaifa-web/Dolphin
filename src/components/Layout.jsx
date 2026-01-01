import React from 'react'
import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { useI18n } from '../i18n'
import { NavLink, useNavigate } from 'react-router-dom'
import { getUsers } from '../data/mock'

export default function Layout({children,sideItems}){
  const {logout,user,updateUser} = useAuth()
  const {t, lang, setLang} = useI18n()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const [showProfileForm, setShowProfileForm] = useState(false)
  const [showAllUsers, setShowAllUsers] = useState(false)
  const [profileDraft, setProfileDraft] = useState({ name: user?.name||'', email: user?.email||'', phone: user?.phone||'' })
  const [allUsersList, setAllUsersList] = useState(() => getUsers())

  function doSearch(){
    if(!search.trim()) return
    navigate(`/admin/search?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-black p-4">
        <div className="mb-6">
          <div className="font-bold text-lg">{user?.name || 'User'}</div>
          <div className="text-sm text-slate-400">{user?.role}</div>
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin/all-users')} className="mt-2 block px-2 py-1 bg-indigo-600 text-white rounded">all users</button>
          )}
        </div>
        <nav className="space-y-2 text-sm">
          {sideItems?.map(i=> (
            i.action ? (
              <button key={i.label} onClick={i.action} className={`block w-full text-left px-2 py-2 rounded hover:bg-black/80`}>{i.label}</button>
            ) : (
              <NavLink key={i.label} to={i.to} className={({isActive})=>`block px-2 py-2 rounded hover:bg-black/80 ${isActive? 'bg-black/70':''}`}>
                {i.label}
              </NavLink>
            )
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <img src="/1__1_-removebg-preview.png" alt="Dolphin Logo" className="h-12 w-auto object-contain" />
            <div className="flex items-center gap-3">
              <button onClick={() => setShowProfileForm(true)} title="Edit profile" className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">E</button>
              <div className="text-sm leading-tight">
                <div className="text-xs text-slate-400">Delivery to</div>
                <div className="font-medium">Home — 23 Elm St <span className="text-xs">▾</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') doSearch() }} placeholder={t('search')} className="px-3 py-2 rounded bg-slate-700" />
              <button onClick={doSearch} className="px-3 py-2 bg-indigo-600 rounded text-white">Search</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={()=> navigate('/customer/coupons')} className="px-3 py-2 bg-slate-700 rounded">القسائم</button>
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="px-3 py-2 bg-slate-700 rounded">Translate</button>
            <button onClick={logout} className="px-3 py-2 bg-red-600 rounded">{t('logout')}</button>
          </div>
        </div>
        <div>{children}</div>
      </main>
      <LayoutModals showProfileForm={showProfileForm} setShowProfileForm={setShowProfileForm} profileDraft={profileDraft} setProfileDraft={setProfileDraft} updateUser={updateUser} showAllUsers={showAllUsers} setShowAllUsers={setShowAllUsers} allUsersList={allUsersList} setAllUsersList={setAllUsersList} />
    </div>
  )
}

// Below the component we add modals via small helper components in the same file for simplicity
export function LayoutModals({ showProfileForm, setShowProfileForm, profileDraft, setProfileDraft, updateUser, showAllUsers, setShowAllUsers, allUsersList, setAllUsersList }){
  if(!showProfileForm && !showAllUsers) return null
  return (
    <div>
        {showProfileForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-black/70 p-6 rounded w-11/12 max-w-md text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Edit Profile</h3>
              <button onClick={()=>setShowProfileForm(false)} className="px-3 py-1 bg-red-600 text-white rounded">Close</button>
            </div>
            <div className="space-y-2">
              <input placeholder="Name" value={profileDraft.name} onChange={e=>setProfileDraft({...profileDraft, name: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Email" value={profileDraft.email} onChange={e=>setProfileDraft({...profileDraft, email: e.target.value})} className="w-full border rounded p-2" />
              <input placeholder="Phone" value={profileDraft.phone} onChange={e=>setProfileDraft({...profileDraft, phone: e.target.value})} className="w-full border rounded p-2" />
              <div className="flex gap-2">
                <button onClick={()=>{ updateUser(profileDraft); setShowProfileForm(false) }} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                <button onClick={()=>setShowProfileForm(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAllUsers && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-black/70 p-6 rounded w-11/12 max-w-3xl max-h-[80vh] overflow-auto text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">All Users</h3>
              <button onClick={()=>setShowAllUsers(false)} className="px-3 py-1 bg-red-600 text-white rounded">Close</button>
            </div>
            <div className="space-y-2">
              {allUsersList.map(u=> (
                <div key={u.id} className="flex justify-between items-center p-2 border-b">
                  <div>
                    <div className="font-semibold">{u.name} <span className="text-sm text-slate-500">(@{u.username})</span></div>
                    <div className="text-sm text-slate-500">Status: {u.status || 'N/A'} — Last login: {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
