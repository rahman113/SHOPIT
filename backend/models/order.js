const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            validate: {
              validator: function (v) {
                return v !== "" ? /\+\d{1,3}\d{10}/.test(v) : true;
              },
              msg: "Phone number is invalid!",
            },
          },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
    },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        orderItems: [
            {
                name: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: String,
                    required: true
                },
                image: {

                },
                price: {
                    type: Number,
                    required: true
                },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product'
                }

            }
        ],
        paymentInfo: {
            id: {
                type: String,
                required: true
            },
            status: {
                type: String,
               required: true
            }

        },
        paidAt: {
            type: Date
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0
        },
        taxPrice: {
            type: Number,
            required: true,
            default: 0.0
        },
        shippingPrice: {
            type: Number,
            required: true,
            default: 0.0
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0

        },
        orderStatus: {
            type: String,
            required: true,
            default: 'processing'
        },
        deliverdAt: {
            type: Date,

            default: Date.now()
        },

        createdAt: {    
            type: Date,
            default: Date.now()
        }

    
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order;     