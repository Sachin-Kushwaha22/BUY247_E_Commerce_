const express = require('express')
const cors = require('cors')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const auth = require('./routes/auth')
const userRoute = require('./routes/user')
const { restrictAuht, adminAuth, restrictAuth } = require('./middlewares/auth')
const productsRoute = require('./routes/productsRoute') 
const adminProductsRoute = require('./routes/adminProductsRoute')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/orders')
const adminOrdersRoute = require('./routes/adminOrdersRoute')

require('dotenv').config();
const app = express();

app.use(
    cors({
        origin: '*',
        Credential: true,
    })
)

// enable it on time of production
// app.set("trust proxy", 1); 

app.use(express.json())
app.use(cookieParser())
app.use(helmet());
app.use(morgan("dev"))
// Create a rate limiter middleware
const limiter = rateLimiter({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    headers: true, // Adds X-RateLimit headers to responses
    standardHeaders: true, // Includes RateLimit headers in response
    legacyHeaders: false, // Disable deprecated headers
});

// Apply to all routes
app.use(limiter);

//routes api
// app.use('/', restrictAuth, userRoute)
app.use('/', productsRoute)
app.use('/cart', restrictAuth, cartRoute)
app.use('/order', restrictAuth, orderRoute)
app.use('/admin/order', adminAuth, adminOrdersRoute)
app.use('/api/admin/products', adminAuth, adminProductsRoute)
app.use('/api/auth', auth)

const PORT = process.env.PORT || 2025
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})