const express = require("express")
const errorMiddlaware = require("./middleware/errors")
const app = express()

const cookieParser = require("cookie-parser")
app.use(express.json())
app.use(cookieParser())


// import all the routes
const products = require("./routes/product")
const auth = require("./routes/auth")
const order = require("./routes/order")
app.use("/api/v1", products)
app.use("/api/v1", auth)
app.use("/api/v1", products)
app.use("/api/v1", order)
// Middleware to handler errors
app.use(errorMiddlaware)
module.exports = app;
// ataur_rahman@qwertycode.in
// github password: git113@#$
//skype: qwerty12@# website link: https://signup.live.com/signup
// alchamey: alchemy@#
// mantisBT: rahman(pass) username(Ataur)
// postman: rahman123@#$%
// https://dvignesh1496.medium.com/email-verification-and-password-reset-flow-using-golang-c8bd037101e8
// https://levelup.gitconnected.com/crud-restful-api-with-go-gorm-jwt-postgres-mysql-and-testing-460a85ab7121