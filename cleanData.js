/* cleanData.js */
const mongoose = require('mongoose');
const Playlist = require('./models/Playlist');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    // 找到所有歌单，过滤掉里面空的歌曲 ID
    const playlists = await Playlist.find();
    for (let p of playlists) {
        p.songs = p.songs.filter(s => s != null); // 删掉 null
        await p.save();
    }
    console.log("✅ 歌单数据清理完成！");
    process.exit();
});