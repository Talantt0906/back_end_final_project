const Playlist = require('../models/Playlist');
const User = require('../models/User');

// 1. Create a new playlist (增强版：防崩溃 + 日志)
exports.createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;

    console.log("1. 收到创建歌单请求:", { name, userId: req.user.id });

    // 创建歌单实例
    const newPlaylist = new Playlist({
      name,
      description,
      user: req.user.id, // Get user ID from the JWT token
      songs: []
    });

    // 保存到数据库
    const savedPlaylist = await newPlaylist.save();
    console.log("2. 歌单保存成功 ID:", savedPlaylist._id);

    // === 关键修复：给关联用户步骤加“保险丝” ===
    // 即使这一步失败（例如 User 模型里没有 playlists 字段），也不会导致整个请求报错
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { playlists: savedPlaylist._id }
        });
        console.log("3. 用户关联成功");
    } catch (userError) {
        console.warn("⚠️ 警告：歌单创建成功，但没能关联到用户 (非致命错误):", userError.message);
    }
    // ===========================================

    res.status(201).json(savedPlaylist);
  } catch (error) {
    console.error("❌ 创建歌单失败:", error);
    res.status(500).json({ message: 'Error creating playlist', error: error.message });
  }
};

/* controllers/playlistController.js */

/* controllers/playlistController.js */

exports.getMyPlaylists = async (req, res) => {
    try {
        // 关键：.populate('songs') 会把 ID 数组变成对象数组
        const playlists = await Playlist.find({ user: req.user.id })
            .populate('songs'); 
            
        console.log("发送给前端的歌单数据示例:", playlists[0]); // 调试用
        res.json(playlists);
    } catch (err) {
        console.error("获取歌单失败:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};
/* controllers/playlistController.js */

exports.addSongToPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.body;

        // 🔍 调试：看看收到的 ID 到底有没有值
        console.log(`📥 尝试添加歌曲: PlaylistID=[${playlistId}], SongID=[${songId}]`);

        if (!songId || songId === 'undefined' || songId === 'null') {
            console.log("❌ 拒绝操作：收到空的 Song ID");
            return res.status(400).json({ message: 'Invalid Song ID' });
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

        // 防止重复添加
        const exists = playlist.songs.some(s => s && s.toString() === songId);
        if (exists) {
            return res.status(400).json({ message: 'Song already in playlist' });
        }

        playlist.songs.push(songId);
        await playlist.save();

        console.log(`✅ 成功添加！现在的歌曲总数: ${playlist.songs.length}`);
        res.json({ message: 'Added successfully', count: playlist.songs.length });

    } catch (err) {
        console.error("❌ 后端报错:", err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// 4. Delete a playlist
exports.deletePlaylist = async (req, res) => {
  try {
    const playlistId = req.params.id;
    const userId = req.user.id;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check if user owns this playlist
    if (playlist.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Playlist.findByIdAndDelete(playlistId);

    // Clean up User model
    try {
        await User.findByIdAndUpdate(userId, {
            $pull: { playlists: playlistId }
        });
    } catch (err) {
        console.warn("清理用户关联失败 (非致命):", err.message);
    }

    res.status(200).json({ message: 'Playlist deleted' });
  } catch (error) {
    console.error("删除歌单失败:", error);
    res.status(500).json({ message: 'Error deleting playlist', error: error.message });
  }
};

// 5. Remove a song from a playlist
exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const { id, songId } = req.params;

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check ownership
    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Filter out the song
    playlist.songs = playlist.songs.filter(
      (song) => song.toString() !== songId
    );

    await playlist.save();
    res.status(200).json(playlist);
  } catch (error) {
    console.error("移除歌曲失败:", error);
    res.status(500).json({ message: 'Error removing song', error: error.message });
  }
};