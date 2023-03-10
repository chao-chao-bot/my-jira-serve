const mysql = require('mysql2/promise')
exports.swapData = async (table, fromId, order_id) => {
  /**交换全部字段值 但是不交换id */
  const db = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'jira_db'
  })
  try {
    // 获取原始数据
    const [fromData] = await db.query(`SELECT * FROM ${table} WHERE order_id = ${fromId}`)
    const [referenceData] = await db.query(`SELECT * FROM ${table} WHERE order_id = ${order_id}`)
    // 交换数据的位置
    delete referenceData[0].order_id
    delete fromData[0].order_id
    await db.query(`UPDATE ${table} SET ? WHERE order_id = ?`, [referenceData[0], fromId])
    await db.query(`UPDATE ${table} SET ? WHERE order_id = ?`, [fromData[0], order_id])
    db.end() // 关闭连接
  } catch (error) {
    console.error(error)
  }
}

exports.reorderData = async (table, fromId, referenceId) => {
  const db = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'jira_db'
  })
  if (fromId < referenceId) {
    await db.query(`UPDATE ${table} SET order_id = ? WHERE order_id = ?`, [-1, fromId])
    await db.query(
      `UPDATE ${table} SET order_id = order_id - 1 WHERE order_id > ${fromId} AND order_id <= ${referenceId};`
    )
    await db.query(`UPDATE ${table} SET order_id = ? WHERE order_id = ?`, [referenceId, -1])
  } else {
    await db.query(`UPDATE ${table} SET order_id = ? WHERE order_id = ?`, [-1, fromId])
    await db.query(
      `UPDATE ${table} SET order_id = order_id + 1 WHERE order_id < ${fromId} AND order_id >= ${referenceId};`
    )
    await db.query(`UPDATE ${table} SET order_id = ? WHERE order_id = ?`, [referenceId, -1])
  }
  db.end() // 关闭连接
}
