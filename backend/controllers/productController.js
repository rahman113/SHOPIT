
const Product = require('../models/product')
const ApiFeatures = require('../utils/apiFeatures')
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
// create new product  => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {

    // creating the instance of model
    const products = new Product({
        // req.body.user = req.user._id
        ...req.body,
        user: req.user._id
    })
    const product = await products.save()
    res.status(201).json({ success: true, msg: "product inserted successfully.", product })
})
// Get all products => /api/v1/products?keyword = apple
exports.getProducts = catchAsyncErrors(async (req, res) => {

    const resPerPage = 4;
    const productCount = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage)
    const products = await apiFeatures.query;
    res.status(200).json({ "success": "true", "count": products.length, productCount, products })
})

// Get a single product  => api/v1/product/:id

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {


    const product = await Product.findById(req.params.id)

    if (!product) return next(new ErrorHandler("produc not found", 404))

    res.json({ "success": "true", "count": product.length, product })
}
)
// update product => api/v1/admin/update/:id

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id)
    if (!product) return next(new ErrorHandler('product not found', 404))

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: true
    })
    res.status(200).json({ "success": "true", "count": product.length, product })
})
// delete a product => api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {


    let product = await Product.findById(req.params.id)
    if (!product) return next(new ErrorHandler('product not found', 404))
    await product.remove()
    res.status(200).json({ "success": true, "message": "product is deleted" })
})


// create new review => /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res) => {

    const { rating, comment, productId } = req.body
    console.log(rating, comment, productId)
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment

    }
    const product = await Product.findById(productId)
    console.log(product.reviews)
    const isReviewd = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewd) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review)
        product.numOf = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save()

    res.status(200).json({ "success": true, "message": "reviews" })
})
