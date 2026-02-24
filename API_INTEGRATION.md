# API 集成说明文档

## 📋 概述

项目已经从使用 mock 数据改为通过 axios 调用真实后端 API。所有 API 调用都已封装在服务层中，便于维护和测试。

## 🗂️ 项目结构

```
src/
├── config/
│   └── api.js              # API 配置和端点定义
├── services/
│   ├── request.js          # axios 实例和拦截器
│   └── api.js              # API 服务层（封装所有 API 调用）
├── components/
│   ├── Loading.svelte      # 加载状态组件
│   └── ErrorMessage.svelte # 错误提示组件
└── pages/
    ├── Home.svelte         # ✅ 已集成 API
    ├── Articles.svelte     # ✅ 已集成 API
    ├── ArticleDetail.svelte # 待集成
    ├── Popular.svelte      # 待集成
    ├── MyBlog.svelte       # 待集成
    └── WriteArticle.svelte # 待集成
```

## ⚙️ 配置

### 1. 环境变量配置

在 `.env` 文件中配置 API 基础 URL：

```bash
# 开发环境
VITE_API_BASE_URL=http://localhost:3000/api

# 生产环境
# VITE_API_BASE_URL=https://your-api-server.com/api
```

### 2. API 端点配置

在 `src/config/api.js` 中定义所有 API 端点：

```javascript
export const API_ENDPOINTS = {
  ARTICLES: '/articles',
  ARTICLE_DETAIL: (id) => \`/articles/\${id}\`,
  POPULAR_ARTICLES: '/articles/popular',
  // ... 更多端点
};
```

## 🔌 API 服务层使用

### 文章相关 API

```javascript
import { articleApi } from '../services/api.js';

// 获取文章列表
const articles = await articleApi.getArticles({
  page: 1,
  pageSize: 10,
  category: 'frontend'
});

// 获取文章详情
const article = await articleApi.getArticleById(articleId);

// 获取热门文章
const popularArticles = await articleApi.getPopularArticles({
  timeRange: 'week'
});

// 创建文章
const newArticle = await articleApi.createArticle({
  title: '文章标题',
  content: '文章内容',
  // ...
});

// 更新文章
await articleApi.updateArticle(articleId, { title: '新标题' });

// 删除文章
await articleApi.deleteArticle(articleId);
```

### 分类和标签 API

```javascript
import { categoryApi, tagApi } from '../services/api.js';

// 获取分类列表
const categories = await categoryApi.getCategories();

// 获取标签列表
const tags = await tagApi.getTags();
```

### 评论 API

```javascript
import { commentApi } from '../services/api.js';

// 获取文章评论
const comments = await commentApi.getComments(articleId);

// 创建评论
await commentApi.createComment(articleId, {
  author: '用户名',
  content: '评论内容'
});
```

### 用户 API

```javascript
import { userApi } from '../services/api.js';

// 获取用户信息
const profile = await userApi.getUserProfile();

// 获取用户统计
const stats = await userApi.getUserStats();
```

## 📝 页面集成示例

### 示例 1: 首页（Home.svelte）- 已完成

```svelte
<script>
  import { onMount } from 'svelte';
  import { articleApi, userApi } from '../services/api.js';
  import Loading from '../components/Loading.svelte';
  import ErrorMessage from '../components/ErrorMessage.svelte';

  let featuredArticles = [];
  let stats = [];
  let loading = true;
  let error = null;

  const loadData = async () => {
    loading = true;
    error = null;
    try {
      const [articlesData, statsData] = await Promise.all([
        articleApi.getArticles({ featured: true, limit: 3 }),
        userApi.getUserStats()
      ]);
      featuredArticles = articlesData.data || articlesData;
      stats = statsData.data || statsData;
    } catch (err) {
      error = err.response?.data?.message || '加载失败';
    } finally {
      loading = false;
    }
  };

  onMount(() => loadData());
</script>

{#if loading}
  <Loading message="加载中..." />
{:else if error}
  <ErrorMessage message={error} onRetry={loadData} />
{:else}
  <!-- 渲染数据 -->
{/if}
```

### 示例 2: 文章详情页集成

```svelte
<script>
  import { onMount } from 'svelte';
  import { articleApi, commentApi } from '../services/api.js';

  export let params = {}; // 来自路由

  let article = null;
  let comments = [];
  let loading = true;
  let error = null;

  const loadArticle = async () => {
    loading = true;
    error = null;
    try {
      const [articleData, commentsData] = await Promise.all([
        articleApi.getArticleById(params.id),
        commentApi.getComments(params.id)
      ]);
      article = articleData.data || articleData;
      comments = commentsData.data || commentsData;
    } catch (err) {
      error = err.response?.data?.message || '加载文章失败';
    } finally {
      loading = false;
    }
  };

  onMount(() => loadArticle());
</script>
```

### 示例 3: 写文章页集成

```svelte
<script>
  import { push } from 'svelte-spa-router';
  import { articleApi } from '../services/api.js';

  let article = { title: '', content: '', ... };
  let saving = false;

  const handleSubmit = async (isDraft) => {
    saving = true;
    try {
      const response = await articleApi.createArticle({
        ...article,
        isDraft
      });
      alert(isDraft ? '草稿已保存' : '发布成功');
      if (!isDraft) {
        push('/articles');
      }
    } catch (err) {
      alert(err.response?.data?.message || '保存失败');
    } finally {
      saving = false;
    }
  };
</script>
```

## 🎯 后端 API 数据格式要求

### 文章列表响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "文章标题",
      "excerpt": "文章摘要",
      "content": "文章内容",
      "image": "封面图片URL",
      "author": "作者",
      "date": "2024-02-20",
      "views": "1.2k",
      "category": "前端开发",
      "categoryId": "frontend",
      "tags": ["Svelte", "JavaScript"]
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 10
}
```

### 分类列表响应格式

```json
{
  "code": 200,
  "data": [
    {
      "id": "frontend",
      "name": "前端开发"
    },
    {
      "id": "web3",
      "name": "Web3"
    }
  ]
}
```

### 用户统计响应格式

```json
{
  "code": 200,
  "data": [
    {
      "icon": "📝",
      "number": "120+",
      "label": "文章总数"
    },
    {
      "icon": "👥",
      "number": "5k+",
      "label": "读者"
    }
  ]
}
```

## 🔐 认证处理

如果 API 需要认证，token 会自动从 localStorage 读取并添加到请求头：

```javascript
// 登录后保存 token
localStorage.setItem('token', 'your-jwt-token');

// 请求拦截器会自动添加：
// Authorization: Bearer your-jwt-token
```

## ⚠️ 错误处理

所有 API 错误都会在响应拦截器中统一处理：

- 401: 未授权，需要登录
- 403: 无权限
- 404: 资源不存在
- 500: 服务器错误

错误信息会通过 console.error 输出，并可以通过 try-catch 捕获。

## 🚀 后续工作

### 待集成 API 的页面

1. **ArticleDetail.svelte** - 文章详情页
   - 需要集成：文章详情、评论列表、相关文章

2. **Popular.svelte** - 热门文章页
   - 需要集成：热门文章列表、趋势数据

3. **MyBlog.svelte** - 我的博客页
   - 需要集成：用户信息、技能数据、项目列表

4. **WriteArticle.svelte** - 写文章页
   - 需要集成：创建/更新文章、分类列表、图片上传

### 集成步骤

对于每个页面，按以下步骤操作：

1. 导入相关 API 服务和组件
2. 添加 loading 和 error 状态
3. 创建 loadData 函数，调用 API
4. 在 onMount 中调用 loadData
5. 在模板中添加加载和错误状态处理

## 📞 联系后端

请向后端开发团队确认：

- [ ] API 基础 URL
- [ ] 各端点的具体路径
- [ ] 请求/响应数据格式
- [ ] 是否需要认证
- [ ] 分页参数格式
- [ ] 错误响应格式
- [ ] 文件上传方式（如果需要）

## 🧪 测试

建议使用以下工具测试 API：

- **Postman** - 测试 API 端点
- **axios 拦截器** - 查看请求/响应日志（已配置）
- **浏览器开发工具** - 网络面板查看实际请求

## 📌 注意事项

1. 所有 API 调用都应该在 try-catch 中处理
2. 使用 loading 状态提升用户体验
3. 提供重试功能（ErrorMessage 组件已支持）
4. 考虑添加请求防抖和节流
5. 对于大量数据，考虑实现虚拟滚动或分页
6. 添加请求取消功能（避免组件卸载后继续请求）
