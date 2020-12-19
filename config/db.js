const mongoose = require("mongoose");
const connectDb = async () => {
    const connection = await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    console.log(`MongoDB connect ${connection.connection.host}`)
}
module.exports = connectDb