import './Cart.css'
import NavBar from '../Home/NavBar'
import { useEffect } from 'react'

function Cart({cart}) {
  return (
    <div>
      <div className="crt-nav-shadow"></div>
      <NavBar />
      <div className='cartContainer'>
        <div className='cart-items-div'>
        {cart.length === 0 ? <p>Cart Empty</p> : cart.map((cart)=>(
          <div key={cart.id}>
            Hey
          </div>
        ))}
        </div>
        <div className='cart-price-div'>

        </div>
      </div>
      <div className="crt-footer">
        <div className="crt-footer-links">
          <div>Policies: Returns Policy | Terms of use | Security | Privacy</div>
          <div>© 2025 BUY247</div>
          <div>
            Need help? Visit the{" "}
            <a
              href="#"
              style={{
                color: "#2874f0",
              }}>
              Help Center
            </a>{" "}
            or{" "}
            <a
              href="#"
              style={{
                color: "#2874f0",
              }}>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Cart