import jsonServer from 'json-server'

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// ── 自定义路由（处理前端 /api/* 请求）──────────────────────────

// 文章评论：GET/POST /api/articles/:articleId/comments
server.use('/api/articles/:articleId/comments', (req, res) => {
  const { articleId } = req.params
  const db = router.db

  if (req.method === 'GET') {
    const comments = db.get('comments').filter({ articleId }).value()
    res.json(comments)
  } else if (req.method === 'POST') {
    const newComment = {
      id: `c${Date.now()}`,
      articleId,
      ...req.body,
      date: req.body.date || new Date().toISOString().split('T')[0]
    }
    db.get('comments').push(newComment).write()
    res.status(201).json(newComment)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
})

// 用户信息：GET /api/user/profile
server.get('/api/user/profile', (req, res) => {
  const profile = router.db.get('userProfile').value()
  res.json(profile)
})

// 用户统计：GET /api/user/stats
server.get('/api/user/stats', (req, res) => {
  const stats = router.db.get('userStats').value()
  res.json(stats)
})

// 职业历程：GET/POST /api/user/timeline
server.use('/api/user/timeline', (req, res, next) => {
  if (req.path !== '/') return next()
  const db = router.db
  if (req.method === 'GET') {
    res.json(db.get('timeline').value())
  } else if (req.method === 'POST') {
    const item = { id: `t${Date.now()}`, ...req.body }
    db.get('timeline').unshift(item).write()
    res.status(201).json(item)
  } else {
    next()
  }
})

// 职业历程单项：PUT/DELETE /api/user/timeline/:id
server.use('/api/user/timeline/:id', (req, res) => {
  const { id } = req.params
  const db = router.db
  if (req.method === 'PUT') {
    const updated = { id, ...req.body }
    db.get('timeline').find({ id }).assign(updated).write()
    res.json(updated)
  } else if (req.method === 'DELETE') {
    db.get('timeline').remove({ id }).write()
    res.status(200).json({ id })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
})

// 关注状态：GET /api/authors/:authorId/follow
server.get('/api/authors/:authorId/follow', (req, res) => {
  const { authorId } = req.params
  const author = router.db.get('authors').find({ id: authorId }).value()
  if (!author) return res.status(404).json({ message: '作者不存在' })
  res.json({ isFollowing: author.isFollowing, followCount: author.followCount })
})

// 关注作者：POST /api/authors/:authorId/follow
server.post('/api/authors/:authorId/follow', (req, res) => {
  const { authorId } = req.params
  const db = router.db
  const author = db.get('authors').find({ id: authorId })
  if (!author.value()) return res.status(404).json({ message: '作者不存在' })
  const followCount = (author.value().followCount || 0) + 1
  author.assign({ isFollowing: true, followCount }).write()
  res.json({ isFollowing: true, followCount })
})

// 取消关注：DELETE /api/authors/:authorId/follow
server.delete('/api/authors/:authorId/follow', (req, res) => {
  const { authorId } = req.params
  const db = router.db
  const author = db.get('authors').find({ id: authorId })
  if (!author.value()) return res.status(404).json({ message: '作者不存在' })
  const followCount = Math.max(0, (author.value().followCount || 1) - 1)
  author.assign({ isFollowing: false, followCount }).write()
  res.json({ isFollowing: false, followCount })
})

// 点赞状态：GET /api/articles/:id/like
server.get('/api/articles/:id/like', (req, res) => {
  const { id } = req.params
  const like = router.db.get('likes').find({ articleId: id }).value()
  res.json(like || { isLiked: false, likeCount: 0 })
})

// 点赞：POST /api/articles/:id/like
server.post('/api/articles/:id/like', (req, res) => {
  const { id } = req.params
  const db = router.db
  const like = db.get('likes').find({ articleId: id })
  const current = like.value() || { id: `like-${id}`, articleId: id, isLiked: false, likeCount: 0 }
  const likeCount = current.likeCount + 1
  if (like.value()) {
    like.assign({ isLiked: true, likeCount }).write()
  } else {
    db.get('likes').push({ ...current, isLiked: true, likeCount }).write()
  }
  res.json({ isLiked: true, likeCount })
})

// 取消点赞：DELETE /api/articles/:id/like
server.delete('/api/articles/:id/like', (req, res) => {
  const { id } = req.params
  const db = router.db
  const like = db.get('likes').find({ articleId: id })
  if (!like.value()) return res.json({ isLiked: false, likeCount: 0 })
  const likeCount = Math.max(0, like.value().likeCount - 1)
  like.assign({ isLiked: false, likeCount }).write()
  res.json({ isLiked: false, likeCount })
})

// 收藏状态：GET /api/articles/:id/bookmark
server.get('/api/articles/:id/bookmark', (req, res) => {
  const { id } = req.params
  const bm = router.db.get('bookmarks').find({ articleId: id }).value()
  res.json(bm || { isBookmarked: false, bookmarkCount: 0 })
})

// 收藏：POST /api/articles/:id/bookmark
server.post('/api/articles/:id/bookmark', (req, res) => {
  const { id } = req.params
  const db = router.db
  const bm = db.get('bookmarks').find({ articleId: id })
  const current = bm.value() || { id: `bm-${id}`, articleId: id, isBookmarked: false, bookmarkCount: 0 }
  const bookmarkCount = current.bookmarkCount + 1
  if (bm.value()) {
    bm.assign({ isBookmarked: true, bookmarkCount }).write()
  } else {
    db.get('bookmarks').push({ ...current, isBookmarked: true, bookmarkCount }).write()
  }
  res.json({ isBookmarked: true, bookmarkCount })
})

// 取消收藏：DELETE /api/articles/:id/bookmark
server.delete('/api/articles/:id/bookmark', (req, res) => {
  const { id } = req.params
  const db = router.db
  const bm = db.get('bookmarks').find({ articleId: id })
  if (!bm.value()) return res.json({ isBookmarked: false, bookmarkCount: 0 })
  const bookmarkCount = Math.max(0, bm.value().bookmarkCount - 1)
  bm.assign({ isBookmarked: false, bookmarkCount }).write()
  res.json({ isBookmarked: false, bookmarkCount })
})

// 订阅：POST /api/subscribe
server.post('/api/subscribe', (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: '邮箱不能为空' })
  const exists = router.db.get('subscribers').find({ email }).value()
  if (exists) return res.status(409).json({ message: '该邮箱已订阅' })
  const sub = { id: Date.now(), email }
  router.db.get('subscribers').push(sub).write()
  res.status(201).json({ message: '订阅成功', ...sub })
})

// 热门文章：GET /api/articles/popular
server.get('/api/articles/popular', (req, res) => {
  const articles = router.db.get('articles')
    .filter({ isDraft: false })
    .orderBy(['views'], ['desc'])
    .take(10)
    .value()
  res.json(articles)
})

// ── 其余请求走 json-server 默认路由（/api/*）──────────────────
server.use('/api', router)

server.listen(3000, () => {
  console.log('Mock Server running at http://localhost:3000/api')
})
