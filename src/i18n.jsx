import React, {createContext, useContext, useState, useEffect} from 'react'

const translations = {
  en: {
    login: 'Login', username: 'Username or Email', password: 'Password', logout: 'Logout', dashboard: 'Dashboard', users: 'Users', orders: 'Orders', products: 'Products', reports: 'Reports', settings: 'Settings', search: 'Search', profile: 'Profile', notifications: 'Notifications', totalOrders: 'Total Orders', totalRevenue: 'Total Revenue', activeUsers: 'Active Users', activeStores: 'Active Stores', recentTransactions: 'Recent Transactions', addToCart: 'Add to cart', cart: 'Cart', createOrder: 'Create Order', accept: 'Accept', updateStatus: 'Update Status', register: 'Register', createAccount: 'Create account'
  },
  ar: {
    login: 'تسجيل الدخول', username: 'اسم المستخدم أو الإيميل', password: 'كلمة المرور', logout: 'تسجيل الخروج', dashboard: 'لوحة التحكم', users: 'المستخدمون', orders: 'الطلبات', products: 'المنتجات', reports: 'التقارير', settings: 'الإعدادات', search: 'بحث', profile: 'الملف', notifications: 'الإشعارات', totalOrders: 'إجمالي الطلبات', totalRevenue: 'إجمالي الإيراد', activeUsers: 'المستخدمون النشطون', activeStores: 'المتاجر النشطة', recentTransactions: 'المعاملات الأخيرة', addToCart: 'أضف إلى السلة', cart: 'السلة', createOrder: 'إنشاء طلب', accept: 'قبول', updateStatus: 'تحديث الحالة', register: 'إنشاء حساب', createAccount: 'إنشاء حساب'
  }
}

const I18nContext = createContext()

export function I18nProvider({children}){
  const [lang,setLang] = useState('en')

  useEffect(()=>{
    document.documentElement.lang = lang
    document.documentElement.dir = lang==='ar' ? 'rtl' : 'ltr'
  },[lang])

  const t = (key) => translations[lang][key] || key

  return <I18nContext.Provider value={{lang,setLang,t}}>{children}</I18nContext.Provider>
}

export function useI18n(){return useContext(I18nContext)}
