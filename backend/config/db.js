const mongoose = require('mongoose');

const connectToDb = () =>{
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log('Database Connected Successfully!');
    })
    .catch((err)=>{
        console.error('Database connection error:', err);
    })
}

module.exports = connectToDb;