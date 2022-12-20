const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const userHandler = require('../router_handler/user')

// 注册新用户
router.post('/user/register', userHandler.regUser)
// 登录
router.post('/user/login', userHandler.login)
//获取用户列表

router.get('/users',userHandler.getUser)


module.exports = router