<script>
  import { onMount } from 'svelte';
  import { link } from 'svelte-spa-router';
  import ArticleCard from '../components/ArticleCard.svelte';
  import Loading from '../components/Loading.svelte';
  import ErrorMessage from '../components/ErrorMessage.svelte';
  import { articleApi, userApi, subscribeApi } from '../services/api.js';

  let featuredArticles = [];
  let stats = [];
  let loading = true;
  let error = null;

  // 订阅状态
  let subscribeEmail = '';
  let subscribing = false;
  let subscribeSuccess = false;
  let subscribeError = '';

  // 加载数据
  const loadData = async () => {
    loading = true;
    error = null;

    try {
      // 并行请求精选文章和统计数据
      const [articlesData, statsData] = await Promise.all([
        articleApi.getArticles({ featured: true, limit: 3 }),
        userApi.getUserStats()
      ]);

      featuredArticles = articlesData.data || articlesData;
      stats = statsData.data || statsData;
    } catch (err) {
      console.error('加载数据失败:', err);
      error = err.response?.data?.message || '加载数据失败，请稍后重试';

      // 使用默认数据作为后备
      featuredArticles = [];
      stats = [
        { icon: '📝', number: '120+', label: '文章总数' },
        { icon: '👥', number: '5k+', label: '读者' },
        { icon: '💬', number: '800+', label: '评论' },
        { icon: '❤️', number: '3.2k', label: '点赞' }
      ];
    } finally {
      loading = false;
    }
  };

  const handleSubscribe = async () => {
    subscribeError = '';
    if (!subscribeEmail.trim()) {
      subscribeError = '请输入邮箱地址';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscribeEmail)) {
      subscribeError = '请输入有效的邮箱地址';
      return;
    }

    subscribing = true;
    try {
      await subscribeApi.subscribe(subscribeEmail);
      subscribeSuccess = true;
      subscribeEmail = '';
    } catch (err) {
      subscribeError = err.response?.data?.message || '订阅失败，请稍后重试';
    } finally {
      subscribing = false;
    }
  };

  onMount(() => {
    loadData();
  });
</script>

<div class="home">
  <!-- 英雄区域 -->
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">欢迎来到我的博客 🚀</h1>
      <p class="hero-subtitle">
        分享技术见解，记录成长历程，探索前沿科技
      </p>
      <div class="hero-buttons">
        <a href="/articles" use:link class="btn btn-primary">
          浏览文章
        </a>
        <a href="/myblog" use:link class="btn btn-secondary">
          关于我
        </a>
      </div>
    </div>
    <div class="hero-decoration">
      <div class="floating-element">💻</div>
      <div class="floating-element">🌟</div>
      <div class="floating-element">🎨</div>
    </div>
  </section>

  <!-- 统计数据 -->
  <section class="stats">
    <div class="container">
      <div class="stats-grid">
        {#each stats as stat (stat.label)}
          <div class="stat-card">
            <div class="stat-icon">{stat.icon}</div>
            <div class="stat-number">{stat.number}</div>
            <div class="stat-label">{stat.label}</div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- 精选文章 -->
  <section class="featured-section">
    <div class="container">
      <div class="section-header">
        <h2>✨ 精选文章</h2>
        <p>精心挑选的优质内容</p>
      </div>

      {#if loading}
        <Loading message="加载精选文章中..." />
      {:else if error}
        <ErrorMessage message={error} onRetry={loadData} />
      {:else if featuredArticles.length > 0}
        <div class="articles-grid">
          {#each featuredArticles as article (article.id)}
            <ArticleCard {article} />
          {/each}
        </div>

        <div class="view-more">
          <a href="/articles" use:link class="btn btn-outline">
            查看更多文章 →
          </a>
        </div>
      {:else}
        <div class="empty-state">
          <p>暂无精选文章</p>
        </div>
      {/if}
    </div>
  </section>

  <!-- 订阅区域 -->
  <section class="subscribe-section">
    <div class="container">
      <div class="subscribe-card">
        <h2>📬 订阅我的博客</h2>
        <p>获取最新文章和技术见解，直接发送到你的邮箱</p>

        {#if subscribeSuccess}
          <div class="subscribe-success">
            🎉 订阅成功！感谢你的关注，最新内容将发送到你的邮箱。
          </div>
        {:else}
          <form class="subscribe-form" on:submit|preventDefault={handleSubscribe}>
            <input
              type="email"
              placeholder="输入你的邮箱地址"
              class="subscribe-input"
              class:input-error={subscribeError}
              bind:value={subscribeEmail}
              disabled={subscribing}
            />
            <button type="submit" class="btn btn-primary" disabled={subscribing}>
              {subscribing ? '订阅中...' : '订阅'}
            </button>
          </form>
          {#if subscribeError}
            <p class="subscribe-error">{subscribeError}</p>
          {/if}
        {/if}
      </div>
    </div>
  </section>
</div>

<style>
  .home {
    min-height: calc(100vh - 80px);
  }

  /* 英雄区域样式 */
  .hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 6rem 2rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .hero-title {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    animation: fadeInUp 0.8s ease;
  }

  .hero-subtitle {
    font-size: 1.3rem;
    margin-bottom: 2rem;
    opacity: 0.95;
    animation: fadeInUp 0.8s ease 0.2s both;
  }

  .hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    animation: fadeInUp 0.8s ease 0.4s both;
  }

  .hero-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  .floating-element {
    position: absolute;
    font-size: 3rem;
    opacity: 0.1;
    animation: float 6s ease-in-out infinite;
  }

  .floating-element:nth-child(1) {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  .floating-element:nth-child(2) {
    top: 60%;
    right: 15%;
    animation-delay: 2s;
  }

  .floating-element:nth-child(3) {
    bottom: 20%;
    left: 70%;
    animation-delay: 4s;
  }

  /* 统计数据样式 */
  .stats {
    padding: 3rem 0;
    background: #f7fafc;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }

  .stat-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-5px);
  }

  .stat-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: #718096;
    font-size: 1rem;
  }

  /* 精选文章样式 */
  .featured-section {
    padding: 4rem 0;
  }

  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-header h2 {
    font-size: 2.5rem;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  .section-header p {
    color: #718096;
    font-size: 1.1rem;
  }

  .articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .view-more {
    text-align: center;
  }

  /* 订阅区域样式 */
  .subscribe-section {
    padding: 4rem 0;
    background: #f7fafc;
  }

  .subscribe-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 3rem;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }

  .subscribe-card h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .subscribe-card p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.95;
  }

  .subscribe-form {
    display: flex;
    gap: 1rem;
    max-width: 500px;
    margin: 0 auto;
    flex-wrap: wrap;
    justify-content: center;
  }

  .subscribe-input {
    flex: 1;
    min-width: 250px;
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
  }

  .subscribe-input:focus {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  .subscribe-input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .input-error {
    outline: 2px solid #fc8181;
    outline-offset: 2px;
  }

  .subscribe-error {
    margin-top: 0.75rem;
    color: #fed7d7;
    font-size: 0.9rem;
  }

  .subscribe-success {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 1rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
  }

  /* 按钮样式 */
  .btn {
    display: inline-block;
    padding: 0.8rem 2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    font-size: 1rem;
  }

  .btn-primary {
    background: white;
    color: #667eea;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid white;
  }

  .btn-secondary:hover {
    background: white;
    color: #667eea;
  }

  .btn-outline {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
  }

  .btn-outline:hover {
    background: #667eea;
    color: white;
  }

  /* 动画 */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(10deg);
    }
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .hero {
      padding: 4rem 1.5rem;
    }

    .hero-title {
      font-size: 2.5rem;
    }

    .hero-subtitle {
      font-size: 1.1rem;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .articles-grid {
      grid-template-columns: 1fr;
    }

    .subscribe-card {
      padding: 2rem 1.5rem;
    }

    .subscribe-form {
      flex-direction: column;
    }

    .subscribe-input {
      width: 100%;
    }
  }
</style>
