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
  if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
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
router.post('/create', [auth.authUser, handleUploadImg], controller.createProduct);
router.put('/products/:id', auth.authUser, controller.updateProduct);
router.delete('/products/:id', auth.authUser, controller.deleteProduct);

module.exports = router;
