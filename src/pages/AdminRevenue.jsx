import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getStats, subscribe } from '../data/mock'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function AdminRevenue() {
  const navigate = useNavigate()
  const [filterMonth, setFilterMonth] = useState('All')

  const side = [
    {label:'Dashboard',to:'/admin'},
    {label:'Orders',to:'/admin/orders'},
    {label:'Revenue',to:'/admin/revenue'},
    {label:'statistics',to:'/admin/stats'},
    {label:'Users online',to:'/admin/users'},
    {label:'Products',to:'/admin/products'},
    {label:'Create',to:'/admin/create-store'}
  ]

  const lineData = {
    labels:['Jan','Feb','Mar','Apr','May','Jun'],
    datasets:[
      {
        label:'Monthly Revenue',
        data:[1200,1900,3000,2500,3800,4200],
        borderColor:'#10b981',
        backgroundColor:'#10b98133',
        tension:0.4
      }
    ]
  }

  const [stats, setStats] = React.useState(() => getStats())
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState('')
  const [detailedOpen, setDetailedOpen] = useState(false)

  React.useEffect(()=>{
    const unsub = subscribe(ev => {
      if(ev.type === 'tick' || ev.type === 'order'){
        setStats({...ev.stats})
      }
    })
    return () => unsub()
  }, [])

  const avgOrderValue = (stats.totalOrders ? (stats.totalRevenue / stats.totalOrders) : 0).toFixed(2)

  function shortRevenue(value){
    try{
      const n = Math.max(0, Math.floor(Number(value) || 0))
      if(n < 1000) return n.toLocaleString()
      const s = String(n)
      const len = s.length
      const first3 = Number(s.slice(0,3))
      const zeros = len - 3
      const v = first3 * Math.pow(10, zeros)
      return v.toLocaleString()
    }catch(e){ return value }
  }

  const handleExportReport = () => {
    try {
      const reportHtml = `
        <html>
          <head>
            <title>Revenue Report</title>
            <meta charset="utf-8" />
            <style>
              body{ font-family: Arial, Helvetica, sans-serif; padding:24px; color:#111 }
              h1{ font-size:24px; margin-bottom:8px }
              .meta{ margin-bottom:16px; color:#444 }
              table{ width:100%; border-collapse:collapse; margin-top:12px }
              th,td{ padding:8px; border:1px solid #ddd; text-align:left }
              th{ background:#f4f4f4 }
              .big{ font-size:20px; font-weight:700 }
            </style>
          </head>
          <body>
            <h1>Revenue Report</h1>
            <div class="meta">Generated: ${new Date().toLocaleString()}</div>

            <div>
              <p class="big">Total Revenue: $${Number(stats.totalRevenue || 0).toLocaleString()}</p>
              <p class="big">Total Orders: ${Number(stats.totalOrders || 0).toLocaleString()}</p>
              <p class="big">Avg Order Value: $${avgOrderValue}</p>
            </div>

            <h3 style="margin-top:18px">Top Summary</h3>
            <table>
              <thead>
                <tr><th>Metric</th><th>Value</th></tr>
              </thead>
              <tbody>
                <tr><td>Orders / Day (est.)</td><td>${(stats.totalOrders/30).toFixed(1)}</td></tr>
                <tr><td>Revenue / Day (est.)</td><td>$${(stats.totalRevenue/30).toFixed(2)}</td></tr>
                <tr><td>Active Stores</td><td>${stats.activeStores}</td></tr>
                <tr><td>Active Users</td><td>${stats.activeUsers}</td></tr>
              </tbody>
            </table>

          </body>
        </html>
      `

      const w = window.open('', '_blank', 'noopener,noreferrer')
      if (!w) {
        alert('Unable to open print window — please allow popups for this site.')
        return
      }
      w.document.open()
      w.document.write(reportHtml)
      w.document.close()
      // Wait for content to render then call print
      setTimeout(() => {
        try { w.focus(); w.print(); } catch (e) { console.warn('print failed', e) }
      }, 300)
    } catch (err) {
      console.error(err)
      alert('Failed to generate report')
    }
  }

  const handleFilterData = (month) => {
    setFilterMonth(month)
  }

  function openStatDetail(type){
    setModalType(type)
    setModalOpen(true)
  }

  function closeModal(){ setModalOpen(false); setModalType('') }

  function handleViewDetailedReport(){ setDetailedOpen(true) }
  function closeDetailed(){ setDetailedOpen(false) }

  // Build monthly stats from sample line data and current stats
  const numericAvg = stats.totalOrders ? (stats.totalRevenue / Math.max(1, stats.totalOrders)) : (parseFloat(avgOrderValue) || 100)
  const monthlyStats = lineData.labels.map((m, idx) => {
    const revenue = Number(lineData.datasets[0].data[idx] || 0)
    const orders = Math.max(1, Math.round(revenue / (numericAvg || 100)))
    const avg = orders ? (revenue / orders) : 0
    return { month: m, revenue, orders, avg }
  })
  const filteredMonthly = filterMonth === 'All' ? monthlyStats : monthlyStats.filter(x => x.month === filterMonth)

  return (
    <Layout sideItems={side}>
      <div className="mb-6">
        <button 
          onClick={() => navigate('/admin')}
          className="mb-4 px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
        >
          ← Back to Dashboard
        </button>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-white">Revenue Analytics</h2>
          <button 
            onClick={handleExportReport}
            className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700 font-bold"
          >
            📥 Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <button onClick={() => openStatDetail('revenue')} className="bg-slate-800 p-6 rounded text-left hover:shadow-lg transition">
          <p className="text-slate-400 text-sm mb-2">Total Revenue</p>
          <p className="text-4xl font-bold text-green-400">${shortRevenue(stats.totalRevenue)}</p>
        </button>
        <button onClick={() => openStatDetail('orders')} className="bg-slate-800 p-6 rounded text-left hover:shadow-lg transition">
          <p className="text-slate-400 text-sm mb-2">Total Orders</p>
          <p className="text-4xl font-bold text-blue-400">{stats.totalOrders}</p>
        </button>
        <button onClick={() => openStatDetail('avg')} className="bg-slate-800 p-6 rounded text-left hover:shadow-lg transition">
          <p className="text-slate-400 text-sm mb-2">Avg Order Value</p>
          <p className="text-4xl font-bold text-yellow-400">${avgOrderValue}</p>
        </button>
      </div>

      <div className="mb-6">
        <label className="text-white font-bold mb-2 block">Filter by Month:</label>
        <div className="flex gap-2 flex-wrap">
          {['All','Jan','Feb','Mar','Apr','May','Jun'].map(month => (
            <button
              key={month}
              onClick={() => handleFilterData(month)}
              className={`px-4 py-2 rounded font-bold transition ${filterMonth === month ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Revenue Trend</h3>
        <Line data={lineData} options={{responsive:true, maintainAspectRatio:true}} />

        <div className="mt-4 bg-slate-900 rounded p-3">
          <h4 className="text-white font-bold mb-2">Monthly Statistics</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-300">
                  <th className="py-2">Month</th>
                  <th className="py-2">Revenue</th>
                  <th className="py-2">Orders</th>
                  <th className="py-2">Avg Order</th>
                </tr>
              </thead>
              <tbody>
                {filteredMonthly.map(row => (
                  <tr key={row.month} className="border-t border-slate-700">
                    <td className="py-2 text-white">{row.month}</td>
                    <td className="py-2 text-green-300">${row.revenue.toLocaleString()}</td>
                    <td className="py-2 text-white">{row.orders}</td>
                    <td className="py-2 text-yellow-300">${row.avg.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded">
          <h3 className="text-xl font-bold text-white mb-4">Top Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Orders per Day:</span>
              <span className="text-white font-bold">{(stats.totalOrders/30).toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Revenue per Day:</span>
              <span className="text-white font-bold">${(stats.totalRevenue/30).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Stores:</span>
              <span className="text-white font-bold">{stats.activeStores}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Users:</span>
              <span className="text-white font-bold">{stats.activeUsers}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded">
          <h3 className="text-xl font-bold text-white mb-4">Growth Analysis</h3>
          <div className="space-y-3">
            <div>
              <p className="text-slate-400 mb-1">Month-over-Month Growth</p>
              <div className="bg-slate-900 rounded p-2">
                <p className="text-green-400 font-bold">↑ 12.5%</p>
              </div>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Customer Satisfaction</p>
              <div className="bg-slate-900 rounded p-2">
                <p className="text-blue-400 font-bold">★★★★★ (4.8/5)</p>
              </div>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Delivery Success Rate</p>
              <div className="bg-slate-900 rounded p-2">
                <p className="text-yellow-400 font-bold">98.2%</p>
              </div>
            </div>
            <button 
              onClick={handleViewDetailedReport}
              className="w-full mt-3 px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700 font-bold transition"
            >
              📋 View Detailed Report
            </button>
          </div>
        </div>
      </div>
      {detailedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white text-black max-w-4xl w-full mx-4 rounded p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Detailed Revenue Report</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="px-3 py-1 bg-green-600 text-white rounded">Print</button>
                <button onClick={closeDetailed} className="px-3 py-1 bg-slate-700 text-white rounded">Close</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-600"><th className="py-2">Month</th><th className="py-2">Revenue</th><th className="py-2">Orders</th><th className="py-2">Avg Order</th></tr>
                </thead>
                <tbody>
                  {monthlyStats.map(r => (
                    <tr key={r.month} className="border-t"><td className="py-2">{r.month}</td><td className="py-2">${r.revenue.toLocaleString()}</td><td className="py-2">{r.orders}</td><td className="py-2">${r.avg.toFixed(2)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white text-black max-w-2xl w-full mx-4 rounded p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{modalType === 'revenue' ? 'Revenue Details' : modalType === 'orders' ? 'Orders Details' : 'Avg Order Value Details'}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => { window.print() }} className="px-3 py-1 bg-green-600 text-white rounded">Print</button>
                <button onClick={closeModal} className="px-3 py-1 bg-slate-700 text-white rounded">Close</button>
              </div>
            </div>
            <div>
              {modalType === 'revenue' && (
                <div>
                  <p className="text-sm text-slate-600 mb-2">Total revenue for the selected period and summary breakdown.</p>
                  <p className="font-bold text-lg">${Number(stats.totalRevenue || 0).toLocaleString()}</p>
                  <table className="w-full mt-4 border-collapse">
                    <thead><tr><th className="text-left">Metric</th><th className="text-left">Value</th></tr></thead>
                    <tbody>
                      <tr><td className="py-1">Revenue / Day (est.)</td><td className="py-1">${(stats.totalRevenue/30).toFixed(2)}</td></tr>
                      <tr><td className="py-1">Top Month (sample)</td><td className="py-1">June</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
              {modalType === 'orders' && (
                <div>
                  <p className="text-sm text-slate-600 mb-2">Total orders and per-day estimate.</p>
                  <p className="font-bold text-lg">{stats.totalOrders}</p>
                  <ul className="list-disc ml-5 mt-3 text-sm text-slate-700">
                    <li>Orders / Day (est.): {(stats.totalOrders/30).toFixed(1)}</li>
                    <li>Pending Orders: {stats.pendingOrders || 0}</li>
                  </ul>
                </div>
              )}
              {modalType === 'avg' && (
                <div>
                  <p className="text-sm text-slate-600 mb-2">Average order value across all orders.</p>
                  <p className="font-bold text-lg">${avgOrderValue}</p>
                  <p className="mt-3 text-sm">This is total revenue divided by total orders.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
