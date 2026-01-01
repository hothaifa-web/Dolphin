import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppEngine from '../services/AppEngine'
import { useAuth } from '../components/AuthProvider'
import { useCart } from '../contexts/CartContext'
import OfferHero from '../components/OfferHero'
import OfferSlider from '../components/OfferSlider'

const CART_KEY = 'cart'

function readCart(){
	import React from 'react'

	export default function StorePage(){
	  return (
		<div className="p-6">
		  <div className="max-w-4xl mx-auto text-center">
			<h2 className="text-xl font-semibold">Store page temporarily disabled</h2>
			<p className="text-sm text-slate-500">This page was replaced temporarily to fix syntax errors — restore the original logic later.</p>
		  </div>
		</div>
	  )
	}
						<h2 className="text-xl font-bold mb-4 text-black">{group.category}</h2>
						<div className="flex flex-wrap -mx-2">
							{group.items.map((p) => (
								<article key={p.id} className="bg-white rounded-2xl p-3 shadow m-2 w-[calc(50%-0.5rem)] md:w-[calc(33%-0.5rem)] lg:w-[calc(25%-0.5rem)]">
									<div className="flex items-center gap-3">
										<img src={p.image} className="w-20 h-20 object-cover rounded" />
										<div className="flex-1">
											<div className="font-medium">{p.title}</div>
											<div className="text-sm text-gray-500">{p.price} USD</div>
										</div>
										<div>
											<button onClick={() => addToCart(p)} className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
										</div>
									</div>
								</article>
							))}
						</div>
					</section>
				))}

				<div style={{ height: 120 }} />
			</main>

			{cart.items.length > 0 && (
				<div className="fixed bottom-4 left-0 right-0 flex justify-center">
					<div className="bg-white rounded-3xl shadow p-3 max-w-5xl w-full mx-4 flex items-center justify-between">
						<div>
							<div className="text-sm text-gray-500">{cart.items.length} items</div>
							<div className="font-bold text-black">${cart.items.reduce((s,i)=>s+i.qty*i.price,0).toFixed(2)}</div>
						</div>
						<div className="flex gap-3">
							<button onClick={() => navigate('/customer/cart')} className="px-4 py-2 rounded-lg border">View cart</button>
							<button onClick={handleCheckout} className="px-4 py-2 rounded-lg bg-green-600 text-white">Checkout</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
							</div>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div ref={cartRef} className="relative">
							<button onClick={()=>{}} className="bg-indigo-600 text-white px-4 py-2 rounded-2xl shadow">Cart</button>
							{itemCount > 0 && <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{itemCount}</div>}
						</div>
					</div>
				</div>
				<div className="overflow-x-auto bg-white border-t">
					<div className="max-w-5xl mx-auto px-4 py-2 flex gap-3 items-center">
						{grouped.map(g => (
							<button key={g.category} onClick={()=>scrollToCategory(g.category)} className="whitespace-nowrap px-3 py-1 rounded-full text-sm bg-slate-100 hover:bg-slate-200">{g.category}</button>
						))}
					</div>
				</div>
			</header>

			<main className="max-w-5xl mx-auto px-4 py-6">
				{loading ? (
					<div className="space-y-4">
						{[1,2,3].map(i=> (
							<div key={i} className="grid grid-cols-2 gap-4">
								<div className="h-28 bg-slate-200 animate-pulse rounded-2xl" />
								<div className="h-28 bg-slate-200 animate-pulse rounded-2xl" />
							</div>
						))}
					</div>
				) : (
					<div className="space-y-8">
						{grouped.map(group => (
							<section key={group.category} data-category={group.category} ref={el => categoriesRef.current.set(group.category, el)}>
								<h2 className="text-xl font-bold mb-4">{group.category}</h2>
								<div className="grid grid-cols-2 gap-4">
									<AnimatePresence mode="popLayout">
										{group.items.map(product => {
											const inCart = cart.find(c=>c.productId===product.id)
											return (
												<motion.div data-card key={product.id} layout initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.98}} transition={{duration:0.22}} className="bg-white p-3 rounded-3xl shadow-sm flex items-center gap-3">
													<img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-xl" />
													<div className="flex-1">
														<div className="flex items-center justify-between">
															<div>
																<div className="font-semibold text-slate-800">{product.name}</div>
																<div className="text-sm text-slate-400">${(product.price||0).toFixed(2)}</div>
															</div>
															<div>
																{!inCart ? (
																	<button onClick={(e)=>addToCart(product,e)} className="bg-indigo-600 text-white px-3 py-1 rounded-full">Add</button>
																) : (
																	<div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-full">
																		<button onClick={()=>changeQty(product.id, -1)} className="px-2">-</button>
																		<div className="w-6 text-center">{inCart.qty}</div>
																		<button onClick={()=>changeQty(product.id, +1)} className="px-2">+</button>
																	</div>
																)}
															</div>
														</div>
													</div>
												</motion.div>
											)
										})}
									</AnimatePresence>
								</div>
							</section>
						))}
						{grouped.length === 0 && (
							<div className="text-center text-slate-500 py-20">لا توجد منتجات مطابقة لبحثك.</div>
						)}
					</div>
				)}
			</main>

			<AnimatePresence>
				{flying && (
					<motion.img
						key={flying.id}
						src={flying.src}
						style={{ position: 'fixed', zIndex: 9999, left: flying.from.x, top: flying.from.y, width: flying.from.width, height: flying.from.height, pointerEvents:'none', borderRadius:8 }}
						initial={{ opacity: 1 }}
						animate={{ left: flying.to.x + flying.to.width/2 - 20, top: flying.to.y + flying.to.height/2 - 20, width: 40, height: 40, opacity: 0.9 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.7, ease: 'easeInOut' }}
						onAnimationComplete={()=>setFlying(null)}
					/>
				)}
			</AnimatePresence>

			<div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
				<div className="bg-white w-full max-w-3xl mx-4 p-3 rounded-3xl shadow-lg flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="text-sm text-slate-500">{itemCount} items</div>
						<div className="text-lg font-semibold">${total.toFixed(2)}</div>
					</div>
					<div className="flex items-center gap-3">
						<button onClick={()=>{}} className="px-4 py-2 rounded-full bg-slate-100">View Cart</button>
						<button onClick={handleCheckout} className="px-4 py-2 rounded-full bg-indigo-600 text-white">Checkout</button>
					</div>
				</div>
			</div>
		</div>
	)
}
