import React from 'react'
import { motion } from 'framer-motion'

export default function CoffeeSteam({className=''}){
  return (
    <div className={"pointer-events-none " + className} aria-hidden>
      <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
        </defs>
        <g opacity="0.6" stroke="#fff">
          <motion.path d="M20 120 C25 80, 15 60, 30 30" strokeWidth="1.5" stroke="rgba(255,255,255,0.12)" fill="none" animate={{ translateY: [-4, -12, -4] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} />
          <motion.path d="M40 120 C45 85, 35 65, 50 35" strokeWidth="1.2" stroke="rgba(255,255,255,0.09)" fill="none" animate={{ translateY: [-2, -10, -2] }} transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut', delay: 0.2 }} />
          <motion.path d="M60 120 C65 90, 55 70, 70 40" strokeWidth="1" stroke="rgba(255,255,255,0.07)" fill="none" animate={{ translateY: [-6, -18, -6] }} transition={{ repeat: Infinity, duration: 3.6, ease: 'easeInOut', delay: 0.6 }} />
        </g>
      </svg>
    </div>
  )
}
