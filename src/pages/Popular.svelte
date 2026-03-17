<script>
  import { onMount } from 'svelte';
  import ArticleCard from '../components/ArticleCard.svelte';
  import Loading from '../components/Loading.svelte';
  import ErrorMessage from '../components/ErrorMessage.svelte';
  import { articleApi } from '../services/api.js';

  let popularArticles = [];
  let loading = true;
  let error = null;

  const timeRanges = [
    { id: 'today', label: '今日热门', icon: '🔥' },
    { id: 'week', label: '本周热门', icon: '📈' },
    { id: 'month', label: '本月热门', icon: '⭐' },
    { id: 'all', label: '全部热门', icon: '👑' }
  ];

  let selectedRange = 'week';

  // 加载热门文章
  const loadPopularArticles = async (timeRange = 'week') => {
    loading = true;
    error = null;

    try {
      const response = await articleApi.getPopularArticles({
        timeRange: timeRange
      });
      popularArticles = response.data || response;
    } catch (err) {
      console.error('加载热门文章失败:', err);
      error = err.response?.data?.message || '加载热门文章失败，请稍后重试';
      popularArticles = [];
    } finally {
      loading = false;
    }
  };

  // 当时间范围改变时重新加载
  $: loadPopularArticles(selectedRange);

  onMount(() => {
    loadPopularArticles(selectedRange);
  });
</script>

<div class="popular-page">
  <div class="page-header">
    <div class="container">
      <h1>🔥 热门文章</h1>
      <p>最受欢迎的文章，由社区推荐</p>
    </div>
  </div>

  <div class="container">
    <!-- 时间范围选择 -->
    <div class="time-range-selector">
      {#each timeRanges as range (range.id)}
        <button
          class="range-btn"
          class:active={selectedRange === range.id}
          on:click={() => selectedRange = range.id}
        >
          <span class="range-icon">{range.icon}</span>
          <span class="range-label">{range.label}</span>
        </button>
      {/each}
    </div>

    <!-- 热门榜单 -->
    <div class="popular-section">
      <div class="section-header">
        <h2>📊 热门排行榜</h2>
        <p>根据浏览量、点赞和分享综合排名</p>
      </div>

      {#if loading}
        <Loading message="加载热门文章中..." size="large" />
      {:else if error}
        <ErrorMessage message={error} onRetry={() => loadPopularArticles(selectedRange)} />
      {:else if popularArticles.length > 0}
        <div class="ranking-grid">
          {#each popularArticles as article, index (article.id)}
            <div class="ranking-item">
              <div class="rank-number" class:top-three={index < 3}>
                {#if index === 0}
                  🥇
                {:else if index === 1}
                  🥈
                {:else if index === 2}
                  🥉
                {:else}
                  {index + 1}
                {/if}
              </div>
              <ArticleCard {article} featured={index < 3} />
            </div>
          {/each}
        </div>
      {:else}
        <div class="empty-state">
          <p>暂无热门文章</p>
        </div>
      {/if}
    </div>

    <!-- 趋势统计 -->
    <div class="trending-section">
      <h2>📈 趋势分析</h2>
      <div class="trending-grid">
        <div class="trending-card">
          <div class="trending-icon">🚀</div>
          <h3>快速上升</h3>
          <p>过去24小时增长最快</p>
          <ul class="trending-list">
            <li>React vs Vue vs Svelte <span class="trend-up">+350%</span></li>
            <li>Web3 开发入门 <span class="trend-up">+210%</span></li>
            <li>前端性能优化 <span class="trend-up">+180%</span></li>
          </ul>
        </div>

        <div class="trending-card">
          <div class="trending-icon">⚡</div>
          <h3>持续热门</h3>
          <p>长期保持高人气</p>
          <ul class="trending-list">
            <li>Svelte 完整指南 <span class="trend-stable">稳定</span></li>
            <li>Python 数据分析 <span class="trend-stable">稳定</span></li>
            <li>智能合约开发 <span class="trend-stable">稳定</span></li>
          </ul>
        </div>

        <div class="trending-card">
          <div class="trending-icon">🎯</div>
          <h3>新秀推荐</h3>
          <p>最近发布的优质内容</p>
          <ul class="trending-list">
            <li>TypeScript 高级技巧 <span class="trend-new">新</span></li>
            <li>响应式设计指南 <span class="trend-new">新</span></li>
            <li>UI/UX设计趋势 <span class="trend-new">新</span></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .popular-page {
    min-height: calc(100vh - 80px);
    padding-bottom: 4rem;
  }

  .page-header {
    background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
    color: white;
    padding: 4rem 0;
    text-align: center;
    margin-bottom: 3rem;
  }

  .page-header h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .page-header p {
    font-size: 1.2rem;
    opacity: 0.95;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* 时间范围选择器 */
  .time-range-selector {
    display: flex;
    gap: 1rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .range-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 1.5rem;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .range-btn:hover {
    border-color: #f59e0b;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
  }

  .range-btn.active {
    background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
    border-color: transparent;
    color: white;
  }

  .range-icon {
    font-size: 1.2rem;
  }

  /* 热门榜单 */
  .popular-section {
    margin-bottom: 4rem;
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

  .ranking-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
  }

  .ranking-item {
    position: relative;
  }

  .rank-number {
    position: absolute;
    top: -15px;
    left: -15px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .rank-number.top-three {
    width: 60px;
    height: 60px;
    font-size: 1.8rem;
    background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  }

  /* 趋势统计 */
  .trending-section {
    background: #f7fafc;
    padding: 3rem;
    border-radius: 16px;
    margin-top: 4rem;
  }

  .trending-section h2 {
    text-align: center;
    font-size: 2rem;
    color: #2d3748;
    margin-bottom: 2rem;
  }

  .trending-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .trending-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }

  .trending-card:hover {
    transform: translateY(-5px);
  }

  .trending-icon {
    font-size: 3rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  .trending-card h3 {
    font-size: 1.3rem;
    color: #2d3748;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .trending-card p {
    color: #718096;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .trending-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .trending-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 0;
    border-bottom: 1px solid #e2e8f0;
    color: #4a5568;
  }

  .trending-list li:last-child {
    border-bottom: none;
  }

  .trend-up {
    color: #10b981;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .trend-stable {
    color: #667eea;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .trend-new {
    background: #f59e0b;
    color: white;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .page-header h1 {
      font-size: 2rem;
    }

    .page-header p {
      font-size: 1rem;
    }

    .ranking-grid {
      grid-template-columns: 1fr;
    }

    .trending-section {
      padding: 2rem 1rem;
    }

    .trending-grid {
      grid-template-columns: 1fr;
    }

    .time-range-selector {
      justify-content: stretch;
    }

    .range-btn {
      flex: 1;
      justify-content: center;
    }
  }
</style>
