const express = require('express')
const router = express.Router()
const knaban = require('../router_handler/kanban')

router.get('/kanban/list', knaban.getKanbanlist)
router.post('/kanban/create', knaban.createKanBan)
module.exports = router
