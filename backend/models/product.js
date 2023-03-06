const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter the product name '],
        trim: true,
        maxLength: [100, 'maxLength of the product can not exceed 100 characters']

    },
    price: {
        type: Number,
        required: [true, 'please enter the product price '],
        maxLength: [5, 'maxLength of the product price can not exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'please enter the product decsription '],

    },
    ratings: {
        type: Number,
        max: 5.0,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: false
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'please select the category for this product'],
        enum: {
            values: [
                'Electronics',
                'Cameras',
                'Books',
                'Accessories',
                'Headphones',
                'Food',
                'Laptops',
                'Mobiles',
                'Clothes',
                'Shoes',
                'Sports',
                'Beauty/Health',
                'Outdoor',
                'Home',
                'Hardware'
            ],
            mesg: 'Please select correct cateogory of product'
        }
    },
    seller: {
        type: String,
        required: [true, 'please enter product seller']
    },

    stock: {
        type: Number,
        required: [true, 'please enter product stock'],
        maxLength: [5, 'product stock can not exceed 5 characters'],
        default: 0
    },
    numofReviews: {
        type: Number,
        default: 0

    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                //required: true,
                ref: 'User'
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
        ref: 'User'
    }
},

    {// createdAt: {
        //     type: Date,
        //     default: Date.now
        // }
        timestamps: true
    })
module.exports = mongoose.model('Product', productSchema)

