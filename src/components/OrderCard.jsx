import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

// OrderCard: luxury glassmorphism card for order item / summary
export default function OrderCard({ item, product, status, onPick, onDetails }){
  const title = (product && (product.name && product.name.ar)) || product.name || '—'

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.36 }}
      className="glass-card rounded-2xl p-4 flex flex-col gap-3 shadow-lux"
    >
      <div className="flex items-start gap-3">
        <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-white/40 flex items-center justify-center">
          <img src={product.image || 'https://via.placeholder.com/160'} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-deep-navy font-semibold text-lg leading-6">{title}</div>
              <div className="text-sm text-slate-500 mt-1">{product && product.unitType === 'weightable' ? `Weight: ${item.qty || item.quantity || 1} kg` : `Qty: ${item.qty || item.quantity || 1}`}</div>
            </div>
            <div className="text-right">
              <div className="text-deep-navy font-bold">${(product.price||0).toFixed(2)}</div>
              <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs text-white ${status==='preparing' ? 'bg-amber-400 badge-pending' : status==='processing' ? 'bg-ocean-blue badge-processing' : 'bg-slate-400'}`}>
                {status === 'preparing' ? 'قيد التجهيز' : status === 'processing' ? 'قيد التجهيز' : 'حالة'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-2">
        <button onClick={() => onPick && onPick(product)} className="btn-shine px-4 py-2 rounded-xl text-white font-semibold" style={{ background: 'linear-gradient(90deg,#0077be,#00a8ff)', boxShadow: '0 10px 30px rgba(0,119,190,0.18)' }}>
          التقاط الصنف
        </button>
        <button onClick={() => onDetails && onDetails(product)} className="px-4 py-2 rounded-xl border border-white/12 text-deep-navy bg-white/10 font-medium hover:scale-105 transition-transform">
          تفاصيل
        </button>
      </div>
    </motion.article>
  )
}

OrderCard.propTypes = {
  item: PropTypes.object,
  product: PropTypes.object,
  status: PropTypes.string,
  onPick: PropTypes.func,
  onDetails: PropTypes.func
}
