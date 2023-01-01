const mongoose = require('mongoose')

const connectionDatabase = () => {
   mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
      //   useCreateIndex: false,
      //   useFindAndModify: false
   }).then(res => {
      console.log(`MongoDB Database Connected with HOST: ${res.connection.host}`)
   }).catch(err => {
      console.log(`Error: ${err.message}`)
      process.exit(1)
   })
}
module.exports = connectionDatabase;