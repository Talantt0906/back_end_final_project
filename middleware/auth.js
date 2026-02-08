const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
  // 1. 获取 Token
  const token = req.header('x-auth-token');

  // 2. 如果没有 Token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 3. 验证并解析
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ▼▼▼▼▼▼ 关键修复区：自动兼容两种 Token 格式 ▼▼▼▼▼▼
    
    // 情况 A：Token 结构是 { user: { id: '...' } } (标准写法)
    if (decoded.user) {
        req.user = decoded.user;
    } 
    // 情况 B：Token 结构直接是 { id: '...' } (简写写法)
    else {
        req.user = decoded;
    }

    // 调试日志：看看解析出来到底是啥 (问题解决后可删除)
    console.log("✅ Token 解析成功，用户ID:", req.user.id);
    
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    next();
  } catch (err) {
    console.error("❌ Token 验证失败:", err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};