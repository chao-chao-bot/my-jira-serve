const express = require('express')
const router = express.Router()
const task = require('../router_handler/task')

router.get('/task/list', task.getTasklist)
router.get('/taskType/list', task.getTaskTypelist)
module.exports = router
