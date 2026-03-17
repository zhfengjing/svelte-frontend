# Mock 数据生成器

为项目的 json-server 自动生成完整的 `db.json` mock 数据文件，并生成对应的路由配置 `server.js`。

## 使用方式

```
/gen-mock [文章数量]
```

**示例：**
- `/gen-mock` — 默认生成 10 篇文章
- `/gen-mock 20` — 生成 20 篇文章（评论、点赞等数据同比例增加）

---

## 执行步骤

1. 读取 `src/config/api.js` 了解所有 API 端点
2. 读取 `src/services/api.js` 了解每个实体的请求/响应结构
3. 读取各 Svelte 页面（`Articles.svelte`、`ArticleDetail.svelte`、`MyBlog.svelte`、`Home.svelte`），提取模板中实际使用的字段名，确保生成的数据字段与前端完全匹配
4. 生成 `db.json` 文件（覆盖全部实体）
5. 生成 `server.js` 自定义路由文件（处理嵌套路由、特殊端点）
6. 更新 `package.json` 中的 `mock` 脚本（如尚未配置）

---

## 数据生成规范

### 必须覆盖的实体（严格对齐前端字段）

**articles（文章列表）**
```json
{
  "id": "唯一字符串或数字",
  "title": "技术类中文标题",
  "excerpt": "150字以内摘要",
  "content": "完整HTML格式正文（至少3段，包含h2/p/code标签）",
  "author": "中文作者名",
  "authorId": "对应 authors 的 id",
  "date": "YYYY-MM-DD",
  "category": "分类名称（与 categories[].name 一致）",
  "categoryId": "分类id（与 categories[].id 一致）",
  "tags": ["标签1", "标签2"],
  "image": "https://images.unsplash.com/...（真实可访问的图片URL）",
  "views": "数字",
  "readTime": "X 分钟阅读",
  "featured": true/false,
  "isDraft": false,
  "likeCount": "数字",
  "bookmarkCount": "数字"
}
```

**categories（分类）**
```json
{ "id": "frontend", "name": "前端开发", "count": 数字 }
```

**tags（标签）**
```json
{ "id": "svelte", "name": "Svelte", "count": 数字 }
```

**comments（评论，挂载在 articles 下）**
```json
{
  "id": "唯一id",
  "articleId": "对应文章id",
  "author": "评论者名",
  "content": "评论内容",
  "date": "YYYY-MM-DD"
}
```

**user/profile（用户个人信息）**
```json
{
  "id": 1,
  "name": "中文姓名",
  "title": "职位头衔",
  "bio": "个人简介",
  "skills": [{ "name": "技术名", "level": 0-100, "icon": "emoji" }],
  "projects": [{ "name": "", "description": "", "tech": [], "link": "#", "image": "URL" }],
  "socialLinks": [{ "name": "", "icon": "emoji", "url": "" }]
}
```

**user/stats（统计数据）**
```json
[{ "icon": "emoji", "number": "120+", "label": "文章总数" }]
```

**user/timeline（职业历程）**
```json
{ "id": "唯一id", "year": "2024", "title": "职位", "company": "公司", "description": "描述" }
```

**authors（作者，用于关注功能）**
```json
{ "id": "作者id", "name": "", "followCount": 数字, "isFollowing": false }
```

**likes / bookmarks（点赞收藏状态）**
```json
{
  "id": "article_[articleId]",
  "articleId": "文章id",
  "isLiked": false,
  "likeCount": 数字,
  "isBookmarked": false,
  "bookmarkCount": 数字
}
```

**subscribers（订阅者）**
```json
{ "id": 1, "email": "test@example.com" }
```

### 数据质量要求
- 文章标题和内容必须是**真实有意义的中文技术博客内容**（涵盖 Svelte、JavaScript、Web3、TypeScript 等话题）
- 日期使用 2024-2025 年的合理日期，按时间倒序排列
- 图片 URL 使用 `https://images.unsplash.com/photo-[id]?w=800&h=450&fit=crop` 格式
- `featured: true` 的文章至少 3 篇（供首页使用）
- 每篇文章至少 2-3 条评论

---

## server.js 生成规范

json-server 不原生支持嵌套路由（如 `/articles/:id/comments`），需要自定义路由：

```javascript
// server.js — json-server 自定义路由
import jsonServer from 'json-server'
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

// 处理 /api 前缀
server.use('/api', router)

// 自定义路由：文章评论 /api/articles/:articleId/comments
// 用户信息 /api/user/profile → /api/userProfile
// 用户统计 /api/user/stats → /api/userStats
// 职业历程 /api/user/timeline → /api/timeline
// 关注状态 /api/authors/:authorId/follow → /api/authors/:authorId
// 点赞收藏 /api/articles/:id/like → /api/likes
// ...按实际端点补充

server.listen(3000, () => {
  console.log('Mock Server running at http://localhost:3000')
})
```

---

## 输出内容

1. **`db.json`** — 完整的 mock 数据文件，放到项目根目录
2. **`server.js`** — json-server 自定义路由文件，放到项目根目录
3. **更新 `package.json`** — 确保 `mock` 脚本指向 `node server.js`
4. **运行说明** — 告知用户如何启动 mock server

---

文章数量参数：`$ARGUMENTS`（未传则默认 10）。生成完成后输出每个实体的数量统计。
