const pool = require('../config/database')
const client = require('../config/redis')
const { getUser, setUser } = require('../services/jwt')
const bcrypt = require('bcryptjs')

exports.adminLogin = async (req, res) => {
    try {
        const { phone_number, email, password, otp, role = 'admin' } = req.body;

        const getUser = await pool.query(
            `select * from users where email = $1 or phone_number = $2 and role = $3`,
            [email, phone_number, role]
        )
        if (getUser.rowCount === 0) return res.status(404).json({ Message: 'Admin account not found' })
        const user = getUser.rows[0]


        if (otp) {
            const identifier = phone_number ? `otp:${phone_number}` : `otp:${email}`;
            const redisOTP = await client.get(identifier)
            if (redisOTP !== otp) return res.status(401).json({ message: 'Invalid OTP' })

            const token = setUser(user)
            if (!token) return res.status(401).json({ message: 'token not created' })

            res.cookie('adminAuthToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Only secure in production
                sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            })

            return res.status(200).json({ message: "LoggedIn Successfully" })
        }


        let checkPassword = user.password

        const isPasswordValid = await bcrypt.compare(password, checkPassword)

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = setUser(user)
        if (!token) return res.status(401).json({ message: 'token not created' })

        res.cookie('adminAuthToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only secure in production
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })

        return res.status(200).json({ message: "admin LoggedIn Successfully" })

    } catch (error) {
        console.error('admin Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
}

exports.logoutAdmin = async (req, res) => {
    try {
        const adminid = req.user.id
        const token = req.cookies?.adminAuthToken
        if (!token) { return res.status(401).json('Token not found, unauthorized') }

        const admin = getUser(token)
        if (!admin) { return res.status(401).json('User not found, unauthorized') }

        if (admin.role === 'admin' && admin.id === adminid) {
            res.clearCookie('adminAuthToken')
            return res.status(200).json('Admin logout')
        }
        return res.status(403).json('you are not admin, access denied')
    } catch (error) {
        console.log('error from logoutAdmin', error);
        return res.status(500).json('Internal Server error during logout admin')
    }
}

exports.checkAdminAuth = async (req, res) => {
    const token = req.cookies?.adminAuthToken

    if (!token) return res.status(401).json({ message: 'token not found or expired, Unauthorized' })

    const admin = getUser(token)

    if (!admin) return res.status(401).json({ message: 'admin not found, Unauthorized' })

    if (admin.role !== "admin") return res.status(403).json({ message: "Access denied. Admins only!" });

    return res.status(200).json({ message: 'Authorized Admin', admin: admin })
}


exports.getAllUsers = async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 20
        const offset = (page - 1) * limit
        const cacheKey = `users_page_${page}_limit_${limit}`
        const getUsersRedis = await client.get(cacheKey)

        if (getUsersRedis) return res.status(200).json({ message: 'All users data', users: JSON.parse(getUsersRedis) })

        const query = await pool.query(
            `SELECT * FROM users ORDER BY fname asc LIMIT $1 OFFSET $2`,
            [limit, offset]
        )

        if (query.rowCount === 0) return res.status(404).json('Data not found')

        await client.setex(cacheKey, 3600, JSON.stringify(query.rows))
        return res.status(200).json({ message: 'All users data', users: query.rows })

    } catch (error) {
        console.log('error while getAllUsers')
        return res.status(500).json('Server error while getting all users data')
    }
}