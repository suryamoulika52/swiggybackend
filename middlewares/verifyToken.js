const Vendor=require('../models/Vendor');
const jwt=require('jsonwebtoken')
const dotEnv=require('dotenv')
dotEnv.config()
const secretKey = process.env.WhatIsMYName;
//next is function  it performs further actions after response is being accepted
const verifyToken=async(req,res,next)=>{
//we pass token to header because it sends request along with data to server
const token=req.headers.token;
if(!token){
    return res.status(401).json({message:"Token is required"});
}
try{
    //verify token with secretkey in dotenv file
const decoded=jwt.verify(token,secretKey)
//find decoded vendor id 
const vendor=await Vendor.findById(decoded.vendorId);
if(!vendor){
    return res.status(404).json({message:"Vendor not found"});
}
//compare vendorid of request with database vendorid
req.vendorId=vendor._id;
//above code iscorrect then next go to other function
next()
}catch(error){
    console.log(error)
    return res.status(401).json({message:"Token is not valid"});
}
}
module.exports=verifyToken;