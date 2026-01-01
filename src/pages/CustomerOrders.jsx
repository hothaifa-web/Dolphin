import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrders, subscribe } from '../data/mock'
import BottomNav from '../components/BottomNav'

export default function CustomerOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = React.useState(() => getOrders())
  const [selected, setSelected] = React.useState(null)

  React.useEffect(()=>{
    const unsub = subscribe(ev => {
      if(ev.type === 'tick' || ev.type === 'order' || ev.type === 'app:newOrder' || ev.type === 'app:order:update') setOrders([...getOrders()])
    })
    return () => unsub()
  }, [])

  function closeModal(){ setSelected(null) }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24 text-black">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <h1 className="text-2xl font-bold text-black">My Orders</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 w-full flex-1">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders yet</p>
            <button
              onClick={() => navigate('/customer/home')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Active Orders</h3>
              <div className="space-y-3">
                {orders.filter(o => !['delivered','cancelled'].includes(o.status)).map(order => (
                  <button key={order.id} onClick={() => setSelected(order)} className="w-full text-left bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.items.length} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-black">${order.total}</p>
                        <p className={`text-xs font-medium ${order.status === 'delivered' ? 'text-green-600' : 'text-orange-600'}`}>
                          {order.status.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Past Orders</h3>
              <div className="space-y-3">
                {orders.filter(o => ['delivered','cancelled'].includes(o.status)).map(order => (
                  <button key={order.id} onClick={() => setSelected(order)} className="w-full text-left bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.items.length} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-black">${order.total}</p>
                        <p className={`text-xs font-medium ${order.status === 'delivered' ? 'text-green-600' : 'text-red-600'}`}>
                          {order.status.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-11/12 max-w-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Order #{selected.id}</h3>
              <button onClick={closeModal} className="px-3 py-1 bg-red-600 text-white rounded">Close</button>
            </div>
            <div className="prose text-sm">
              <p><strong>Status:</strong> {selected.status}</p>
              <p><strong>Total:</strong> ${selected.total}</p>
              <h4 className="mt-3">Items</h4>
              <ul className="list-disc pl-6">
                {(selected.items||[]).map((it,idx)=> (
                  <li key={idx}>{it.productId ? `Product #${it.productId}` : it.name} — qty: {it.qty || it.quantity || 1}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
