const Product=require('../models/Product')
const Firm=require('../models/Firm')
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
const addProduct=async(req,res)=>{
try{
    //these data comes from data
const {productName, price, category, bestseller, description}=req.body;

        //if file is avlid saved in uploads otherwise it is shown undefined
    const image=req.file?req.file.filename:undefined
    //adding products using firmid
    const firmId=req.params.firmId;
    //wait until we get firmid
    const firm=await Firm.findById(firmId);
    if(!firm){
        return res.status(404).json({message:"Firm not found"})
    }
    //craeting new product
    const product=new Product({  productName, price, category, image, bestseller, description,firm:firm._id})
//save product



const savedProduct=await product.save();

    //push saved products in firm table
    firm.product.push(savedProduct);
    await firm.save();
        res.status(201).json(savedProduct);
}
catch(error){
    console.error(error);
    res.status(500).json({message:"Internal server error"});
}
}
//to get products
const getProductByFirm = async(req, res) => {
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }
// to identify products for each firm
        const restaurantName = firm.firmName;
        const products = await Product.find({ firm: firmId });

        res.status(200).json({ restaurantName, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
}
const deleteProductById = async(req, res) => {
    try {
        const productId = req.params.productId;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: "No product found" })
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" })
    }
}
//exporting single image and products details

module.exports={addProduct:[upload.single('image'),addProduct],getProductByFirm,deleteProductById}