import React, { useEffect, useState } from 'react'
import OfferForm from './OfferForm'
import { useAuth } from './AuthProvider'
import { useNavigate } from 'react-router-dom'

export default function OfferHero({ storeName, onCustomerClick }){
  const [offer, setOffer] = useState(null)
  const [openForm, setOpenForm] = useState(false)
  const { user } = useAuth() || {}
  const navigate = useNavigate()

  useEffect(()=>{
    try{
      const approved = JSON.parse(localStorage.getItem('APPROVED_OFFERS')||'[]')
      const list = approved.filter(o => {
        if(!storeName) return true
        return !o.store || o.store === decodeURIComponent(storeName)
      })
      setOffer(list.length ? list[0] : null)
    }catch(e){ setOffer(null) }
  }, [storeName])

  const bg = 'linear-gradient(90deg, #d63384 0%, #7c3aed 50%, #f97316 100%)'

  function handleClick(){
    const isStoreUser = user && user.role === 'store' && (decodeURIComponent(storeName||'') === user.username || decodeURIComponent(storeName||'') === user.name)
    if(isStoreUser){
      setOpenForm(true)
      return
    }
    // customer: call provided handler or navigate to offer category if available
    if(typeof onCustomerClick === 'function') return onCustomerClick(offer)
    if(offer && offer.category){
      navigate(`/customer/category/${encodeURIComponent(offer.category)}`)
      return
    }
    // fallback: navigate to customer home
    navigate('/customer')
  }

  return (
    <div className="max-w-6xl mx-auto mb-6 px-4">
      <div onClick={handleClick} className="rounded-2xl overflow-hidden shadow-lg cursor-pointer" style={{ background: bg }}>
        <div className="flex items-center gap-4 p-6">
          <div className="w-28 h-28 bg-white/20 rounded-lg flex-shrink-0 overflow-hidden border border-white/20">
            <img src={offer?.image || 'https://via.placeholder.com/160x160/ffffff/000000?text=Image'} alt="offer" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-white">
            <div className="text-2xl font-extrabold">{offer?.title || 'Hot Offer #2'}</div>
            <div className="mt-2 text-sm opacity-90">{offer?.subtitle || 'Free delivery on orders above $20. Limited time only.'}</div>
          </div>
        </div>
        <div className="h-12 flex items-center justify-center">
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-white/60" />
            <span className="w-2 h-2 rounded-full bg-white/40" />
            <span className="w-2 h-2 rounded-full bg-white/30" />
          </div>
        </div>
      </div>

      {openForm && <OfferForm storeName={storeName} onClose={()=> setOpenForm(false)} onSubmitted={()=>{ /* noop */ }} />}
    </div>
  )
}
