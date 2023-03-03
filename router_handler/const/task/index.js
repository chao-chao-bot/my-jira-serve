const IMPROVE = 'improve'
const BUG = 'bug'
const TASK = 'task'
exports.TaskTypes = [
  { name: IMPROVE, id: 1 },
  { name: BUG, id: 2 },
  { name: TASK, id: 3 }
]

const HIGHEST = 'Highest'
const HIGH = 'High'
const MEDIUM = 'Medium'
const LOW = 'Low'
const LOWEST = 'Lowest'

exports.TaskPriorities = [
  { name: HIGHEST, id: 1 },
  { name: HIGH, id: 2 },
  { name: MEDIUM, id: 3 },
  { name: LOW, id: 4 },
  { name: LOWEST, id: 5 }
]
