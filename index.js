const express=require('express');

const dotEnv=require('dotenv');
const mongoose=require('mongoose');
const vendorRoutes=require('./routes/vendorRoutes');
const firmRoutes=require('./routes/firmRoutes')
const productRoutes=require('./routes/productRoutes')
const bodyParser=require('body-parser');

const cors=require('cors');
const path=require('path');
const app=express();
const PORT=process.env.PORT||4000;
dotEnv.config();
app.use(cors())
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Database connected successfully");
})
.catch((error)=>{
    console.log(error);
})
//middleware 
//the data is parsed to json format
app.use(bodyParser.json());
//the data from registered vendor in database
//the vendor/register is url because the vendorRoutes has data from post with url '/register'
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'))
app.listen(PORT,()=>{
    console.log(`server started and running at ${PORT}`);
});

app.use('/',(req,res)=>{
    res.send("<h1>SWIGGY</h1>");
})
