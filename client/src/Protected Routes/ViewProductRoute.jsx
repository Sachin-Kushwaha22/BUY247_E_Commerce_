import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import serverUrl from '../../config'
import axios from 'axios'

function ViewProductRoute({children}) {
    const { pid } = useParams()
  const [product, setProduct] = useState()

  const getProductById = async() => {
    try {
        const response = await axios.get(`${serverUrl}/${pid}`,{
            withCredentials: true
        })
        if(response.status === 200){
            setProduct(response.data.product[0])
        }
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(()=>{
    getProductById()
  },[pid])

  return typeof children === 'function' ? children(product, getProductById) : children;
}

export default ViewProductRoute