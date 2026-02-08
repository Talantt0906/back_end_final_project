/* routes/reviews.js */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // 1. 必须引入安检门
const reviewController = require('../controllers/reviewController');

// 2. 发评论：必须加 'auth'，否则后端不知道是谁发的
// 路由是 /api/reviews/:songId
router.post('/:songId', auth, reviewController.addReview);

// 3. 删除评论：也必须加 'auth'
// 路由是 /api/reviews/:songId/:reviewId
router.delete('/:songId/:reviewId', auth, reviewController.deleteReview);

module.exports = router;