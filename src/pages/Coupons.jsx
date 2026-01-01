import React from 'react'
import Layout from '../components/Layout'

const SAMPLE_COUPONS = [
  { id: 'C10', title: '10% off', discount: '10%', stores: ['Coffee Bazaar','Fashion Hub'], expires: '2026-01-31' },
  { id: 'F5', title: '5 JD off', discount: '5 JOD', stores: ['Grocery Plus','المراعي'], expires: '2026-02-15' },
  { id: 'FREEDEL', title: 'Free Delivery', discount: 'Free delivery', stores: ['All stores'], expires: '2026-03-01' }
]

export default function Coupons(){
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Available Coupons</h2>
        <div className="space-y-3">
          {SAMPLE_COUPONS.map(c => (
            <div key={c.id} className="p-4 border rounded flex justify-between items-center bg-white/5">
              <div>
                <div className="font-semibold">{c.title} <span className="text-sm text-slate-400">({c.id})</span></div>
                <div className="text-sm text-slate-300">Discount: {c.discount}</div>
                <div className="text-sm text-slate-300">Stores: {c.stores.join(', ')}</div>
                <div className="text-sm text-slate-400">Expires: {c.expires}</div>
              </div>
              <div>
                <button className="px-3 py-2 bg-indigo-600 rounded text-white">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
