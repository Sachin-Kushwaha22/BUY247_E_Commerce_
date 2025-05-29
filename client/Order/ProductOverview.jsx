import React, { useState, useEffect } from 'react'
import './ProductOverview.css'
import axios from 'axios'
import serverUrl from '../config';
import { useNavigate } from 'react-router-dom';


function ProductOverview({handleCheckoutStep, orderItems, getOrderItem }) {
  const navigate = useNavigate()
  const [total, setTotal] = useState({})
  useEffect(() => {
    const totalUnit = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const price = orderItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const totalPrice = price.toFixed(2);
    const discountPercent = 10
    const discount = (totalPrice * discountPercent / 100).toFixed(0)
    const delivery = totalPrice > 499 ? 0 : 60
    const finalPrice = Number(totalPrice - discount + delivery).toFixed(2)
    setTotal({
      totalUnit, totalPrice, discount, delivery, finalPrice
    });

  }, [orderItems]);

  const handleQuantity = async (quantity, id) => {
    if (quantity === "inc" || quantity === "dec") {
      try {
        const response = await axios.put(`${serverUrl}/order/orderItems/quantity`, {
          orderItemsId: id,
          quantity: quantity
        }, {
          withCredentials: true
        })
        if (response.status === 200) {
          await getOrderItem()
        }
      } catch (error) {
        console.log(error);

      }
    } else {
      console.log('Invalid request made for quantity changing');
    }
  }

  const handleOrderItemRemove = async (id) => {
    try {
      const response = await axios.delete(`${serverUrl}/order/orderItems/remove/${id}`, {
        withCredentials: true
      })
      if (response.status === 200) {
        console.log(response.data.message);
        await getOrderItem()
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleProceedTOPayment = () => {
    handleCheckoutStep('payment')
  }

  return (
    <>
      {orderItems.length === 0 ? <div className='orderItems-empty-div'>
        <p className="orderItems-empty">No Products</p>
        <button onClick={() => {
          navigate('/')
        }} className='explore-product-btn'>Explore Products</button>
      </div> : <div className='po-cartContainer'>
        <div className='cart-items-div'>
          {orderItems.length > 0 && orderItems.map((item) => (

            <div className='cart-container-div' key={item.orderitems_id}>
              <div className='cart-box'>
                <div className='left-side-cart-box'>
                  <img className='cart-item-img' src={item.image_url} alt="product_image" />
                </div>
                <div className='right-side-cart-box'>
                  <div className="right-side-row-one">
                    {item.category}
                    <svg className='angle-bracket' xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" enable-background="new 0 0 24 24"><path d="M15.5,11.3L9.9,5.6c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l4.9,4.9l-4.9,4.9c-0.2,0.2-0.3,0.4-0.3,0.7c0,0.6,0.4,1,1,1c0.3,0,0.5-0.1,0.7-0.3l5.7-5.7c0,0,0,0,0,0C15.9,12.3,15.9,11.7,15.5,11.3z" /></svg>
                    {item.brand}
                  </div>

                  <div className="right-side-row-two">
                    {item.name}
                  </div>
                  <div className="right-side-row-three">
                    <div className="quantity-selector">
                      <span onClick={() => handleQuantity("dec", item.orderitems_id)} className={`descrease ${item.quantity === 1 ? 'disabled-btn' : ''}`}>-</span>
                      <p className="quantity-box">{item.quantity}</p>
                      <span onClick={() => handleQuantity("inc", item.orderitems_id)} className={`increase ${item.quantity === 5 ? 'disabled-btn' : ''}`}>+</span>
                    </div>

                    {'₹' + item.price * item.quantity}
                  </div>

                  <div className="right-side-row-four">
                    <div className="delivery-details">
                      {/* Delivery by Mon Apr 21 | ₹40Free */}
                    </div>
                    <button onClick={() => handleOrderItemRemove(item.orderitems_id)} className='remove-cart-item'>REMOVE</button>
                  </div>
                </div>
              </div>
              <p className="line-break-cart"></p>
            </div>

          ))}

        </div>

        <div className="overview-price-proceed-div">
          <div className="overview-billing-div">
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
              <p style={{ color: total.delivery === 0 ? 'green' : 'black' }} className="delivery-number">{total.delivery === 0 ? 'Free' : '₹' + total.delivery}</p>
            </div>

            <p className="line-break-thin"></p>
            <div className="price-div-content total-price">
              <p className="total-price-text">Total Amount To Pay</p>
              <p className="total-price-number">₹{total.finalPrice || 0}</p>
            </div>
            <p className="mb-0 line-break-thin"></p>
          </div>

          <button onClick={() => {
            
            handleProceedTOPayment()
          }} className='proceed-to-payment'>Proceed To Payment</button>
        </div>
      </div>}
    </>

  )
}

export default ProductOverview