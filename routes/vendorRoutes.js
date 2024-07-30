const vendorController=require('../controllers/vendorController');
const express=require('express');
const router=express.Router();
//the data from register is posted to database
router.post('/register',vendorController.vendorRegister);
//the data from register is posted to database
router.post('/login',vendorController.vendorLogin);
//fetches data from database
router.get('/all-vendors',vendorController.getAllVendors);
//fetches each id
router.get('/single-vendor/:apple',vendorController.getVendorById)
module.exports=router;