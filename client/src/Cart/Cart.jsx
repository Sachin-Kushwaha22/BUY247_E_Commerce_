import './Cart.css'

function Cart(){
    return(
        <div>
  <nav className="crt-navbar">
    <div className="crt-logo">
      <a className="crt-logo-text" href="#">
        Flipkart
      </a>
      <span className="crt-logo-subtext">Explore Plus</span>
    </div>
    <div className="crt-search-container">
      <input placeholder="Search for products, brands and more" type="text" />
      <button>
        <svg
          fill="#2874f0"
          height="16"
          viewBox="0 0 16 16"
          width="16"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
      </button>
    </div>
    <div className="crt-nav-buttons">
      <button className="crt-login-btn">Login</button>
      <span className="crt-user-name">Sachin</span>
      <span className="crt-more-btn">More</span>
      <a className="crt-cart-link" href="#">
        <svg
          fill="currentColor"
          height="16"
          style={{
            marginRight: "5px",
            verticalAlign: "text-top",
          }}
          viewBox="0 0 16 16"
          width="16"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        </svg>
        Cart
      </a>
    </div>
  </nav>
  <div className="crt-cart-with-products crt-show-with-products">
    <div className="crt-container">
      <div className="crt-left-panel">
        <div className="crt-card crt-address-card">
          <div>From Saved Addresses</div>
          <button className="crt-pincode-btn">Enter Delivery Pincode</button>
        </div>
        <div className="crt-card">
          <div className="crt-product-item">
            <img
              alt="Product 1"
              className="crt-product-img"
              src="/api/placeholder/120/120"
            />
            <div className="crt-product-details">
              <h3 className="crt-product-title">
                Lil Tara Deadpool - Most Loved Comic Super Hero Figure
              </h3>
              <p className="crt-product-variant">Multicolor</p>
              <p className="crt-out-of-stock">Out Of Stock</p>
              <div className="crt-action-btns">
                <span className="crt-action-link">SAVE FOR LATER</span>
                <span className="crt-action-link">REMOVE</span>
              </div>
            </div>
          </div>
          <div className="crt-product-item">
            <img
              alt="Product 2"
              className="crt-product-img"
              src="/api/placeholder/120/120"
            />
            <div className="crt-product-details">
              <h3 className="crt-product-title">
                Toys World 3D Fast Steering Remote Car
              </h3>
              <p className="crt-product-variant">Red</p>
              <p className="crt-product-seller">Seller: Whitedevil</p>
              <div className="crt-price-container">
                <span className="crt-discounted-price">₹250</span>
                <span className="crt-original-price">₹599</span>
                <span className="crt-discount-percent">58% Off</span>
              </div>
              <p>
                Delivery by Thu Apr 17 |{" "}
                <span
                  style={{
                    color: "#388e3c",
                  }}>
                  Free
                </span>
              </p>
              <div className="crt-quantity-container">
                <button className="crt-quantity-btn">-</button>
                <input
                  className="crt-quantity-input"
                  defaultValue="1"
                  type="text"
                />
                <button className="crt-quantity-btn">+</button>
              </div>
              <div className="crt-action-btns">
                <span className="crt-action-link">SAVE FOR LATER</span>
                <span className="crt-action-link">REMOVE</span>
              </div>
            </div>
          </div>
        </div>
        <button className="crt-place-order-btn">PLACE ORDER</button>
      </div>
      <div className="crt-right-panel">
        <div className="crt-price-details">
          <h3 className="crt-price-title">PRICE DETAILS</h3>
          <div className="crt-price-row">
            <span>Price (1 item)</span>
            <span>₹599</span>
          </div>
          <div className="crt-price-row">
            <span>Discount</span>
            <span
              style={{
                color: "#388e3c",
              }}>
              - ₹349
            </span>
          </div>
          <div className="crt-price-row">
            <span>Platform Fee</span>
            <span>₹3</span>
          </div>
          <div className="crt-price-row">
            <span>Delivery Charges</span>
            <span
              style={{
                color: "#388e3c",
              }}>
              Free
            </span>
          </div>
          <div className="crt-total-row">
            <span>Total Amount</span>
            <span>₹253</span>
          </div>
          <div className="crt-savings">You will save ₹346 on this order</div>
        </div>
        <div className="crt-safe-msg">
          <svg
            className="crt-security-icon"
            fill="#878787"
            height="22"
            viewBox="0 0 16 16"
            width="22"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
          </svg>
          Safe and Secure Payments. Easy returns. 100% Authentic products.
        </div>
      </div>
    </div>
  </div>
  <div className="crt-footer">
    <div className="crt-footer-links">
      <div>Policies: Returns Policy | Terms of use | Security | Privacy</div>
      <div>© 2007-2025 Flipkart.com</div>
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