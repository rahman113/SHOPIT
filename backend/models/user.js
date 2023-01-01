const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require("crypto")
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a userName'],
        maxlength: [30, "userName can not excedd 30 characters"],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'please provide an email address'],
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value))
                throw new Error('Error', 'Invalid email address')
        }
    },
    age: {
        type: Number,
        required: [true, 'please provide an user Age'],
        default: 0,
        validate(value) {
            if (value < 0)
                throw new Error('Age must be a positive number', value)
        }
    },
    address: {
        type: String,
        required: [true, 'please provide an address'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'please provide user password'],
        trim: true,
        select: true,
        minlength: [7, 'password should contain atleast 7 characters'],
        validate(value) {
            if (value.toLowerCase().includes('password'))
                throw new Error('password  can not contain passwod', value)
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
   
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamp: true
})
//delete some sensitive data like password and token .
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject;
}
// Return JWT token
userSchema.methods.generateAuthToken = async function(){
     const user = this 
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
    const data = jwt.verify(token, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token;   
}   
userSchema.statics.findByCredentiales = async (email, password) => {
    // finding user in database 
    const user = await User.findOne( {email: email} )
    if (!user) {    
        throw new Error('Invalid email')
    }
//check if password is correct or not
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Invalid password')
    }
    return user
}

// hash the plain text password before saving the user
userSchema.pre('save', function (next) {
    const user = this
    // if data is not modified
    if (!user.isModified("password")) {
        next()
    }
    bcrypt.hash(user.password, 08, (err, hash) => {
        if (err) {
            return next(err)
        }
        user.password = hash
         next()
    })
})
// compare user password
 userSchema.methods.comparePassword = async function (password) {
     return await bcrypt.compare(password, this.password)
 }   
// Generate passwrod reset token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex") 

    // hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
console.log("model file", this.resetPasswordToken);
    // set token expires time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000 // resetPasswordToken expires in 30 minutes
    return resetToken
}

const   User = mongoose.model('User', userSchema)
module.exports = User;