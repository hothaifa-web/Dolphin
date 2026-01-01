// Small WebAudio-based notification tones used by the store UI
let ctx = null
function getCtx(){
  try{
    if(!ctx){
      ctx = new (window.AudioContext || window.webkitAudioContext)()
    }
    return ctx
  }catch(e){ return null }
}

function playTone(freq, duration = 200, type = 'sine', when = 0, gain = 0.08){
  const c = getCtx()
  if(!c) return
  const now = c.currentTime + when/1000
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, now)
  g.gain.setValueAtTime(0, now)
  g.gain.linearRampToValueAtTime(gain, now + 0.01)
  g.gain.linearRampToValueAtTime(0.0001, now + duration/1000)
  o.connect(g); g.connect(c.destination)
  o.start(now); o.stop(now + duration/1000 + 0.02)
}

export function playNewOrder(){
  // ascending two-tone chime
  playTone(660, 120, 'sine', 0, 0.06)
  playTone(880, 160, 'sine', 120, 0.08)
}

export function playDriverArrived(){
  // single ping
  playTone(880, 220, 'sine', 0, 0.09)
}

export function playPickedUp(){
  // three descending pings
  playTone(880, 90, 'sine', 0, 0.08)
  playTone(740, 90, 'sine', 100, 0.08)
  playTone(660, 140, 'sine', 200, 0.08)
}

export function ensureAudioContext(){
  const c = getCtx()
  if(!c) return
  if(c.state === 'suspended'){
    try{ c.resume() }catch(e){}
  }
}
