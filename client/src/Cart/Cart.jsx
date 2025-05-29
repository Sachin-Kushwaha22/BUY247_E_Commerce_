import './Cart.css'
import NavBar from '../Home/NavBar'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import serverUrl from '../../config'

function Cart({ cart, getCartItem }) {
  const navigate = useNavigate()
  const [total, setTotal] = useState({})
  const [address, setAddress] = useState({})
  useEffect(() => {
    const totalUnit = cart.reduce((sum, item) => sum + item.quantity, 0);
    const price = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const totalPrice = price.toFixed(2);
    const discount = (totalPrice * 10/100).toFixed(0)
    const delivery = totalPrice > 499 ? 0 : 60
    setTotal({
      totalUnit, totalPrice, discount, delivery
    });

    const district = 'Gorakhpur'
    const pincode = 273010
    setAddress({ district, pincode })
  }, [cart]);

  const handleQuantity = async (quantity, id) => {
    if (quantity === "inc" || quantity === "dec") {
      try {
        console.log(quantity, id);

        const response = await axios.put(`${serverUrl}/cart/quantity`, {
          cartid: id,
          quantity: quantity
        }, {
          withCredentials: true
        })
        if (response.status === 200) {
          await getCartItem()
        }
      } catch (error) {
        console.log(error);

      }
    } else {
      console.log('Invalid request made for quantity changing');

    }
  }

  const handleCartItemRemove = async (id) => {
    try {
      const response = await axios.delete(`${serverUrl}/cart/remove/${id}`, {
        withCredentials: true
      })
      if (response.status === 200) {
        console.log(response.data.message);
        await getCartItem()
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handlePlaceOrder = async() => {
    try {
      const response = await axios.post(`${serverUrl}/order/product`,{},{
        withCredentials:true
      })

      if(response.status === 200){
        sessionStorage.removeItem('checkoutStep')
        navigate(`/order/checkout/${response.data?.orderItem?.o_id}`)
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (cart.length === 0) {
    return (
      <>
        <div className="crt-nav-shadow"></div>
        <NavBar cart={cart} />
        <div className='cart-empty-div'>
          <p className="cart-empty-text">Cart Empty</p>
        </div>

        <div className="crt-footer cart-empty-footer">
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
      </>
    )
  }
  return (
    <div className='cart-body'>
      <div className="crt-nav-shadow"></div>
      <NavBar cart={cart} />
      <div className='cartContainer'>
        <div className='cart-items-div'>
          {cart.length === 0 ? <p>Cart Empty</p> : cart.map((cart) => (

            <div className='cart-container-div' key={cart.cartid}>
              <div  className='cart-box'>
                <div className='left-side-cart-box'>
                  <img className='cart-item-img' src={cart.image_url} alt="product_image" />
                </div>
                <div className='right-side-cart-box'>
                  <div className="right-side-row-one">
                    {cart.category}
                    <svg className='angle-bracket' xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" enable-background="new 0 0 24 24"><path d="M15.5,11.3L9.9,5.6c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l4.9,4.9l-4.9,4.9c-0.2,0.2-0.3,0.4-0.3,0.7c0,0.6,0.4,1,1,1c0.3,0,0.5-0.1,0.7-0.3l5.7-5.7c0,0,0,0,0,0C15.9,12.3,15.9,11.7,15.5,11.3z" /></svg>
                    {cart.brand}
                  </div>

                  <div className="right-side-row-two">
                    {cart.name}
                  </div>
                  <div className="right-side-row-three">
                    <div className="quantity-selector">
                      <span onClick={() => handleQuantity("dec", cart.cartid)} className={`descrease ${cart.quantity === 1 ? 'disabled-btn' : ''}`}>-</span>
                      <p className="quantity-box">{cart.quantity}</p>
                      <span onClick={() => handleQuantity("inc", cart.cartid)} className={`increase ${cart.quantity === 5 ? 'disabled-btn' : ''}`}>+</span>
                    </div>

                    {'₹' + cart.price * cart.quantity}
                  </div>

                  <div className="right-side-row-four">
                    <div className="delivery-details">
                     
                    </div>
                    <button onClick={() => handleCartItemRemove(cart.cartid)} className='remove-cart-item'>REMOVE</button>
                  </div>
                </div>
              </div>
              <p className="line-break-cart"></p>
            </div>

          ))}

          <div className="place-order-btn-div">
            <p className="total-unit-text">
              TOTAL UNIT : {total.totalUnit}
            </p>
            <button onClick={() => handlePlaceOrder()} className='place-order-btn'>PLACE ORDER</button>
          </div>
        </div>
        <div className='cart-price-div'>
          {/* <div className="address-div">
            <p className='price-div-heading'>ADDRESS</p>
            <p className="line-break-thin"></p>

            <p className="deliver-to">
              Deliver to : <strong className='deliver-to-pincode'>{address.district} - {address.pincode}</strong>
            </p>

            <button className='change-address-button-cart'>Change</button>
          </div> */}

          <div className="price-div">
            <p className='price-div-heading'>PRICE DETAILS</p>
            <p className="line-break-thin"></p>
            <div className="price-div-content price-cummulative">
              <p className="price-text">Price <p className='height-fix p-3'>(</p>{total.totalUnit} units<p className='height-fix'>)</p></p>
              <p className="price-number">₹{total.totalPrice}</p>
            </div>
            <div className="price-div-content discount">
              <p className="discount-text">Discount</p>
              <p className="discount-number">- ₹{total.discount || 0}</p>
            </div>

            <div className="price-div-content delivery-charge">
              <p className="delivery-text">Delivery Charges</p>
              {/* <p className="delivery-number">₹{total.delivery || 0}</p> */}
              <p style={{ color: total.delivery === 0 ? 'green' : 'black' }} className="delivery-number">{total.delivery === 0 ? 'Free' : '₹'+total.delivery}</p>
            </div>

            <p className="line-break-thin"></p>
            <div className="price-div-content total-price">
              <p className="total-price-text">Total Amount To Pay</p>
              <p className="total-price-number">₹{total.totalPrice - total.discount + total.delivery || 0}</p>
            </div>
            <p className="mb-0 line-break-thin"></p>


          </div>
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