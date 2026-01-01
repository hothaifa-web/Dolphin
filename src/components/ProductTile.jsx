import React from 'react'
import { motion } from 'framer-motion'
import { useCart } from '../contexts/CartContext'

function ProductTile({product, lang='en', onQuickView, onAdd, wobble}){
  const { items, addItem, changeQty, removeItem } = useCart()
  const cartItem = items.find(i=> i.id === product.id)

  function handleAdd(e){ e.stopPropagation(); addItem(product, 1); if(onAdd) onAdd(product) }

  return (
    <motion.div layout initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} whileHover={{ scale: 1.03 }} transition={{duration:0.2}} className="relative bg-[rgba(0,0,0,0.5)] rounded-2xl overflow-hidden p-3 cursor-pointer text-white" style={{ border: '1px solid rgba(0,0,0,0.06)' }} onClick={() => onQuickView && onQuickView(product)} role="button" tabIndex={0}>
      <div className="h-40 w-full rounded-lg overflow-hidden mb-3">
        <img src={product?.image} alt={product?.name?.en} className="w-full h-full object-cover" />
      </div>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold">{product?.name?.[lang] || product?.name}</div>
          <div className="text-xs opacity-90">{product?.store}</div>
        </div>
        <div className="text-lg font-bold">${(product?.price||0).toFixed(2)}</div>
      </div>
      <div className="mt-3">
        {!cartItem ? (
          <button onClick={handleAdd} className="w-full px-3 py-2 bg-indigo-600 rounded">Add</button>
        ) : (
          <div className="bg-black/60 p-2 rounded flex items-center justify-between">
            <div className="text-sm">عدد العناصر: {cartItem.qty}</div>
            <div className="flex items-center gap-2">
              <button onClick={(e)=>{ e.stopPropagation(); changeQty(product.id, Math.max(0, (cartItem.qty||1) - 1)) }} className="px-2 py-1 bg-black/30 rounded">−</button>
              <div className="w-6 text-center">{cartItem.qty}</div>
              <button onClick={(e)=>{ e.stopPropagation(); changeQty(product.id, (cartItem.qty||1) + 1) }} className="px-2 py-1 bg-black/30 rounded">+</button>
              <button onClick={(e)=>{ e.stopPropagation(); removeItem(product.id) }} className="ml-2 px-2 py-1 bg-black/30 rounded">✕</button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default React.memo(ProductTile)
