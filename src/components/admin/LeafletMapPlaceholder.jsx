import React from 'react'

export default function LeafletMapPlaceholder(){
  return (
    <div className="h-64 bg-slate-900 rounded flex items-center justify-center text-slate-400">
      <div className="text-center">
        <div className="mb-2">Map Placeholder</div>
        <div className="text-xs">Leaflet map goes here (add API and tiles for production)</div>
      </div>
    </div>
  )
}
