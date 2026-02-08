const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const auth = require('../middleware/auth'); // 普通安检
const admin = require('../middleware/admin'); // ★ 管理员安检

// 1. 公开接口 (所有人都能看)
router.get('/', songController.getAllSongs);
router.get('/:id', songController.getSongById);

// 2. 管理员接口 (只有 Admin 能操作)
// 注意：必须先过 auth (查身份)，再过 admin (查权限)
router.post('/', [auth, admin], songController.createSong);
router.delete('/:id', [auth, admin], songController.deleteSong);

module.exports = router;