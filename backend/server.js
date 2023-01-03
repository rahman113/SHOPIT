const app = require("./app")
const connectionDatabase = require('./db/mongoose')
const dotenv = require('dotenv')

// Handle uncaught exceptions

process.on('uncaughtException', function (err) {
    console.log(`Error: ${err.stack}`)
    console.log("shutting down the server due to uncaught exception")
   process.exit(1)
})
// setting up config file
 dotenv.config({ path:'backend/config/dev.env'});

//connecting to dataBase

connectionDatabase();
const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})



/* Handle Unhandled promise rejections
ex: mongod://127.0.0.1:27017/SHOPIT
*/
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.meassage}`)
    console.log("shutting down the server due to unhandeled promise rejections")
    server.close(() => {
        process.exit(1)
    })
}); 