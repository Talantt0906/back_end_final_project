/* deleteAdmin.js - 删号脚本 */
const mongoose = require('mongoose');
const User = require('./models/User'); 
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🔗 连接数据库...');
    // 彻底删除 admin
    await User.deleteOne({ username: 'admin' });
    console.log('🗑️ 坏掉的 "admin" 账号已删除！');
    process.exit();
  })
  .catch(err => console.log(err));