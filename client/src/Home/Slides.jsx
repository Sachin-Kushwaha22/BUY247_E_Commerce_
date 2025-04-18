import { useEffect, useState } from 'react'
import './HomePage.css'

export default function Slides() {
    const [slide, setSlide] = useState(0);

    useEffect(() => {
        // Set up the interval for automatic slide change every 3 seconds
        const interval = setInterval(() => {
          setSlide((prevSlide) => (prevSlide + 1) % 5); // Increment and loop back to 0 after reaching 2
        }, 3000); // Change slide every 3 seconds
    
        // Cleanup the interval when the component unmounts
        return () => clearInterval(interval);
      }, []);
    return(
        <div className="hm-slider-container">
                <div style={{transform:`translateX(${-slide * 100}%)`}} className="hm-slider">
                    <div className='hm-slide'>
                        <img alt="Sale Banner" src="/assets/slide1.webp" />
                        {/* <div className="hm-slide-content">
                            <h2>Summer Collection 2025</h2>
                            <p>
                                Discover the hottest trends for this season with up to 40% off on
                                selected items.
                            </p>
                            <button className="hm-slide-btn">Shop Now</button>
                        </div> */}
                    </div>
                    <div className='hm-slide'>
                        <img alt="New Arrivals" src="/assets/slide2.webp" />
                        {/* <div className="hm-slide-content">
                            <h2>New Arrivals</h2>
                            <p>Be the first to check out our latest products and collections.</p>
                            <button className="hm-slide-btn">Explore</button>
                        </div> */}
                    </div>
                    <div className='hm-slide'>
                        <img alt="Special Offers" src="/assets/slide3.webp" />
                        {/* <div className="hm-slide-content">
                            <h2>Special Offers</h2>
                            <p>Limited time deals on premium products. Don't miss out!</p>
                            <button className="hm-slide-btn">View Deals</button>
                        </div> */}
                    </div>
                    <div className='hm-slide'>
                        <img alt="Special Offers" src="/assets/slide4.webp" />
                        {/* <div className="hm-slide-content">
                            <h2>Special Offers</h2>
                            <p>Limited time deals on premium products. Don't miss out!</p>
                            <button className="hm-slide-btn">View Deals</button>
                        </div> */}
                    </div>
                    <div className='hm-slide'>
                        <img alt="Special Offers" src="/assets/slide5.webp" />
                        {/* <div className="hm-slide-content">
                            <h2>Special Offers</h2>
                            <p>Limited time deals on premium products. Don't miss out!</p>
                            <button className="hm-slide-btn">View Deals</button>
                        </div> */}
                    </div>
                </div>
            </div>
    )
}
