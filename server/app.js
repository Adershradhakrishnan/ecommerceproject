const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

const connect = require('./db/config');
const userRoutes = require('./routes/userroutes');

app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

app.use(userRoutes);
         app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
         app.use('/getproduct',userRoutes);
         app.use('/updateproduct',userRoutes);
         app.use('/deleteproduct',userRoutes);
         app.use('/cartproducts',userRoutes);
         app.use('addreview',userRoutes);

connect();


app.listen(process.env.PORT,()=> {
    console.log(`server listening at http://localhost:${process.env.PORT}`);
})