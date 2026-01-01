import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { USERS, saveUsers, getOrders } from '../data/mock'
import AppEngine from '../services/AppEngine'
import * as walletService from '../services/walletService'

export default function AdminUsers() {
  const navigate = useNavigate()
  const [userList, setUserList] = useState(USERS)
  const [selectedUser, setSelectedUser] = useState(null)

  const side = [
    {label:'Dashboard',to:'/admin'},
    {label:'Orders',to:'/admin/orders'},
    {label:'Revenue',to:'/admin/revenue'},
    {label:'statistics',to:'/admin/stats'},
    {label:'Users online',to:'/admin/users'},
    {label:'Products',to:'/admin/products'},
    {label:'Create',to:'/admin/create-store'}
  ]

  const handleBlockUser = (id) => {
    // mutate master USERS array and persist
    const idx = USERS.findIndex(u=>u.id===id)
    if(idx !== -1){
      USERS[idx].status = USERS[idx].status === 'active' ? 'blocked' : 'active'
      try{ saveUsers() }catch(e){}
      setUserList([...USERS])
    }
  }

  const handleDeleteUser = (id) => {
    const idx = USERS.findIndex(u=>u.id===id)
    if(idx !== -1){
      USERS.splice(idx,1)
      try{ saveUsers() }catch(e){}
      setUserList([...USERS])
    }
  }

  const customers = userList.filter(u => u.role === 'customer')
  const stores = userList.filter(u => u.role === 'store')
  const drivers = userList.filter(u => u.role === 'driver')
  const admins = userList.filter(u => u.role === 'admin')

  const UserCard = ({ user }) => (
    <div className={`p-4 rounded transition ${user.status === 'blocked' ? 'bg-red-900 opacity-75' : 'bg-slate-900 hover:bg-slate-800'}`}>
      <p className="text-white font-semibold">{user.name}</p>
      <p className="text-slate-400 text-sm">@{user.username}</p>
      {user.email && <p className="text-slate-400 text-xs">{user.email}</p>}
      {user.phone && <p className="text-slate-400 text-xs">{user.phone}</p>}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => handleBlockUser(user.id)}
          className={`flex-1 px-2 py-1 rounded text-xs font-bold ${user.status === 'active' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
        >
          {user.status === 'active' ? 'حظر' : 'إلغاء الحظر'}
        </button>
        <button
          onClick={() => setSelectedUser(user)}
          className="flex-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs font-bold text-white"
        >
          كشف حساب
        </button>
        <button
          onClick={() => handleDeleteUser(user.id)}
          className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-bold text-white"
        >
          🗑️ حذف
        </button>
      </div>
      <p className={`text-xs mt-2 font-bold ${user.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
        {(user.status || 'unknown').toString().toUpperCase()}
      </p>
    </div>
  )

  function closeAccountModal(){ setSelectedUser(null) }

  function renderAccountModal(){
    if(!selectedUser) return null
    const orders = getOrders().filter(o => o.userId === selectedUser.id)
    const cancelled = orders.filter(o => o.status === 'cancelled')
    const txs = AppEngine.getFinancialTxs ? AppEngine.getFinancialTxs(selectedUser.id) : []
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 text-black dark:text-white p-6 rounded w-11/12 max-w-4xl max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">سجل العميل — {selectedUser.name}</h3>
            <div className="flex items-center gap-2">
              <button onClick={closeAccountModal} className="px-3 py-1 bg-red-600 text-white rounded">Close</button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-1">
              <div className="w-36 h-36 rounded overflow-hidden bg-slate-100 mb-3">
                {selectedUser.photo ? <img src={selectedUser.photo} alt="avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">👤</div>}
              </div>
              <p className="text-sm">Username: @{selectedUser.username}</p>
              {selectedUser.email && <p className="text-sm">Email: {selectedUser.email}</p>}
              {selectedUser.phone && <p className="text-sm">Phone: {selectedUser.phone}</p>}
              {selectedUser.age && <p className="text-sm">Age: {selectedUser.age}</p>}
              {selectedUser.gender && <p className="text-sm">Gender: {selectedUser.gender}</p>}
              {selectedUser.address && <p className="text-sm">Address: {selectedUser.address}</p>}
            </div>
            <div className="col-span-2">
              <p className="mb-3">Total orders: {orders.length} — Cancelled: {cancelled.length}</p>
              <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">Financial Log</h4>
                {txs.length === 0 && <p className="text-slate-400">No transactions for this user.</p>}
                <div className="space-y-2">
                  {txs.map(tx => (
                    <div key={tx.id} className="p-2 bg-slate-100 rounded flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{tx.type} — ${tx.amount}</div>
                        <div className="text-sm text-slate-500">{new Date(tx.date).toLocaleString()}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => {
                          alert('Reconciled (mock)')
                        }} className="px-2 py-1 bg-indigo-600 text-white rounded text-xs">Reconcile</button>
                        <button onClick={() => {
                          const amt = Number(tx.amount) || 0
                          if(amt <= 0) return alert('Invalid amount')
                          walletService.addFunds(amt)
                          AppEngine.addFinancialTx(selectedUser.id, { id: Date.now(), userId: selectedUser.id, type: 'refund', amount: amt, date: new Date().toISOString(), meta: { by: 'admin' } })
                          alert('Refund issued (mock)')
                        }} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Refund</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-bold mb-2">Orders</h4>
                {orders.map(o => (
                  <div key={o.id} className="p-3 bg-slate-100 rounded">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">Order #{o.id} — ${o.total}</p>
                        <p className="text-sm">Status: {o.status}</p>
                        {o.cancelReason && <p className="text-sm text-red-600">Cancelled reason: {o.cancelReason}</p>}
                      </div>
                      <div className="text-right text-sm">
                        <p>Payment: {o.payment?.method || 'N/A'}</p>
                        <p>Paid: {(o.payment && (o.payment.method || o.paid)) || o.status === 'delivered' ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
        <h2 className="text-3xl font-bold text-white mb-6">All Users</h2>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded text-center">
          <p className="text-slate-400 text-sm">Customers</p>
          <p className="text-3xl font-bold text-blue-400">{customers.length}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded text-center">
          <p className="text-slate-400 text-sm">Stores</p>
          <p className="text-3xl font-bold text-green-400">{stores.length}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded text-center">
          <p className="text-slate-400 text-sm">Drivers</p>
          <p className="text-3xl font-bold text-orange-400">{drivers.length}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded text-center">
          <p className="text-slate-400 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-purple-400">{userList.length}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Customers */}
        {customers.length > 0 && (
          <div className="bg-slate-800 p-6 rounded">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">👤</span> Customers ({customers.length})
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {customers.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {/* Stores */}
        {stores.length > 0 && (
          <div className="bg-slate-800 p-6 rounded">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🏪</span> Stores ({stores.length})
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {stores.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {/* Drivers */}
        {drivers.length > 0 && (
          <div className="bg-slate-800 p-6 rounded">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🚗</span> Drivers ({drivers.length})
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {drivers.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
