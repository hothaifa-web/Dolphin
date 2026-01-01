import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { PRODUCTS, getStats, subscribe } from '../data/mock'

export default function AdminProducts() {
  const navigate = useNavigate()
  const [productList, setProductList] = useState(PRODUCTS)
  const [stats, setStats] = React.useState(() => getStats())
  const [showProductModal, setShowProductModal] = useState(false)
  const [newProduct, setNewProduct] = useState({ name:{en:'', ar:''}, price:'', sku:'', store:'', image:'', stock: 0, region: '' })

  React.useEffect(()=>{
    const unsub = subscribe(ev => {
      if(ev.type === 'tick' || ev.type === 'order') setStats({...ev.stats})
    })
    return () => unsub()
  }, [])

  const side = [
    {label:'Dashboard',to:'/admin'},
    {label:'Orders',to:'/admin/orders'},
    {label:'Revenue',to:'/admin/revenue'},
    {label:'statistics',to:'/admin/stats'},
    {label:'Users online',to:'/admin/users'},
    {label:'Products',to:'/admin/products'},
    {label:'Create',to:'/admin/create-store'}
  ]

  const [pendingOffers, setPendingOffers] = React.useState(() => {
    try{ return JSON.parse(localStorage.getItem('pending_offers')||'[]') }catch(e){ return [] }
  })

  React.useEffect(()=>{
    const handler = setInterval(()=>{
      try{ setPendingOffers(JSON.parse(localStorage.getItem('pending_offers')||'[]')) }catch(e){}
    }, 1500)
    return ()=> clearInterval(handler)
  }, [])

  const handleEditProduct = (id) => {
    alert(`Edit product ${id} - Feature coming soon`)
  }

  const handleDeleteProduct = (id) => {
    setProductList(productList.filter(p => p.id !== id))
  }

  const handleUpdateStock = (id) => {
    setProductList(productList.map(p => 
      p.id === id ? {...p, stock: Math.max(0, p.stock - 1)} : p
    ))
  }

  const totalInventoryValue = productList.reduce((sum, p) => sum + (p.price * (p.stock || 10)), 0)

  return (
    <Layout sideItems={side}>
      <div className="mb-6">
        <button 
          onClick={() => navigate('/admin')}
          className="mb-4 px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
        >
          ← Back to Dashboard
        </button>
        <button
          onClick={() => setShowProductModal(true)}
          className="mb-4 ml-3 px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700"
        >
          Product Catalog
        </button>
        <h2 className="text-3xl font-bold text-white mb-6">All Products</h2>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded text-center">
          <p className="text-slate-400 text-sm">Total Products</p>
          <p className="text-3xl font-bold text-blue-400">{productList.length}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded text-center">
          <p className="text-slate-400 text-sm">Active Stores</p>
          <p className="text-3xl font-bold text-green-400">{stats.activeStores}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded text-center">
          <p className="text-slate-400 text-sm">Avg Price</p>
          <p className="text-3xl font-bold text-yellow-400">${(productList.reduce((sum, p) => sum + p.price, 0) / productList.length).toFixed(2)}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded text-center">
          <p className="text-slate-400 text-sm">Inventory Value</p>
          <p className="text-3xl font-bold text-purple-400">${totalInventoryValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded">
        <h3 className="text-xl font-bold text-white mb-4">Product Catalog</h3>
        {pendingOffers.length > 0 && (
          <div className="mb-4 p-3 bg-slate-900 rounded">
            <h4 className="text-white font-semibold mb-2">Pending Offers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pendingOffers.map(of => (
                <div key={of.id} className="p-3 bg-slate-800 rounded flex gap-3 items-start">
                  <img src={of.image} alt="offer" className="w-24 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-semibold text-white">{of.productName} — {of.store}</div>
                    <div className="text-slate-400 text-sm">Offer: ${of.offerPrice} — Original: ${of.originalPrice}</div>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => {
                        // approve: move to approved_offers
                        try{
                          const approved = JSON.parse(localStorage.getItem('approved_offers')||'[]')
                          approved.push({...of, status: 'approved', approvedAt: Date.now()})
                          localStorage.setItem('approved_offers', JSON.stringify(approved))
                          const rest = (JSON.parse(localStorage.getItem('pending_offers')||'[]')).filter(x=> x.id !== of.id)
                          localStorage.setItem('pending_offers', JSON.stringify(rest))
                          setPendingOffers(rest)
                          alert('Offer approved and published')
                        }catch(e){ console.error(e); alert('Could not approve') }
                      }} className="px-3 py-1 bg-green-600 text-white rounded">موافقة</button>
                      <button onClick={() => {
                        try{
                          const rest = (JSON.parse(localStorage.getItem('pending_offers')||'[]')).filter(x=> x.id !== of.id)
                          localStorage.setItem('pending_offers', JSON.stringify(rest))
                          setPendingOffers(rest)
                          alert('Offer rejected')
                        }catch(e){ console.error(e); alert('Could not reject') }
                      }} className="px-3 py-1 bg-red-600 text-white rounded">رفض</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productList.map(product => (
            <div key={product.id} className="bg-slate-900 rounded-lg p-4 hover:bg-slate-850 transition border-l-4 border-indigo-600">
              <img 
                src={product.image} 
                alt={product.name.en}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h4 className="text-white font-semibold text-sm mb-1">{product.name.en}</h4>
              <p className="text-slate-400 text-xs mb-2">{product.name.ar}</p>
              
              <div className="bg-slate-800 p-2 rounded mb-2">
                <p className="text-2xl font-bold text-green-400">${product.price.toFixed(2)}</p>
              </div>
              
              <div className="space-y-1 text-xs text-slate-400 mb-3">
                <div className="flex justify-between">
                  <span>Stock:</span>
                  <span className={`font-bold ${(product.stock || 10) > 50 ? 'text-green-400' : (product.stock || 10) > 10 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {product.stock || 10} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>SKU:</span>
                  <span className="text-white">{product.sku}</span>
                </div>
              </div>
              
              <div className="flex gap-2 text-xs">
                <button 
                  onClick={() => handleEditProduct(product.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 rounded font-semibold transition"
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => handleUpdateStock(product.id)}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-1 rounded font-semibold transition"
                  title="Decrease stock by 1"
                >
                  📦
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded font-semibold transition"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {productList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No products added yet</p>
          <button className="mt-4 px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700">
            + Add New Product
          </button>
        </div>
      )}

      {/* Product Catalog Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-11/12 max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add Product</h3>
              <button onClick={() => setShowProductModal(false)} className="px-2 py-1 text-sm text-slate-600">Close</button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={newProduct.name.en} onChange={e=>setNewProduct({...newProduct, name:{...newProduct.name, en: e.target.value}})} placeholder="Name (EN)" className="px-3 py-2 rounded bg-slate-100" />
                <input value={newProduct.name.ar} onChange={e=>setNewProduct({...newProduct, name:{...newProduct.name, ar: e.target.value}})} placeholder="الاسم (AR)" className="px-3 py-2 rounded bg-slate-100" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price: e.target.value})} placeholder="Price" className="px-3 py-2 rounded bg-slate-100" />
                <input value={newProduct.sku} onChange={e=>setNewProduct({...newProduct, sku: e.target.value})} placeholder="SKU" className="px-3 py-2 rounded bg-slate-100" />
                <input value={newProduct.stock} onChange={e=>setNewProduct({...newProduct, stock: e.target.value})} placeholder="Stock" className="px-3 py-2 rounded bg-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={newProduct.store} onChange={e=>setNewProduct({...newProduct, store: e.target.value})} placeholder="Store (optional)" className="px-3 py-2 rounded bg-slate-100" />
                <select value={newProduct.region} onChange={e=>setNewProduct({...newProduct, region: e.target.value})} className="px-3 py-2 rounded bg-slate-100">
                  <option value="">Select region (optional)</option>
                  {/* regions not imported here; leave blank or accept free text */}
                </select>
              </div>
              <input value={newProduct.image} onChange={e=>setNewProduct({...newProduct, image: e.target.value})} placeholder="Image URL (optional)" className="w-full px-3 py-2 rounded bg-slate-100" />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowProductModal(false)} className="px-3 py-2 bg-slate-300 rounded">Cancel</button>
                <button onClick={() => {
                  try{
                    const nextId = (PRODUCTS.reduce((m,p)=> Math.max(m, p.id || 0), 0) || 0) + 1
                    const p = {
                      id: nextId,
                      name: { en: String(newProduct.name.en || '').trim(), ar: String(newProduct.name.ar || '').trim() },
                      price: Number(newProduct.price) || 0,
                      sku: String(newProduct.sku || '').trim(),
                      store: String(newProduct.store || '').trim(),
                      image: String(newProduct.image || '').trim(),
                      stock: Number(newProduct.stock) || 0
                    }
                    PRODUCTS.push(p)
                    setNewProduct({ name:{en:'', ar:''}, price:'', sku:'', store:'', image:'', stock: 0, region: '' })
                    setShowProductModal(false)
                    setProductList([...PRODUCTS])
                  }catch(e){
                    console.error('add product failed', e)
                    setShowProductModal(false)
                  }
                }} className="px-3 py-2 bg-green-600 text-white rounded">Add Product</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
