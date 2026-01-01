import { useParams, useNavigate } from 'react-router-dom'
import { getOrders, getProducts, getUsers } from '../data/mock'

export default function Invoice(){
  const { id } = useParams()
  const navigate = useNavigate()
  const order = getOrders().find(o=> String(o.id) === String(id))
  if(!order) return (
    <div className="p-6">
      <h2>Invoice not found</h2>
      <button onClick={()=>navigate(-1)} className="mt-4 px-3 py-1 bg-indigo-600 text-white rounded">Back</button>
    </div>
  )

  const storeNames = [...new Set((order.items||[]).map(it=> (getProducts().find(p=>p.id===it.productId)||{}).store ))]
  const storeName = storeNames[0] || order.storeName || 'المتجر'

  const subtotal = (order.items||[]).reduce((s,it)=>{
    const p = getProducts().find(pp=>pp.id===it.productId) || {}
    const price = p.price ?? it.price ?? 0
    return s + price * (it.qty || it.quantity || 0)
  },0)

  const tax = order.tax ?? +( (subtotal * 0.05).toFixed(2) )
  const total = order.total ?? +(subtotal + tax).toFixed(2)

  const distinctCount = new Set((order.items||[]).map(it => it.productId)).size

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-4xl mx-auto bg-white shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-bold">{storeName}</div>
          <div className="text-sm font-semibold">Fast Cart</div>
        </div>

        <div className="mb-4">
          <p><strong>Order #</strong> {order.id}</p>
          <p><strong>Date:</strong> {order.date ? new Date(order.date).toLocaleString() : 'N/A'}</p>
          <p><strong>عدد الأصناف:</strong> {distinctCount}</p>
        </div>

        <table className="w-full mb-4 text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">صورة</th>
              <th className="py-2 text-left">المنتج</th>
              <th className="py-2">Qty</th>
              <th className="py-2">Price</th>
              <th className="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.items||[]).map((it,idx)=>{
              const p = getProducts().find(pp=>pp.id===it.productId) || {}
              const name = p.name?.en || p.name || `#${it.productId}`
              const qty = it.qty || it.quantity || 0
              const price = p.price ?? it.price ?? 0
              return (
                <tr key={idx} className="border-b">
                  <td className="py-2">{p.image ? <img src={p.image} alt={name} className="w-16 h-12 object-cover rounded" /> : null}</td>
                  <td className="py-2">{name}</td>
                  <td className="py-2 text-center">{qty}</td>
                  <td className="py-2 text-right">${price}</td>
                  <td className="py-2 text-right">${(price * qty).toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="text-right">
          <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
          <p><strong>Tax:</strong> ${tax}</p>
          <p className="text-xl font-bold">Total: ${total}</p>
        </div>

        <div className="mt-6 text-right">
          <button onClick={()=>window.print()} className="px-3 py-1 bg-indigo-600 text-white rounded mr-2">Print</button>
          <button onClick={()=>navigate(-1)} className="px-3 py-1 bg-slate-700 text-white rounded">Close</button>
        </div>
      </div>
    </div>
  )
}
