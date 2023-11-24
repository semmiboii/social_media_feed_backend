const mongoose = require('mongoose');
require('dotenv').config();

async function connectToDB() {

    try {
        
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        if (conn) {
            console.log("Connected to MongoDB succesfully.");
        }

    } catch(e) {

        console.log("Error connecting to MongoDB",e);
    
    }
    
}

module.exports = connectToDB;

