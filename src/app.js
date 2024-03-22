require('dotenv').config();
const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const routes=require('../src/routes/auth');
const cookieParser = require('cookie-parser');


const app=express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/',routes);


app.listen(3000,()=>{
    console.log('listening to port 3000');
})