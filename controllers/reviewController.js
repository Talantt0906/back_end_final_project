/* controllers/reviewController.js */
const Review = require('../models/Review');
const Song = require('../models/Song');

// 添加评论
exports.addReview = async (req, res) => {
  try {
    const { rating, content } = req.body;
    const songId = req.params.songId;
    const userId = req.user.id; // 这一步需要路由加 auth 才能获取到

    console.log(`收到评论请求 - 用户: ${userId}, 歌曲: ${songId}, 内容: ${content}`);

    // 1. 检查歌曲是否存在
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    // 2. 创建评论
    const newReview = new Review({
      user: userId, // 关联用户
      song: songId, // 关联歌曲
      rating,
      content
    });

    const savedReview = await newReview.save();

    // 3. 把评论 ID 塞进歌曲的 reviews 数组里
    song.reviews.push(savedReview._id);
    await song.save();

    // 4. 重要：把用户信息填充出来返回给前端 (这样前端能立刻显示用户名)
    // 如果不 populate，前端只能拿到用户 ID，显示不出名字
    const populatedReview = await Review.findById(savedReview._id).populate('user', 'username');

    console.log("✅ 评论发表成功");
    res.status(201).json(populatedReview);

  } catch (error) {
    console.error("❌ 发表评论失败:", error);
    res.status(500).json({ message: 'Server error adding review', error: error.message });
  }
};

// 删除评论
// 删除评论
exports.deleteReview = async (req, res) => {
  try {
    const { songId, reviewId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role; // 从 Token 中获取角色

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // ▼▼▼ 核心权限逻辑修改 ▼▼▼
    // 判断 A：当前用户是评论作者
    const isAuthor = review.user.toString() === userId;
    // 判断 B：当前用户是管理员
    const isAdmin = userRole === 'admin';

    // 只要两个条件都不满足，才报错
    if (!isAuthor && !isAdmin) {
      console.log(`⛔ 拒绝删除: 用户 ${userId} 既不是作者也不是管理员`);
      return res.status(401).json({ message: 'User not authorized' });
    }
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    // 执行删除逻辑
    await Review.findByIdAndDelete(reviewId);

    // 从歌曲里移除引用
    await Song.findByIdAndUpdate(songId, {
      $pull: { reviews: reviewId }
    });

    console.log(`🗑️ 评论删除成功 - 执行者: ${isAdmin ? 'Admin' : 'Author'}`);
    res.json({ message: 'Review removed' });

  } catch (error) {
    console.error("❌ 删除评论失败:", error);
    res.status(500).json({ message: 'Server error deleting review' });
  }
};