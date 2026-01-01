import React from 'react'
import PropTypes from 'prop-types'

export default function EnhancedStoreCard({ store = {}, onClick = ()=>{}, rtl = false }){
  const name = store.name || store.storeName || 'Store'
  const image = store.image || store.logo || `https://picsum.photos/seed/${encodeURIComponent(name)}/400/300`
  const rating = (store.rating != null) ? Number(store.rating).toFixed(1) : (store.demoRating || '4.5')
  const deliveryTime = store.deliveryTime || store.prepRange || '20-30'
  const fee = (store.deliveryFee != null) ? Number(store.deliveryFee).toFixed(2) : (store.deliveryFeeText || '1.50')

  return (
    <div onClick={onClick} className="bg-white dark:bg-slate-800 rounded overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-40 object-cover" />
        <div className={`absolute top-2 ${rtl ? 'left-2' : 'right-2'} bg-black/60 text-white text-xs px-2 py-1 rounded`}>{deliveryTime} min</div>
      </div>
      <div className="p-3 flex items-start justify-between">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{name}</h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69L9.05 2.927z"/></svg>
              <span>{rating}</span>
            </div>
            <div>•</div>
            <div>{`Delivery: $${fee}`}</div>
          </div>
        </div>
        <div className="text-right text-sm text-slate-400">
          <div className="font-semibold text-slate-900 dark:text-white">{store.category || '—'}</div>
        </div>
      </div>
    </div>
  )
}

EnhancedStoreCard.propTypes = {
  store: PropTypes.object,
  onClick: PropTypes.func,
  rtl: PropTypes.bool
}
