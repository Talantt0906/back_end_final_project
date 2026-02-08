/* models/Review.js */
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  // 关联到用户 (必须指向 'User')
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  // 关联到歌曲 (必须指向 'Song')
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);