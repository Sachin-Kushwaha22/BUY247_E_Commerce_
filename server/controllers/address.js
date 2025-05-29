const pool = require('../config/database')

exports.setAddress = async (req, res) => {
    try {
        const uid = req.user.id
        const { user_name,
            phone_number,
            pincode,
            locality,
            street,
            district,
            state,
            landmark,
            alternate_phone_number,
            type } = req.body

        const address = await pool.query(
            `insert into useraddress(userid, user_name, phone_number, alternate_phone_number, locality, district, state, landmark, type, pincode, street)
            values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *`,
            [uid, user_name,
                phone_number,
                alternate_phone_number,
                locality,
                district,
                state,
                landmark,
                type,
                pincode,
                street ]
        )

        if(address.rowCount === 0) throw new error('address did not saved try again')

        return res.status(200).json({message:'address saved', address:address.rows[0]})
        
    } catch (error) {
        if (error.code === '23505') {
            // Check if the error is related to the home/work address unique constraint
            if (error.constraint === 'unique_home_address') {
                return res.status(400).json({ message: "You can only have one 'home' address." });
            }
            if (error.constraint === 'unique_work_address') {
                return res.status(400).json({ message: "You can only have one 'work' address." });
            }
        }
        
        console.log(error);
        return res.status(500).json('Server error during setting address')
    }
}

exports.setShippingAddress = async (req, res) => {
    const client_pg = await pool.connect();
    try {
        // Start a transaction
        await client_pg.query('BEGIN');

        const uid = req.user.id;
        const { orderid, addressid, addressText } = req.body;

        // Update the address in the users table (if necessary)
        const updateUserAddressQuery = `
            UPDATE users
            SET shipping_address = $1
            WHERE id = $2
        `;
        await client_pg.query(updateUserAddressQuery, [addressid, uid]);
        console.log(addressText);
        

        // Update the address in the orders table
        const updateOrderAddressQuery = `
            UPDATE orders
            SET shipping_address = $1  
            WHERE o_id = $2
        `;
        const result = await client_pg.query(updateOrderAddressQuery, [addressText, orderid]);
        console.log(result);
        

        // Commit the transaction
        await client_pg.query('COMMIT');

        return res.status(200).json({ message: "Shipping address updated successfully" });

    } catch (error) {
       
        await client_pg.query('ROLLBACK');
        console.log("Error in setShippingAddress:", error);
        return res.status(500).json({ message: 'Server Internal Error while setting shipping address' });
    } finally {
        // Release the client back to the pool
        client_pg.release();
    }
};


exports.getAddress = async(req, res) => {
    try {
        const uid = req.user.id

        const address = await pool.query(
            `select * from useraddress where userid = $1`,[uid]
        )

        if(address.rowCount === 0) return res.status(404).json('No Address Found')
        
        return res.status(200).json({ message:'Address fetched', address: address.rows})
    } catch (error) {
        console.log('error during getting saved address', error);
        return res.status(500).json('Server internal error during getting saved address')
    }
}

exports.setShippingAddressForOrder = async (req, res) => {
    const client_pg = await pool.connect();
    try {
        // Start a transaction
        await client_pg.query('BEGIN');

        const uid = req.user.id;
        const { orderid, addressText } = req.body;

         // Update the address in the orders table
        const updateOrderAddressQuery = `
            UPDATE orders
            SET shipping_address = $1  
            WHERE o_id = $2
        `;
        const result = await client_pg.query(updateOrderAddressQuery, [addressText, orderid]);
        

        // Commit the transaction
        await client_pg.query('COMMIT');

        return res.status(200).json({ message: "Shipping address updated successfully" });

    } catch (error) {
       
        await client_pg.query('ROLLBACK');
        console.log("Error in setShippingAddress:", error);
        return res.status(500).json({ message: 'Server Internal Error while setting shipping address' });
    } finally {
        // Release the client back to the pool
        client_pg.release();
    }
};