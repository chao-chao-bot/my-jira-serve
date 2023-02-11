
const express = require('express')
const router = express.Router()
// 导入用户信息的处理函数模块
const project = require('../router_handler/project')


router.get('/project/list', project.getProjectList)
router.post('/project/create',project.createProject)
router.post('/project/edit',project.editProject)
router.post('/project/delete',project.deleteProject)
router.get('/project/commander/list',project.getCommanderList)


module.exports = router