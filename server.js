const express = require('express');
const morgan = require('morgan')
const appRouter = require('./src/routes/app.routes');
const connectToMongoDB = require('./src/configs/db')

require('dotenv').config();
const app = express()


const PORT = process.env.PORT;
connectToMongoDB();

app.use(appRouter);
app.use(morgan('dev'))

app.listen(PORT,()=>{
        console.log(`Emergency Health Alert System Server is running on port: ${PORT}`)
})