/* middleware/admin.js (调试版) */
const User = require('../models/User');

module.exports = async function(req, res, next) {
  try {
    // 1. 拿着 ID 去查数据库
    const user = await User.findById(req.user.id);
    
    // 2. 打印日志 (看看数据库里到底存了啥)
    if (user) {
        console.log(`👮 Admin检查: 用户名=[${user.username}], 数据库角色=[${user.role}]`);
    } else {
        console.log("👮 Admin检查: 找不到用户!");
    }

    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    // 3. 严格比对
    if (user.role !== 'admin') {
      console.log("⛔ 拒绝访问: 角色不符");
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // 4. 通过
    console.log("✅ 批准访问: 管理员身份确认");
    next();
    
  } catch (err) {
    console.error("Admin Check Error:", err.message);
    res.status(500).send('Server Error');
  }
};