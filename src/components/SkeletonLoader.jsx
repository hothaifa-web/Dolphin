import React from 'react'

export default function SkeletonLoader({cols=3, rows=2}){
  const items = Array.from({length: cols*rows})
  return (
    <div className={`grid grid-cols-${cols} gap-4`}>
      {items.map((_,i)=> (
        <div key={i} className="animate-pulse bg-slate-800 rounded h-56" />
      ))}
    </div>
  )
}
