const jwt = require('jsonwebtoken')

exports.setUser = (user) => {
    const payload = {
        id:user.id,
        fname:user.fname,
        lname:user.lname,
        emailOrPhone:user.email ? user.email : user.phone_number,
        role:user.role,
        profilePic:user.profilepic
    }
    return jwt.sign(
        payload, process.env.JWT_SECRET, { expireIn: '1d' }
    );
}

exports.getUser = (token) => {
    if(!token) return null
    return jwt.verify(token, process.env.JWT_SECRET)
}