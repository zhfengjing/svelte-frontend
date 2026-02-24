<script>
  import { link } from 'svelte-spa-router';

  export let params = {};

  // 模拟文章数据
  const article = {
    id: params.id || 1,
    title: 'Svelte 完整指南：从入门到精通',
    author: '张三',
    date: '2024-02-20',
    views: '1.2k',
    readTime: '8 分钟',
    category: '前端开发',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=600&fit=crop',
    content: `
      <p>Svelte 是一个革命性的前端框架，它在构建时将你的代码编译成高效的 JavaScript，而不是在运行时解释代码。这使得 Svelte 应用具有出色的性能和更小的包体积。</p>

      <h2>为什么选择 Svelte？</h2>
      <p>Svelte 提供了许多独特的优势：</p>
      <ul>
        <li>无虚拟 DOM，直接操作真实 DOM，性能更优</li>
        <li>更少的样板代码，开发效率更高</li>
        <li>内置状态管理，无需额外的库</li>
        <li>真正的响应式，无需手动优化</li>
      </ul>

      <h2>核心概念</h2>
      <p>让我们深入了解 Svelte 的核心概念：</p>

      <h3>1. 响应式声明</h3>
      <p>Svelte 使用 <code>$:</code> 语法实现响应式声明，让数据变化自动触发更新。</p>

      <h3>2. 组件生命周期</h3>
      <p>Svelte 提供了简洁的生命周期钩子，如 onMount、onDestroy 等。</p>

      <h3>3. 内置动画</h3>
      <p>Svelte 内置了强大的动画和过渡效果，让你的应用更加生动。</p>

      <h2>最佳实践</h2>
      <p>在使用 Svelte 开发时，请记住这些最佳实践：</p>
      <ol>
        <li>保持组件简单和专注</li>
        <li>合理使用 stores 管理全局状态</li>
        <li>充分利用 Svelte 的响应式特性</li>
        <li>使用 SvelteKit 构建完整应用</li>
      </ol>

      <h2>总结</h2>
      <p>Svelte 是一个强大而优雅的前端框架，它简化了开发流程，同时提供了卓越的性能。无论你是前端新手还是经验丰富的开发者，Svelte 都值得你尝试。</p>
    `,
    tags: ['Svelte', '前端开发', 'JavaScript', 'Web开发']
  };

  const relatedArticles = [
    { id: 2, title: 'Web3 开发入门：构建去中心化应用', views: '980' },
    { id: 3, title: 'TypeScript 高级技巧与最佳实践', views: '856' },
    { id: 5, title: 'React vs Vue vs Svelte：2024框架对比', views: '1.5k' }
  ];

  let comment = '';
  const comments = [
    {
      id: 1,
      author: '李四',
      date: '2024-02-21',
      content: '写得很好！我正在学习 Svelte，这篇文章帮助很大。'
    },
    {
      id: 2,
      author: '王五',
      date: '2024-02-21',
      content: '详细的教程，特别是最佳实践部分很有用。'
    }
  ];
</script>

<article class="article-detail">
  <!-- 文章头部 -->
  <div class="article-header">
    <div class="container">
      <div class="breadcrumb">
        <a href="/" use:link>首页</a>
        <span>›</span>
        <a href="/articles" use:link>文章列表</a>
        <span>›</span>
        <span>{article.title}</span>
      </div>

      <h1 class="article-title">{article.title}</h1>

      <div class="article-meta">
        <span class="meta-item">✍️ {article.author}</span>
        <span class="meta-item">📅 {article.date}</span>
        <span class="meta-item">👁️ {article.views}</span>
        <span class="meta-item">⏱️ {article.readTime}</span>
        <span class="category-badge">{article.category}</span>
      </div>
    </div>
  </div>

  <!-- 文章封面 -->
  <div class="article-cover">
    <img src={article.image} alt={article.title} />
  </div>

  <div class="container">
    <div class="article-layout">
      <!-- 文章内容 -->
      <div class="article-main">
        <div class="article-content">
          {@html article.content}
        </div>

        <!-- 标签 -->
        <div class="article-tags">
          {#each article.tags as tag}
            <span class="tag">#{tag}</span>
          {/each}
        </div>

        <!-- 分享按钮 -->
        <div class="article-actions">
          <button class="action-btn like-btn">❤️ 点赞 (42)</button>
          <button class="action-btn share-btn">🔗 分享</button>
          <button class="action-btn bookmark-btn">🔖 收藏</button>
        </div>

        <!-- 评论区 -->
        <div class="comments-section">
          <h2>💬 评论 ({comments.length})</h2>

          <form class="comment-form" on:submit|preventDefault>
            <textarea
              bind:value={comment}
              placeholder="写下你的评论..."
              rows="4"
            ></textarea>
            <button type="submit" class="submit-btn">发表评论</button>
          </form>

          <div class="comments-list">
            {#each comments as comment}
              <div class="comment">
                <div class="comment-avatar">👤</div>
                <div class="comment-content">
                  <div class="comment-header">
                    <strong>{comment.author}</strong>
                    <span class="comment-date">{comment.date}</span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- 侧边栏 -->
      <aside class="article-sidebar">
        <!-- 作者信息 -->
        <div class="sidebar-card author-card">
          <div class="author-avatar">👨‍💻</div>
          <h3>{article.author}</h3>
          <p>全栈开发工程师，热爱技术分享</p>
          <button class="follow-btn">+ 关注</button>
        </div>

        <!-- 相关文章 -->
        <div class="sidebar-card">
          <h3>📖 相关文章</h3>
          <ul class="related-list">
            {#each relatedArticles as related}
              <li>
                <a href={`/article/${related.id}`} use:link>
                  {related.title}
                  <span class="views">👁️ {related.views}</span>
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <!-- 目录 -->
        <div class="sidebar-card toc-card">
          <h3>📑 目录</h3>
          <ul class="toc">
            <li><a href="#intro">为什么选择 Svelte？</a></li>
            <li><a href="#concepts">核心概念</a></li>
            <li><a href="#practices">最佳实践</a></li>
            <li><a href="#summary">总结</a></li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</article>

<style>
  .article-detail {
    min-height: calc(100vh - 80px);
    padding-bottom: 4rem;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* 文章头部 */
  .article-header {
    padding: 2rem 0;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    color: #718096;
  }

  .breadcrumb a {
    color: #667eea;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .breadcrumb a:hover {
    color: #764ba2;
  }

  .article-title {
    font-size: 2.5rem;
    color: #2d3748;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  .article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
  }

  .meta-item {
    color: #718096;
    font-size: 0.95rem;
  }

  .category-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
  }

  /* 文章封面 */
  .article-cover {
    margin-bottom: 3rem;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }

  .article-cover img {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }

  /* 文章布局 */
  .article-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 3rem;
  }

  /* 文章主体 */
  .article-main {
    min-width: 0;
  }

  .article-content {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #2d3748;
  }

  .article-content :global(h2) {
    font-size: 1.8rem;
    margin: 2rem 0 1rem;
    color: #2d3748;
  }

  .article-content :global(h3) {
    font-size: 1.4rem;
    margin: 1.5rem 0 0.8rem;
    color: #4a5568;
  }

  .article-content :global(p) {
    margin-bottom: 1.2rem;
  }

  .article-content :global(code) {
    background: #f7fafc;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    color: #667eea;
  }

  .article-content :global(ul),
  .article-content :global(ol) {
    margin-bottom: 1.2rem;
    padding-left: 2rem;
  }

  .article-content :global(li) {
    margin-bottom: 0.5rem;
  }

  /* 标签 */
  .article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin: 2rem 0;
    padding-top: 2rem;
    border-top: 2px solid #e2e8f0;
  }

  .tag {
    background: #f7fafc;
    color: #667eea;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
  }

  /* 操作按钮 */
  .article-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 3rem;
  }

  .action-btn {
    padding: 0.8rem 1.5rem;
    border: 2px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .like-btn:hover {
    border-color: #ff6b6b;
    color: #ff6b6b;
  }

  .share-btn:hover {
    border-color: #667eea;
    color: #667eea;
  }

  .bookmark-btn:hover {
    border-color: #f59e0b;
    color: #f59e0b;
  }

  /* 评论区 */
  .comments-section {
    margin-top: 3rem;
    padding-top: 3rem;
    border-top: 2px solid #e2e8f0;
  }

  .comments-section h2 {
    margin-bottom: 1.5rem;
    color: #2d3748;
  }

  .comment-form {
    margin-bottom: 2rem;
  }

  .comment-form textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    margin-bottom: 1rem;
  }

  .comment-form textarea:focus {
    outline: none;
    border-color: #667eea;
  }

  .submit-btn {
    padding: 0.8rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .comment {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: #f7fafc;
    border-radius: 8px;
  }

  .comment-avatar {
    font-size: 2rem;
  }

  .comment-content {
    flex: 1;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .comment-date {
    color: #a0aec0;
    font-size: 0.9rem;
  }

  /* 侧边栏 */
  .article-sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .sidebar-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .sidebar-card h3 {
    margin-bottom: 1rem;
    color: #2d3748;
  }

  /* 作者卡片 */
  .author-card {
    text-align: center;
  }

  .author-avatar {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .author-card p {
    color: #718096;
    margin-bottom: 1rem;
  }

  .follow-btn {
    width: 100%;
    padding: 0.8rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .follow-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  /* 相关文章 */
  .related-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .related-list li {
    margin-bottom: 1rem;
  }

  .related-list a {
    display: block;
    color: #4a5568;
    text-decoration: none;
    transition: color 0.3s ease;
    line-height: 1.5;
  }

  .related-list a:hover {
    color: #667eea;
  }

  .related-list .views {
    display: block;
    font-size: 0.85rem;
    color: #a0aec0;
    margin-top: 0.3rem;
  }

  /* 目录 */
  .toc {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .toc li {
    margin-bottom: 0.8rem;
  }

  .toc a {
    color: #4a5568;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .toc a:hover {
    color: #667eea;
  }

  /* 响应式设计 */
  @media (max-width: 1024px) {
    .article-layout {
      grid-template-columns: 1fr;
    }

    .article-sidebar {
      order: 2;
    }
  }

  @media (max-width: 768px) {
    .article-title {
      font-size: 1.8rem;
    }

    .article-cover img {
      height: 250px;
    }

    .article-content {
      font-size: 1rem;
    }

    .article-actions {
      flex-direction: column;
    }

    .action-btn {
      width: 100%;
    }
  }
</style>
