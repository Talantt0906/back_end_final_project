/* models/Playlist.js */
const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // 关键点：必须定义为 [ { type: ..., ref: 'Song' } ] 这种数组格式
  songs: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Song' 
  }],
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', PlaylistSchema);