import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { getUsers } from '../data/mock'

export default function CustomerOffers() {
  const navigate = useNavigate()
  const [showOffersModal, setShowOffersModal] = useState(false)

  const offers = [
    { id: 1, title: '🎉 Get up to 50% off on selected items', discount: 'Up to 50% OFF', category: 'Selected', icon: '🏷️' },
    { id: 2, title: 'Free Delivery over $20', discount: 'Free Delivery', category: 'Delivery', icon: '🚚' },
    { id: 3, title: 'Buy 2 Get 1 Free', discount: 'Buy 2 Get 1', category: 'Bakery', icon: '🥖' }
  ]

  const stores = ['Coffee Bazaar','Fashion Hub','Books Gallery','Tech Store','Electronics','Home Décor']

  const storeUsers = getUsers().filter(u => u.role === 'store')

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24 text-black">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <h1 className="text-2xl font-bold text-black">🏷️ Special Offers</h1>
          <button onClick={() => setShowOffersModal(true)} className="ml-auto px-4 py-2 bg-yellow-400 text-black rounded shadow">Offers</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 w-full flex-1">
        <div className="mb-4 bg-white rounded p-4 shadow">
          <p className="font-semibold">Get up to 50% off on selected items. Tap "Offers" to explore deals!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
          {offers.map(offer => (
            <button key={offer.id} onClick={() => alert(`${offer.title} — ${offer.discount}`)} className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl">{offer.icon}</div>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">HOT</span>
              </div>
              <h3 className="text-lg font-bold mb-1">{offer.title}</h3>
              <p className="text-sm opacity-90">{offer.discount}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 bg-white rounded p-4 shadow">
          <h3 className="font-semibold mb-3">المتاجر</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {stores.map((s,idx) => (
              <div key={s} className="bg-slate-100 p-3 rounded flex items-center justify-between cursor-pointer" onClick={() => navigate('/customer/home')}>
                <div className="font-semibold text-red-900">{s}</div>
                <div className="text-sm text-slate-500">{(storeUsers[idx] && storeUsers[idx].category) || ''}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showOffersModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-black/70 p-6 rounded w-11/12 max-w-lg text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">🎉 Active Offers</h3>
              <button onClick={() => setShowOffersModal(false)} className="px-3 py-1 bg-red-600 text-white rounded">Close</button>
            </div>
            <div className="space-y-3">
              {offers.map(o => (
                <div key={o.id} className="p-3 border rounded bg-black/50">
                  <p className="font-semibold">{o.title}</p>
                  <p className="text-sm text-slate-300">{o.discount} — {o.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
