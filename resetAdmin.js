/* resetAdmin.js - 强制重置 admin 账号 */
const mongoose = require('mongoose');
const User = require('./models/User'); // 确保路径对
const bcrypt = require('bcryptjs'); // 引入加密库
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🔗 正在连接数据库...');
    
    // 1. 查找是否存在 admin
    let user = await User.findOne({ username: 'admin' });
    
    if (user) {
        console.log('✅ 找到现有 admin 账号，正在重置密码...');
    } else {
        console.log('⚠️ 没找到 admin 账号，正在创建一个新的...');
        user = new User({ username: 'admin' });
    }

    // 2. 强制设置新密码 (加密)
    // 注意：如果你的 User 模型里有 pre('save') 自动加密，这里直接赋值 '123456' 即可
    // 为了保险起见，我们手动加密一次，或者依赖 User 模型的逻辑
    // 这里假设你的 User 模型会自动处理加密，我们直接赋值明文
    user.password = '123456'; 
    
    // 3. 强制赋予管理员权限
    user.role = 'admin'; 

    await user.save();
    
    console.log('🎉 成功！');
    console.log('👤 用户名: admin');
    console.log('🔑 密  码: 123456');
    console.log('⚡ 权  限: 管理员 (Admin)');
    
    process.exit();
  })
  .catch(err => {
      console.error(err);
      process.exit();
  });