const client = require('../config/redis')
const pool = require('../config/database')

const getUserProfile = async (req, res) => {
    try {
        const { uid } = req.body
        if(!uid) return res.status(401).json('Unauthorized')
        const getUserProfileRedis = await client.get(`userProfileData:${uid}`)
        if(getUserProfileRedis) return res.status(200).json({message:'user profile data', user: JSON.parse(getUserProfileRedis)})
        const userDetail = await pool.query(
            `select id as userid,
            fname,
            lname,
            email,
            phone_number
            from users
            where id = $1`,
            [uid]
        )

        if(userDetail.rowCount === 0 ) return res.status(404).json('NO DaTA FOund')

        await client.set(`userProfileData:${uid}`, JSON.stringify(userDetail.rows))
        return res.status(200).json({Message:'user profile data', user: userDetail.rows})
    } catch (error) {
        console.log('error from getUserProfile', error);
        return res.status(500).json('Server Internal Error during getting user profile data')
    }
}

const getUserAddress = async (req, res) => {
    try {
        const {  uid } = req.body 
        const userAddressRedis = await client.get(`userAddress:${uid}`)
        if (userAddressRedis) return res.status(200).json({message:'user address', user: JSON.parse(userAddressRedis)})
        const userAddress = await pool.query(
            `select * from userAddress
            where userid = $1`,
            [uid]
        )

        if(userAddress.rowCount === 0) return res.status(404).json('No data Found')
        
        await client.set(`userAddress:${uid}`, JSON.stringify(userAddress))
        return res.status(200).json({message:'user addresses', address: userAddress.rows})
    } catch (error) {
        console.log('error from getUserAddress', error);
        return res.status(500).json('Server Internal Error during getting user address')
    }
}


const deleteUserAcc = async (req, res) => {
    try {
        const { uid } = req.body

        const deleteAcc = await pool.query(
            `delete from users where id = $1 returning *`,
            [uid]
        )

        if(deleteAcc.rowCount === 0) return res.status(404).json({message:'User not found'})
        const token = req.cookies?.authToken
        if(token) res.clearCookies("authToken")
        return res.status(200).json({message:'User account deleted', DeletedUser: deleteAcc.rows})
    } catch (error) {
        console.log('error from deleteUserAcc', error);
        return res.status(500).json('Server Internal Error during deleteing user account')
    }
}
module.exports = {
    getUserProfile,
    getUserAddress,
    deleteUserAcc
}