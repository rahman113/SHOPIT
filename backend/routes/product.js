const express = require("express")

const router = new express.Router()
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth")
const {newProduct, getProducts, getSingleProduct, updateProduct,deleteProduct } = require("../controllers/productController")
router.route("/products").get(isAuthenticatedUser,authorizeRoles("admin"),getProducts)
router.route("/product/:id").get(getSingleProduct)
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles("admin"),newProduct)
router.route("/admin/product/:id")
    .put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
    .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)



module.exports = router