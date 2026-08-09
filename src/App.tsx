import { useMemo, useState } from 'react'
import './App.css'

type View = 'shop' | 'cart' | 'checkout' | 'orders'

type Product = {
  id: number
  name: string
  price: number
  description: string
  badge: string
  accent: string
}

type CartItem = Product & {
  quantity: number
}

type Order = {
  id: string
  items: CartItem[]
  total: number
  date: string
  status: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Aero Chrono',
    price: 189,
    description: 'A lightweight field watch with brushed steel case and black dial.',
    badge: 'New Arrival',
    accent: 'linear-gradient(135deg, #111827, #374151)',
  },
  {
    id: 2,
    name: 'Harbor Leather',
    price: 149,
    description: 'A refined strap and polished finish for everyday dressing.',
    badge: 'Best Seller',
    accent: 'linear-gradient(135deg, #7c2d12, #a16207)',
  },
  {
    id: 3,
    name: 'North Wind',
    price: 219,
    description: 'A bold chronograph built for weekend escapes and city evenings.',
    badge: 'Limited',
    accent: 'linear-gradient(135deg, #0f766e, #2563eb)',
  },
]

const initialOrders: Order[] = [
  {
    id: 'ORD-1001',
    items: [{ ...products[0], quantity: 1 }],
    total: 189,
    date: 'Jun 12, 2026',
    status: 'Delivered',
  },
]

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [view, setView] = useState<View>('shop')
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [loginForm, setLoginForm] = useState({ email: 'demo@nixon.com', password: 'password' })
  const [checkoutForm, setCheckoutForm] = useState({
    name: 'Ava Stone',
    address: '123 Market Street',
    card: '4242 4242 4242 4242',
  })
  const [notice, setNotice] = useState('Welcome to the Nixon-inspired storefront.')

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  )

  const shipping = cart.length > 0 ? 19 : 0
  const total = subtotal + shipping

  const formatPrice = (value: number) =>
    value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    })

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...current, { ...product, quantity: 1 }]
    })
    setNotice(`${product.name} added to your bag.`)
    setView('cart')
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (loginForm.email == 'demo@nixon.com' && loginForm.password) {
      setIsLoggedIn(true)
      setNotice(`Welcome back, ${loginForm.email.split('@')[0]}.`)
      setView('shop')
    }
  }

  const handleCheckout = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (cart.length === 0) {
      setNotice('Add a product to your cart before checking out.')
      return
    }

    const order: Order = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      items: cart,
      total,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'Processing',
    }

    setOrders((current) => [order, ...current])
    setCart([])
    setNotice(`Order ${order.id} placed successfully.`)
    setView('orders')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Modern essentials</p>
          <h1 className="brand">NIXON</h1>
        </div>
        <nav className="nav-links" aria-label="Primary navigation">
          <button type="button" className={view === 'shop' ? 'nav-link active' : 'nav-link'} onClick={() => setView('shop')}>
            Shop
          </button>
          <button type="button" className={view === 'cart' ? 'nav-link active' : 'nav-link'} onClick={() => setView('cart')}>
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
          <button type="button" className={view === 'orders' ? 'nav-link active' : 'nav-link'} onClick={() => setView('orders')}>
            Orders
          </button>
          <button type="button" className={view === 'checkout' ? 'nav-link active' : 'nav-link'} onClick={() => setView('checkout')}>
            Checkout
          </button>
        </nav>
      </header>

      {notice ? <div className="notice">{notice}</div> : null}

      {!isLoggedIn ? (
        <section className="auth-card">
          <div>
            <p className="eyebrow">Sign in</p>
            <h2>Welcome back to your account.</h2>
            <p className="muted">Use the demo account to explore the shopping flow.</p>
          </div>
          <form onSubmit={handleLogin} className="auth-form">
            <label>
              Email
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
              />
            </label>
            <button type="submit" className="primary-btn">
              Login
            </button>
          </form>
        </section>
      ) : (
        <>
          <section className="hero-card">
            <div>
              <p className="eyebrow">Spring 2026</p>
              <h2>Elevated timepieces for every chapter.</h2>
              <p className="muted">
                Discover precision-crafted watches, quick checkout, and a personal order history in one place.
              </p>
            </div>
            <div className="hero-actions">
              <button type="button" className="primary-btn" onClick={() => setView('shop')}>
                Browse products
              </button>
              <button type="button" className="secondary-btn" onClick={() => setView('cart')}>
                View bag
              </button>
            </div>
          </section>

          {view === 'shop' ? (
            <section className="content-grid">
              <div className="products-section">
                <div className="section-heading">
                  <h3>Featured collection</h3>
                  <p className="muted">Curated for modern city life and weekend escapes.</p>
                </div>
                <div className="product-grid">
                  {products.map((product) => (
                    <article key={product.id} className="product-card">
                      <div className="product-visual" style={{ background: product.accent }} />
                      <div className="product-info">
                        <div className="product-topline">
                          <span className="chip">{product.badge}</span>
                          <span className="price">{formatPrice(product.price)}</span>
                        </div>
                        <h4>{product.name}</h4>
                        <p>{product.description}</p>
                        <button type="button" className="primary-btn full" onClick={() => addToCart(product)}>
                          Add to cart
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="summary-card">
                <h3>Bag summary</h3>
                <p className="muted">Your cart is ready whenever you are.</p>
                {cart.length === 0 ? (
                  <p className="empty">No items yet.</p>
                ) : (
                  <ul className="summary-list">
                    {cart.map((item) => (
                      <li key={item.id}>
                        <span>{item.name}</span>
                        <strong>{formatPrice(item.price * item.quantity)}</strong>
                      </li>
                    ))}
                  </ul>
                )}
                <button type="button" className="secondary-btn full" onClick={() => setView('cart')}>
                  Review bag
                </button>
              </aside>
            </section>
          ) : null}

          {view === 'cart' ? (
            <section className="content-grid single-column">
              <div className="section-heading">
                <h3>Your bag</h3>
                <p className="muted">Review each piece before you secure your order.</p>
              </div>
              {cart.length === 0 ? (
                <div className="empty-state">Your bag is empty. Start shopping to fill it.</div>
              ) : (
                <div className="cart-list">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div>
                        <h4>{item.name}</h4>
                        <p>{item.description}</p>
                      </div>
                      <div className="cart-controls">
                        <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                          +
                        </button>
                      </div>
                      <strong>{formatPrice(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>
              )}
              <div className="summary-card">
                <h3>Order total</h3>
                <div className="totals-row">
                  <span>Subtotal</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>
                <div className="totals-row">
                  <span>Shipping</span>
                  <strong>{formatPrice(shipping)}</strong>
                </div>
                <div className="totals-row total">
                  <span>Total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <button type="button" className="primary-btn full" onClick={() => setView('checkout')}>
                  Continue to checkout
                </button>
              </div>
            </section>
          ) : null}

          {view === 'checkout' ? (
            <section className="content-grid single-column">
              <div className="section-heading">
                <h3>Checkout</h3>
                <p className="muted">Secure checkout for your selected pieces.</p>
              </div>
              <form onSubmit={handleCheckout} className="checkout-form">
                <label>
                  Full name
                  <input
                    value={checkoutForm.name}
                    onChange={(event) => setCheckoutForm(prev => ({ ...prev, name: event.target.value }))}
                  />
                </label>
                <label>
                  Shipping address
                  <input
                    value={checkoutForm.address}
                    onChange={(event) => setCheckoutForm(prev => ({ ...prev, address: event.target.value }))}
                  />
                </label>
                <label>
                  Card number
                  <input
                    value={checkoutForm.card}
                    onChange={(event) => setCheckoutForm(prev => ({ ...prev, card: event.target.value }))}
                  />
                </label>
                <button type="submit" className="primary-btn full">
                  Place order
                </button>
              </form>
            </section>
          ) : null}

          {view === 'orders' ? (
            <section className="content-grid single-column">
              <div className="section-heading">
                <h3>Order history</h3>
                <p className="muted">Track every purchase in one streamlined view.</p>
              </div>
              <div className="order-list">
                {orders.map((order) => (
                  <article key={order.id} className="order-card">
                    <div className="order-topline">
                      <strong>{order.id}</strong>
                      <span>{order.status}</span>
                    </div>
                    <p>{order.date}</p>
                    <ul>
                      {order.items.map((item) => (
                        <li key={`${order.id}-${item.id}`}>
                          {item.quantity} × {item.name}
                        </li>
                      ))}
                    </ul>
                    <strong>Total: {formatPrice(order.total)}</strong>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  )
}

export default App
