import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'

export default function OrderSimulationBox({ className = 'w-40 h-28', compact = true }){
  const navigate = useNavigate()
  const { user } = useAuth() || {}
  const [orderState, setOrderState] = useState('preparing')
  const [driverInfo, setDriverInfo] = useState(null)
  const customerMock = useMemo(()=> ({ name: (user && user.name) || 'أحمد الزبون', phone: '0912345678', location: 'شارع النصر 12' }), [user])

  return (
    <div className={`bg-white rounded-lg p-2 shadow flex items-center gap-3 ${className}`}>
      <div className="w-20 h-full rounded overflow-hidden bg-gray-100 flex items-center justify-center">
        {orderState !== 'delivered' ? (
          <div className="p-2 text-xs text-left">
            <div className="font-semibold">موقع المتجر</div>
            <div className="text-xs text-slate-500">Sample Store • Tech Store</div>
            <div className="mt-1 text-xs">● المتجر</div>
            <div className="text-xs">○ الزبون</div>
            {driverInfo && orderState !== 'preparing' && <div className="text-xs">◆ الكابتن</div>}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-1">
            <img src={user?.photo || 'https://via.placeholder.com/80'} alt="customer" className="w-10 h-10 rounded-full object-cover" />
            <div className="text-xs">
              <div className="font-semibold">{customerMock.name}</div>
              <div className="text-xs text-slate-500">{customerMock.phone}</div>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 text-xs">
        {orderState === 'preparing' && (
          <div>
            <div className="font-semibold">جارِ تحضير طلبك</div>
            <div className="text-xs text-slate-500">الوقت المقدر للتحضير: 15 دقيقة</div>
          </div>
        )}
        {orderState === 'ready' && (
          <div>
            <div className="font-semibold">الطلب جاهز للاستلام</div>
            <div className="text-xs text-slate-500">الوقت المقدر للوصول: 20 دقيقة</div>
          </div>
        )}
        {orderState === 'enroute' && driverInfo && (
          <div>
            <div className="font-semibold">الطلب في الطريق</div>
            <div className="text-xs text-slate-500">ETA: {driverInfo.eta}</div>
            <div className="mt-1 text-xs">{driverInfo.name} • {driverInfo.car}</div>
          </div>
        )}
        {orderState === 'delivered' && (
          <div>
            <div className="font-semibold">تم تسليم الطلب</div>
            <div className="text-xs text-slate-500">شكراً لك!</div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {orderState === 'preparing' && (
          <button onClick={()=> navigate('/customer/cart')} className="px-2 py-1 bg-indigo-600 text-white rounded text-xs">تعديل السلة</button>
        )}
        <div className="text-xs text-slate-400">محاكاة:</div>
        <div className="flex flex-col gap-1">
          <button onClick={()=>{ setOrderState('preparing'); setDriverInfo(null) }} className="px-2 py-1 bg-slate-100 rounded text-xs">Preparing</button>
          <button onClick={()=>{ setOrderState('ready'); setDriverInfo(null) }} className="px-2 py-1 bg-slate-100 rounded text-xs">Ready</button>
          <button onClick={()=>{ setDriverInfo({ name: 'يوسف السائق', phone: '0798765432', car: 'Toyota Yaris', plate: '12-345-678', eta: '12 mins' }); setOrderState('enroute') }} className="px-2 py-1 bg-slate-100 rounded text-xs">Enroute</button>
          <button onClick={()=>{ setOrderState('delivered') }} className="px-2 py-1 bg-slate-100 rounded text-xs">Delivered</button>
        </div>
      </div>
    </div>
  )
}
