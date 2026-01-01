import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import ToastContainer from './components/ToastContainer'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import AdminOrders from './pages/AdminOrders'
import AdminRevenue from './pages/AdminRevenue'
import AdminUsers from './pages/AdminUsers'
import AdminAllUsers from './pages/AdminUsers'
import AdminProducts from './pages/AdminProducts'
import AdminStats from './pages/AdminStats'
import AdminOffers from './pages/AdminOffers'
import Invoice from './pages/Invoice'
import Customer from './pages/Customer'
import SearchUsers from './pages/SearchUsers'
import CreateStoreForm from './pages/CreateStoreForm'
import CustomerHome from './pages/CustomerHome'
import CategoryDetail from './pages/CategoryDetail'
import CustomerOrders from './pages/CustomerOrders'
import CustomerOffers from './pages/CustomerOffers'
import CustomerCart from './pages/CustomerCart'
import Coupons from './pages/Coupons'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import StorePage from './pages/StorePageNew'
import CustomerCheckout from './pages/CustomerCheckout'
import CustomerMore from './pages/CustomerMore'
import StoreDashboard from './pages/StoreDashboard'
import StoreOrders from './pages/StoreOrders'
import StoreProducts from './pages/StoreProducts'
import StoreProductDetail from './pages/StoreProductDetail'
import StoreOrderDetail from './pages/StoreOrderDetail'
import StorePicked from './pages/StorePicked'
import StorePrepared from './pages/StorePrepared'
import StoreOrderItems from './pages/StoreOrderItems'
import Driver from './pages/Driver'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  const location = useLocation()
  const navigate = useNavigate()
  const showBottomNav = location.pathname.startsWith('/customer')
  const [showSplash, setShowSplash] = useState(true)

  useEffect(()=>{
    // show splash (public/1.png) for 2s then go to login
    const t = setTimeout(()=>{
      setShowSplash(false)
      try{ navigate('/login') }catch(e){}
    }, 2000)
    return ()=> clearTimeout(t)
  }, [])
  return (
    <div className={`min-h-screen ${showBottomNav ? 'pb-20' : ''}`}> {/* pad for persistent bottom nav when shown */}
      <ToastContainer />
      {showSplash && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <img src="/1.png" alt="splash" className="w-full h-full object-cover" />
        </div>
      )}
      <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/reset-password/:token" element={<ResetPassword/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard/></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute roles={["admin"]}><AdminOrders/></ProtectedRoute>} />
      <Route path="/admin/revenue" element={<ProtectedRoute roles={["admin"]}><AdminRevenue/></ProtectedRoute>} />
      <Route path="/admin/stats" element={<ProtectedRoute roles={["admin"]}><AdminStats/></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><AdminUsers/></ProtectedRoute>} />
      <Route path="/admin/all-users" element={<ProtectedRoute roles={["admin"]}><AdminAllUsers/></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute roles={["admin"]}><AdminProducts/></ProtectedRoute>} />
      <Route path="/admin/offers" element={<ProtectedRoute roles={["admin"]}><AdminOffers/></ProtectedRoute>} />
      <Route path="/admin/search" element={<ProtectedRoute roles={["admin"]}><SearchUsers/></ProtectedRoute>} />
      <Route path="/admin/create-store" element={<ProtectedRoute roles={["admin"]}><CreateStoreForm/></ProtectedRoute>} />
      <Route path="/admin/invoice/:id" element={<ProtectedRoute roles={["admin"]}><Invoice/></ProtectedRoute>} />
      <Route path="/customer" element={<ProtectedRoute roles={["customer"]}><Navigate to="/customer/home" replace /></ProtectedRoute>} />
      <Route path="/customer/home" element={<ProtectedRoute roles={["customer"]}><CustomerHome/></ProtectedRoute>} />
      <Route path="/customer/category/:categoryId" element={<ProtectedRoute roles={["customer"]}><CategoryDetail/></ProtectedRoute>} />
      <Route path="/customer/orders" element={<ProtectedRoute roles={["customer"]}><CustomerOrders/></ProtectedRoute>} />
      <Route path="/customer/offers" element={<ProtectedRoute roles={["customer"]}><CustomerOffers/></ProtectedRoute>} />
      <Route path="/customer/coupons" element={<ProtectedRoute roles={["customer"]}><Coupons/></ProtectedRoute>} />
      <Route path="/customer/cart" element={<ProtectedRoute roles={["customer"]}><CustomerCart/></ProtectedRoute>} />
      <Route path="/customer/checkout" element={<ProtectedRoute roles={["customer"]}><CustomerCheckout/></ProtectedRoute>} />
      <Route path="/customer/store/:storeName" element={<StorePage/>} />
      <Route path="/customer/more" element={<ProtectedRoute roles={["customer"]}><CustomerMore/></ProtectedRoute>} />
      <Route path="/store" element={<ProtectedRoute roles={["store"]}><StoreDashboard/></ProtectedRoute>} />
      <Route path="/store/products" element={<ProtectedRoute roles={["store"]}><StoreProducts/></ProtectedRoute>} />
      <Route path="/store/product/:id" element={<ProtectedRoute roles={["store"]}><StoreProductDetail/></ProtectedRoute>} />
      <Route path="/store/picked" element={<ProtectedRoute roles={["store"]}><StorePicked/></ProtectedRoute>} />
      <Route path="/store/prepared" element={<ProtectedRoute roles={["store"]}><StorePrepared/></ProtectedRoute>} />
      <Route path="/store/orders" element={<ProtectedRoute roles={["store"]}><StoreOrders/></ProtectedRoute>} />
      <Route path="/store/orders/:id" element={<ProtectedRoute roles={["store"]}><StoreOrderDetail/></ProtectedRoute>} />
      <Route path="/store/orders/:id/items" element={<ProtectedRoute roles={["store"]}><StoreOrderItems/></ProtectedRoute>} />
      <Route path="/driver" element={<ProtectedRoute roles={["driver"]}><Driver/></ProtectedRoute>} />
      <Route path="*" element={<NotFound/>} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </div>
  )
}
