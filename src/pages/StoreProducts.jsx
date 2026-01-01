import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getProducts, PRODUCTS, saveProducts, subscribe } from '../data/mock'
import { useAuth } from '../components/AuthProvider'
import { useNavigate, useLocation } from 'react-router-dom'

const CATEGORY_LIST_AR = [
  'الدواجن واللحوم والاسماك','مخبوزات','أطعمة طازجة','الفواكه والخضروات','المعلبات','العناية الشخصية','المستلزمات المنزلية','الطهي والخبز','منتجات الالبان والبيض','المشروبات','الوجبات الخفيفة والشوكلاته','القهوه والشاي','الاطعمه المجمده','التوابل والصلصات','التنظيف والغسيل','جاهز للاكل'
]

const SUBCATEGORIES = {
  'الدواجن واللحوم والاسماك': ['الدجاج الكامل','أجزاء الدجاج','لحم بقري','قطع السمك'],
  'مخبوزات': ['خبز','كعك','كرواسون'],
  'الفواكه والخضروات': ['تمور','فواكه','خضروات']
}

function seedJordanProductsDemo(count = 12){
  try{
    for(let i=0;i<count;i++){
      const id = 'demo-' + Date.now() + '-' + i
      const cat = CATEGORY_LIST_AR[i % CATEGORY_LIST_AR.length]
      const sub = (SUBCATEGORIES[cat] || [])[0] || ''
      PRODUCTS.push({
        id,
        name: { ar: `منتج تجريبي ${i+1}`, en: `Demo ${i+1}` },
        image: 'https://via.placeholder.com/400x300',
        price: Number((Math.random()*20+1).toFixed(2)),
        store: 'Demo Store',
        categories: [cat],
        subcategory: sub,
        active: true,
        sku: 'DEM-' + i
      })
    }
    try{ saveProducts() }catch(e){}
    try{ window.dispatchEvent(new Event('storage')) }catch(e){}
  }catch(e){ console.error(e) }
}

export default function StoreProducts(){
  const { user } = useAuth() || {}
  const navigate = useNavigate()
  const location = useLocation()
  const [items, setItems] = useState(() => getProducts().filter(p => p.store === (user?.name || 'Demo Store')))
  const [showActive, setShowActive] = useState(true)
  const [expanded, setExpanded] = useState({})
  const [expandedSub, setExpandedSub] = useState({})

  useEffect(()=>{
    const unsub = subscribe(() => setItems(getProducts().filter(p => p.store === (user?.name || 'Demo Store'))))
    return () => unsub && unsub()
  }, [user])

  function toggleActive(product){
    const idx = PRODUCTS.findIndex(p => p.id === product.id)
    if(idx === -1) return
    PRODUCTS[idx].active = !PRODUCTS[idx].active
    try{ saveProducts() }catch(e){}
  }

  const side = [ {label:'Dashboard',to:'/store'}, {label:'Products', to:'/store/products'}, {label:'Orders', to:'/store/orders'} ]

  const params = new URLSearchParams(location.search)
  const urlCat = params.get('cat')
  const urlSub = params.get('sub')

  if(urlCat && urlSub){
    const subProducts = (items || []).filter(p => ((p.categories || []).includes(urlCat)) && (p.subcategory === urlSub) && (showActive ? (p.active !== false) : (p.active === false)))
    return (
      <Layout sideItems={side}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded overflow-hidden border border-slate-700">
              <button onClick={() => setShowActive(true)} className={`px-3 py-1 text-sm ${showActive? 'bg-green-600 text-white' : 'bg-slate-800 text-white'}`}>تفعيل</button>
              <button onClick={() => setShowActive(false)} className={`px-3 py-1 text-sm ${!showActive? 'bg-red-600 text-white' : 'bg-slate-800 text-white'}`}>ايقاف</button>
            </div>
          </div>
        </div>

        <div>
          {subProducts.length === 0 ? (
            <div className="text-slate-400">لا توجد أصناف في هذه القائمة الداخلية</div>
          ) : (
            <div className="flex flex-col gap-4">
              {subProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-black/60 p-2 rounded-md">
                  <div onClick={() => navigate(`/store/product/${p.id}`)} className="flex items-center gap-2 cursor-pointer flex-1">
                    <div className="relative">
                      <img src={p.image} alt={p.name?.ar || p.name?.en || p.name} className="w-28 h-20 object-cover rounded-md" />
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/store/product/${p.id}?edit=true`) }} className="absolute top-1 left-1 bg-white/20 text-white rounded p-0.5 text-xs">✎</button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate text-sm">دجاج كامل</div>
                      <div className="text-slate-400 text-xs">الوزن التقريبي: <span className="text-white text-sm">{p.weight ?? '-'}</span></div>
                      <div className="text-slate-300 text-xs mt-1">SKU: -</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center gap-1">
                    <div className="text-green-400 text-base font-bold">$1</div>
                    <button onClick={() => toggleActive(p)} className={`px-2 py-0.5 rounded text-white text-sm ${p.active === false ? 'bg-green-600' : 'bg-red-600'}`}>{p.active === false ? 'تفعيل' : 'ايقاف'}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    )
  }

  return (
    <Layout sideItems={side}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Products — {user?.name || 'Demo Store'}</h2>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowActive(true)} className={`px-3 py-1 rounded ${showActive? 'bg-green-600 text-white' : 'bg-slate-700 text-white'}`}>تفعيل</button>
            <button onClick={() => setShowActive(false)} className={`px-3 py-1 rounded ${!showActive? 'bg-red-600 text-white' : 'bg-slate-700 text-white'}`}>مغلق</button>
            <div className="flex items-center rounded overflow-hidden border border-slate-700">
              <button onClick={() => setShowActive(true)} className={`px-3 py-1 text-sm ${showActive? 'bg-green-600 text-white' : 'bg-slate-800 text-white'}`}>تفعيل</button>
              <button onClick={() => setShowActive(false)} className={`px-3 py-1 text-sm ${!showActive? 'bg-red-600 text-white' : 'bg-slate-800 text-white'}`}>ايقاف</button>
            </div>
          </div>
          <button onClick={() => { seedJordanProductsDemo(12); setItems(getProducts().filter(p => p.store === (user?.name || 'Demo Store'))) }} className="px-3 py-2 bg-yellow-500 text-black rounded">Generate Demo Products</button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-slate-300 mb-2">التصنيفات</div>
        <div className="flex flex-col gap-2">
          {(CATEGORY_LIST_AR || []).map(cat => {
            const catProducts = (items || []).filter(p => ((p.categories || []).includes(cat)) && (showActive ? (p.active !== false) : (p.active === false)))
            return (
              <div key={cat} className="bg-slate-800 rounded overflow-hidden">
                <button onClick={() => setExpanded(exp => ({ ...exp, [cat]: !exp[cat] }))} className="w-full text-right p-3 flex justify-between items-center">
                  <div className="text-white font-semibold">{cat}</div>
                  <div className="text-slate-300 text-sm">{catProducts.length} صنف</div>
                </button>
                {expanded[cat] && (
                  <div className="p-3 border-t border-slate-700">
                    {(SUBCATEGORIES[cat] || []).length > 0 ? (
                      <div className="mb-3 flex flex-col gap-2">
                        {(SUBCATEGORIES[cat] || []).map(sub => {
                          const subCount = catProducts.filter(p => (p.subcategory || '') === sub).length
                          const isOpen = expandedSub[cat] && expandedSub[cat][sub]
                          return (
                            <div key={sub}>
                              <div className="flex gap-2">
                                <button onClick={() => navigate(`/store/products?cat=${encodeURIComponent(cat)}&sub=${encodeURIComponent(sub)}`)} className={`flex-1 text-right px-3 py-2 rounded text-sm ${isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-white'}`}>
                                  <div className="flex justify-between items-center">
                                    <div className="truncate">{sub}</div>
                                    <div className="text-slate-300 text-sm">{subCount} صنف</div>
                                  </div>
                                </button>
                                <button onClick={() => setExpandedSub(es => ({ ...es, [cat]: { ...(es[cat]||{}), [sub]: !((es[cat]||{})[sub]) } }))} className={`px-2 py-2 rounded ${isOpen ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-white'}`}>
                                  {isOpen ? '−' : '+'}
                                </button>
                              </div>
                              {isOpen && (
                                <div className="mt-2 ml-4 border-l border-slate-700 pl-3">
                                  {subCount === 0 ? (
                                    <div className="text-slate-400 text-sm">لا توجد أصناف</div>
                                  ) : (
                                    <div className="flex flex-col gap-2">
                                              {catProducts.filter(p => (p.subcategory||'')===sub).map(p => (
                                                <div key={p.id} className="flex items-center justify-between bg-slate-900 p-2 rounded">
                                                  <div className="flex items-center gap-2">
                                                    <img src={p.image} alt={p.name?.ar||p.name?.en||p.name} className="w-10 h-8 object-cover rounded" />
                                                    <div className="text-sm text-white truncate">دجاج كامل</div>
                                                  </div>
                                                  <div className="flex items-center gap-3">
                                                    <div className="text-slate-300 text-sm">$1</div>
                                                    <button onClick={() => toggleActive(p)} className={`px-2 py-1 rounded text-white text-sm ${p.active === false ? 'bg-green-600' : 'bg-red-600'}`}>{p.active === false ? 'تفعيل' : 'ايقاف'}</button>
                                                  </div>
                                                </div>
                                              ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      catProducts.length === 0 ? (
                        <div className="text-slate-400">لا توجد أصناف معروضة لهذه الفئة</div>
                      ) : (
                        <div className="grid grid-cols-3 gap-4">
                          {catProducts.map(p => (
                            <div key={p.id} className="bg-slate-900 p-3 rounded">
                              <img onClick={() => navigate(`/store/product/${p.id}`)} src={p.image} alt={p.name?.ar || p.name?.en || p.name} className="w-full h-24 object-cover rounded mb-2 cursor-pointer" />
                              <div className="font-semibold text-white">دجاج كامل</div>
                              <div className="text-slate-400 text-sm">SKU: -</div>
                              <div className="text-green-400 text-lg font-bold">$1</div>
                              <div className="mt-2">
                                <button onClick={() => toggleActive(p)} className={`px-2 py-1 rounded text-white text-sm ${p.active === false ? 'bg-green-600' : 'bg-red-600'}`}>{p.active === false ? 'تفعيل' : 'ايقاف'}</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
