const express = require("express")

const router = new express.Router()
const { isAuthenticatedUser , authorizeRoles} = require("../middleware/auth")
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    allUsers,
    userDetailes,
    updateUser,
    deleteUser
} = require("../controllers/authController")

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/me").get(isAuthenticatedUser, getUserDetails)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/password/update").put(isAuthenticatedUser, updatePassword)
router.route("/me/update").put(isAuthenticatedUser, updateProfile)
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),allUsers)
router.route("/admin/user/:id")
       .get(isAuthenticatedUser,authorizeRoles("admin"), userDetailes)
       .put(isAuthenticatedUser,authorizeRoles("admin"),updateUser )
       .delete(isAuthenticatedUser,authorizeRoles("admin"), deleteUser )

module.exports = router     