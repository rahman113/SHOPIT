const express = require("express")

const router = new express.Router()
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth")
const {
    newProduct, 
    getProducts, 
    getSingleProduct, 
    updateProduct,
    deleteProduct , 
    createProductReview,
    getProductReviews,
    deleteReviews
} = require("../controllers/productController")
router.route("/products").get(isAuthenticatedUser,authorizeRoles("admin"),getProducts)
router.route("/product/:id").get(getSingleProduct)
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles("admin"),newProduct)
router.route("/admin/product/:id")
    .put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
    .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)


router.route("/review").put(isAuthenticatedUser, createProductReview)
router.route("/reviews").get(isAuthenticatedUser, getProductReviews)
router.route("/reviews").delete(isAuthenticatedUser,deleteReviews )
module.exports = router