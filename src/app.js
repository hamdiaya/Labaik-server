require('dotenv').config();
const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const authCandidat=require('./routes/auth_candidat');
const registration=require('./routes/registration')

const app=express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use('/authCnadidat',authCandidat);
app.use('/registration',registration);

app.listen(3000,()=>{
    console.log('listening to port 3000');
})