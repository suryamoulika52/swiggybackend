const productController=require('../controllers/productController');

const express=require('express');
const router=express.Router();

//the data from register is posted to database
router.post('/add-product/:firmId',productController.addProduct);
router.get('/:firmId/product', productController.getProductByFirm);
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.header('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

router.delete('/:productId', productController.deleteProductById);
module.exports=router;
