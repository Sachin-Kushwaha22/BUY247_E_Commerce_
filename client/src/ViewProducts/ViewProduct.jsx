import React, { useState, useEffect } from 'react'
import './ViewProduct.css'
import NavBar from '../Home/NavBar';
import axios from 'axios'
import serverUrl from '../../config';
import { useNavigate } from 'react-router-dom';

function useOffsetDate(offsetDays) {
    const [dateInfo, setDateInfo] = useState({ date: '', day: '' });

    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + offsetDays);

        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = targetDate.toLocaleDateString('en-US', options);

        setDateInfo({ date: formattedDate, day: dayName });
    }, [offsetDays]);

    return dateInfo;
}

export default function ViewProduct({ product, getProductById, cart, getCartItem}) {
    const navigate = useNavigate()

    const { date, day } = useOffsetDate(3)
    const [pincode, setPincode] = useState("")
    const [deliveryCharge, setDeliveryCharge] = useState(true)
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [isInCart, setIsInCart] = useState()

    useEffect(() => {
        if (product?.price && product?.discount >= 0) {
            const discountAmount = (product.price * product.discount) / 100;
            setDiscountedPrice((product.price - discountAmount).toFixed(2));
        }
    
        if (Array.isArray(cart) && cart.length > 0 && product?.id) {
            const isAvailable = cart.some((p) => {
                return p.productid === product.id
            });
            setIsInCart(isAvailable);
        } else {
            setIsInCart(false); // fallback
        }
    }, [cart, product]);


    // Check if it's exactly 6 digits (numbers only)
    const isValidPincode = /^\d{6}$/.test(pincode);

    const handleAddToCart = async (pid) => {
        // dispatch({ type: 'Add_to_cart', payload: pid })
        try {
            const response = await axios.post(`${serverUrl}/cart/add/${pid}`, {}, {
                withCredentials: true
            })
            if (response.status === 200) {
                await getCartItem()
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (!product) {
        getProductById()
        return <div className='loading-page'>Loading...</div>;
    }

    return (
        <div>
            <NavBar cart={cart} />

            <div className="vp-container">
                <div className="vp-left-div">
                    <div className='vp-image-div'>
                        <img className='vp-product-img' src={product?.image_url} alt="product_image" />
                    </div>

                    <div className="vp-cart-ord-btns">
                        {isInCart ? (<button onClick={() => {
                                navigate('/user/cart')
                            }} className='vp-add-to-cart-btn'>
                            <i className="fa-solid fa-cart-shopping"></i>
                            GO TO CART</button>) : (
                                <button onClick={() => {
                                    handleAddToCart(product.id)
                                }} className='vp-add-to-cart-btn'>
                                <i className="fa-solid fa-cart-shopping"></i>
                                ADD TO CART</button>
                            )}
                        {/* <button onClick={() => navigate(`/order/checkout/${product.id}`)} className='vp-buy-now-btn'>
                            <i className="fa-solid fa-bag-shopping"></i>
                            BUY NOW
                        </button> */}
                    </div>
                </div>

                <div className="vp-right-div">
                    <div className="vp-directory">
                        <p className="directory-route">Home</p>
                        <svg className="angle-bracket-small" xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" enableBackground="new 0 0 24 24"><path d="M15.5,11.3L9.9,5.6c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l4.9,4.9l-4.9,4.9c-0.2,0.2-0.3,0.4-0.3,0.7c0,0.6,0.4,1,1,1c0.3,0,0.5-0.1,0.7-0.3l5.7-5.7c0,0,0,0,0,0C15.9,12.3,15.9,11.7,15.5,11.3z"></path></svg>

                        <p className="directory-route">{product.category}</p>

                        <svg className="angle-bracket-small" xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" enableBackground="new 0 0 24 24"><path d="M15.5,11.3L9.9,5.6c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l4.9,4.9l-4.9,4.9c-0.2,0.2-0.3,0.4-0.3,0.7c0,0.6,0.4,1,1,1c0.3,0,0.5-0.1,0.7-0.3l5.7-5.7c0,0,0,0,0,0C15.9,12.3,15.9,11.7,15.5,11.3z"></path></svg>

                        <p className="directory-route">{product.brand} {product.category}</p>

                        <svg className="angle-bracket-small" xmlns="http://www.w3.org/2000/svg" fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" enableBackground="new 0 0 24 24"><path d="M15.5,11.3L9.9,5.6c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l4.9,4.9l-4.9,4.9c-0.2,0.2-0.3,0.4-0.3,0.7c0,0.6,0.4,1,1,1c0.3,0,0.5-0.1,0.7-0.3l5.7-5.7c0,0,0,0,0,0C15.9,12.3,15.9,11.7,15.5,11.3z"></path></svg>

                        <p className="directory-route">{product.name}</p>
                    </div>

                    <p className="vp-product-name">{product.name}</p>

                    <div className="vp-reviews">
                        <div className="star-rate">
                            <p className="review-number">4.3</p>
                            <i className="fa-solid fa-star"></i>
                        </div>

                        <p className="rating-review-text">327 Rating & 14 Reviews</p>
                    </div>

                    <div className="vp-price">
                        <p className="special-price-text">Special price</p>

                        <div className="price-discount-div">
                            <p className="discounted-price">₹{discountedPrice}</p>
                            <p className="org-price">
                                <span className='price-cross-line'></span>
                                <span className='price-cross-line2'></span>
                                ₹{product.price}
                            </p>

                            <p className="discount-number">{product.discount}% off</p>
                        </div>
                    </div>

                    {/* <div className="vp-specs-div">
                        <div className="specs-heading-div">
                            <i className="fa-solid fa-circle-info"></i>
                            <p className="specs-heading">Specification</p>
                        </div>
                        <div className="specs-div">specs</div>
                    </div> */}

                    <div className="vp-delivery">
                        <div className="vp-deliver-to">
                            <i className="fa-solid fa-map-location-dot"></i>
                            <p className="deliver-to-text">Deliver to</p>
                        </div>

                        <div className="vp-enter-pincode">
                            <input
                                type="text"
                                className="pincode-input"
                                maxLength={6}
                                inputMode="numeric"
                                pattern="[0-9]*"
                                onBeforeInput={(e) => {
                                    if (!/^\d$/.test(e.data)) {
                                        e.preventDefault(); // block anything that's not a digit (0–9)
                                    }
                                }}
                                onPaste={(e) => {
                                    const paste = e.clipboardData.getData('text');
                                    if (!/^\d{1,6}$/.test(paste)) {
                                        e.preventDefault(); // block paste if it's not 1-6 digits only
                                    }
                                }}

                                placeholder='Enter Pincode here'
                                name='pincode'
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                            />

                            <button onClick={() => console.log(pincode)} disabled={!isValidPincode} >Check</button>
                        </div>

                        <div className="vp-delivery-date">
                            <p className="delivery-by-date">Delivery by {date}, {day}</p>
                            <span className="verticle-line-break"></span>
                            <p className="delivery-charge">
                                Delivery Charge :
                                {deliveryCharge ? (<span className='d-price'>₹40</span>) : (<span className='free'>
                                    Free
                                    <span className='d-price-free'>
                                        ₹40
                                        <span className='d-price-crossline'></span>
                                    </span>

                                </span>)}


                            </p>
                        </div>

                        <div className="vp-description">
                            <div className="description-heading">
                                <i className="fa-solid fa-bars"></i>
                                <p>Descriptions</p>
                            </div>

                            <div className="description-data">
                                {product.description}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

