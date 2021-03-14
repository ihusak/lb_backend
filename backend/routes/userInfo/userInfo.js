const express = require('express');
const router = express.Router();
const auth = require('../../config/middleware/auth');
const userInfo = require('../../controllers/userInfo');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    console.log('!!res', res);
    cb(null, './uploads/avatars')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  console.log('fileFilter', file);
  if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
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

const uploadSingle = upload.single('avatar');

const handleUploadImg = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) return res.status(500).send({ success: false, message: err.message, code: err.code })
    next();
  })
};

router.post('/', auth.authUser, userInfo.createUserInfo);
router.get('/', auth.authUser, userInfo.getUserInfo);
router.get('/course/:courseId', auth.authUser, userInfo.getUsersInfoByCourse);
router.get('/all/:roleId', auth.authUser, userInfo.getAllUserInfoByRoleId);
router.get('/coach/:coachId', auth.authUser, userInfo.getUserInfoByCoach);
router.put('/task-status/:userId', auth.authUser, userInfo.changeTaskStatus);
router.put('/accept-task/:userId', auth.authUser, userInfo.acceptStudentTask);
router.post('/request/coach/:id', userInfo.requestCoachPermission);
router.get('/confirm/coach/:token', userInfo.acceptCoachPermission);
router.put('/', [auth.authUser, handleUploadImg], userInfo.updateUserInfo);
router.get('/:roleId/:id', auth.authUser, userInfo.getUserInfoWithParams);

module.exports = router;
