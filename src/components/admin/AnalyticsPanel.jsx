import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title)

function makeSample(days=7){
  const today = new Date()
  return Array.from({length:days}).map((_,i)=>{
    const d = new Date(today)
    d.setDate(today.getDate() - (days-1-i))
    return {date: d.toLocaleDateString(), revenue: Math.floor(Math.random()*2000)+200, orders: Math.floor(Math.random()*40)+5}
  })
}

export default function AnalyticsPanel(){
  const [range, setRange] = React.useState({start:'', end:''})
  const [data,setData] = React.useState(()=> makeSample(14))

  const labels = data.map(d=>d.date)
  const chartData = {
    labels,
    datasets: [
      { label: 'Revenue', data: data.map(d=>d.revenue), borderColor: '#60a5fa', backgroundColor: '#60a5fa33', tension: 0.3 },
      { label: 'Orders', data: data.map(d=>d.orders), borderColor: '#34d399', backgroundColor: '#34d39933', tension: 0.3 }
    ]
  }

  const totals = data.reduce((acc,r)=>{ acc.revenue += r.revenue; acc.orders += r.orders; return acc }, {revenue:0, orders:0})

  return (
    <div className="rounded bg-slate-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Revenue & Stats</h3>
        <div className="flex gap-2">
          <input type="date" value={range.start} onChange={e=>setRange(r=>({...r,start:e.target.value}))} className="px-2 py-1 bg-slate-700 rounded" />
          <input type="date" value={range.end} onChange={e=>setRange(r=>({...r,end:e.target.value}))} className="px-2 py-1 bg-slate-700 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="p-3 bg-slate-900 rounded">Total Revenue<br/><strong>${totals.revenue}</strong></div>
        <div className="p-3 bg-slate-900 rounded">Total Orders<br/><strong>{totals.orders}</strong></div>
        <div className="p-3 bg-slate-900 rounded">Active Customers<br/><strong>{Math.floor(Math.random()*300)+20}</strong></div>
      </div>

      <div className="h-48">
        <Line data={chartData} options={{responsive:true, maintainAspectRatio:false}} />
      </div>
    </div>
  )
}
