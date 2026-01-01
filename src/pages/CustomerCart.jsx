import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { getUsers } from '../data/mock'
import AppEngine from '../services/AppEngine'
import { useAuth } from '../components/AuthProvider'
import { useCart } from '../contexts/CartContext'
import { useI18n } from '../i18n'

export default function CustomerCart() {
  const navigate = useNavigate()
  const { lang } = useI18n()

  const { items: cartItems, changeQty, removeItem, clearCart } = useCart()

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0)
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')
  const couponDiscount = couponApplied ? 3 : 0
  const finalTotal = Math.max(0, total - couponDiscount)

  const handleRemove = (id) => { removeItem(id) }
  const handleQtyChange = (id, newQty) => { changeQty(id, newQty) }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">🛒 Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 w-full flex-1">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/customer/home')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                  <div className="w-20 h-16 rounded overflow-hidden bg-gray-100">
                    <img src={item.image || 'https://picsum.photos/seed/p2/200/150'} alt={typeof item.name === 'object' ? (item.name[lang] || item.name.en) : item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{typeof item.name === 'object' ? (item.name[lang] || item.name.en || JSON.stringify(item.name)) : item.name}</h3>
                    <p className="text-black font-bold">${Number(item.price).toFixed(2)}</p>
                    <div className="text-sm text-gray-600">عدد العناصر: {item.qty}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQtyChange(item.id, item.qty - 1)}
                      className="px-2 py-1 bg-black text-white rounded hover:bg-gray-800"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">{item.qty}</span>
                    <button
                      onClick={() => handleQtyChange(item.id, item.qty + 1)}
                      className="px-2 py-1 bg-black text-white rounded hover:bg-gray-800"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="ml-2 bg-black text-white rounded px-2 py-1 hover:bg-gray-800"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg p-4 shadow mb-4">
                <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">رمز الخصم</label>
                <div className="flex gap-2">
                  <input value={couponCode} onChange={e=>{ setCouponCode(e.target.value); setCouponError('') }} placeholder="أدخل الكود" className="flex-1 border rounded px-3 py-2" />
                  <button onClick={() => {
                    if(couponCode === '123123'){
                      setCouponApplied(true)
                      setCouponError('')
                      try{ localStorage.setItem('coupon', JSON.stringify({ code: couponCode, applied: true })) }catch(e){}
                      alert('تم تفعيل الكوبون: 3 دنانير')
                    } else {
                      setCouponApplied(false)
                      setCouponError('كود غير صالح')
                    }
                  }} className="px-4 py-2 bg-green-600 text-white rounded">تطبيق</button>
                </div>
                {couponError && <div className="text-red-600 text-sm mt-1">{couponError}</div>}
                {couponApplied && <div className="text-green-600 text-sm mt-1">تم تطبيق الكوبون: خصم 3 دنانير</div>}
              </div>

              <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-2">
                <span>المجموع الفرعي:</span>
                <span className="text-gray-700">${total.toFixed(2)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-2">
                  <span>الخصم:</span>
                  <span className="text-red-600">- 3 دنانير</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xl font-extrabold text-gray-900 mb-4">
                <span>الإجمالي:</span>
                <span className="text-black">${finalTotal.toFixed(2)}</span>
              </div>

                <div className="flex gap-3">
                <button onClick={() => { try{ localStorage.setItem('coupon', JSON.stringify({ code: couponCode, applied: couponApplied })) }catch(e){} navigate('/customer/checkout') }} className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition">Proceed to Checkout</button>
                <button onClick={async () => {
                  // simulate placing order directly from cart
                  try{
                    const cart = cartItems
                    if(!cart || cart.length===0) return alert('Cart is empty')
                    const items = cart.map(i=> ({ productId: i.productId || i.id, quantity: i.qty }))
                    const total = cart.reduce((s,i)=> s + (i.price||0)*(i.qty||1), 0)
                    // require login check
                    const authUser = useAuth ? null : null
                    // if there's a logged-in user in localStorage try to pull an id
                    const maybeUser = (function(){ try{ const u = JSON.parse(localStorage.getItem('ecom_users')||'[]'); return null }catch(e){ return null } })()
                    // Prefer using AppEngine if available; try to place order
                    try{
                      const userId = (window.__CURRENT_USER_ID__ || (maybeUser && maybeUser.id) || 0)
                      AppEngine.placeOrder({ userId, items, total, payment:{method:'wallet'}, store: cart[0]?.store || '' })
                    }catch(e){ /* ignore */ }
                    // clear cart
                    clearCart()
                    alert('Order placed (demo). Cart cleared.')
                  }catch(e){ alert('Order failed: '+(e.message||e)) }
                }} className="flex-1 border rounded-lg py-3">Place Order (simulate)</button>
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
