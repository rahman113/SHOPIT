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
const NODE_ENV = process.env.NODE_ENV;
connectionDatabase();
const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${NODE_ENV} mode.`)
})



// Handle Unhandled promise rejections

process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`)
    console.log("shutting down the server due to unhandeled promise rejections")
    server.close(() => {
        process.exit(1)
    })
});