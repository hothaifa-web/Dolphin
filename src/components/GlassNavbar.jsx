import React from 'react'
import { ShoppingCart, Menu, Search } from 'lucide-react'
import clsx from 'clsx'
import { useCart } from '../contexts/CartContext'

export default function GlassNavbar({ onOpenCart }){
  const { itemCount } = useCart()

  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-4 z-40 w-[94%] sm:w-[88%] glass-navbar rounded-xl p-3 glass-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-md bg-transparent hover:bg-white/2"><Menu /></button>
          <div className="text-lg font-semibold text-white">Mock E-Store</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-slate-800/40 rounded px-2 py-1">
            <Search className="text-slate-400" />
            <input placeholder="Search products" className="ml-2 bg-transparent outline-none text-sm text-slate-200" />
          </div>
          <button onClick={onOpenCart} className={clsx('relative inline-flex items-center gap-2 px-3 py-1 rounded-md glass-button')}> 
            <ShoppingCart />
            <span className="text-sm">Cart</span>
            {itemCount > 0 && <span className="absolute -right-2 -top-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{itemCount}</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
