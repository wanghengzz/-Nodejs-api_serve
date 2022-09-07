const express = require('express')
const router = express.Router()

// 挂载路由

// 导入路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo.js')
// 导入验证规则的中间件
const expressJoi = require('@escook/express-joi')
// 导入验证规则
const { update_userinfo_schema,update_password_schema,update_avatar_schema } = require('../schema/user.js')
// 获取用户基本信息的路由
router.get('/userinfo', userinfo_handler.getUserInfo)
// 更新用户信息的路由
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
// 更新密码的路由
router.post('/updatepwd',expressJoi(update_password_schema),userinfo_handler.updatePassword)
// 更新用户头像的路由
router.post('/update/avatar',expressJoi(update_avatar_schema),userinfo_handler.updataAvatar)

module.exports = router
