const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  artist: { 
    type: String, 
    required: true 
  },
  genre: {
    type: String,
    default: 'Pop'
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/150' 
  },
  audioUrl: {
    type: String, 
    required: true
  },

  reviews: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Review' 
  }]
});

module.exports = mongoose.model('Song', songSchema);