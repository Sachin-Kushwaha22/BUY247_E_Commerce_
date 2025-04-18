import { useEffect, useState } from "react"
import axios from 'axios'
import serverUrl from "../../config"

export default function CartProvider({children}){
    const [cart, setCart] = useState([])

    useEffect(()=>{
        const getCartItem = async() => {
            try {
                const response = await axios.get(`${serverUrl}/cart/items`,{
                    withCredentials:true
                })
                if(response.status === 200){
                    setCart(response.data.cartItems)
                }
            } catch (error) {
                console.log(error);
            }
        }
        
        getCartItem()
    },[])
    return typeof children === 'function' ? children(cart) : children
}