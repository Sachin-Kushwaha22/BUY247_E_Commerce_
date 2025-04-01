// importing twilio which helps to send otps in sms or mail
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);


export const sendMessage = async (phone, otp) => {
    console.log('otp sent');

    await client.messages.create({
        body: `Your OTP is ${otp}. It expires in 5 minutes.`,
        from: '+12138164291',
        to: phone
    });
};