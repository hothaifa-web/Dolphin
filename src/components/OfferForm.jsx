import React, { useState, useEffect } from 'react'

export default function OfferForm({ storeName, onClose, onSubmitted }){
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [image, setImage] = useState('')
  const [discount, setDiscount] = useState('')
  const [region, setRegion] = useState('All')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(()=>{
    if(storeName) setTitle(`عرض من ${decodeURIComponent(storeName)}`)
  }, [storeName])

  function submit(e){
    e && e.preventDefault()
    const now = Date.now()
    const offer = {
      id: 'offer-'+now,
      title: title.trim(),
      subtitle: subtitle.trim(),
      image: image.trim() || null,
      discount: Number(discount || 0),
      region: region || 'All',
      store: storeName ? decodeURIComponent(storeName) : null,
      status: 'approved',
      createdAt: now,
      startDate: startDate || null,
      endDate: endDate || null
    }
    try{
      const approved = JSON.parse(localStorage.getItem('APPROVED_OFFERS')||'[]')
      // ensure this offer is scoped to the store only (no global flag)
      approved.unshift(offer)
      localStorage.setItem('APPROVED_OFFERS', JSON.stringify(approved))
    }catch(err){
      console.error('Failed to save offer', err)
    }
    if(onSubmitted) onSubmitted(offer)
    if(onClose) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <form onSubmit={submit} className="bg-white rounded-lg p-6 z-10 w-full max-w-xl">
        <h3 className="font-bold text-lg mb-2">أرسل عرض متجر</h3>
        <p className="text-sm text-slate-600 mb-4">أرسل العرض من عند الموظف ورح يظهر فقط بصفحة المتجر</p>
        <div className="space-y-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="عرض من Coffee Bazaar" className="w-full border px-3 py-2 rounded" required />
          <input value={subtitle} onChange={e=>setSubtitle(e.target.value)} placeholder="نص مختصر" className="w-full border px-3 py-2 rounded" />
          <input value={image} onChange={e=>setImage(e.target.value)} placeholder="رابط صورة (اختياري)" className="w-full border px-3 py-2 rounded" />
          <div className="flex gap-2 items-center">
            <input value={discount} onChange={e=>setDiscount(e.target.value)} placeholder="نسبة الخصم" type="number" min="0" max="100" className="w-1/3 border px-3 py-2 rounded" required />
            <select value={region} onChange={e=>setRegion(e.target.value)} className="flex-1 border px-3 py-2 rounded">
              <option value="All">الكل</option>
            </select>
          </div>
          <div className="flex gap-2 mt-2 items-center">
            <label className="text-sm">من:</label>
            <input value={startDate} onChange={e=>setStartDate(e.target.value)} type="date" className="border px-3 py-2 rounded" />
            <label className="text-sm">إلى:</label>
            <input value={endDate} onChange={e=>setEndDate(e.target.value)} type="date" className="border px-3 py-2 rounded" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded bg-slate-100">إلغاء</button>
            <button type="submit" className="px-3 py-2 rounded bg-indigo-600 text-white">أرسل العرض</button>
          </div>
        </div>
      </form>
    </div>
  )
}
