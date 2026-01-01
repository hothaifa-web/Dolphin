import React from 'react'

export default function NoDataFound({message='No data found'}){
  return (
    <div className="flex items-center justify-center p-6 text-slate-400">
      <div className="text-center">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="mx-auto mb-2"><path d="M3 6h18" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 6v11a3 3 0 003 3h2a3 3 0 003-3V6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <div className="text-sm">{message}</div>
      </div>
    </div>
  )
}
