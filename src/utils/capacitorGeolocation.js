// Wrapper that uses Capacitor Geolocation plugin when available,
// and falls back to navigator.geolocation for browsers.
// Exports: requestPermissions(), getCurrentPosition()

export async function requestPermissions(){
  try{
    const mod = await import('@capacitor/geolocation')
    if(mod && mod.Geolocation && typeof mod.Geolocation.requestPermissions === 'function'){
      try{ const res = await mod.Geolocation.requestPermissions(); return res }catch(e){ return { location: 'denied' } }
    }
  }catch(e){ /* not available, fall through */ }
  // browser has no explicit permission request API beyond getCurrentPosition call
  return { location: 'prompt' }
}

export async function getCurrentPosition(options = { enableHighAccuracy: true, timeout: 10000 }){
  try{
    const mod = await import('@capacitor/geolocation')
    if(mod && mod.Geolocation && typeof mod.Geolocation.getCurrentPosition === 'function'){
      const pos = await mod.Geolocation.getCurrentPosition(options)
      return { lat: pos.coords.latitude, lng: pos.coords.longitude }
    }
  }catch(e){ /* plugin not available or failed; fallback */ }

  return new Promise((resolve, reject) => {
    if(!navigator.geolocation) return reject(new Error('Geolocation not available'))
    navigator.geolocation.getCurrentPosition((p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }), (err) => reject(err), options)
  })
}
