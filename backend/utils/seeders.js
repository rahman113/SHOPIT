const Product = require('../models/product')
const connectionDatabase = require('../db/mongoose')
const products = require('../data/product')

const dotenv = require('dotenv') 

// setting the dotenv file

dotenv.config({path: 'backend/config/dev.env'})

connectionDatabase()

const seedProducts = async () => {
    try {
        const data = await Product.deleteMany()
        console.log('products are deleted')

        const insertData = await Product.insertMany(products)
        console.log('products inserted to the database successfully')
         process.exit()

    }catch(err) {
        console.log('error',err)
         process.exit()
    }
}
seedProducts()