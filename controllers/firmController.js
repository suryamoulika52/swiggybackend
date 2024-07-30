const Firm=require('../models/Firm')
const Vendor=require('../models/Vendor')
//multer used for storing images
const multer=require('multer')



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Destination folder where the uploaded images will be stored
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
    }
});
const upload = multer({ storage: storage });

const addFirm=async(req,res)=>{
    try{
        const {firmName,area,category,region,offer}=req.body;
        //if file is avlid saved in uploads otherwise it is shown undefined
    const image=req.file?req.file.filename:undefined

    const vendor=await Vendor.findById(req.vendorId);
    if(!vendor){
        return res.status(404).json({message:"Vendor not found"})
    }
    //creating new firms
    const firm=new Firm({firmName,area,category,region,offer,image,vendor:vendor._id})
    //save firm
    const savedFirm=await firm.save();
   
    //push saved firmid in vendor table
vendor.firm.push(savedFirm._id);
await vendor.save()
    res.status(201).json({message:"Firm added successfully", firmId, vendorFirmName})
    }
    catch(error){
console.log(error);
res.status(500).json({message:"Error adding firm"});
    }

}
const deleteFirmById = async(req, res) => {
    try {
        const firmId = req.params.firmId;

        const deletedProduct = await Firm.findByIdAndDelete(firmId);

        if (!deletedProduct) {
            return res.status(404).json({ error: "No product found" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
}
//exporting single image and firm details
module.exports={addFirm:[upload.single('image'),addFirm],deleteFirmById}
