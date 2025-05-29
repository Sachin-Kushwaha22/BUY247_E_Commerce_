const express = require('express')
const cors = require('cors')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const auth = require('./routes/auth')
const userRoute = require('./routes/users')
const { adminAuth, restrictAuth } = require('./middlewares/auth')
const productsRoute = require('./routes/productsRoute')
const adminProductsRoute = require('./routes/adminProductsRoute')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/orders')
const adminOrdersRoute = require('./routes/adminOrdersRoute')
const checkoutRoute = require('./routes/checkout')
const adminRoute = require('./routes/admins')
const addressRoute = require('./routes/addressRoute')

require('dotenv').config();
const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
)
app.options("*", (req, res) => {
    res.sendStatus(200);
});
// enable it on time of production
// app.set("trust proxy", 1); 

app.use(express.json())
app.use(cookieParser())
app.use(helmet());
app.use(morgan("dev"))
// Create a rate limiter middleware
const limiter = rateLimiter({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    headers: true, // Adds X-RateLimit headers to responses
    standardHeaders: true, // Includes RateLimit headers in response
    legacyHeaders: false, // Disable deprecated headers
});

// Apply to all routes
app.use(limiter);

//routes api
// app.use('/', restrictAuth, userRoute)
app.use('/user', userRoute)
app.use('/', productsRoute)
app.use('/cart', restrictAuth, cartRoute)
app.use('/order', restrictAuth, orderRoute)
app.use('/checkout', restrictAuth, checkoutRoute)
app.use('/admin/order', adminAuth, adminOrdersRoute)
app.use('/api/admin/products', adminProductsRoute)
app.use('/api/auth', auth)
app.use('/api/admin', adminAuth, adminRoute)
app.use('/api/address',restrictAuth, addressRoute)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})