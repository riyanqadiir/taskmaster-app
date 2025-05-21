const mongoose = require('mongoose');

const connectToDb = () =>{
    mongoose.connect("mongodb://localhost:27017/TaskMaster").then(()=>{
        console.log('Database Connected Successfully!');
    })
    .catch((err)=>{
        console.error('Database connection error:', err);
    })
}

module.exports = connectToDb;