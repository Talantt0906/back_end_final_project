require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const songRoutes = require('./routes/songRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// --- 1. Setup Frontend Engine (EJS) ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- 2. Setup Static Files (CSS/Images/JS) ---
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cors());

// --- 3. Render Home Page ---
app.get('/', (req, res) => {
  res.render('index'); // This looks for views/index.ejs
});

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/reviews', reviewRoutes);

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));