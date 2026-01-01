import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function QuickViewModal({open, product, onClose}){
  if(!open || !product) return null
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60">
      <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.95,opacity:0}} className="w-[90%] max-w-2xl bg-slate-900 glass-card rounded-xl p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <img src={product.image} alt={product.name?.en} className="w-36 h-36 object-cover rounded-lg" />
            <div>
              <h3 className="text-xl font-semibold">{product.name?.en || product.name}</h3>
              <div className="text-sm text-slate-300 mt-2">{product.description || 'No description available.'}</div>
              <div className="mt-3 text-lg font-bold text-orange-400">${product.price}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2"><X /></button>
        </div>
        <div className="mt-4">
          <div className="text-sm text-slate-400">Roast: {product.roast || 'Medium'} • Origin: {product.origin || 'Unknown'}</div>
        </div>
      </motion.div>
    </div>
  )
}
