const pool = require('../config/database')
const client = require('../config/redis')



exports.getCartItems = async (req, res) => {
    try {
        // const { id } = req.params
        const id = req.user.id
        const cacheData = await client.get(`cartItems:${id}`)

        if(cacheData) return  res.status(200).json({message:'Cart Items', cartItems:JSON.parse(cacheData)})

        const cart = await pool.query(
            `select c.id as cartid, 
            p.id as productid, 
            p.name, 
            p.description, 
            p.price, 
            p.stock, 
            p.category, 
            p.image_url, 
            p.brand, 
            c.quantity
            from cart c
            join products p on c.productid = p.id
            where c.userid = $1`,
            [id]
        )

        if(cart.rowCount === 0 ) return res.status(404).json({message:'Cart Empty'})

        await client.setex(`cartItems:${id}`,3600, JSON.stringify(cart.rows))
        
        return res.status(200).json({message:'Cart Items', cartItems:cart.rows})
    } catch (error) {
        console.log("Error from getCartItems", error)
        return res.status(500).json({ message: 'Server error during get cart items' })
    }
}

exports.addToCart = async (req, res) => {
    try {
        const { pid } = req.params
        const uid = req.user.id

        const doExist = await pool.query(
            'SELECT * FROM cart WHERE productid = $1 and userid = $2', [pid, uid]
        );

        if (doExist.rows.length > 0) return res.status(400).json({ message: 'item already exist in cart' })

        const addToCart = await pool.query(
            `Insert into cart(userid, productid)
            values($1, $2) RETURNING *`,
            [uid, pid]
        )

        if (addToCart.rowCount === 0) return res.status(400).json({ message: 'Error while adding to cart' })

        await client.del(`cartItems:${uid}`)
        return res.status(200).json({ message: 'added to cart', product: addToCart.rows })
    } catch (error) {
        console.log("Error from addTOCArt", error)
        return res.status(500).json({ message: 'Server error during adding product to cart' })
    }
}

exports.removeFromCart = async (req, res) => {
    try {
        const uid = req.user.id
        const { cartid } = req.params

        const remove = await pool.query(
            `DELETE FROM cart WHERE id = $1 RETURNING *`,
            [cartid]
        );

        if (remove.rowCount === 0) {
            return res.status(404).json({ message: 'Product not found to remove' })
        }

        await client.del(`cartItems:${uid}`)
        return res.status(200).json({ message: 'Product removed', removedProduct: remove.rows })
    } catch (error) {
        console.log("Error from removeFromCart", error)
        return res.status(500).json({ message: 'Server error during removing product from cart' })
    }
}

exports.changeItemQuantity = async (req, res) => {
    try {
        const uid = req.user.id;
        const { cartid, quantity } = req.body
        
        if(quantity === 'inc'){
            const query =  `update cart
                        set quantity = quantity + 1
                        where id = $1 RETURNING *`
            const itemQuantity = await pool.query(query, [cartid])
            if (itemQuantity.rowCount === 0) {
                return res.status(404).json({ message: 'Product not found to update quantity' })
            }
            await client.del(`cartItems:${uid}`)
            return res.status(200).json({message:'quantity increases by 1', product:itemQuantity.rows})
        }
        else if(quantity === 'dec'){
            const query =  `update cart
                        set quantity = GREATEST(quantity - 1, 0)
                        where id = $1 RETURNING *`
            const itemQuantity = await pool.query(query, [cartid])
            if (itemQuantity.rowCount === 0) {
                return res.status(404).json({ message: 'Product not found to update quantity' })
            }

            await client.del(`cartItems:${uid}`)
            return res.status(200).json({message:'quantity increases by 1', product:itemQuantity.rows})
        }

        return res.status(404).json({ message: 'Invalid quantity alter request' })
    } catch (error) {
        console.log("Error from changeItemQuantity", error)
        return res.status(500).json({ message: 'Server error during changing product quantity in cart' })
    }
}

exports.clearCart = async (req, res) => {
    try {
        const { uid } = req.params
        await client.del(`cartItems:${uid}`)
        const clearCart = await pool.query(
            `delete from cart where userid = $1`,
            [uid]
        )

        if (clearCart.rowCount === 0) {
            return res.status(200).json({ message: 'Cart was already empty' });
        }
        
        return res.status(200).json({message:'cart cleared'})
    } catch (error) {
        console.log("Error from clearCart", error)
        return res.status(500).json({ message: 'Server error during clearing cart' })
    }
}