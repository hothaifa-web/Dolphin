import React, { useEffect, useState, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import AppEngine from '../services/AppEngine'
import { getUsers } from '../data/mock'
import { requestPermissions, getCurrentPosition } from '../utils/capacitorGeolocation'

// simple placeholders for icons (real app should configure Leaflet icon URLs)
import L from 'leaflet'
// Configure Leaflet default icon URLs using Vite-friendly imports
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
try{
	if(L && L.Icon && L.Icon.Default){
		delete L.Icon.Default.prototype._getIconUrl
		L.Icon.Default.mergeOptions({
	iconRetinaUrl: markerIcon2x,
	iconUrl: markerIcon,
	shadowUrl: markerShadow,
		})
	}
}catch(e){
	console.warn('Leaflet icon setup failed', e)
}

export default function LiveTracking({order}){
	const [driverPos, setDriverPos] = useState((order && order.driver && order.driver.position) || { lat: 31.955, lng: 35.945 })
	const [customerPos, setCustomerPos] = useState((order && order.customer && order.customer.position) || { lat: 31.955, lng: 35.945 })
	const [driver, setDriver] = useState(order?.driver || null)
	const [LeafletComponents, setLeafletComponents] = useState(null)
	const [leafletError, setLeafletError] = useState(false)
	const [permissionDenied, setPermissionDenied] = useState(false)
	const mountedRef = useRef(true)

	// load react-leaflet dynamically so missing dependency doesn't crash app
	useEffect(()=>{
		mountedRef.current = true
		import('react-leaflet').then(mod => { if(mountedRef.current) setLeafletComponents(mod) }).catch(err => { console.warn('react-leaflet not available', err); setLeafletError(true) })
		return ()=> { mountedRef.current = false }
	},[])

	// request permission helper
	async function tryRequestPermission(){
		setPermissionDenied(false)
		try{
	await requestPermissions()
	const pos = await getCurrentPosition()
	if(pos && pos.lat && pos.lng) setCustomerPos(pos)
			setPermissionDenied(false)
		}catch(e){
			setPermissionDenied(true)
		}
	}

	useEffect(()=>{
	// initial permission attempt
	tryRequestPermission()

	// subscribe to driver:position events
		const unsub = AppEngine.subscribe(ev => {
			if(!ev) return
			if(ev.type === 'driver:position' && ev.driverId === (order && (order.driver && order.driver.id) || order.driverId)){
				setDriverPos(ev.position)
			}
			if(ev.type === 'order:updated' && ev.order && ev.order.id === (order && order.id)){
	// normalize driver object from order.driverId -> driver user
	let drv = ev.order.driver || ev.order.driverId ? (getUsers().find(u=>u.id === ev.order.driverId) || null) : null
	setDriver(drv || driver)
				setCustomerPos(ev.order.customer?.position || customerPos)
			}
		})
		return ()=> unsub && unsub()
	},[order])

	if(!order || !order.driver) return null
	const center = (driverPos && driverPos.lat && driverPos.lng) ? [driverPos.lat, driverPos.lng] : [(customerPos.lat || 31.955), (customerPos.lng || 35.945)]

	return (
		<div className="fixed inset-0 z-40 bg-white text-black p-2 touch-manage">
			<div className="max-w-md mx-auto bg-white rounded shadow h-full overflow-hidden">
				<div className="p-3 border-b flex items-center justify-between">
					<div>
						<div className="font-bold text-black">Driver on the way</div>
						<div className="text-sm font-bold text-black">{driver?.name || 'Driver'}</div>
					</div>
					<div className="flex items-center gap-2">
						<button onClick={()=> window.location.href = 'tel:' + (driver?.phone || '')} className="px-3 py-2 rounded bg-slate-100 font-bold text-black">Call</button>
					</div>
				</div>
				<div className="h-[60vh] relative">
					{leafletError ? (
						<div className="p-6 text-center">
							<div className="font-bold text-black">Map unavailable</div>
							<div className="text-sm font-bold text-black mt-2">Please install <span className="font-bold">react-leaflet</span> to enable map features.</div>
							<div className="mt-3">
								<code className="text-sm font-bold text-black">npm install react-leaflet</code>
							</div>
						</div>
					) : !LeafletComponents ? (
						<div className="p-6 text-center">
							<div className="font-bold text-black">Loading map…</div>
						</div>
					) : (
						(() => {
							try{
								const { MapContainer, TileLayer, Marker, Popup } = LeafletComponents
								return (
									<MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
										<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
										<Marker position={[customerPos.lat, customerPos.lng]}>
											<Popup><div className="font-bold text-black">Customer</div></Popup>
										</Marker>
										<Marker position={[driverPos.lat, driverPos.lng]}>
											<Popup><div className="font-bold text-black">{driver?.name || 'Driver'}</div></Popup>
										</Marker>
									</MapContainer>
								)
							}catch(e){
								console.warn('Leaflet render failed', e)
								return (
									<div className="p-6 text-center">
										<div className="font-bold text-black">Map failed to render</div>
									</div>
								)
							}
						})()
					)}
					{permissionDenied && (
						<div className="absolute inset-0 flex items-center justify-center bg-white/90">
							<div className="text-center">
								<div className="font-bold text-black">Please enable location to see your delivery on the map.</div>
								<div className="mt-3 flex gap-2 justify-center">
									<button onClick={tryRequestPermission} className="px-3 py-2 rounded bg-slate-100 font-bold text-black">Retry</button>
								</div>
							</div>
						</div>
					)}
				</div>
				<div className="p-3 border-t">
					<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-slate-200" />
						<div>
				<div className="font-bold text-black">{driver?.name || 'Delivery Partner'}</div>
				<div className="text-sm font-bold text-black">{driver?.vehicle || 'Vehicle details'}</div>
			</div>
						<div className="ml-auto">
							<button onClick={()=> window.location.href = 'tel:' + (driver?.phone || '')} className="px-3 py-2 rounded bg-emerald-100 font-bold text-black">Call</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
