const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const sendToken = require("../utils/jwtToken")
// Register a user => /api/v1/register

exports.registerUser = catchAsyncErrors( async (req, res, next) => {

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
        sendToken(user,200, res)
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
exports.loginUser = catchAsyncErrors( async (req, res, next) => {
        const { email, password } = req.body
        console.log("Password",password)
        console.log("Email",email)

        // check if email ans password is entered by user
        if(!email || !password) {
            return next(new ErrorHandler("please enter  email and password", 400))
        }  
        const user = await User.findByCredentiales(email, password)
        sendToken(user,200, res)
})

// user logout => /api/v1/logout

exports.logoutUser = catchAsyncErrors( async (req, res, next) => {
    res.cookie("token",null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
        res.status(200).json({ sucess: true, message: 'user logged out successfully'
        })
    })
// // getting all users

// router.get('/user/all', async (req, res, next) => {
//     const users = await User.find({})
//     try {
//         res.status(200).json({
//             success: true,
//             count: users.length,
//             users
//         })
//     }
//     catch (e) {
//         res.status(500).send(e.message)
//     }
// })
// module.exports = router;