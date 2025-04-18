import './HomePage.css'
import { useCart } from '../Context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function NavBar() {
    const navigate = useNavigate()
    const { state } = useCart()
    return(
        <div>
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
                            <svg
                                fill="#2c3e50"
                                height="18"
                                style={{
                                    marginRight: "5px",
                                }}
                                viewBox="0 0 16 16"
                                width="18"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                            </svg>
                            Account
                        </button>
                        <div className="hm-dropdown-content">
                            <form>
                                <input placeholder="Email" type="email" />
                                <input placeholder="Password" type="password" />
                                <button type="submit">Login</button>
                            </form>
                        </div>
                    </div>
                    <button onClick={() => navigate('/user/cart')} className="hm-cart-btn">
                    <svg className='cart-img' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M29.4 8.85A2.48 2.48 0 0 0 27.53 8H14a1 1 0 0 0 0 2h13.53a.47.47 0 0 1 .36.16.48.48 0 0 1 .11.36l-1.45 10a1.71 1.71 0 0 1-1.7 1.48H14.23a1.72 1.72 0 0 1-1.68-1.33L10 8.79l-.5-1.92A3.79 3.79 0 0 0 5.82 4H3a1 1 0 0 0 0 2h2.82a1.8 1.8 0 0 1 1.74 1.36L8 9.21l2.6 11.88A3.72 3.72 0 0 0 14.23 24h10.62a3.74 3.74 0 0 0 3.68-3.16l1.45-10a2.45 2.45 0 0 0-.58-1.99zM16 25h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2zM25 25h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2z"/></svg>
                        {state.cartItems.length > 0 && (
                            <span className="hm-cart-count">{state.cartItems.length}</span>
                        )}
                        Cart

                    </button>
                </div>
            </nav>
        </div>
    )
}