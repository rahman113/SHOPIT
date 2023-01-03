const express = require('express')

const crypto = require('crypto')
const User = require('../models/user')
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail")
// Register a user => /api/v1/register

exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, age, address, password } = req.body;
    const user = await User.create({
        name,
        email,
        age,
        address,
        password,
        avatar: {
            public_id: "ehgfakjdf73r7234",
            url: "wdcbileu/dguy/wdbe/2eee"

        }
    })
    sendToken(user, 200, res)
}

    // const users = new User(req.body)
    // try {
    //     const user = await users.save()
    //     res.status(201).json({
    //         sucess: true,
    //         message: 'user created successfully',
    //         user,
    //         token
    //     })
    // }
)
// user login => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body

    // check if email ans password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler("please enter  email and password", 400))
    }
    const user = await User.findByCredentiales(email, password)
    sendToken(user, 200, res)
})

// update /change password => /api/v1/password/update

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id)
    const isMatch = user.comparePassword(req.body.oldPassword)
    if (!isMatch) {
        return next(new ErrorHandler("old password is not correct", 400))

    }
    user.password = req.body.password
    await user.save()
    res.status(200).json({
        sucess: true,
        message: 'password updated successfully',
        user
    })
})
// Get currently loged in user Details => /api/v1/me
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        sucess: true,
        user
    })
}

);
// update UserProfile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserDetails = {
        name: req.body.name,
        email: req.body.email,
    }

    // Update avatar: TODO

    const user = await User.findByIdAndUpdate(req.user.id, newUserDetails,

        {
            new: true,
            runValidators: true,
            findAndModify: false

        })
    res.status(200).json({
        sucess: true,
        message: "User profile updated successfully",
    })
}
)
// forgot Password => /api/v1/password/forgoot   
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorHandler("user not found with this email", 404))

    }
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    console.log("resettoken", resetToken);
    await user.save({ validateBeforeSave: false })
    // create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token as is follow: \n\n${resetUrl}\n\n if you have not requested this email, then just ignored it `

    try {
        await sendEmail({
            email: user.email,
            subject: "SHOPIT PASSWORD RECOVERY",
            message: message
        })
        res.status(200).json({
            sucess: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler('Email could not be sent', 500))

    }

})

// reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Hash url token               

    const resetPasswordToken = crypto.
        createHash("sha256").
        update(req.params.token).
        digest("hex")
    console.log("resetpasswordToken", resetPasswordToken);
    const user = await User.findOne({

        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() } // expiry time that is save in db must be greater than current time
    })
    console.log("User", user);
    if (!user) {
        return next(new ErrorHandler("Password reset token is invalid or has been expired", 400))

    }
    if (req.body.password !== confirmPassword) {
        return next(new ErrorHandler("Password does not match ", 400))

    }
    // setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;


    await user.save()
    sendToken(user, 200, res)


})
// user logout => /api/v1/logout

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        sucess: true, message: 'user logged out successfully'
    })
})


// Admin Routes
// admin users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({
        sucess: true,
        count: users.length,
        users: users
    })
});

// get User Details => /api/v1/admin/user/:id
exports.userDetailes = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById({ _id: req.params.id })
    if (!user) {
        return next(new ErrorHandler(`user not found with id:  ${req.params.id}`))
    }
    res.status(200).json({
        sucess: true,
        user: user
    });
})
// admin update user profile => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {

    const newUserDetails = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserDetails,

        {
            new: true,
            runValidators: true,
            findAndModify: false

        })
    res.status(200).json({
        sucess: true,
        message: "User profile updated successfully",
    })
}
)

//  Delet user => /api/v1/admin/user/:id

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById({ _id: req.params.id })
    if (!user) {
        return next(new ErrorHandler(`user not found with id:  ${req.params.id}`))
    }
    // Remove avatar from cloudinary server: TODO
    await user.remove()
    res.status(200).json({
        sucess: true,
        message: "User profile deleted successfully",
        user: user
    });
})



