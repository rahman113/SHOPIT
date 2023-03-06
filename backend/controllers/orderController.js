
const Product = require("../models/product")

const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const Order = require("../models/order")



// create a new order => /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res) => {

    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,


    } = req.body;

    const order = await Order.create({

        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order: order
    })
})

// get a single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res) => {



    const order = await Order.findById(req.params.id).populate("user", "name email")

    if (!order) {
        return next(new ErrorHandler('product not found', 404))
    }
    res.status(200).json({
        success: true,
        order: order
    })
})

// get login user order => /api/v1/me
exports.myOrders = catchAsyncErrors(async (req, res) => {

    const orders = await Order.find({ user: req.user.id })
    res.status(200).json({
        success: true,
        count: orders.length,
        orders: orders
    })
})



// admin  get all Orders - ADMIN => /api/v1/admin/orders
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()
    //console.log(orders.totalPrice);
    let totalAmount = 0
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })
    res.status(200).json({
        //sucess: true,
        //totalAmount: totalAmount,
        count: orders.length,
        orders,
        totalAmount
    }
    )
});

// Update /process order - ADMIN => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler('You have delivered this order', 400))
    }
    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus =req.body.status
    order.deliverdAt = Date.now()
    await order.save()

    res.status(200).json({
        sucess: true
    }
    )
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id)
      console.log("product" ,product);
    product.stock = product.stock - quantity
    await product.save()
}


// romve order => /api/v1/order/admin/:id
exports.deleteOrder = catchAsyncErrors(async (req, res) => {



    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler('product not found with id: ', 404))
    }
    await order.remove()
    res.status(200).json({
        success: true,
        message: "order deleted successfully"
    })
})