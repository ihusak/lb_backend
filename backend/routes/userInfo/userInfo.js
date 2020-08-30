const express = require('express');
const router = express.Router();
const auth = require('../../config/middleware/auth');
const userInfo = require('../../controllers/userInfo');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/avatars')
  },
  filename: (req, file, cb) => {
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
  storage: storage, 
  limits: {
  fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter
});

router.get('/all/:roleId', auth.authUser, userInfo.getAllUserInfo);
router.post('/', auth.authUser, userInfo.createUserInfo);
router.get('/:id/:roleId', auth.authUser, userInfo.getUserInfo);
router.get('/coach/:coachId', auth.authUser, userInfo.getUserInfoByCoach);
router.put('/:id/:roleId', auth.authUser, upload.single('avatar'), userInfo.updateUserInfo);
router.put('/task-status/:id', auth.authUser, userInfo.changeTaskStatus);
router.put('/accept-task/:userId', auth.authUser, userInfo.acceptUserTask);
router.post('/request/coach/:id', userInfo.requestCoachPermission);
router.get('/confirm/coach/:token', userInfo.acceptCoachPermission);

module.exports = router;
