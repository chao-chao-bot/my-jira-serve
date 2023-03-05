const express = require('express')
const router = express.Router()
const knaban = require('../router_handler/kanban')

router.get('/kanban/list', knaban.getKanbanlist)
router.post('/kanban/create', knaban.createKanBan)
router.post('/kanban/reorder', knaban.reorderKanBan)
module.exports = router
