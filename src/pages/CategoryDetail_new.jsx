import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CATEGORIES, USERS } from '../data/mock'
import BottomNav from '../components/BottomNav'

export default function CategoryDetail() {
  const { categoryId } = useParams()
  const navigate = useNavigate()

  const category = CATEGORIES.find(c => c.id === categoryId)
  
  // الحصول على المتاجر المرتبطة بهذه الفئة
  const stores = USERS.filter(u => u.role === 'store' && u.status === 'active' && u.category === category?.name)

  if (!category) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center pb-24">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Category Not Found</h1>
        <button
          onClick={() => navigate('/customer/home')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </button>
        <BottomNav />
      </div>
    )
  }

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
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        <div className={`${category.color} rounded-xl p-8 text-center mb-8`}>
          <div className="text-7xl mb-4">{category.icon}</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h2>
          <p className="text-gray-700">
            {stores.length} {stores.length === 1 ? 'store' : 'stores'} available in this category
          </p>
        </div>

        {/* Stores Grid */}
        {stores.length > 0 ? (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Stores</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {stores.map(store => (
                <div key={store.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                  <img 
                    src={store.image} 
                    alt={store.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{store.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{store.category}</p>
                    <button onClick={() => navigate(`/customer/store/${encodeURIComponent(store.name)}`)} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                      Visit Store
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No stores available in this category yet</p>
            <button
              onClick={() => navigate('/customer/home')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Categories
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
