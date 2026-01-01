import React from 'react'
import Layout from '../components/Layout'
import { getOrders, subscribe, updateOrder } from '../data/mock'
import { useI18n } from '../i18n'

export default function Driver(){
  const {t} = useI18n()
  const side = [ {label:t('orders'),to:'/driver'}, {label:'Deliveries',to:'/driver/log'} ]

  const [orders, setOrders] = React.useState(() => getOrders())

  React.useEffect(()=>{
    const unsub = subscribe(ev => {
      if(ev.type === 'tick' || ev.type === 'order') setOrders([...getOrders()])
    })
    return () => unsub()
  }, [])

  function acceptFirstPending(){
    const o = getOrders().find(x=>x.status==='pending')
    if(!o) return alert('No pending orders')
    updateOrder(o.id, { status: 'accepted' })
    setOrders([...getOrders()])
    alert('Order ' + o.id + ' accepted')
  }

  return (
    <Layout sideItems={side}>
      <h2 className="text-xl font-semibold mb-4">Driver Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-800 rounded">Available orders list (mock) <button onClick={acceptFirstPending} className="ml-2 px-2 py-1 bg-green-600 rounded">{t('accept')}</button></div>
        <div className="p-4 bg-slate-800 rounded">Deliveries log and earnings (mock)</div>
      </div>
    </Layout>
  )
}
