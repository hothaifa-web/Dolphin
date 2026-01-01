import React from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

function ProductCard({product, lang='en', onAdd, onToggleWishlist, wished}){
  const { items, addItem, changeQty, removeItem } = useCart()
  const cartItem = items.find(i=> i.id === product.id)

  function handleAdd(){
    // prefer context addItem but call onAdd if provided for compatibility
    addItem(product, 1)
    if(onAdd) onAdd(product)
  }

  return (
    <motion.div layout whileHover={{ scale: 1.02 }} className="bg-[rgba(0,0,0,0.5)] rounded-lg overflow-hidden shadow text-white">
      <div className="h-40 bg-black/20 flex items-center justify-center">
        <img src={product.image} alt={product.name && product.name[lang]} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm font-semibold">{product.name?.[lang] || product.name}</div>
            <div className="text-xs text-slate-300">{product.store}</div>
          </div>
          <button onClick={() => onToggleWishlist && onToggleWishlist(product)} className="p-1 text-rose-400 hover:text-rose-300">
            <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold">${product.price}</div>
          {!cartItem ? (
            <button onClick={handleAdd} className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500">
              Add
            </button>
          ) : (
            <div className="bg-black/60 text-white rounded-lg px-3 py-2 flex items-center gap-3">
              <div>
                <div className="font-semibold">{product.name?.[lang] || product.name}</div>
                <div className="text-sm">{product.name?.[lang] || product.name}</div>
                <div className="text-sm mt-1">${Number(product.price).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e)=>{ e.stopPropagation(); changeQty(product.id, (cartItem.qty||1) - 1) }} className="px-2 py-1 bg-black/30 rounded">−</button>
                <div className="w-6 text-center">{cartItem.qty}</div>
                <button onClick={(e)=>{ e.stopPropagation(); changeQty(product.id, (cartItem.qty||1) + 1) }} className="px-2 py-1 bg-black/30 rounded">+</button>
              </div>
              <button onClick={(e)=>{ e.stopPropagation(); removeItem(product.id) }} className="ml-2 text-white bg-black/30 rounded px-2 py-1">✕</button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default React.memo(ProductCard)
