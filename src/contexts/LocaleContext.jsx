import React from 'react'

const LocaleContext = React.createContext(null)

export function LocaleProvider({children}){
  const [dir, setDir] = React.useState(()=>{
    try{ return localStorage.getItem('APP_DIR') || 'ltr' }catch(e){return 'ltr'}
  })

  React.useEffect(()=>{
    try{ localStorage.setItem('APP_DIR', dir) }catch(e){}
    document.documentElement.dir = dir
  },[dir])

  const toggle = () => setDir(d => d === 'ltr' ? 'rtl' : 'ltr')

  return (
    <LocaleContext.Provider value={{dir, toggle}}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(){
  const ctx = React.useContext(LocaleContext)
  if(!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

export default LocaleContext
