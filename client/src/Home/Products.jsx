import { useEffect, useState } from 'react'
import './HomePage.css'
import axios from 'axios'
import serverUrl from '../../config'
import { useCart } from '../Context/CartContext'
import { Link } from 'react-router-dom'

export default function Products({ getCartItem }) {
    const { dispatch } = useCart()
    const [productsData, setProductsData] = useState([])

    const getProducts = async () => {
        try {
            const response = await axios.get(`${serverUrl}`, {
                withCredentials: true
            })
            if (response.status === 200) {
                // console.log(response.data.products)
                setProductsData(response.data.products)
            }
        } catch (error) {
            console.log('Error from HomePage Reload', error);
        }
    }

    useEffect(() => {
        getProducts()
    }, [])



    return (
        <div className="hm-products-container">
            {/* <h2 className="hm-products-title">Featured Products</h2> */}
            <div className="hm-products-grid">
                {productsData.length === 0 ? <p>Loading....</p> : productsData.map((product) => (
                    <Link to={`/product/${product.id}`} style={{textDecoration:'none'}}>
                        <div key={product.id} onClick={() => {

                        }} className="hm-product-card">
                            <div className="hm-product-img-div">
                                <img
                                    alt="Product 1"
                                    className="hm-product-image"
                                    src={product.image_url}
                                />
                            </div>
                            <div className="hm-product-info">
                                <p className="hm-product-brand">{product.brand}</p>
                                <p className="hm-product-name">{product.name}</p>
                                <p className="hm-product-specs">Specs : </p>
                                <p className="hm-product-review">review optional </p>
                                <p className="hm-product-price">₹{product.price}</p>
                                {/* <button onClick={() => {
                                handleAddToCart(product.id)
                            }} className="hm-add-to-cart">Add to Cart</button> */}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}