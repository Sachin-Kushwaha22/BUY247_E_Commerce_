import { useEffect, useState } from "react"
import axios from 'axios'
import serverUrl from "../../config"

export default function CartProvider({children}){
    const [cart, setCart] = useState([])

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
            if(error?.response?.status === 401){
                const response = {"message":error.response.data?.message, status:error.response.status}
                return response
            }
        }
    }
    useEffect(()=>{
        getCartItem()
    },[])
    return typeof children === 'function' ? children(cart, getCartItem) : children
}