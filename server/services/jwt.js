const jwt = require('jsonwebtoken')

exports.setUser = (user) => {
    const payload = {
        id:user.id,
        fname:user.fname,
        lname:user.lname,
        email:user.email,
        role:user.role
    }
    console.log('payload', payload)
    return jwt.sign(
        payload, process.env.JWT_SECRET, { expiresIn: '1d' }
    );
}

exports.getUser = (token) => {
    if(!token) return null
    return jwt.verify(token, process.env.JWT_SECRET)
}