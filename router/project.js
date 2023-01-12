
const express = require('express')
const router = express.Router()
// 导入用户信息的处理函数模块
const project = require('../router_handler/project')


router.get('/projects', project.getProjectList)
router.post('/project/create',project.createProject)
router.post('/project/delete',project.deleteProject)

module.exports = router