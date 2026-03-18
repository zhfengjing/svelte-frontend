import { App } from '@tinyhttp/app'
import { cors } from '@tinyhttp/cors'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { json } from 'milliparsec'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const adapter = new JSONFile(join(__dirname, 'db.json'))
const db = new Low(adapter, {})
await db.read()

const save = () => db.write()

const app = new App()

app.use(cors())
app.use(json())

// ── 文章评论：GET/POST /api/articles/:articleId/comments ──────────────────────

app.get('/api/articles/:articleId/comments', (req, res) => {
  const { articleId } = req.params
  const comments = (db.data.comments || []).filter(c => c.articleId === articleId)
  res.json(comments)
})

app.post('/api/articles/:articleId/comments', async (req, res) => {
  const { articleId } = req.params
  const newComment = {
    id: `c${Date.now()}`,
    articleId,
    ...req.body,
    date: req.body.date || new Date().toISOString().split('T')[0]
  }
  db.data.comments = db.data.comments || []
  db.data.comments.push(newComment)
  await save()
  res.status(201).json(newComment)
})

// ── 热门文章：GET /api/articles/popular ─────────────────────────────────────
// 必须在 /api/articles/:id 之前注册

app.get('/api/articles/popular', (req, res) => {
  const articles = (db.data.articles || [])
    .filter(a => !a.isDraft)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10)
  res.json(articles)
})

// ── 文章详情：GET/PUT/DELETE /api/articles/:id ───────────────────────────────

app.get('/api/articles/:id', (req, res) => {
  const article = (db.data.articles || []).find(a => a.id === req.params.id)
  if (!article) return res.status(404).json({ message: '文章不存在' })
  res.json(article)
})

app.put('/api/articles/:id', async (req, res) => {
  const idx = (db.data.articles || []).findIndex(a => a.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: '文章不存在' })
  db.data.articles[idx] = { ...db.data.articles[idx], ...req.body, id: req.params.id }
  await save()
  res.json(db.data.articles[idx])
})

app.delete('/api/articles/:id', async (req, res) => {
  const idx = (db.data.articles || []).findIndex(a => a.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: '文章不存在' })
  const [removed] = db.data.articles.splice(idx, 1)
  await save()
  res.json(removed)
})

// ── 文章列表：GET/POST /api/articles ────────────────────────────────────────

app.get('/api/articles', (req, res) => {
  const { featured, category, categoryId, search, limit, isDraft } = req.query
  let articles = db.data.articles || []

  if (isDraft !== undefined) {
    const val = isDraft === 'true'
    articles = articles.filter(a => a.isDraft === val)
  }
  if (featured !== undefined) {
    const val = featured === 'true'
    articles = articles.filter(a => a.featured === val)
  }
  if (category) {
    articles = articles.filter(a => a.category === category)
  }
  if (categoryId) {
    articles = articles.filter(a => a.categoryId === categoryId)
  }
  if (search) {
    const q = search.toLowerCase()
    articles = articles.filter(a =>
      a.title?.toLowerCase().includes(q) ||
      a.excerpt?.toLowerCase().includes(q)
    )
  }
  if (limit) {
    articles = articles.slice(0, Number(limit))
  }
  res.json(articles)
})

app.post('/api/articles', async (req, res) => {
  const article = { id: String(Date.now()), ...req.body }
  db.data.articles = db.data.articles || []
  db.data.articles.push(article)
  await save()
  res.status(201).json(article)
})

// ── 分类：GET /api/categories ────────────────────────────────────────────────

app.get('/api/categories', (req, res) => {
  res.json(db.data.categories || [])
})

// ── 标签：GET /api/tags ──────────────────────────────────────────────────────

app.get('/api/tags', (req, res) => {
  res.json(db.data.tags || [])
})

// ── 用户信息：GET /api/user/profile ─────────────────────────────────────────

app.get('/api/user/profile', (req, res) => {
  res.json(db.data.userProfile || {})
})

// ── 用户统计：GET /api/user/stats ────────────────────────────────────────────

app.get('/api/user/stats', (req, res) => {
  res.json(db.data.userStats || [])
})

// ── 职业历程：GET/POST /api/user/timeline ────────────────────────────────────

app.get('/api/user/timeline', (req, res) => {
  res.json(db.data.timeline || [])
})

app.post('/api/user/timeline', async (req, res) => {
  const item = { id: `t${Date.now()}`, ...req.body }
  db.data.timeline = db.data.timeline || []
  db.data.timeline.unshift(item)
  await save()
  res.status(201).json(item)
})

// ── 职业历程单项：PUT/DELETE /api/user/timeline/:id ──────────────────────────

app.put('/api/user/timeline/:id', async (req, res) => {
  const { id } = req.params
  const idx = (db.data.timeline || []).findIndex(t => t.id === id)
  if (idx === -1) return res.status(404).json({ message: '记录不存在' })
  db.data.timeline[idx] = { id, ...req.body }
  await save()
  res.json(db.data.timeline[idx])
})

app.delete('/api/user/timeline/:id', async (req, res) => {
  const { id } = req.params
  const idx = (db.data.timeline || []).findIndex(t => t.id === id)
  if (idx === -1) return res.status(404).json({ message: '记录不存在' })
  db.data.timeline.splice(idx, 1)
  await save()
  res.status(200).json({ id })
})

// ── 关注状态：GET/POST/DELETE /api/authors/:authorId/follow ──────────────────

app.get('/api/authors/:authorId/follow', (req, res) => {
  const author = (db.data.authors || []).find(a => a.id === req.params.authorId)
  if (!author) return res.status(404).json({ message: '作者不存在' })
  res.json({ isFollowing: author.isFollowing, followCount: author.followCount })
})

app.post('/api/authors/:authorId/follow', async (req, res) => {
  const idx = (db.data.authors || []).findIndex(a => a.id === req.params.authorId)
  if (idx === -1) return res.status(404).json({ message: '作者不存在' })
  const followCount = (db.data.authors[idx].followCount || 0) + 1
  db.data.authors[idx] = { ...db.data.authors[idx], isFollowing: true, followCount }
  await save()
  res.json({ isFollowing: true, followCount })
})

app.delete('/api/authors/:authorId/follow', async (req, res) => {
  const idx = (db.data.authors || []).findIndex(a => a.id === req.params.authorId)
  if (idx === -1) return res.status(404).json({ message: '作者不存在' })
  const followCount = Math.max(0, (db.data.authors[idx].followCount || 1) - 1)
  db.data.authors[idx] = { ...db.data.authors[idx], isFollowing: false, followCount }
  await save()
  res.json({ isFollowing: false, followCount })
})

// ── 点赞：GET/POST/DELETE /api/articles/:id/like ─────────────────────────────

app.get('/api/articles/:id/like', (req, res) => {
  const like = (db.data.likes || []).find(l => l.articleId === req.params.id)
  res.json(like || { isLiked: false, likeCount: 0 })
})

app.post('/api/articles/:id/like', async (req, res) => {
  const { id } = req.params
  db.data.likes = db.data.likes || []
  const idx = db.data.likes.findIndex(l => l.articleId === id)
  if (idx >= 0) {
    const likeCount = db.data.likes[idx].likeCount + 1
    db.data.likes[idx] = { ...db.data.likes[idx], isLiked: true, likeCount }
    await save()
    res.json({ isLiked: true, likeCount })
  } else {
    const entry = { id: `like-${id}`, articleId: id, isLiked: true, likeCount: 1 }
    db.data.likes.push(entry)
    await save()
    res.json({ isLiked: true, likeCount: 1 })
  }
})

app.delete('/api/articles/:id/like', async (req, res) => {
  const { id } = req.params
  db.data.likes = db.data.likes || []
  const idx = db.data.likes.findIndex(l => l.articleId === id)
  if (idx === -1) return res.json({ isLiked: false, likeCount: 0 })
  const likeCount = Math.max(0, db.data.likes[idx].likeCount - 1)
  db.data.likes[idx] = { ...db.data.likes[idx], isLiked: false, likeCount }
  await save()
  res.json({ isLiked: false, likeCount })
})

// ── 收藏：GET/POST/DELETE /api/articles/:id/bookmark ─────────────────────────

app.get('/api/articles/:id/bookmark', (req, res) => {
  const bm = (db.data.bookmarks || []).find(b => b.articleId === req.params.id)
  res.json(bm || { isBookmarked: false, bookmarkCount: 0 })
})

app.post('/api/articles/:id/bookmark', async (req, res) => {
  const { id } = req.params
  db.data.bookmarks = db.data.bookmarks || []
  const idx = db.data.bookmarks.findIndex(b => b.articleId === id)
  if (idx >= 0) {
    const bookmarkCount = db.data.bookmarks[idx].bookmarkCount + 1
    db.data.bookmarks[idx] = { ...db.data.bookmarks[idx], isBookmarked: true, bookmarkCount }
    await save()
    res.json({ isBookmarked: true, bookmarkCount })
  } else {
    const entry = { id: `bm-${id}`, articleId: id, isBookmarked: true, bookmarkCount: 1 }
    db.data.bookmarks.push(entry)
    await save()
    res.json({ isBookmarked: true, bookmarkCount: 1 })
  }
})

app.delete('/api/articles/:id/bookmark', async (req, res) => {
  const { id } = req.params
  db.data.bookmarks = db.data.bookmarks || []
  const idx = db.data.bookmarks.findIndex(b => b.articleId === id)
  if (idx === -1) return res.json({ isBookmarked: false, bookmarkCount: 0 })
  const bookmarkCount = Math.max(0, db.data.bookmarks[idx].bookmarkCount - 1)
  db.data.bookmarks[idx] = { ...db.data.bookmarks[idx], isBookmarked: false, bookmarkCount }
  await save()
  res.json({ isBookmarked: false, bookmarkCount })
})

// ── 订阅：POST /api/subscribe ────────────────────────────────────────────────

app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: '邮箱不能为空' })
  db.data.subscribers = db.data.subscribers || []
  const exists = db.data.subscribers.find(s => s.email === email)
  if (exists) return res.status(409).json({ message: '该邮箱已订阅' })
  const sub = { id: Date.now(), email }
  db.data.subscribers.push(sub)
  await save()
  res.status(201).json({ message: '订阅成功', ...sub })
})

// ── 启动服务器 ────────────────────────────────────────────────────────────────

app.listen(3000, () => {
  console.log('Mock Server running at http://localhost:3000/api')
})
