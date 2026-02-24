<script>
  import { link } from 'svelte-spa-router';
  import ArticleCard from '../components/ArticleCard.svelte';

  // 模拟数据
  const featuredArticles = [
    {
      id: 1,
      title: 'Svelte 完整指南：从入门到精通',
      excerpt: '深入学习 Svelte 框架，掌握现代前端开发技术。本文将带你了解 Svelte 的核心概念和最佳实践。',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
      author: '张三',
      date: '2024-02-20',
      views: '1.2k',
      category: '前端开发'
    },
    {
      id: 2,
      title: 'Web3 开发入门：构建去中心化应用',
      excerpt: '探索区块链技术和 Web3 生态系统，学习如何构建去中心化应用程序。',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
      author: '李四',
      date: '2024-02-18',
      views: '980',
      category: 'Web3'
    },
    {
      id: 3,
      title: 'TypeScript 高级技巧与最佳实践',
      excerpt: '提升你的 TypeScript 技能，学习高级类型系统和设计模式。',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop',
      author: '王五',
      date: '2024-02-15',
      views: '856',
      category: '编程语言'
    }
  ];

  const stats = [
    { icon: '📝', number: '120+', label: '文章总数' },
    { icon: '👥', number: '5k+', label: '读者' },
    { icon: '💬', number: '800+', label: '评论' },
    { icon: '❤️', number: '3.2k', label: '点赞' }
  ];
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
        {#each stats as stat}
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

      <div class="articles-grid">
        {#each featuredArticles as article}
          <ArticleCard {article} />
        {/each}
      </div>

      <div class="view-more">
        <a href="/articles" use:link class="btn btn-outline">
          查看更多文章 →
        </a>
      </div>
    </div>
  </section>

  <!-- 订阅区域 -->
  <section class="subscribe-section">
    <div class="container">
      <div class="subscribe-card">
        <h2>📬 订阅我的博客</h2>
        <p>获取最新文章和技术见解，直接发送到你的邮箱</p>
        <form class="subscribe-form" on:submit|preventDefault>
          <input
            type="email"
            placeholder="输入你的邮箱地址"
            class="subscribe-input"
          />
          <button type="submit" class="btn btn-primary">
            订阅
          </button>
        </form>
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
