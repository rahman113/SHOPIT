// create and send token ans save the cookie

const sendToken =  async(user, statusCode, res) => {
    // create JWT token
    const token = await user.generateAuthToken()
    // options for cookie
    const options = {
        httpOnly: true,
        expires: new Date( Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000)

}

res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user
})
}
module.exports = sendToken