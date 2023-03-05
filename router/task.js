const express = require('express')
const router = express.Router()
const task = require('../router_handler/task')

router.get('/task/list', task.getTasklist)
router.get('/taskType/list', task.getTaskTypelist)
router.get('/taskPriorities/list', task.getTaskPriorities)
router.post('/task/create', task.createTask)
router.post('/task/reorder', task.reorderTask)
module.exports = router
