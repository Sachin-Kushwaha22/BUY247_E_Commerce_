import { useEffect, useState } from "react"
import axios from 'axios'
import serverUrl from "../../config"
import { useParams } from "react-router-dom"

export default function OrderItemProvider({children}){
    const { oid } = useParams()
    const [orderItems, setOrderItems] = useState([])

    const getOrderItem = async() => {
        try {
            const response = await axios.get(`${serverUrl}/order/orderItems/${oid}`,{
                withCredentials:true
            })
            if(response.status === 200){
                setOrderItems(response.data.orderItems)
                console.log(response.data.orderItems);
                
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        getOrderItem()
    },[])
    return typeof children === 'function' ? children(orderItems, getOrderItem) : children
}