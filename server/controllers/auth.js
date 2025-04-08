require('dotenv').config();
const pool = require('../config/database')
const client = require('../config/redis')
const { setUser, getUser } = require('../services/jwt')
const bcrypt = require('bcryptjs')
const path = require('path')
// importing nodemailer transporter for email services
const { addToOTPQueue } = require('../config/queue')
const transporter = require('../config/nodemailer')

const rateLimit = require("express-rate-limit");

exports.registerUser = async (req, res) => {

    try {
        const { phone_number, otp, fname, lname, email, password } = req.body;

        // hash password before saving
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // insert new user now
        const result = await pool.query(
            `insert into users(fname, lname, email, phone_number, password) 
            values($1, $2, $3, $4, $5) RETURNING id, fname, lname, email, role, created_at`,
            [fname, lname, email, phone_number, hashedPassword]
        )
        if (result.rows.length === 0) return res.status(400).json({ message: ' registration failed' })

        const identifier = phone_number ? `otp:${phone_number}` : `otp:${email}`;
        const redisOTP = await client.get(identifier)
        if (!redisOTP) return res.status(401).json({ message: 'otp not generated' })

        if (redisOTP !== otp) return res.status(401).json({ message: 'Invalid OTP' })

        // console.log('result',result.rows[0])
        const token = setUser(result.rows[0])

        if (!token) return res.status(401).json({ message: 'token not created' })
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only secure in production
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })

        const user = result.rows[0];
        res.status(200).json({
            message: 'Registered and Login successful',
            user: {
                id: user.id,
                email: user.email,
                first_name: user.fname,
                last_name: user.lname,
                role: user.role
            }
        });
    } catch (error) {
        console.error('register error:', error);
        res.status(500).json({ message: 'Server error during register and login' });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { phone_number, email, password, otp, role = 'user'} = req.body;
        let getUser = await client.get(`checkUser:${phone_number || email}`)
        let user = JSON.parse(getUser)
        if (!user) {
            getUser = await pool.query(
                `select * from users where email = $1 or phone_number = $2 and role = $3`,
                [email, phone_number, role]
            )
            if (getUser.rowCount === 0) return res.status(401).json({ Message: 'unexpected error occured' })
            user = getUser.rows[0]
        }

        if (otp) {
            const identifier = phone_number ? `otp:${phone_number}` : `otp:${email}`;
            const redisOTP = await client.get(identifier)
            if (redisOTP !== otp) return res.status(401).json({ message: 'Invalid OTP' })

            const token = setUser(user)
            if (!token) return res.status(401).json({ message: 'token not created' })

            res.cookie('authToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Only secure in production
                sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            })
            
            return res.status(200).json({ message: "LoggedIn Successfully" })
        }


        let checkPassword = user.password

        console.log(checkPassword);

        const isPasswordValid = await bcrypt.compare(password, checkPassword)

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = setUser(user)
        if (!token) return res.status(401).json({ message: 'token not created' })

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Only secure in production
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })

        return res.status(200).json({ message: "LoggedIn Successfully" })

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
}

exports.logoutUser = async (req, res) => {
    try {
        const token = req.cookies?.authToken
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        res.clearCookie("authToken");

        return res.status(201).json('Logout Successfully')


    } catch (error) {
        console.error('logout error:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
}

exports.checkExisting = async (req, res) => {
    try {
        const { phone_number, email } = req.body;

        const doExist = await pool.query(
            `SELECT * FROM users WHERE email = $1 OR phone_number = $2`,
            [email, phone_number]
        )

        if (doExist.rowCount > 0) {
            const identifier = phone_number ? `otp:${phone_number}` : `otp:${email}`;
            await client.setex(identifier, 1200, JSON.stringify(doExist.rows[0]))
            const message = await generateOTP(phone_number, email)
            return res.status(200).json({ message: `user exist otp send ${message}`, user: doExist.rows })
        }

        return res.status(404).json({ message: 'Data not found' })
    } catch (error) {
        console.error('checking existing user phone or email error:', error);
        return res.status(500).json({ message: 'Server error during checking existing phone or email' });
    }

}


exports.generateResendOTP = async (req, res) => {
    try {
        const { phone_number, email } = req.body;
        const message = await generateOTP(phone_number, email)

        return res.status(200).json('otp generated')
    } catch (error) {
        console.log(error);
        
        return res.status(500).json('Server error by generating otp after resend')
    }
}

const generateOTP = async (phone_number, email) => {
    const otp = Math.floor(100000 + Math.random() * 900000)
    if (email) {
        await addToOTPQueue(email, otp)
        // mail(email, otp)
        await client.setex(`otp:${email}`, 300, otp)
        return true
    }else{
        // const identifier = phone_number ? `otp:${phone_number}` : `otp:${email}`;
        // sendOTP(phone_number)
        // await client.setex(`otp:${phone_number}`, 180, otp);
        // return { message: 'otp is generated' }
    }
}



// const mail = async (to, otp) => {
//     try {
//         const info = await transporter.sendMail({
//             from: '"BUY247" <buy247n@gmail.com>',
//             to: to,
//             subject: "Your OTP Code - BUY247",
//             html: `<div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
//     <h2 style="color: #333; text-align: center;">Transaction Alert</h2>
//     <p>Dear Customer,</p>
//     <p>Your account XXXX5678 has been credited with <strong>₹5,000.00</strong>.</p>
//     <p>Transaction Details:</p>
//     <ul style="list-style: none; padding: 0; font-size: 14px;">
//         <li><strong>Amount:</strong> ₹5,000.00</li>
//         <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
//         <li><strong>Reference No:</strong> TXN${Math.floor(Math.random() * 1000000000)}</li>
//         <li><strong>Remarks:</strong> Cashback Credit</li>
//     </ul>
//     <p>Your available balance is: <strong>₹32,540.75</strong></p>
//     <p style="font-size: 12px; color: #666;">If you did not perform this transaction, please contact customer support immediately.</p>
//     <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
//     <p style="font-size: 12px; color: #666; text-align: center;">This is an auto-generated email. Please do not reply.</p>
// </div>`,
//             attachments: [
//                 {
//                     filename: '24.png',
//                     path: path.resolve(__dirname, '24.png'),
//                     cid: 'logo' // Same as used in `cid:logo` inside HTML
//                 }
//             ]
//         });

//         console.log("Email sent:", info.response);

//     } catch (error) {
//         console.error("Error sending email:", error);

//     }
// }