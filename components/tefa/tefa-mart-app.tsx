'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AppHeader } from './app-header'
import { HeroCarousel } from './hero-carousel'
import { CategoryMenu } from './category-menu'
import { AiSmartPick } from './ai-smart-pick'
import { ProductGrid } from './product-grid'
import { BottomNav, type NavTab } from './bottom-nav'
import { CartFab } from './cart-fab'
import { SuccessToast } from './success-toast'
import { CategoryScreen, type CategoryFilter } from './category-screen'
import { CartScreen } from './cart-screen'
import { OrdersScreen } from './orders-screen'
import { ProfileScreen } from './profile-screen'
import { getProduct, initialOrders, type Cart, type Order } from './data'

type Tab = NavTab | 'keranjang'

export function TefaMartApp() {
  const [tab, setTab] = useState<Tab>('beranda')
  const [prevTab, setPrevTab] = useState<NavTab>('beranda')
  const [category, setCategory] = useState<CategoryFilter>('semua')
  const [focusSearch, setFocusSearch] = useState(false)
  const [cart, setCart] = useState<Cart>({ roti: 1, susu: 1 })
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [balance, setBalance] = useState(45000)
  const [points, setPoints] = useState(2500)
  const [toastKey, setToastKey] = useState(0)
  const [toastVisible, setToastVisible] = useState(false)
  const [bump, setBump] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const orderTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0)
  const activeOrders = orders.filter((o) => o.status !== 'selesai').length

  const goTo = useCallback(
    (next: Tab) => {
      if (next === 'keranjang' && tab !== 'keranjang') setPrevTab(tab)
      if (next !== 'kategori') setFocusSearch(false)
      setTab(next)
    },
    [tab],
  )

  const handleAdd = useCallback((id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
    setToastKey((k) => k + 1)
    setToastVisible(true)
    setBump(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 2800)
  }, [])

  const handleQtyChange = useCallback((id: string, qty: number) => {
    setCart((c) => {
      const next = { ...c }
      if (qty <= 0) delete next[id]
      else next[id] = Math.min(qty, 20)
      return next
    })
  }, [])

  const handleCheckout = () => {
    const items = Object.entries(cart).map(([productId, qty]) => ({ productId, qty }))
    const total = items.reduce((s, i) => s + (getProduct(i.productId)?.price ?? 0) * i.qty, 0)
    if (items.length === 0 || total > balance) return

    const id = `o-${Date.now()}`
    const time = `Hari ini, ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
    const code = `TF-${Math.floor(1000 + Math.random() * 9000)}`
    setOrders((o) => [{ id, code, items, total, status: 'diproses', time }, ...o])
    setCart({})
    setBalance((b) => b - total)
    setPoints((p) => p + Math.floor(total / 100))
    setTab('pesanan')

    orderTimers.current.push(
      setTimeout(() => {
        setOrders((list) => list.map((o) => (o.id === id ? { ...o, status: 'siap' } : o)))
      }, 6000),
    )
  }

  const handlePicked = (id: string) => {
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, status: 'selesai' } : o)))
  }

  const handleReorder = (order: Order) => {
    setCart((c) => {
      const next = { ...c }
      for (const { productId, qty } of order.items) next[productId] = (next[productId] ?? 0) + qty
      return next
    })
    goTo('keranjang')
  }

  useEffect(() => {
    if (!bump) return
    const t = setTimeout(() => setBump(false), 300)
    return () => clearTimeout(t)
  }, [bump])

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
      orderTimers.current.forEach(clearTimeout)
    },
    [],
  )

  return (
    <>
      <SuccessToast key={toastKey} visible={toastVisible} onClose={() => setToastVisible(false)} />
      <div key={tab} className="no-scrollbar h-full overflow-y-auto pb-24">
        {tab === 'beranda' ? (
          <>
            <AppHeader
              points={points}
              balance={balance}
              onSearch={() => {
                setCategory('semua')
                setFocusSearch(true)
                setTab('kategori')
              }}
            />
            <div className="flex flex-col gap-6 pt-4">
              <HeroCarousel />
              <CategoryMenu
                onSelect={(id) => {
                  setCategory(id)
                  goTo('kategori')
                }}
              />
              <AiSmartPick onAdd={handleAdd} />
              <ProductGrid
                onAdd={handleAdd}
                onSeeAll={() => {
                  setCategory('semua')
                  goTo('kategori')
                }}
              />
            </div>
          </>
        ) : null}

        {tab === 'kategori' ? (
          <CategoryScreen category={category} onCategoryChange={setCategory} onAdd={handleAdd} autoFocusSearch={focusSearch} />
        ) : null}

        {tab === 'pesanan' ? (
          <OrdersScreen orders={orders} onPicked={handlePicked} onReorder={handleReorder} onShop={() => goTo('beranda')} />
        ) : null}

        {tab === 'profil' ? (
          <ProfileScreen
            points={points}
            balance={balance}
            orderCount={orders.length}
            onTopUp={() => setBalance((b) => b + 20000)}
            onOpenOrders={() => goTo('pesanan')}
            onOpenCart={() => goTo('keranjang')}
          />
        ) : null}

        {tab === 'keranjang' ? (
          <CartScreen
            cart={cart}
            balance={balance}
            onQtyChange={handleQtyChange}
            onCheckout={handleCheckout}
            onBack={() => goTo(prevTab)}
          />
        ) : null}
      </div>
      {tab !== 'keranjang' ? <CartFab count={cartCount} bump={bump} onClick={() => goTo('keranjang')} /> : null}
      <BottomNav active={tab} onChange={goTo} orderBadge={activeOrders} />
    </>
  )
}
