import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthProvider'

export default function ProfileFormModal(){
  const { user, updateUser } = useAuth()
  const [open, setOpen] = useState(false)
  const [photo, setPhoto] = useState(user?.photo || '')
  const [name, setName] = useState(user?.name || '')
  const [age, setAge] = useState(user?.age || '')
  const [address, setAddress] = useState(user?.address || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [gender, setGender] = useState(user?.gender || '')
  const fileRef = useRef(null)

  useEffect(()=>{
    if(user){
      const ok = user && user.profileComplete && user.name && user.phone && user.age && user.address && user.gender && user.photo
      if(!ok) setOpen(true)
      else setOpen(false)
    }
  }, [user])

  useEffect(()=>{
    setPhoto(user?.photo || '')
    setName(user?.name || '')
    setAge(user?.age || '')
    setAddress(user?.address || '')
    setPhone(user?.phone || '')
    setGender(user?.gender || '')
  }, [user])

  if(!open) return null

  function onSubmit(e){
    e.preventDefault()
    const payload = { photo, name, age, address, phone, gender, profileComplete: true }
    try{ updateUser(payload) }catch(e){ console.warn(e) }
    setOpen(false)
  }

  function onFile(e){
    const f = e.target.files && e.target.files[0]
    if(!f) return
    const reader = new FileReader()
    reader.onload = ev => setPhoto(ev.target.result)
    reader.readAsDataURL(f)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <form onSubmit={onSubmit} className="bg-black/70 p-6 rounded-lg w-full max-w-md text-white">
        <h3 className="text-lg font-semibold mb-3">أكمل بيانات حسابك</h3>

        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
              {photo ? (
                <img src={photo} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-3xl">👤</div>
              )}
            </div>
            <button type="button" onClick={()=>fileRef.current && fileRef.current.click()} className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-1 shadow border border-white/20">
              ✎
            </button>
            <input ref={fileRef} onChange={onFile} accept="image/*" type="file" className="hidden" />
          </div>
          <div className="flex-1">
            <div className="mb-2">
              <label className="text-sm">الاسم الكامل</label>
              <input value={name} onChange={e=>setName(e.target.value)} className="w-full mt-1 px-3 py-2 rounded bg-black/40" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm">العمر</label>
                <input value={age} onChange={e=>setAge(e.target.value)} className="w-full mt-1 px-3 py-2 rounded bg-black/40" />
              </div>
              <div>
                <label className="text-sm">رقم الهاتف</label>
                <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full mt-1 px-3 py-2 rounded bg-black/40" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <label className="text-sm">مكان السكن</label>
          <input value={address} onChange={e=>setAddress(e.target.value)} className="w-full mt-1 px-3 py-2 rounded bg-black/40" />
        </div>
        <div className="mt-2">
          <label className="text-sm">الجنس</label>
          <select value={gender} onChange={e=>setGender(e.target.value)} className="w-full mt-1 px-3 py-2 rounded bg-black/40">
            <option value="">اختر</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
            <option value="other">آخر</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">تأكيد</button>
        </div>
      </form>
    </div>
  )
}
