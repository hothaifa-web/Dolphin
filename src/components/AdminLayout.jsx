import React from 'react'

export default function AdminLayout({ children, sideItems = [] }){
	return (
		<div className="admin-app" style={{display:'flex',minHeight:'100vh'}}>
			<aside className="admin-sidebar" style={{width:220,padding:16,background:'#0f172a',color:'#cbd5e1'}}>
				<div style={{display:'flex',gap:8,alignItems:'center',marginBottom:12}}>
					<img src="/1.png" alt="logo" style={{width:36,height:36,objectFit:'cover',opacity:0.95}} />
					<div>
						<div style={{fontWeight:700}}>Admin</div>
						<div style={{fontSize:12,color:'#94a3b8'}}>Dashboard</div>
					</div>
				</div>
				<nav style={{display:'flex',flexDirection:'column',gap:6}}>
					{ (sideItems && sideItems.length ? sideItems : [
						{ label: 'Dashboard', to: '/admin' },
						{ label: 'Orders', to: '/admin/orders' },
						{ label: 'Users', to: '/admin/users' },
						{ label: 'Products', to: '/admin/products' }
					]).map(item => (
						<a key={item.to || item.label} href={item.to || '#'} style={{color:'#e2e8f0',textDecoration:'none',padding:'6px 8px',borderRadius:6,display:'block'}}>{item.label}</a>
					))}
				</nav>
			</aside>

			<div className="admin-main" style={{flex:1,padding:20,background:'#0b1220',color:'#fff'}}>
				<header style={{height:56,display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
					<div style={{fontSize:18,fontWeight:700}}>Admin</div>
					<div style={{opacity:0.8,fontSize:13}}>Welcome</div>
				</header>
				<main>
					{children}
				</main>
			</div>
		</div>
	)
}

