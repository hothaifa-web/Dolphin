import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { USERS, saveUsers, CATEGORIES, REGIONS } from '../data/mock'

export default function CreateStoreForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    type: 'store',
    region: '',
    storeName: '',
    storeCategory: '',
    storeImage: '',
    driverPhoto: ''
  })

  // Categories list with emojis (displayed inside the 'القائمه' fieldset)
  const categories = [
    { key: 'offers', label: 'Offers & Discounts', emoji: '🏷️' },
    { key: 'restaurants', label: 'Restaurants', emoji: '🍔' },
    { key: 'accessories', label: 'Accessories & Gifts', emoji: '🎁' },
    { key: 'home', label: 'Home Supplies', emoji: '🏠' },
    { key: 'stationery', label: 'Stationery', emoji: '📝' },
    { key: 'bakery', label: 'Bakery', emoji: '🥖' },
    { key: 'delivery', label: 'Delivery Service', emoji: '🚚' },
    { key: 'sweets', label: 'Sweets & Desserts', emoji: '🍰' },
    { key: 'grocery', label: 'Grocery', emoji: '🛒' },
    { key: 'produce', label: 'Produce (Fruits & Vegetables)', emoji: '🥬' },
    { key: 'cafes', label: 'Cafés', emoji: '☕' },
    { key: 'pharmacy', label: 'Pharmacy', emoji: '💊' },
    { key: 'water', label: 'Water', emoji: '💧' }
  ]

  const villages = REGIONS

  const side = [
    {label:'Dashboard',to:'/admin'},
    {label:'Orders',to:'/admin/orders'},
    {label:'Revenue',to:'/admin/revenue'},
    {label:'statistics',to:'/admin/stats'},
    {label:'Users online',to:'/admin/users'},
    {label:'Products',to:'/admin/products'},
    {label:'Search',to:'/admin/search'},
    {label:'Create',to:'/admin/create-store'}
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({...prev, [name]: value}))
  }

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0]
    if(!f) return
    const reader = new FileReader()
    reader.onload = () => {
      // use input name to decide which field to set (storeImage or driverPhoto)
      const field = e.target.name || 'storeImage'
      setFormData(prev => ({...prev, [field]: reader.result}))
    }
    reader.readAsDataURL(f)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation: require username/password and store fields when creating a store
    if (!formData.username || !formData.password) {
      alert('الرجاء إدخال اسم المستخدم وكلمة المرور')
      return
    }

    if (formData.type === 'store') {
      if (!formData.storeName || !formData.storeCategory || !formData.region) {
        alert('الرجاء تعبئة جميع الحقول المطلوبة: اسم المتجر، التصنيف، والمنطقة')
        return
      }
    }
    if (formData.type === 'driver') {
      if (!formData.storeName || !formData.region) {
        alert('الرجاء تعبئة اسم السائق والمنطقة')
        return
      }
    }

    // Create new user/store
    const newUserId = Math.max(...USERS.map(u => u.id)) + 1
    const newUser = {
      id: newUserId,
      username: formData.username,
      password: formData.password,
      role: formData.type,
      name: formData.storeName,
      category: formData.storeCategory,
      region: formData.region,
      image: formData.type === 'driver' ? (formData.driverPhoto || `https://picsum.photos/seed/newdriver${newUserId}/200/200`) : (formData.storeImage || `https://picsum.photos/seed/newstore${newUserId}/400/300`),
      status: 'active',
      email: `${formData.username}@example.com`,
      phone: '0790000000'
    }

    // في تطبيق حقيقي، يتم إرسال البيانات للخادم
    console.log('New account created:', newUser)
    alert(`✓ ${formData.type === 'store' ? 'Store' : 'Driver'} account created successfully!\n\nUsername: ${formData.username}\nPassword: ${formData.password}`)
    // Append and persist
    USERS.push(newUser)
    try{ saveUsers() }catch(e){ /* ignore */ }
    
    // Reset form
    setFormData({
      username: '',
      password: '',
      type: 'store',
      storeName: '',
      storeCategory: '',
      region: '',
      storeImage: '',
      driverPhoto: ''
    })
  }

  return (
    <Layout sideItems={side}>
      <div className="mb-6">
        <button 
          onClick={() => navigate('/admin')}
          className="mb-4 px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-3xl font-bold text-white mb-6">➕ Create Store / Driver Account</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-slate-800 p-8 rounded">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-2 items-end">
              <div>
                <label className="block text-white font-bold mb-2">Account Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-slate-900 text-white border border-slate-700 rounded focus:border-indigo-600 focus:outline-none"
                >
                  <option value="store">🏪 Store</option>
                  <option value="driver">🚗 Driver</option>
                </select>
              </div>

              {formData.type === 'store' ? (
                <>
                  <div>
                    <label className="block text-white font-medium text-sm mb-1">القسم</label>
                    <select
                      name="storeCategory"
                      value={formData.storeCategory}
                      onChange={handleChange}
                      className="w-full px-2 py-2 text-sm bg-slate-900 text-white border border-slate-700 rounded focus:border-indigo-600 focus:outline-none"
                    >
                      <option value="">اختر القسم</option>
                      {categories.map(c => (
                        <option key={c.key} value={c.label}>{`${c.emoji} ${c.label}`}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium text-sm mb-1">المنطقه</label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full px-2 py-2 text-sm bg-slate-900 text-white border border-slate-700 rounded focus:border-indigo-600 focus:outline-none"
                    >
                      <option value="">اختر المنطقة</option>
                      {villages.map(v=> <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div />
                  <div />
                </>
              )}
            </div>

            {/* Username / Password row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-white font-medium text-sm mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 text-sm bg-slate-900 text-white border border-slate-700 rounded focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium text-sm mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 text-sm bg-slate-900 text-white border border-slate-700 rounded focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            {formData.type === 'store' && (
              <>
                {/* Store Name */}
                <div>
                  <label className="block text-white font-bold mb-2">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleChange}
                    placeholder="Enter store name"
                    className="w-full px-4 py-2 bg-slate-900 text-white border border-slate-700 rounded focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                {/* Removed duplicate large fieldsets; category and region shown compactly above */}

                {/* Store Image */}
                <div>
                  <label className="block text-white font-bold mb-2">Store Image</label>
                  <input type="file" accept="image/*" name="storeImage" onChange={handleFile} className="w-full text-sm text-slate-400" />
                </div>
              </>
            )}

            {formData.type === 'driver' && (
              <div>
                <label className="block text-white font-bold mb-2">Driver Name</label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="Enter driver name"
                  className="w-full px-4 py-2 bg-slate-900 text-white border border-slate-700 rounded focus:border-indigo-600 focus:outline-none"
                />
              </div>
            )}

            {formData.type === 'driver' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white font-medium text-sm mb-1">المنطقه</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full px-2 py-2 text-sm bg-slate-900 text-white border border-slate-700 rounded focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="">اختر المنطقة</option>
                    <option value="اللواء">اللواء</option>
                    {villages.map(v=> <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-white font-medium text-sm mb-1">صورة السائق</label>
                  <input type="file" accept="image/*" name="driverPhoto" onChange={handleFile} className="w-full text-sm text-slate-400" />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded transition mt-6"
            >
              ✓ Create {formData.type === 'store' ? 'Store' : 'Driver'} Account
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="bg-slate-800 p-8 rounded">
          <h3 className="text-xl font-bold text-white mb-4">👁️ Preview</h3>
          
          {formData.type === 'store' && (
            <div className="bg-slate-900 rounded-lg p-4">
              <img 
                src={formData.storeImage || 'https://via.placeholder.com/400x300?text=Store+Image'} 
                alt="Store"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <div>
                <h4 className="text-white font-bold text-lg">{formData.storeName || 'Store Name'}</h4>
                <p className="text-slate-400 text-sm">{formData.storeCategory || 'Category'}</p>
                {formData.region && <p className="text-slate-400 text-sm">{formData.region}</p>}
                <div className="mt-3">
                  <p className="text-slate-400 text-xs">Username: {formData.username || 'username'}</p>
                  <p className="text-green-400 text-xs mt-1 font-bold">Status: ACTIVE</p>
                </div>
              </div>
            </div>
          )}

          {formData.type === 'driver' && (
            <div className="bg-slate-900 rounded-lg p-4 text-center">
              {formData.driverPhoto ? (
                <img src={formData.driverPhoto} alt={formData.storeName || 'Driver'} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />
              ) : (
                <div className="text-4xl mb-4">🚗</div>
              )}
              <h4 className="text-white font-bold text-lg">{formData.storeName || 'Driver Name'}</h4>
              {formData.region && <p className="text-slate-400 text-sm">{formData.region}</p>}
              <p className="text-slate-400 text-sm">Delivery Driver</p>
              <div className="mt-4">
                <p className="text-slate-400 text-xs">Username: {formData.username || 'username'}</p>
                <p className="text-green-400 text-xs mt-1 font-bold">Status: ACTIVE</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
