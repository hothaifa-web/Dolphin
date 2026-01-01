import React from 'react'
import { motion } from 'framer-motion'

export default function DolphinSuccess({ onDone }){
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.6, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-black/70 p-6 rounded-xl shadow-lg w-80 max-w-full text-center text-white"
      >
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="mx-auto w-40 h-40"
        >
          <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#00a1d6" />
                <stop offset="100%" stopColor="#0077be" />
              </linearGradient>
            </defs>
            <path fill="url(#g1)" d="M14 70c12-18 36-30 52-28s36 12 46 26c-8-2-18-6-30-6-14 0-26 6-36 12-8 6-20 8-32-4z"/>
            <path fill="#fff" d="M64 36c8 0 18 6 24 12-12 0-22-2-34 6 2-10 6-18 10-18z" opacity="0.9"/>
          </svg>
        </motion.div>

        <h2 className="font-bold text-lg mt-2">تم الدفع بنجاح!</h2>
        <p className="text-sm text-slate-600 mt-2">شكراً لطلبك — سنوافيك بتحديثات الطلب قريباً.</p>
        <div className="mt-4">
          <button onClick={onDone} className="px-4 py-2 bg-blue-600 text-white rounded">العودة</button>
        </div>
      </motion.div>
    </div>
  )
}
