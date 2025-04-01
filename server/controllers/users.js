const pool = require('../config/database')

const getUsers = async (req, res) => {
    res.json('Hey World this is ecommerce website')
}

module.exports = {
    getUsers,
}