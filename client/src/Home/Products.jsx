import { useEffect, useState } from 'react'
import './HomePage.css'
import axios from 'axios'
import serverUrl from '../../config'
import { useCart } from '../Context/CartContext'

export default function Products() {
    const { dispatch } = useCart()
    const [productsData, setProductsData] = useState([])

    const getProducts = async()=> {
        try {
            const response = await axios.get(`${serverUrl}`,{
                withCredentials:true
            })
            if(response.status === 200){
                // console.log(response.data.products)
                setProductsData(response.data.products)
            }
        } catch (error) {
            console.log('Error from HomePage Reload', error);
        }
    }

    useEffect(()=>{
        getProducts()
    },[])

    const handleAddToCart = async(pid) => {
        dispatch({ type: 'Add_to_cart', payload: pid })
        try {
            const response = await axios.post(`${serverUrl}/cart/add/${pid}`,{},{
                withCredentials:true
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    
    return(
        <div className="hm-products-container">
                <h2 className="hm-products-title">Featured Products</h2>
                <div className="hm-products-grid">
                    {productsData.length === 0 ? <p>Loading....</p> : productsData.map((product)=>(
                        <div key={product.id} className="hm-product-card">
                        <img
                            alt="Product 1"
                            className="hm-product-image"
                            src={product.image_url}
                        />
                        <div className="hm-product-info">
                            <h2 className="hm-product-name">{product.brand}</h2>
                            <h3 className="hm-product-name">{product.name}</h3>
                            <p className="hm-product-price">₹{product.price}</p>
                            <button onClick={() => {
                                handleAddToCart(product.id)
                            }} className="hm-add-to-cart">Add to Cart</button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
    )
}