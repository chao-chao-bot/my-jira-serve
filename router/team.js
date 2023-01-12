
const express = require('express')
const router = express.Router()
// 导入用户信息的处理函数模块
const team = require('../router_handler/team')

router.post('/team/create',team.createTeam)

module.exports = router