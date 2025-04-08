import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_URL;
import AUTH from './auth'

export default function Checkout() {
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    // const { order_id } = useParams()
    const order_id = 'c8b2c186-d63d-4021-9f22-6a5ecfb87c02'
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

    const handlePayment = async () => {
        if (!razorpayLoaded) {
            alert("Razorpay SDK failed to load. Please check your internet connection.");
            return;
        }

        try {
            const response = await axios.post(`${serverUrl}/checkout`, {
                amount: 500, // Amount in paisa (500 INR = 50000 paisa)
                currency: "INR",
                o_id: order_id
            },{
                withCredentials:true
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: response.data.amount,
                currency: response.data.currency,
                order_id: response.data.id,
                name: "BUY247",
                description: "Test Payment",
                handler: async (res) => {
                    alert(`Payment Success! Payment ID: ${res.razorpay_payment_id}`);
                    console.log(res.razorpay_order_id);
                    
                    try {
                        const verifyResponse = await axios.post(`${serverUrl}/checkout/verify`, {
                            razorpay_order_id: res.razorpay_order_id,
                            razorpay_payment_id: res.razorpay_payment_id,
                            razorpay_signature: res.razorpay_signature,
                        },{
                            withCredentials:true
                        });

                        if (verifyResponse.data.success) {
                            alert("Payment Verified Successfully!");
                            await axios.put(`${serverUrl}/order/paymentstatus`, {
                                o_id: order_id,
                                payment_status: 'Paid'
                            },{
                                withCredentials:true
                            })
                            .then(()=> console.log('payment status updated'))
                            .catch((e)=> console.log(e));

                            
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

    return(
        <div>
            <button onClick={handlePayment} disabled={!razorpayLoaded}>Pay Now</button>
            <AUTH />
        </div>
    )
}
