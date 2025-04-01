const path = require('path');
const Queue = require("bull");
const Redis = require("ioredis");
const transporter = require('./nodemailer')
// Redis connection
const redisClient = new Redis();

// Create a Bull queue for OTP emails
const otpQueue = new Queue("otp-email-queue", {
    redis: { host: "127.0.0.1", port: 6379 },
});


// Function to add OTP email to the queue
const addToOTPQueue = async (to, otp) => {
    await otpQueue.add({ to, otp }, { attempts: 3, removeOnComplete: true });
};

// Process queue jobs (send OTP emails)
otpQueue.process(async (job, done) => {
    const { to, otp } = job.data;
    try {
        const info = await transporter.sendMail({
            from: '"BUY247" <sachin8n@gmail.com>',
            to: to,
            subject: "Your OTP Code - BUY247",
            html: `<div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9; text-align: center;">
    <img src="cid:logo" alt="BUY247 Logo" style="max-width: 150px; margin-bottom: 10px;">
    <h2 style="color: #333;">BUY247 OTP Verification</h2>
    <p style="margin-bottom: 10px;">Hello,</p>
    <p style="margin-bottom: 10px;">Your OTP code for verification is:</p>
    <div style="font-size: 24px; font-weight: bold; background: #007bff; color: white; padding: 10px; border-radius: 5px; display: inline-block; margin: 10px auto;">
        ${otp}
    </div>
    <p style="margin-bottom: 10px;">This OTP is valid for <strong>3 minutes</strong>. Do not share it with anyone.</p>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    <p style="font-size: 12px; color: #666;">If you didn’t request this, please ignore this email.</p>
</div>`,
attachments: [
    {
        filename: '24.png',
        path: path.resolve(__dirname, '24.png'),
        cid: 'logo' // Same as used in `cid:logo` inside HTML
    }
]
        });

        console.log("Email sent:", info.response);
        done(); // Mark job as completed
    } catch (error) {
        console.error("Error sending email:", error);
        done(error); // Retry or fail the job
    }
});

// Export queue functions
module.exports = { addToOTPQueue };