import React from 'react'
import CartPageProvider from './CartPageProvider'
import ViewProductRoute from './ViewProductRoute'
import ViewProduct from '../ViewProducts/ViewProduct'

function ViewCartAndProductRoute() {
    return (
        <CartPageProvider>
            {(cart, getCartItem) => <ViewProductRoute>
                {(product, getProductById) => <ViewProduct product={product} getProductById={getProductById} cart={cart} getCartItem={getCartItem} />}
            </ViewProductRoute>}
        </CartPageProvider>
    )
}

export default ViewCartAndProductRoute