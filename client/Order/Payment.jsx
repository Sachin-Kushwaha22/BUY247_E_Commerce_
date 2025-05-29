import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import axios from "axios";
import serverUrl from "../config";
import './Payment.css'

function Payment({ orderid }) {
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [orderData, setOrderData] = useState()
    const order_id = orderid
    useEffect(() => {
        const loadRazorpay = async () => {
            return new Promise((resolve) => {
                if (window.Razorpay) {
                    setRazorpayLoaded(true);
                    resolve(true);
                    return;
                }
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.async = true;
                script.onload = () => {
                    setRazorpayLoaded(true);
                    resolve(true);
                };
                script.onerror = () => {
                    setRazorpayLoaded(false);
                    resolve(false);
                };
                document.body.appendChild(script);
            });
        };

        loadRazorpay();

    }, []);

    useEffect(() => {
        getOrder()
    }, [])
    const getOrder = async () => {
        try {
            const response = await axios.get(`${serverUrl}/order/${order_id}`, {
                withCredentials: true
            })
            if (response.status === 200) {
                setOrderData(response.data.orderById)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handlePayment = async () => {
        if (!razorpayLoaded) {
            alert("Razorpay SDK failed to load. Please check your internet connection.");
            return;
        }

        try {
            const response = await axios.post(`${serverUrl}/checkout`, {
                amount: orderData.finalprice, // Amount in paisa (500 INR = 50000 paisa)
                currency: "INR",
                o_id: order_id
            }, {
                withCredentials: true
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: response.data.amount,
                currency: response.data.currency,
                order_id: response.data.id,
                name: "BUY247",
                description: "Payment",
                handler: async (res) => {
                    alert(`Payment Success! Payment ID: ${res.razorpay_payment_id}`);

                    try {
                        const verifyResponse = await axios.post(`${serverUrl}/checkout/verify`, {
                            razorpay_order_id: res.razorpay_order_id,
                            razorpay_payment_id: res.razorpay_payment_id,
                            razorpay_signature: res.razorpay_signature,
                        }, {
                            withCredentials: true
                        });

                        if (verifyResponse.data.success) {
                            alert("Payment Verified Successfully!");
                            await axios.put(`${serverUrl}/order/paymentstatus`, {
                                o_id: order_id,
                                payment_status: 'Paid'
                            }, {
                                withCredentials: true
                            })
                                .then(() => console.log('payment status updated'))
                                .catch((e) => console.log(e));


                        } else {
                            alert("Payment Verification Failed!");
                        }
                    } catch (error) {
                        console.error("Payment Verification Error:", error);
                        alert("Error verifying payment.");
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error("Payment Initialization Error:", error);
            alert("Failed to initiate payment.");
        }
    };

    return (
        <>
            {!orderData ? <p>Loading....</p> : <div className="checkout-container">
                <h2 className="checkout-title">Order Summary</h2>

                <div className="checkout-details">
                    <div className="checkout-section">
                        <p><span>Product:</span> {orderData.name}</p>
                        <p><span>Category:</span> {orderData.category}</p>
                        <p><span>Customer:</span> {orderData.fname} {orderData.lname}</p>
                        <p><span>Shipping Address:</span><br />{orderData.shipping_address}</p>
                    </div>

                    <div className="checkout-section">
                        <p><span>Email:</span> {orderData.email}</p>
                        <p><span>Quantity:</span> {orderData.quantity}</p>
                        <p><span>Price per item:</span> ₹{orderData.price}</p>
                        <p><span>Discounted Price:</span> ₹{orderData.finalprice}</p>
                        <p className="total"><span>Total:</span> ₹{orderData.finalprice}</p>
                    </div>
                </div>

                <div className="checkout-button-container">
                    <button
                        onClick={handlePayment}
                        disabled={!razorpayLoaded}
                        className="checkout-button"
                    >
                        Pay Now
                    </button>
                </div>
            </div>}
        </>
    )
}

export default Payment