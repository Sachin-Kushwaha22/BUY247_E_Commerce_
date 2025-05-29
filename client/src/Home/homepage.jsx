import { useEffect, useState } from 'react'
import './HomePage.css'
import NavBar from './NavBar';
import Slides from './Slides';
import Products from './Products';

function HomePage({cart, getCartItem}) {
    return (
        <div>
            <NavBar cart={cart} />
            <Slides />
            <Products getCartItem={getCartItem}/>
        </div>
        )
}

export default HomePage