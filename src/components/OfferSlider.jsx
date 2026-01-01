import React, { useEffect, useState, useRef } from 'react'

export default function OfferSlider({ storeName }){
  const [offers, setOffers] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(()=>{
    try{
      const approved = JSON.parse(localStorage.getItem('APPROVED_OFFERS')||'[]')
      const list = approved.filter(o => {
        if(!storeName) return true
        return !o.store || o.store === decodeURIComponent(storeName)
      })
      setOffers(list)
    }catch(e){ setOffers([]) }
  }, [storeName])

  const cards = offers.length ? offers : [null, null, null]

  function prev(){ setIndex(i => Math.max(0, i-1)) }
  function next(){ setIndex(i => Math.min(cards.length-1, i+1)) }

  const current = cards[index]

  return (
    <div className="mb-6 max-w-6xl mx-auto px-4">
      <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #d63384 60%)' }}>
        <div className="flex items-center gap-4 p-6 text-white">
          <div className="flex-1 text-center">
            <div className="text-2xl font-extrabold truncate">{current?.title || `Hot Offer #${index+1}`}</div>
            <div className="mt-2 text-sm opacity-90">{current?.subtitle || 'Free delivery on orders above $20. Limited time only.'}</div>
          </div>
          <div className="w-40 h-28 bg-white/20 rounded-lg flex-shrink-0 overflow-hidden border border-white/20">
            <img src={current?.image || 'https://via.placeholder.com/160x120'} alt="offer" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="h-12 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <button onClick={prev} aria-label="prev" className="px-2 py-1 bg-white/20 text-white rounded">‹</button>
            <div className="flex gap-2">
              {cards.map((c, i) => (
                <button key={i} onClick={()=>setIndex(i)} className={`w-2 h-2 rounded-full ${i===index ? 'bg-white' : 'bg-white/40'}`} aria-label={`page-${i}`} />
              ))}
            </div>
            <button onClick={next} aria-label="next" className="px-2 py-1 bg-white/20 text-white rounded">›</button>
          </div>
        </div>
      </div>
    </div>
  )
}
