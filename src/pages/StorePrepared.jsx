import React from 'react'
import Layout from '../components/Layout'
import { getOrders, getProducts } from '../data/mock'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'

export default function StorePrepared(){
  const { user } = useAuth()
  const orders = React.useMemo(()=> getOrders().filter(o=> !user || o.store === user.name), [user])
  const products = React.useMemo(()=> getProducts(), [])
  const [selected, setSelected] = React.useState(null)
  const [showItemsOnly, setShowItemsOnly] = React.useState(false)
  const navigate = useNavigate()
  const preparedStatuses = ['preparing','ready_for_pickup','picked_up','fulfilled']

  const prepared = orders.filter(o => preparedStatuses.includes(o.status))

  function openOrder(o){
    setSelected(o)
  }

  function closeDetails(){ setSelected(null) }

  return (
    <Layout sideItems={[ {label:'Store', to:'/store'}, {label:'Dashboard', to:'/store'}, {label:'Products', to:'/store/products'}, {label:'Orders', to:'/store/orders'}, {label:'طلبات مُجهزة', to:'/store/prepared'} ]}>
      <h2 className="text-xl font-semibold mb-4">الطلبات المُجهزة</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {prepared.length === 0 ? (
            <div className="p-4 bg-slate-800 rounded text-slate-300">لا توجد طلبات مُجهزة</div>
          ) : (
            <div className="space-y-2">
              {prepared.map(o => (
                <div key={o.id} onClick={() => openOrder(o)} className="cursor-pointer bg-slate-900 p-3 rounded">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">طلب #{o.id}</div>
                      <div className="text-slate-400">{o.items.length} أصناف — ${o.total}</div>
                    </div>
                    <div className="text-sm text-slate-300">{o.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        <div className="col-span-1">
          {selected ? (
            <div className="p-4 bg-slate-800 rounded">
              <div className="bg-slate-700 p-3 rounded mb-3">
                <div className="font-semibold">{(selected.customerName) || ('Customer #' + (selected.userId || 'Guest'))}</div>
                <div className="text-slate-300">Order #{selected.id}</div>
              </div>

              <div className="mb-2">قيمة الطلب: <span className="font-semibold">${selected.total}</span></div>
              <div className="mb-2">هاتف العميل: <span className="font-semibold">{selected.phone || '-'}</span></div>
              <div className="mb-2">الخصم: <span className="font-semibold">{selected.discount || 0}</span></div>

              <div className="mb-3">
                <button onClick={() => setShowItemsOnly(s => !s)} className="w-full text-right px-3 py-2 bg-slate-700 rounded text-white">عرض الأصناف</button>
                {showItemsOnly && (
                  <div className="mt-2 bg-slate-900 p-2 rounded">
                    {(selected.items||[]).map((it, idx) => {
                      const prod = products.find(p=> p.id === it.productId) || {}
                      const qty = it.requestedQty || it.qty || it.quantity || 0
                      const isWeightable = prod.unitType === 'weightable'
                      return (
                        <div key={idx} className="p-2 border-b last:border-b-0 text-slate-300">{prod.name?.en || prod.name} — {isWeightable ? (`Weight: ${qty} kg`) : (`Qty: ${qty}`)}</div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button className="px-3 py-2 bg-green-600 text-white rounded">الدفع عند الخروج</button>
                <button className="px-3 py-2 bg-red-600 text-white rounded">الإبلاغ عن مشكلة</button>
                <button onClick={closeDetails} className="px-3 py-2 bg-slate-400 rounded">اغلاق</button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-800 rounded text-slate-400">
              <h3 className="text-lg font-semibold text-white mb-3">إحصائيات المتجر</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-slate-900 p-3 rounded">
                  <div className="text-slate-400 text-sm">عدد كل الطلبات</div>
                  <div className="text-2xl font-bold text-white">{orders.length}</div>
                </div>

                <div className="bg-slate-900 p-3 rounded">
                  <div className="text-slate-400 text-sm">الطلبات الملغاة</div>
                  <div className="text-2xl font-bold text-white">{orders.filter(o => o.status === 'cancelled').length}</div>
                </div>

                <div className="bg-slate-900 p-3 rounded">
                  <div className="text-slate-400 text-sm">الطلبات المُجهزة</div>
                  <div className="text-2xl font-bold text-white">{prepared.length}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
