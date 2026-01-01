import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/customer/home' },
    { id: 'orders', label: 'Orders', icon: '📦', path: '/customer/orders' },
    { id: 'offers', label: 'Offers', icon: '🏷️', path: '/customer/offers' },
    { id: 'cart', label: 'Cart', icon: '🛒', path: '/customer/cart' },
    { id: 'more', label: 'More', icon: '⋯', path: '/customer/more' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around items-center z-40">
      {navItems.map(item => {
        const isActive = location.pathname === item.path
        return (
          <motion.button
            key={item.id}
            onClick={() => navigate(item.path)}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: isActive ? 1.06 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition ${
              isActive
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </motion.button>
        )
      })}
    </nav>
  )
}
