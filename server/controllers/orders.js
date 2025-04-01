const pool = require('../config/database')
const client = require('../config/redis')

exports.orderItem = async (req, res) => {
    try {
        const { uid, pid, totalprice } = req.body

        const order = await pool.query(
            `insert into orders(userid, pid, totalprice)
            values($1, $2, $3) returning *`,
            [uid, pid, totalprice]
        )
        await client.del(`orderByUserId:${uid}`)
        return res.status(200).json({ message: "order saved ready to be placed", orderItem: order.rows })

    } catch (error) {
        console.log('error from orderItem', error)
        return res.status(500).json({ message: 'Server error while ordering a product' })
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const { o_id, payment_status } = req.query

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
            return res.status(200).json({ message: "Order status updated 'Paid'", update: update.rows})
        

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
            return res.status(200).json({message:'orders by userid', orders: JSON.parse(redisOrder)})
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

        if(getOrder.rowCount === 0) return res.status(404).json({message:'no order data found'})
        
        await  client.set(`ordersByUserId:${uid}`, JSON.stringify(getOrder.rows))
        return res.status(200).json({ message:'Order found', orderById:getOrder.rows})
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
            return res.status(200).json({message:'order Data by orderid', order: JSON.parse(redisOrderData)})
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
            where o.o_id = $1`,
            [o_id]
        );

        if(getOrder.rowCount === 0) return res.status(404).json({message:'no order data found'})
        
        await client.set(`orderByOrderId:${o_id}`, JSON.stringify(getOrder.rows))
        return res.status(200).json({ message:'Order found', orderById:getOrder.rows})
    } catch (error) {
        console.log('error from getOrderById', error)
        return res.status(500).json({ message: 'Server error while getting order by id' })
    }
}