import React, { useState, useEffect } from 'react'
import './Order.css'
import ProgressBar from './ProgressBar.jsx';
import DeliveryAddressForm from './DeliveryAddressForm.jsx';
import ProductOverview from './ProductOverview.jsx';
import Payment from './Payment.jsx';
import { useParams } from 'react-router-dom';

function Order({ orderItems, getOrderItem }) {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // For modern browsers
      e.preventDefault();
      e.returnValue = ''; // Chrome needs this for the dialog to appear
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  const {oid} = useParams()
  const [checkoutStep, setCheckoutStep] = useState(sessionStorage.getItem('checkoutStep') || 'address');

  const handleCheckoutStep = (val) => {
    sessionStorage.setItem('checkoutStep', val)
    setCheckoutStep(val)
  }

  return (
    <div className='order'>

      <div className="navbar-redesign">
        <div>
          <img className='hm-logo' src="/assets/logo.png" alt="" />
        </div>
      </div>

      <div className="progress-bar-div">
        <ProgressBar handleCheckoutStep={handleCheckoutStep} currentStep={checkoutStep} />
      </div>

      <div className="order-pages">
        <div className="da-header">
          {checkoutStep === 'address' && <>
            <span className="da-header-number">1</span>
            <h2 className="da-header-title">DELIVERY ADDRESS</h2>
          </>}

          {checkoutStep === 'overview' && <>
            <span className="da-header-number">2</span>
            <h2 className="da-header-title">PRODUCT OVERVIEW</h2>
          </>}

          {checkoutStep === 'payment' && <>
            <span className="da-header-number">3</span>
            <h2 className="da-header-title">PAYMENT</h2>
          </>}


        </div>
        <div className="order-pages-container">
        {checkoutStep === 'address' && <DeliveryAddressForm handleCheckoutStep={handleCheckoutStep} orderid={oid} />}
          {checkoutStep === 'overview' && <ProductOverview handleCheckoutStep={handleCheckoutStep} orderItems={orderItems} getOrderItem={getOrderItem}/>}
          {checkoutStep === 'payment' && <Payment orderid={oid}/>}

        </div>

      </div>

    </div>
  )
}

export default Order