const express = require('express');
const router = express.Router();
const auth = require('../../config/middleware/auth');
const controller = require('../../controllers/shop');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, './uploads/products')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage, 
  limits: {
  fileSize: 22282810,
  },
  fileFilter: fileFilter
});

const uploadMulti = upload.array('productsImg', 10);

const handleUploadImg = (req, res, next) => {
  uploadMulti(req, res, (err) => {
    if (err) return res.status(500).send({ success: false, message: err.message, code: err.code })
    next();
  })
};

router.get('/products', auth.authUser, controller.getAllProducts);
router.get('/product/:id', auth.authUser, controller.getProductById);
router.post('/create', [auth.authUser, handleUploadImg], controller.createProduct);
router.put('/product/:id/update', [auth.authUser, handleUploadImg], controller.updateProduct);
router.delete('/product/:id/delete', auth.authUser, controller.deleteProduct);
router.post('/order/checkout', auth.authUser, controller.checkout);
router.get('/order/:status', auth.authUser, controller.getOrders);
router.put('/order/update/:id', auth.authUser, controller.orderStatus);

module.exports = router;
