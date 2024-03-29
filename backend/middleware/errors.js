const ErrorHandler = require("../utils/errorHandler")

module.exports = (err, req, res, next) =>  {
    err.statusCode = err.statusCode || 500;
  if(process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
        success: false,
        error: err,
        errMessage : err.message,
        stack: err.stack

    })
  }
  if(process.env.NODE_ENV === "PRODUCTION") {
    let error = {...err} 
    error.message = err.message;

// wrong mongoose object ID  error
if(err.name === "CastError") {

  const message = `Resource not found. Invalid: ${err.pathg}`
  error = new ErrorHandler(message, 400)
}

// Handling mongoose validation errors  

if(err.name === "ValidatorError") {
  const message = Object.values(err.errors).map(value => value.message)
  error = new ErrorHandler(message, 400)
}
// Handling monggose  duplicate key errors
if(err.code === 11000) {
  const message = `Duplicate ${Object.keys(err.keVakue)} entered`
  error = new ErrorHandler(message, 400)

}
// Handling wrong jwt error
if(err.name === "JsonWebTokenError") {
  const message = "JSON Web Token is invalid! Try again"
  error = new ErrorHandler(message, 400)
}
// Handling expired jwt error

if(err.name === "TokenExpiredError"){
  const message = "JSON Web Token is expired! Try again"
  error = new ErrorHandler(message, 400)
}
  res.status(err.statusCode).json({ success: false,  message: err.message || "internal server error" })
  }
}