const Vendor=require('../models/Vendor')
const dotEnv=require('dotenv');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const cors=require('cors');
dotEnv.config();
const secretKey=process.env.WhatIsMyName;
const vendorRegister=async(req,res)=>{
    const{username,email,password}=req.body;
    try{
        //it helps to find if the email given is already present in database or not i.e already used  or not
const vendorEmail=await Vendor.findOne({email});
if(vendorEmail){
    return res.status(400).json("Email already taken");
}
//it hash the password for 10 rounds 
const hashedPassword=await bcrypt.hash(password,10);
//the vendor data is accessed using object 
const newVendor=new Vendor({
    username,
    email,
    password:hashedPassword
});
//data is saved 
await newVendor.save();
res.status(201).json({message:"Vendor registered successfully"});
console.log("registered");
    }
    catch(error){
        console.error(error);
res.status(500).json({error:"Internal server error"});
    }
}
const vendorLogin=async(req,res)=>{
    const{email,password}=req.body;
    try{
        //it helps to check if the email given is already present in database and given values are equal or not

const vendor=await Vendor.findOne({email});
if(!vendor||!(await bcrypt.compare(password,vendor.password))){
return res.status(401).json({error:"Invalid email or password"});
    }
    
        //jwt token is used to allow only authorized users i.e unauthorized persons cannot modify vendor data
        //the token will be active for 1hr,after 1 hr it generates other token
        //the token will generate for login,it changes each for each time you login
        const token=jwt.sign({vendorId:vendor._id},secretKey,{expiresIn:"1h"});
    res.status(201).json({success:"Login successful",token});
    console.log(email);
    
}
    catch(error){
        console.log(error);
res.status(500).json({error:"Internal server error"});
    }

}
//to get all vendors 
const getAllVendors=async(req,res)=>{
    try{
        //add details of firm in vendor
        const vendors=await Vendor.find().populate('firm');
        res.json({vendors});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Error fetching vendors"});
    }
}
//to get vendors using id
const getVendorById = async(req, res) => {
    const vendorId = req.params.apple;

    try {
        //replace the firm in the vendor document with documents from a different collection
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" })
        }
      res.status(200).json({vendor})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
}
module.exports={vendorRegister,vendorLogin,getAllVendors,getVendorById}