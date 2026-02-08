/* controllers/songController.js (完全覆盖) */
const Song = require('../models/Song');

// 1. 获取所有歌曲 (首页用)
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find()
      // ▼▼▼ 必须加这一大段，否则首页看不见评论人 ▼▼▼
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'username' } 
      });
    res.json(songs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 2. 获取单首歌曲 (详情页/刷新用 - 最重要！)
exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id)
      // ▼▼▼ 如果少了这一段，你发完评论刷新就是空的！ ▼▼▼
      .populate({
        path: 'reviews',            // 把 Review ID 变成 Review 对象
        populate: {
          path: 'user',             // 把 User ID 变成 User 对象
          select: 'username'        // 只取用户名
        }
      });
      // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    if (!song) {
      return res.status(404).json({ msg: 'Song not found' });
    }
    res.json(song);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Song not found' });
    }
    res.status(500).send('Server Error');
  }
};

// 3. 创建歌曲
exports.createSong = async (req, res) => {
    try {
        const newSong = new Song(req.body);
        const song = await newSong.save();
        res.json(song);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteSong = async (req, res) => {
    try {
        const songId = req.params.id;
        const userRole = req.user.role; // 这里的 role 是从 auth 中间件解密出来的

        console.log(`收到删歌请求 - 歌曲ID: ${songId}, 执行者角色: ${userRole}`);

        // 严格检查：如果不是 admin，直接踢回去
        if (userRole !== 'admin') {
            console.log("⛔ 拒绝删歌: 权限不足");
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const song = await Song.findByIdAndDelete(songId);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        console.log("🗑️ 歌曲删除成功");
        res.json({ message: 'Song deleted successfully' });
    } catch (err) {
        console.error("❌ 删歌失败:", err.message);
        res.status(500).send('Server Error');
    }
};