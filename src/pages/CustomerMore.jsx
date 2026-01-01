import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import BottomNav from '../components/BottomNav'

export default function CustomerMore() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [modalType, setModalType] = React.useState(null)

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: '👤', action: () => setModalType('profile') },
    { id: 'wallet', label: 'Wallet', icon: '💰', action: () => setModalType('wallet') },
    { id: 'addresses', label: 'Saved Addresses', icon: '📍', action: () => setModalType('addresses') },
    { id: 'favorites', label: 'Favorite Stores', icon: '❤️', action: () => setModalType('favorites') },
    { id: 'help', label: 'Help & Support', icon: '🆘', action: () => setModalType('help') },
    { id: 'settings', label: 'Settings', icon: '⚙️', action: () => setModalType('settings') }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  function closeModal(){ setModalType(null) }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24 text-black">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <h1 className="text-2xl font-bold text-black">More</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 w-full flex-1">
        {/* User Info */}
        <div className="bg-white rounded-lg p-6 shadow mb-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">👤</div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Guest'}</h2>
              <p className="text-gray-600">{user?.username || 'Not logged in'}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={item.action}
              className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition ${
                index !== menuItems.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="flex-1 text-left font-medium text-gray-900">{item.label}</span>
              <span className="text-gray-400">→</span>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold transition"
        >
          Logout
        </button>
      </div>

      <BottomNav />

      {modalType && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-black/70 p-6 rounded w-11/12 max-w-md text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{modalType === 'profile' ? 'Profile' : modalType === 'addresses' ? 'Saved Addresses' : modalType === 'favorites' ? 'Favorite Stores' : modalType === 'help' ? 'Help & Support' : 'Settings'}</h3>
              <button onClick={closeModal} className="px-3 py-1 bg-red-600 text-white rounded">Close</button>
            </div>
            <div className="prose text-white">
              {modalType === 'profile' && (
                <div>
                  <p><strong>Name:</strong> {user?.name || 'Guest'}</p>
                  <p><strong>Username:</strong> {user?.username || '-'}</p>
                </div>
              )}
              {modalType === 'wallet' && (
                <div>
                  <p><strong>Wallet Balance:</strong> {Number(localStorage.getItem('app_wallet_balance_v1')||0).toFixed(2)} USD</p>
                  <p className="mt-3 text-sm text-gray-600">Top up via card or cash at delivery (demo).</p>
                </div>
              )}
              {modalType === 'addresses' && (
                <div>
                  <p>No saved addresses yet.</p>
                  <button className="mt-3 px-3 py-2 bg-blue-600 text-white rounded" onClick={() => alert('Add address flow (demo)')}>Add Address</button>
                </div>
              )}
              {modalType === 'favorites' && (
                <div>
                  <p>You have not added favorite stores.</p>
                </div>
              )}
              {modalType === 'help' && (
                <div>
                  <p>For help, email support@example.com or call 079-XXXXXXX.</p>
                </div>
              )}
              {modalType === 'settings' && (
                <div>
                  <p>Settings are not configurable in this demo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
