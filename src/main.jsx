import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './styles/glass.css'
import { AuthProvider } from './components/AuthProvider'
import { I18nProvider } from './i18n'
import ErrorBoundary from './components/ErrorBoundary'
import { LocaleProvider } from './contexts/LocaleContext'
import { CartProvider } from './contexts/CartContext'
import * as cartService from './services/cartService'
import * as walletService from './services/walletService'
import AppEngine from './services/AppEngine'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <LocaleProvider>
          <ErrorBoundary>
            <AuthProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </AuthProvider>
          </ErrorBoundary>
        </LocaleProvider>
      </I18nProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// Global handler: listen for reorder events and populate the cart
if(typeof window !== 'undefined'){
  // expose AppEngine for debugging and global usage
  try{ window.AppEngine = AppEngine }catch(e){}
  window.addEventListener('app:reorder', (e) => {
    try{
      const order = (e && e.detail && e.detail.order) ? e.detail.order : null
      const last = order || (function(){ try{ return JSON.parse(localStorage.getItem('app_last_order_v1')) }catch(e){return null} })()
      if(!last || !Array.isArray(last.items)){
        alert('No items found in the order to reorder')
        return
      }
      cartService.addItems(last.items)
      alert('Order items added to cart')
      // navigate user to cart page
      try{ window.location.href = '/customer/cart' }catch(e){}
    }catch(err){ console.error('reorder handler error', err) }
  })

  // Bridge for external wallet updates: re-broadcast so components can reload
  window.addEventListener('app:walletUpdated', (e) => {
    // app:walletUpdated detail can include { amount, tx }
    try{
      if(e && e.detail && typeof e.detail.amount !== 'undefined'){
        walletService.setBalance(Number(e.detail.amount) || 0)
      }
      if(e && e.detail && e.detail.tx){
        walletService.addTx(e.detail.tx)
      }
      // notify components
      window.dispatchEvent(new CustomEvent('wallet:updated'))
    }catch(err){ console.error('walletUpdated handler', err) }
  })
}
