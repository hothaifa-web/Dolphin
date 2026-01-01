import React, { useEffect, useState } from 'react'

export default function ToastContainer(){
  const [toast, setToast] = useState(null)

  useEffect(()=>{
    function onToast(e){
      const msg = e && e.detail && e.detail.message ? e.detail.message : ''
      const timeout = (e && e.detail && e.detail.timeout) ? e.detail.timeout : 1000
      if(!msg) return
      setToast(msg)
      const id = setTimeout(()=> setToast(null), timeout)
      return () => clearTimeout(id)
    }
    window.addEventListener('app:toast', onToast)
    return ()=> window.removeEventListener('app:toast', onToast)
  }, [])

  if(!toast) return null
  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-20 z-50">
      <div className="bg-amber-500 text-white px-6 py-3 rounded shadow-lg">{toast}</div>
    </div>
  )
}
