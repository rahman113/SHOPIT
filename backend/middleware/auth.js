
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require("./catchAsyncErrors")

// check if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors( async (req, res, next) => {
   
        //const token = req.header('Authorization').replace('Bearer ', '')
        const { token } = req.cookies
        if (!token) return next(new ErrorHandler("login first to access the resources", 401))
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user)  return next(new ErrorHandler("user not found", 404))
        req.token = token
        req.user = user
        next()
})

//Handling user roles
exports.authorizeRoles = (...roles)  => {
        return (req,res, next) => {
                if(!roles.includes(req.user.role)) return next(new ErrorHandler(`Role ${req.user.role} is not allowed to this `,403))
                next()
        }}