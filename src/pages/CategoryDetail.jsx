import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CATEGORIES, USERS, getProducts } from '../data/mock'
import { useCart } from '../contexts/CartContext'
import BottomNav from '../components/BottomNav'

export default function CategoryDetail() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  // allow either a known category id, or a raw category name passed from UI
  const raw = decodeURIComponent(categoryId || '')
  const rawLower = (raw || '').toString().toLowerCase()
  const category = CATEGORIES.find(c => c.id === categoryId || (c.name && (c.name === raw || c.name === decodeURIComponent(categoryId || ''))))
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/customer/home')}
            className="text-2xl hover:opacity-70 transition"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{(category && category.name) || raw}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        <div className={`${(category && category.color) || 'bg-white'} rounded-xl p-8 text-center`}>
          {/* Icon and extra subtitle removed per UI request */}

          {/* Stores in this category */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {USERS.filter(u => {
              if(u.role !== 'store') return false
              const cat = (u.category || '').toString().toLowerCase()
              const name = (u.name || '').toString().toLowerCase()
              return cat.includes(rawLower) || name.includes(rawLower)
            }).map(store => (
              <div key={store.id} className="bg-white rounded-lg p-4 shadow hover:shadow-md transition">
                <div className="h-40 rounded-lg mb-2 overflow-hidden">
                  <img src={store.image || 'https://via.placeholder.com/400x300'} alt={store.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold text-gray-800">{store.name}</h3>
                <p className="text-gray-600 text-sm">{store.email || store.phone}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => navigate(`/customer/store/${encodeURIComponent(store.name)}`)} className="px-3 py-2 bg-blue-600 text-white rounded">Visit Store</button>
                </div>
              </div>
            ))}
          </div>

          {/* If no stores, try to show matching products */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">متجر / منتجات مرتبطة</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {getProducts().filter(p => {
                const title = (p.name && typeof p.name === 'object') ? (p.name.ar || p.name.en || '') : (p.name || '')
                const catField = ((p.category||'') + '').toString().toLowerCase()
                const titleLower = (title || '').toString().toLowerCase()
                return catField.includes(rawLower) || titleLower.includes(rawLower)
              }).map(p => (
                <div key={p.id} className="bg-white rounded-lg p-3 shadow">
                  <img src={p.image || `https://source.unsplash.com/400x300/?${encodeURIComponent(p.name||p.title||'product')}`} className="w-full h-36 object-cover rounded mb-2" />
                  <div className="font-semibold text-black">{(p.name && p.name.ar) || (p.name && p.name.en) || p.name || p.title}</div>
                  <div className="text-sm text-slate-500">${p.price || 0}</div>
                  <div className="mt-2">
                    <button onClick={() => { addItem(p,1) }} className="px-3 py-1 rounded bg-indigo-600 text-white">اضف للسله</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {getProducts().filter(p => {
            const catField = ((p.category||'') + '').toString().toLowerCase()
            const title = (p.name && typeof p.name === 'object') ? (p.name.ar || p.name.en || '') : (p.name || '')
            return catField.includes(rawLower) || (title||'').toString().toLowerCase().includes(rawLower)
          }).length === 0 && (
            <div className="mt-6 text-center text-slate-600">لا توجد منتجات مطابقة للتصنيف الحالي.</div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
