const { TaskTypes, TaskPriorities } = require('./const/task')
// console.log(typeList)
exports.getTasklist = (req, res) => {
  res.ssend([
    { name: 'tasks1', id: 1, kanbanId: 1, typeId: 1 },
    { name: 'tasks2', id: 2, kanbanId: 2, typeId: 2 },
    { name: 'tasks3', id: 3, kanbanId: 3, typeId: 3 },
    { name: 'tasks4', id: 4, kanbanId: 1, typeId: 1 },
    { name: 'tasks5', id: 5, kanbanId: 3, typeId: 2 },
    { name: 'tasks6', id: 6, kanbanId: 3, typeId: 3 },
    { name: 'tasks7', id: 7, kanbanId: 2, typeId: 1 },
    { name: 'tasks8', id: 8, kanbanId: 1, typeId: 2 },
    { name: 'tasks9', id: 9, kanbanId: 3, typeId: 3 },
    { name: 'tasks9', id: 10, kanbanId: 3, typeId: 3 },
    { name: 'tasks9', id: 11, kanbanId: 3, typeId: 3 },
    { name: 'tasks9', id: 12, kanbanId: 3, typeId: 3 },
    { name: 'tasks9', id: 13, kanbanId: 3, typeId: 3 },
    { name: 'tasks9', id: 14, kanbanId: 3, typeId: 3 }
  ])
}

exports.getTaskTypelist = (req, res) => {
  res.ssend(TaskTypes)
}

exports.getTaskPriorities = (req, res) => {
  res.ssend(TaskPriorities)
}
