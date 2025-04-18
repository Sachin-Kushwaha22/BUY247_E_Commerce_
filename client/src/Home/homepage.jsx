import { useEffect, useState } from 'react'
import './HomePage.css'
import NavBar from './NavBar';
import Slides from './Slides';
import Products from './Products';

function HomePage() {
    return (
        <div>
            <NavBar />
            <Slides />
            <Products />
        </div>
        )
}

export default HomePage