const crypto = require("crypto");
const razorpay = require('../config/razorpay')

exports.orderCheckout = async (req, res) => {
    try {
        const { amount, currency, o_id } = req.body;

        const options = {
            amount: amount * 100, // Razorpay accepts amount in paise (INR 100 = 10000 paise)
            currency: currency || "INR",
            receipt: o_id
        };

        const order = await razorpay.orders.create(options);
        return res.json(order);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // Update order status in the database
        return res.json({ success: true, message: "Payment Verified!" });
    } else {
        return res.status(400).json({ success: false, message: "Payment Verification Failed!" });
    }
}