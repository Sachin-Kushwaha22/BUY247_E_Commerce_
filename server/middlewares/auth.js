const { getUser } = require('../services/jwt')

exports.restrictAuth = async (req, res, next) => {
    const token = req.cookies?.authToken
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = getUser(token)

    if(!user) return res.status(401).json({ message: 'Unauthorized' })
    
    req.user = user
    next()
}

exports.adminAuth = (req, res, next) => {
    const token = req.cookies?.authToken
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = getUser(token)

    if(!user) return res.status(401).json({ message: 'Unauthorized' })
    
    if(user.role !== "admin") return res.status(403).json({ message: "Access denied. Admins only!" });

    next()
}