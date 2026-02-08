const express = require('express');
const router = express.Router();
// ▼▼▼ 1. 必须引入 auth 中间件 (你的安检门) ▼▼▼
const auth = require('../middleware/auth'); 
const playlistController = require('../controllers/playlistController');

// ▼▼▼ 2. 创建歌单：必须加 'auth' 参数！ ▼▼▼
// 之前可能写成了 router.post('/', playlistController.createPlaylist); 导致报错
router.post('/', auth, playlistController.createPlaylist);

// 3. 获取我的歌单：也需要 auth
router.get('/my', auth, playlistController.getMyPlaylists);

// 4. 添加歌曲到歌单：也需要 auth
router.post('/add-song', auth, playlistController.addSongToPlaylist);

// 5. 删除歌单：也需要 auth
router.delete('/:id', auth, playlistController.deletePlaylist);

// 6. 移除歌曲：也需要 auth
router.delete('/:id/song/:songId', auth, playlistController.removeSongFromPlaylist);

module.exports = router;