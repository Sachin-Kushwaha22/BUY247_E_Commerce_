import { useEffect, useState } from 'react'
import './HomePage.css'

function HomePage() {
    const [slide, setSlide] = useState(0);

    useEffect(() => {
        // Set up the interval for automatic slide change every 3 seconds
        const interval = setInterval(() => {
          setSlide((prevSlide) => (prevSlide + 1) % 3); // Increment and loop back to 0 after reaching 2
        }, 3000); // Change slide every 3 seconds
    
        // Cleanup the interval when the component unmounts
        return () => clearInterval(interval);
      }, []);
    return (
        <div>
            <nav className="hm-navbar">
                <div>
                    <img className='hm-logo' src="/assets/logo.png" alt="" />
                </div>
                <div className="hm-search-container">
                    <input placeholder="Search for products..." type="text" />
                    <button>
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
                    <button className="hm-cart-btn">
                        <svg
                            fill="#2c3e50"
                            height="22"
                            viewBox="0 0 16 16"
                            width="22"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                        </svg>
                    </button>
                </div>
            </nav>
            <div className="hm-slider-container">
                <div style={{transform:`translateX(${-slide * 100}%)`}} className="hm-slider">
                    <div className='hm-slide'>
                        <img alt="Sale Banner" src="/api/placeholder/1200/500" />
                        <div className="hm-slide-content">
                            <h2>Summer Collection 2025</h2>
                            <p>
                                Discover the hottest trends for this season with up to 40% off on
                                selected items.
                            </p>
                            <button className="hm-slide-btn">Shop Now</button>
                        </div>
                    </div>
                    <div className='hm-slide'>
                        <img alt="New Arrivals" src="/api/placeholder/1200/500" />
                        <div className="hm-slide-content">
                            <h2>New Arrivals</h2>
                            <p>Be the first to check out our latest products and collections.</p>
                            <button className="hm-slide-btn">Explore</button>
                        </div>
                    </div>
                    <div className='hm-slide'>
                        <img alt="Special Offers" src="/api/placeholder/1200/500" />
                        <div className="hm-slide-content">
                            <h2>Special Offers</h2>
                            <p>Limited time deals on premium products. Don't miss out!</p>
                            <button className="hm-slide-btn">View Deals</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hm-products-container">
                <h2 className="hm-products-title">Featured Products</h2>
                <div className="hm-products-grid">
                    <div className="hm-product-card">
                        <img
                            alt="Product 1"
                            className="hm-product-image"
                            src="/api/placeholder/300/200"
                        />
                        <div className="hm-product-info">
                            <h3 className="hm-product-name">Wireless Headphones</h3>
                            <p className="hm-product-price">$129.99</p>
                            <button className="hm-add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                    <div className="hm-product-card">
                        <img
                            alt="Product 2"
                            className="hm-product-image"
                            src="/api/placeholder/300/200"
                        />
                        <div className="hm-product-info">
                            <h3 className="hm-product-name">Smart Watch</h3>
                            <p className="hm-product-price">$199.99</p>
                            <button className="hm-add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                    <div className="hm-product-card">
                        <img
                            alt="Product 3"
                            className="hm-product-image"
                            src="/api/placeholder/300/200"
                        />
                        <div className="hm-product-info">
                            <h3 className="hm-product-name">Leather Backpack</h3>
                            <p className="hm-product-price">$89.99</p>
                            <button className="hm-add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                    <div className="hm-product-card">
                        <img
                            alt="Product 4"
                            className="hm-product-image"
                            src="/api/placeholder/300/200"
                        />
                        <div className="hm-product-info">
                            <h3 className="hm-product-name">Bluetooth Speaker</h3>
                            <p className="hm-product-price">$79.99</p>
                            <button className="hm-add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                    <div className="hm-product-card">
                        <img
                            alt="Product 5"
                            className="hm-product-image"
                            src="/api/placeholder/300/200"
                        />
                        <div className="hm-product-info">
                            <h3 className="hm-product-name">Fitness Tracker</h3>
                            <p className="hm-product-price">$59.99</p>
                            <button className="hm-add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                    <div className="hm-product-card">
                        <img
                            alt="Product 6"
                            className="hm-product-image"
                            src="/api/placeholder/300/200"
                        />
                        <div className="hm-product-info">
                            <h3 className="hm-product-name">Wireless Charger</h3>
                            <p className="hm-product-price">$34.99</p>
                            <button className="hm-add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                    <div className="hm-product-card">
                        <img
                            alt="Product 7"
                            className="hm-product-image"
                            src="/api/placeholder/300/200"
                        />
                        <div className="hm-product-info">
                            <h3 className="hm-product-name">Smart Home Hub</h3>
                            <p className="hm-product-price">$149.99</p>
                            <button className="hm-add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                    <div className="hm-product-card">
                        <img
                            alt="Product 8"
                            className="hm-product-image"
                            src="/api/placeholder/300/200"
                        />
                        <div className="hm-product-info">
                            <h3 className="hm-product-name">Portable Power Bank</h3>
                            <p className="hm-product-price">$49.99</p>
                            <button className="hm-add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
}

export default HomePage