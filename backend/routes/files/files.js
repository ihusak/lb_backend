const express = require('express');
const router = express.Router();
const multer = require('multer');
const Files = require('../../controllers/file')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/avatars')
  },
  filename: (req, file, cb) => {
    console.log('fileNAME!!!!', file);
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage, limits: {
  fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter
});

router.post('/', upload.single('avatar'), Files.uploadAvatar);

module.exports = router;