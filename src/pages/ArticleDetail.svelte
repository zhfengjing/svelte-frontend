<script>
  import { onMount } from 'svelte';
  import { link } from 'svelte-spa-router';
  import Loading from '../components/Loading.svelte';
  import ErrorMessage from '../components/ErrorMessage.svelte';
  import { articleApi, commentApi } from '../services/api.js';

  export let params = {};

  let article = null;
  let relatedArticles = [];
  let comments = [];
  let comment = '';
  let loading = true;
  let error = null;
  let submitting = false;

  // 加载文章数据
  const loadArticle = async () => {
    loading = true;
    error = null;

    try {
      // 并行加载文章详情和评论
      const articleId = params.id;
      const [articleData, commentsData] = await Promise.all([
        articleApi.getArticleById(articleId),
        commentApi.getComments(articleId).catch(() => ({ data: [] })) // 评论加载失败不影响文章显示
      ]);

      article = articleData.data || articleData;
      comments = commentsData.data || commentsData;

      // 加载相关文章（基于分类）
      if (article && article.categoryId) {
        const relatedData = await articleApi.getArticles({
          category: article.categoryId,
          limit: 3,
          exclude: articleId // 排除当前文章
        }).catch(() => ({ data: [] }));
        relatedArticles = relatedData.data || relatedData;
      }
    } catch (err) {
      console.error('加载文章失败:', err);
      error = err.response?.data?.message || '加载文章失败，请稍后重试';
    } finally {
      loading = false;
    }
  };

  // 提交评论
  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      alert('请输入评论内容');
      return;
    }

    submitting = true;
    try {
      const newComment = await commentApi.createComment(params.id, {
        content: comment,
        author: '匿名用户', // 实际应用中应该从用户信息中获取
        date: new Date().toISOString().split('T')[0]
      });

      // 添加新评论到列表
      comments = [newComment.data || newComment, ...comments];
      comment = '';
      alert('评论发表成功！');
    } catch (err) {
      console.error('发表评论失败:', err);
      alert(err.response?.data?.message || '发表评论失败，请稍后重试');
    } finally {
      submitting = false;
    }
  };

  onMount(() => {
    loadArticle();
  });

  // 当路由参数变化时重新加载
  $: if (params.id) {
    loadArticle();
  }
</script>

{#if loading}
  <div class="article-detail">
    <Loading message="加载文章中..." size="large" />
  </div>
{:else if error}
  <div class="article-detail">
    <ErrorMessage message={error} onRetry={loadArticle} />
  </div>
{:else if article}
<article class="article-detail">
  <!-- 文章头部 -->
  <div class="article-header">
    <div class="container">
      <div class="breadcrumb">
        <a href="/" use:link>首页</a>
        <span>›</span>
        <a href="/articles" use:link>文章列表</a>
        <span>›</span>
        <span>{article.title || '文章详情'}</span>
      </div>

      <h1 class="article-title">{article.title}</h1>

      <div class="article-meta">
        <span class="meta-item">✍️ {article.author}</span>
        <span class="meta-item">📅 {article.date}</span>
        <span class="meta-item">👁️ {article.views}</span>
        {#if article.readTime}
          <span class="meta-item">⏱️ {article.readTime}</span>
        {/if}
        <span class="category-badge">{article.category}</span>
      </div>
    </div>
  </div>

  <!-- 文章封面 -->
  {#if article.image}
    <div class="article-cover">
      <img src={article.image} alt={article.title} />
    </div>
  {/if}

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

          <form class="comment-form" on:submit|preventDefault={handleSubmitComment}>
            <textarea
              bind:value={comment}
              placeholder="写下你的评论..."
              rows="4"
              disabled={submitting}
            ></textarea>
            <button type="submit" class="submit-btn" disabled={submitting}>
              {submitting ? '提交中...' : '发表评论'}
            </button>
          </form>

          <div class="comments-list">
            {#if comments.length > 0}
              {#each comments as commentItem}
                <div class="comment">
                  <div class="comment-avatar">👤</div>
                  <div class="comment-content">
                    <div class="comment-header">
                      <strong>{commentItem.author}</strong>
                      <span class="comment-date">{commentItem.date}</span>
                    </div>
                    <p>{commentItem.content}</p>
                  </div>
                </div>
              {/each}
            {:else}
              <p class="no-comments">暂无评论，快来发表第一条评论吧！</p>
            {/if}
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
{/if}

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
