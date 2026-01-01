import React from 'react'
import PropTypes from 'prop-types'

const STEP_ORDER = ['confirmed','preparing','on_the_way','delivered']
const STEP_LABEL = {
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  on_the_way: "On the way",
  delivered: 'Delivered'
}

export default function OrderTrackingStepper({ status = 'confirmed', timestamps = {}, driver = null, rtl = false }){
  const currentIndex = Math.max(0, STEP_ORDER.indexOf(status))

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded shadow-sm max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Order Status</h3>
        {driver && (
          <div className="text-sm text-slate-500 dark:text-slate-300">Driver: {driver.name} {driver.phone ? `• ${driver.phone}` : ''}</div>
        )}
      </div>

      <div className={`flex items-center gap-4 ${rtl ? 'flex-row-reverse' : ''}`}>
        {STEP_ORDER.map((step, idx) => {
          const done = idx <= currentIndex
          const active = idx === currentIndex
          const time = timestamps[step]
          return (
            <div key={step} className="flex-1 min-w-0">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${done ? 'bg-green-600 border-green-600 text-white' : 'bg-transparent border-slate-400 text-slate-600'}`}>
                  {done ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 5 11.586a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  ) : (
                    <span className="text-sm font-semibold">{idx+1}</span>
                  )}
                </div>
                {idx !== STEP_ORDER.length -1 && (
                  <div className={`flex-1 h-1 ${done ? 'bg-green-500' : 'bg-slate-600/30'} ${rtl ? 'mr-3' : 'ml-3'}`} />
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-sm ${active ? 'text-white bg-indigo-600 inline-block px-2 py-1 rounded' : 'text-slate-300'}`}>{STEP_LABEL[step]}</div>
                {time && <div className="text-xs text-slate-400 mt-1">{new Date(time).toLocaleString()}</div>}
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

OrderTrackingStepper.propTypes = {
  status: PropTypes.oneOf(STEP_ORDER),
  timestamps: PropTypes.object,
  driver: PropTypes.shape({ name: PropTypes.string, phone: PropTypes.string }),
  rtl: PropTypes.bool
}
