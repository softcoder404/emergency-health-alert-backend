const mongoose = require('mongoose')
require('dotenv').config()

module.exports = async()=>{
        console.log("connecting to DB.....")    
        try{
                let conn = await mongoose.connect(process.env.MONGODB_URI,{
                        useFindAndModify:false,
                        useNewUrlParser:true,
                        useUnifiedTopology:true,
                        useCreateIndex:true
                })
            console.log(`connected to DB successfully. host:${conn.connection.host}`)    
        }catch(err){
                console.log(`An error occur while trying to connect to DB: ${err}`)
                process.exit(1)
        }
}