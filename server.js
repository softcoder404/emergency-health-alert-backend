const express = require('express');
const morgan = require('morgan')
const cors = require('cors');

require('dotenv').config();
const app = express()

app.use(cors());

const PORT = process.env.PORT;

app.use(express.urlencoded({
        extended: false
}));
app.use(express.json());

app.use('/',(req,res)=>{
        res.status(200).json({'status':'success','message': 'Hey Yo!, Welcome to emergency health alert system'})
})


//handling error for invalid request or any kind of other errors thrown
app.use((req, res, next) => {
        let error = new Error("Request Not Found !");
        error.status = 404;
        next(error);
    });
    
app.use((error, req, res, next) => {
        res.status(error.status || 500).json({
            error: {
                status: error.status,
                message: error.message
            }
        });
    });
//end route points

app.use(morgan('dev'))

app.listen(PORT,()=>{
        console.log(`Emergency Health Alert System Server is running on port: ${PORT}`)
})