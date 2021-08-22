const express = require('express');
const app = express();
const cors = require('cors');
const authRouter = require('./auth.routes');
const userRouter = require('./user.routes');
const emergencyRouter = require('./emergency.routes');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors())


app.use('/auth/',authRouter);
app.use('/users/',userRouter);
app.use('/emergency/',emergencyRouter)

module.exports = app;