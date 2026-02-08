/* makeAdmin.js */
const mongoose = require('mongoose');
const User = require('./models/User'); 
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🔍 正在查找名为 admin 的用户...');
    const user = await User.findOne({ username: 'admin' });
    
    if (!user) {
        console.log('❌ 找不到！请先去网页注册一个叫 admin 的号！');
    } else {
        user.role = 'admin'; // 强制改为管理员
        await user.save();
        console.log('✅ 成功！新注册的 admin 账号已提拔为管理员！');
        console.log('👉 现在的权限是:', user.role);
    }
    process.exit();
  })
  .catch(err => console.log(err));