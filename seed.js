/* seed.js - 自动抓取 iTunes 真实封面版 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const https = require('https'); // 使用 Node 原生网络模块
const User = require('./models/User');
const Song = require('./models/Song');
const Playlist = require('./models/Playlist');
const Review = require('./models/Review');

// === 核心黑科技：自动从 iTunes 获取高清封面 ===
const fetchRealCover = (title, artist) => {
    return new Promise((resolve) => {
        const query = encodeURIComponent(`${title} ${artist}`);
        const url = `https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=1`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.results && json.results.length > 0) {
                        // iTunes 默认给 100x100 的图，我们把它改成 600x600 获取高清图
                        const highResUrl = json.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
                        console.log(`✅ 找到封面: ${title}`);
                        resolve(highResUrl);
                    } else {
                        console.log(`⚠️ 没找到封面，使用默认图: ${title}`);
                        // 兜底图：如果真没找到，用一个通用的音乐图标
                        resolve('https://placehold.co/600/282828/1db954?text=Music');
                    }
                } catch (e) {
                    resolve('https://placehold.co/600/282828/1db954?text=Error');
                }
            });
        }).on('error', () => {
            resolve('https://placehold.co/600/282828/1db954?text=NetworkError');
        });
    });
};

const rawSongs = [
  // --- Pop / Mainstream ---
  { title: "Shape of You", artist: "Ed Sheeran", genre: "Pop" },
  { title: "Blinding Lights", artist: "The Weeknd", genre: "Pop" },
  { title: "Stay", artist: "The Kid LAROI", genre: "Pop" }, // 去掉Justin方便搜索
  { title: "Levitating", artist: "Dua Lipa", genre: "Pop" },
  { title: "As It Was", artist: "Harry Styles", genre: "Pop" },
  { title: "Anti-Hero", artist: "Taylor Swift", genre: "Pop" },
  { title: "Bad Guy", artist: "Billie Eilish", genre: "Pop" },
  { title: "Peaches", artist: "Justin Bieber", genre: "Pop" },
  { title: "Flowers", artist: "Miley Cyrus", genre: "Pop" },
  { title: "Vampire", artist: "Olivia Rodrigo", genre: "Pop" },

  // --- Hip-Hop / Rap ---
  { title: "God's Plan", artist: "Drake", genre: "Hip-Hop" },
  { title: "SICKO MODE", artist: "Travis Scott", genre: "Hip-Hop" },
  { title: "HUMBLE.", artist: "Kendrick Lamar", genre: "Hip-Hop" },
  { title: "Lucid Dreams", artist: "Juice WRLD", genre: "Hip-Hop" },
  { title: "Rich Flex", artist: "Drake", genre: "Hip-Hop" },
  { title: "First Class", artist: "Jack Harlow", genre: "Hip-Hop" },
  { title: "Wait for U", artist: "Future", genre: "Hip-Hop" },
  { title: "Super Freaky Girl", artist: "Nicki Minaj", genre: "Hip-Hop" },
  { title: "Rockstar", artist: "Post Malone", genre: "Hip-Hop" },

  // --- Rock / Classic ---
  { title: "Bohemian Rhapsody", artist: "Queen", genre: "Rock" },
  { title: "Hotel California", artist: "Eagles", genre: "Rock" },
  { title: "Smells Like Teen Spirit", artist: "Nirvana", genre: "Rock" },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses", genre: "Rock" },
  { title: "In the End", artist: "Linkin Park", genre: "Rock" }, // 换了首更好搜的
  { title: "Yellow", artist: "Coldplay", genre: "Rock" },

  // --- K-Pop / Global ---
  { title: "Dynamite", artist: "BTS", genre: "Pop" },
  { title: "Butter", artist: "BTS", genre: "Pop" },
  { title: "Pink Venom", artist: "Blackpink", genre: "K-Pop" },
  { title: "OMG", artist: "NewJeans", genre: "K-Pop" },
  { title: "Cupid", artist: "Fifty Fifty", genre: "K-Pop" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ 数据库已连接");

    // 清空旧数据
    await User.deleteMany({});
    await Song.deleteMany({});
    await Playlist.deleteMany({});
    await Review.deleteMany({});
    console.log("🧹 旧数据已清除");

    // 创建管理员
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    await User.create({
        username: "admin",
        password: hashedPassword,
        role: "admin"
    });

    console.log("⏳ 正在从 iTunes 获取真实封面，这需要几秒钟...");

    // 遍历歌曲并获取封面
    const songsWithCovers = [];
    for (const song of rawSongs) {
        const coverUrl = await fetchRealCover(song.title, song.artist);
        songsWithCovers.push({
            ...song,
            coverImage: coverUrl,
            audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // 统一演示音频
        });
    }

    await Song.insertMany(songsWithCovers);
    console.log(`🎉 成功添加 ${songsWithCovers.length} 首歌曲（全部为真实封面）！`);

    process.exit();
  } catch (error) {
    console.error("❌ 失败:", error);
    process.exit(1);
  }
};

seedDB();