import './HomePage.css'
import { useCart } from '../Context/CartContext'
import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useState } from 'react';
import ModalWrapper from '../ModalWrapper'
import Signup from '../Customers/Auth'

export default function NavBar({ cart }) {
    const navigate = useNavigate()
    const { state } = useCart()
    const [openSignUp, setOpenSignUp] = useState(false)
    
    return (
        <div>
            <div className="nav-shadow"></div>
            <nav className="hm-navbar">
                <div>
                    <img className='hm-logo' src="/assets/logo.png" alt="" />
                </div>
                <div className="hm-search-container">
                    <input placeholder="Search for products..." type="text" />
                    <button className='searchBtn'>
                        <svg
                            fill="#777"
                            height="16"
                            viewBox="0 0 16 16"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </button>
                </div>
                <div className="hm-nav-buttons">
                    <div className="hm-login-container">
                        <button className="hm-login-btn">
                            <i className='fa-regular fa-user' style={{ marginRight:'5px'}}></i>
                            Account
                        </button>
                        <div className="hm-dropdown-content">

                            <div style={{ display:'flex', flexDirection:'row', alignItems:'center',justifyContent:'space-between', padding:'0', gap:'10px', color:'black'}}>
                                <div>New Customer ?</div>
                                <button className='dropDown-signup' style={{fontSize:'1rem', color:'blue'}} onClick={() => {
                                    setOpenSignUp(true)
                                }}>Sign Up</button>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid black'}} />

                            <div className='dropDown-rows' style={{ display:'flex', flexDirection:'row', alignItems:'center', padding:'7px 0px', gap:'10px', color:'black'}}>
                                <div><i className="fa-regular fa-circle-user" style={{fontSize:'1.1rem'}}></i></div>
                                <div style={{fontSize:'1rem'}}>My Profile</div>
                            </div>
                            
                            <div className='dropDown-rows' style={{ display:'flex', flexDirection:'row', alignItems:'center', padding:'7px 0px', gap:'10px', color:'black'}}>
                                <div><i className="bi bi-box-seam" style={{fontSize:'1rem'}}></i></div>
                                <div style={{fontSize:'1rem'}}>Orders</div>
                            </div>
                            
                            <div className='dropDown-rows' style={{ display:'flex', flexDirection:'row', alignItems:'center', padding:'7px 0px', gap:'10px', color:'black'}}>
                                <div><i className="fa-regular fa-heart" style={{fontSize:'1.1rem'}}></i></div>
                                <div style={{fontSize:'1rem'}}>Wishlist</div>
                            </div>
                            
                            <div className='dropDown-rows' style={{ display:'flex', flexDirection:'row', alignItems:'center', padding:'7px 0px', gap:'10px', color:'black'}}>
                                <div><i className="bi bi-gift" style={{fontSize:'1.1rem'}}></i></div>
                                <div style={{fontSize:'1rem'}}>Rewards</div>
                            </div>
                            
                            <div className='dropDown-rows' style={{ display:'flex', flexDirection:'row', alignItems:'center', padding:'7px 0px', gap:'10px', color:'black'}}>
                                <div><i className="bi bi-credit-card-2-back" style={{fontSize:'1.1rem'}}></i></div>
                                <div style={{fontSize:'1rem'}}>Gift Cards</div>
                            </div>
                            

                        </div>
                    </div>
                    <button onClick={() => navigate('/user/cart')} className="hm-cart-btn">
                        <svg className='cart-img' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M29.4 8.85A2.48 2.48 0 0 0 27.53 8H14a1 1 0 0 0 0 2h13.53a.47.47 0 0 1 .36.16.48.48 0 0 1 .11.36l-1.45 10a1.71 1.71 0 0 1-1.7 1.48H14.23a1.72 1.72 0 0 1-1.68-1.33L10 8.79l-.5-1.92A3.79 3.79 0 0 0 5.82 4H3a1 1 0 0 0 0 2h2.82a1.8 1.8 0 0 1 1.74 1.36L8 9.21l2.6 11.88A3.72 3.72 0 0 0 14.23 24h10.62a3.74 3.74 0 0 0 3.68-3.16l1.45-10a2.45 2.45 0 0 0-.58-1.99zM16 25h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2zM25 25h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2z" /></svg>
                        {cart.length > 0 && (
                            <span className="hm-cart-count">{cart.length}</span>
                        )}
                        Cart

                    </button>
                </div>
            </nav>

            <div>
        {openSignUp && (
          <>
            <ModalWrapper onClose={() => setOpenSignUp(false)}>
              <Signup signUp={true}/>
            </ModalWrapper>
          </>
        )}
      </div>
        </div>
    )
}