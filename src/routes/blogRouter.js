const router = require("express").Router();

const { blogControllers } = require('../controllers');
const {verifyToken, multerUpload}  = require('../middlewares');

router.get('/blog/:id', blogControllers.getBlogById);
router.get('/blog', blogControllers.getBlog);
router.post('/blog', verifyToken, multerUpload.single("imgBlog"), blogControllers.createBlog);

module.exports = router;
