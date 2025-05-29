const pool = require('../config/database')
const client = require('../config/redis')

exports.orderItem = async (req, res) => {
    const client_pg = await pool.connect();

    try {
        await client_pg.query('BEGIN');
        const uid = req.user.id

        const cartItems = await getCartItemsFromDB(uid);
        if (!cartItems || cartItems.length === 0) {
            throw new Error('Cart is empty, cannot place order.');
        }


        const totalAmountRaw = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
        const totalDiscount = cartItems.reduce((total, item) => total + (parseFloat(item.price) * (parseFloat(item.discount) / 100)) * item.quantity, 0);
        const totalprice = Number(totalAmountRaw - totalDiscount).toFixed(2)


        // Step 1: Insert into orders table
        const orderResult = await client_pg.query(
            `INSERT INTO orders(userid, totalprice)
         VALUES($1, $2) 
         RETURNING *`,
            [uid, totalprice]
        );
        const order = orderResult.rows[0];
        await client.del(`orderByUserId:${uid}`)

        // Step 3: Insert all cart items into order_items
        for (const item of cartItems) {
            await client_pg.query(
                `INSERT INTO order_items(orderid, productid, quantity, price)
           VALUES($1, $2, $3, $4)`,
                [
                    order.o_id, // orderid
                    item.productid, // productid
                    item.quantity || 1, // quantity
                    item.price, // price
                ]
            );
        }

        await client_pg.query('COMMIT');

        return res.status(200).json({ message: "order saved ready to be placed", orderItem: order })

    } catch (error) {
        await client_pg.query('ROLLBACK');
        console.log('error from orderItem', error)
        return res.status(500).json({ message: 'Server error while ordering a product' })
    } finally {
        client_pg.release(); // Always release the client to avoid memory leaks
    }
}

const getCartItemsFromDB = async (id) => {
    try {
       

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
            c.quantity,
            p.discount
            from cart c
            join products p on c.productid = p.id
            where c.userid = $1`,
            [id]
        )

        if (cart.rowCount === 0) return { message: 'Cart Empty' }

        return cart.rows
    } catch (error) {
        console.log("Error from getCartItems", error)
        return { message: 'Server error during get cart items' }
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const { o_id, payment_status } = req.body

        if (!o_id || payment_status !== 'Paid') {
            return res.status(400).json({ message: "Missing required fields: o_id or payment_status" });
        }

        const query =
            `UPDATE orders
            SET payment_status = $1
            where o_id = $2
            returning *`;

        const update = await pool.query(query, [payment_status, o_id])

        if (update.rowCount === 0) {
            return res.status(404).json({ message: "Order not found or already updated" });
        }


        await client.del(`orderByOrderId:${o_id}`)
        return res.status(200).json({ message: "Order status updated 'Paid'", update: update.rows })


    } catch (error) {
        console.log('error from updateStatus', error)
        return res.status(500).json({ message: 'Server error while updating order status' })
    }
}

exports.getAllOrders = async (req, res) => {
    try {
        const { uid } = req.params
        const redisOrder = await client.get(`orderByUserId:${uid}`)
        if (redisOrder) {
            return res.status(200).json({ message: 'orders by userid', orders: JSON.parse(redisOrder) })
        }
        const getOrder = await pool.query(
            `select o.o_id as orderid,
            u.id as userid,
            u.fname,
            u.lname,
            u.email,
            p.id as productid,
            p.name,
            p.description,
            p.price as baseprice,
            o.totalprice as finalprice,
            p.stock,
            p.category,
            p.image_url,
            o.payment_status,
            o.status

            from orders o
            join users u on o.userid = u.id
            join products p on o.pid = p.id
            where o.userid = $1`,
            [uid]
        );

        if (getOrder.rowCount === 0) return res.status(404).json({ message: 'no order data found' })

        await client.set(`ordersByUserId:${uid}`, JSON.stringify(getOrder.rows))
        return res.status(200).json({ message: 'Order found', orderById: getOrder.rows })
    } catch (error) {
        console.log('error from getAllOrders', error)
        return res.status(500).json({ message: 'Server error while getting all orders' })
    }
}


exports.getOrderById = async (req, res) => {
    try {
        const { o_id } = req.params
        const redisOrderData = await client.get(`orderByOrderId:${o_id}`)
        if (redisOrderData) {
            return res.status(200).json({ message: 'order Data by orderid', orderById: JSON.parse(redisOrderData) })
        }
        const getOrder = await pool.query(
            `select o.o_id as orderid,
            u.id as userid,
            u.fname,
            u.lname,
            u.email,
            p.id as productid,
            p.name,
            p.description,
            p.price,
			oi.quantity,
            o.totalprice as finalprice,
            p.stock,
            p.category,
            p.image_url,
            o.payment_status,
            o.status,
			o.shipping_address

            from orders o
            join users u on o.userid = u.id
            join order_items oi on o.o_id = oi.orderid
			join products p on oi.productid = p.id
            where o.o_id = $1`,
            [o_id]
        );

        if (getOrder.rowCount === 0) return res.status(404).json({ message: 'no order data found' })

        await client.set(`orderByOrderId:${o_id}`, JSON.stringify(getOrder.rows[0]))
        return res.status(200).json({ message: 'Order found', orderById: getOrder.rows[0] })
    } catch (error) {
        console.log('error from getOrderById', error)
        return res.status(500).json({ message: 'Server error while getting order by id' })
    }
}


exports.getOrderItems = async (req, res) => {
    try {
        const { oid } = req.params

        const result = await pool.query(
            `select oi.id as orderItems_id,
            p.name, 
            p.category, 
            p.image_url, 
            p.brand, 
            oi.quantity, 
            oi.price
            from order_items oi
            join products p on oi.productid = p.id 
            where oi.orderid = $1
            `, [oid]
        )

        if (result.rowCount === 0) return res.status(404).json('No orderItems Found')

        return res.status(200).json({ message: 'OrderItems fetched', orderItems: result.rows })
    } catch (error) {
        console.log(error);
        return res.status(500).json('Server Internal error while getting order items')
    }
}


exports.changeItemQuantity = async (req, res) => {
    try {
        // const uid = req.user.id;
        const { orderItemsId, quantity } = req.body

        if (quantity === 'inc') {
            const query = `update order_items
                        set quantity = quantity + 1
                        where id = $1 RETURNING *`
            const itemQuantity = await pool.query(query, [orderItemsId])
            if (itemQuantity.rowCount === 0) {
                return res.status(404).json({ message: 'Product not found to update quantity' })
            }

            const orderid = itemQuantity.rows[0].orderid
            const orderItems = await getOrderItems(orderid)
            const totalAmountRaw = orderItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
            const totalDiscount = orderItems.reduce((total, item) => total + (parseFloat(item.price) * (parseFloat(item.discount) / 100)) * item.quantity, 0);
            const totalprice = Number(totalAmountRaw - totalDiscount).toFixed(2)

            await updateOrderPrice(orderid, totalprice)

            return res.status(200).json({ message: 'quantity increases by 1', orderItems: itemQuantity.rows })
        }
        else if (quantity === 'dec') {
            const query = `update order_items
                        set quantity = GREATEST(quantity - 1, 0)
                        where id = $1 RETURNING *`
            const itemQuantity = await pool.query(query, [orderItemsId])
            if (itemQuantity.rowCount === 0) {
                return res.status(404).json({ message: 'Product not found to update quantity' })
            }

            const orderid = itemQuantity.rows[0].orderid
            const orderItems = await getOrderItems(orderid)
            const totalAmountRaw = orderItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
            const totalDiscount = orderItems.reduce((total, item) => total + (parseFloat(item.price) * (parseFloat(item.discount) / 100)) * item.quantity, 0);
            const totalprice = Number(totalAmountRaw - totalDiscount).toFixed(2)

            await updateOrderPrice(orderid, totalprice)

            return res.status(200).json({ message: 'quantity descreases by 1', orderItems: itemQuantity.rows })
        }

        return res.status(404).json({ message: 'Invalid quantity alter request' })
    } catch (error) {
        console.log("Error from changeItemQuantity", error)
        return res.status(500).json({ message: 'Server error during changing product quantity in cart' })
    }
}

exports.removeOrderItem = async (req, res) => {
    try {
        const { id } = req.params

        const remove = await pool.query(
            `DELETE FROM order_items WHERE id = $1 RETURNING *`,
            [id]
        );

        if (remove.rowCount === 0) {
            return res.status(404).json({ message: 'Product not found to remove' })
        }

        return res.status(200).json({ message: 'Product removed', removedItem: remove.rows })
    } catch (error) {
        console.log(error);
        return res.status(500).json('Server Internal Problem')
    }
}


const updateOrderPrice = async (oid, totalPrice) => {
    try {
        const result = await pool.query(
            `update orders
            set totalprice = $1
            where o_id = $2
            returning *`,[totalPrice, oid]
        )

        if (result.rowCount === 0) {
            return { message: "Order not found or already updated" }
        }
    
        console.log(result.rows[0].totalprice);
        
        return result.rows
    } catch (error) {
        console.log(error);
    }
}

const getOrderItems = async (oid) => {
    try {

        const result = await pool.query(
            `select oi.id as orderItems_id,
            p.name, 
            p.category, 
            p.image_url, 
            p.brand, 
            oi.quantity, 
            oi.price,
            p.discount
            from order_items oi
            join products p on oi.productid = p.id 
            where oi.orderid = $1
            `, [oid]
        )

        if (result.rowCount === 0) return null

        return result.rows
    } catch (error) {
        console.log(error);
    }
}