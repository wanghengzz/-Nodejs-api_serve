// 导入数据库操作模块
const db = require('../db/index.js')

// 文章列表的处理函数
exports.getArtCates = (req, res) => {
  // res.send('ok')
  // 定义查询分类列表数据的sql语句
  const sql = `select *from ev_article_cate where is_delete=0 order by id asc`
  // 调用db.query（）
  db.query(sql, (err, result) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取文章分类数据成功！',
      data: result
    })
  })
}

// 新增文章分类的处理函数
exports.addArticalCates = (req, res) => {
  // 1.定义查重的sql语句
  const sql = `select *from ev_article_cate where name=? or alias=?`
  // 2.执行查重的sql语句
  db.query(sql, [req.body.name, req.body.alias], (err, result) => {
    // 3.判断sql语句是否执行成功
    if (err) return res.cc(err)
    // 4.1判断数据的 length
    if (result.length === 2) return res.cc('分类名称与分类别名被占用！')
    // 4.2 length=1的三种情况
    if (result.length === 1 && result[0].name === req.body.name && result[0].alias === req.body.alias) return res.cc('分类名称与分类别名被占用！')
    if (result.length === 1 && result[0].name === req.body.name) return res.cc('分类的名称被占用了，请更换后重试！')
    if (result.length === 1 && result[0].alias === req.body.alias) return res.cc('分类的别名被占用了，请更换后重试！')

    // 5 分类名称和分类别名都是可用的  执行插入数据库操作
    const sql = `insert into ev_article_cate set ?`
    db.query(sql, req.body, (err, result) => {
      if (err) return res.cc(err)
      if (result.affectedRows !== 1) return res.cc('新增分类失败！')

      res.cc('新增分类成功！', 0)
    })
  })
}

// 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
  // 定义标记删除的sql语句
  const sql = `update ev_article_cate set is_delete=1 where id=?`
  // 执行sql
  db.query(sql, req.params.id, (err, result) => {
    if (err) return res.cc(err)
    if (result.affectedRows !== 1) return res.cc('删除失败！')

    res.cc('删除文章分类成功！', 0)
  })
}

// 获取文章列表
exports.getArtById = (req, res) => {
  const sql = `select * from ev_article_cate where id=?`
  db.query(sql, req.params.id, (err, result) => {
    if (err) return res.cc(err)
    if (result.length !== 1) return res.cc('获取文章失败！')
    res.send({
      status: 0,
      message: '获取文章列表成功！',
      data: result
    })
  })
}

// 根据id更新文章分类的处理函数
exports.updateCateById = (req, res) => {
  const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`
  // 执行查重操作
  db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 判断 分类名称 和 分类别名 是否被占用
    if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名和别名都被占用！')
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名 称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类 别名被占用，请更换后重试！')
    // TODO：更新文章分类
    const sql = `update ev_article_cate set ? where Id=?`
    db.query(sql, [req.body, req.body.Id], (err, results) => {
      // 执行 SQL 语句失败
      if (err) return res.cc(err)
      // SQL 语句执行成功，但是影响行数不等于 1
      if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
      // 更新文章分类成功
      res.cc('更新文章分类成功！')
    })
  })
}
