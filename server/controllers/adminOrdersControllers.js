const pool = require('../config/database');
const client = require('../config/redis');

exports.orderStatus = async (req, res) => {
    try {
        const { o_id, status } = req.query

        if (!o_id || !status) {
            return res.status(400).json({ message: "Missing required fields: o_id or status" });
        }

        const query =
            `UPDATE orders
            SET status = $1
            where o_id = $2
            returning *`;

            const update = await pool.query(query, [status, o_id])

            if (update.rowCount === 0) {
                return res.status(404).json({ message: "Order not found or already updated" });
            }

            await client.del(`orderByOrderId:${o_id}`)
            return res.status(200).json({ message: "Order status updated ", update: update.rows})
        

    } catch (error) {
        console.log('error from orderItem', error)
        return res.status(500).json({ message: 'Server error while ordering a product' })
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const { o_id, payment_status } = req.query

        if (!o_id || payment_status !== 'Refunded') {
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
            return res.status(200).json({ message: "Order status updated 'Refunded'", update: update.rows})
        

    } catch (error) {
        console.log('error from updateStatus', error)
        return res.status(500).json({ message: 'Server error while updating order status' })
    }
}

exports.getAllOrders = async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 20
        const offset = (page - 1) * limit
        const cacheKey = `orders_page_${page}_limit_${limit}`
        const redisData = await client.get(cacheKey)
        if(redisData) return res.status(200).json({ message: 'all orders list', allOrders:JSON.parse(redisData)})
        
        const allOrders = await pool.query(
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
            limit $1 offset $2`,
            [limit, offset]
        )

        if (allOrders.rowCount === 0) {
            return res.status(404).json({ message:'data not found'})
        }
        await client.setex(cacheKey,3600, JSON.stringify(allOrders.rows))
        return res.status(200).json({ message: 'all orders list', allOrders: allOrders.rows})

    } catch (error) {
        console.log('error from getAllOrdersAdmin', error)
        return res.status(500).json({ message: 'Server error while getting all orders admin' })
    }
}