import React from 'react'

export default function GlassCard({children, className = '', ...props}){
  return (
    <div className={`glass-card rounded-xl p-4 ${className}`} {...props}>
      {children}
    </div>
  )
}
