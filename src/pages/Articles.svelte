<script>
  import { onMount } from 'svelte';
  import ArticleCard from '../components/ArticleCard.svelte';
  import Loading from '../components/Loading.svelte';
  import ErrorMessage from '../components/ErrorMessage.svelte';
  import { articleApi, categoryApi } from '../services/api.js';

  let searchQuery = '';
  let selectedCategory = 'all';
  let categories = [{ id: 'all', name: '全部' }];
  let allArticles = [];
  let loading = true;
  let error = null;

  // 分页状态
  let currentPage = 1;
  const pageSize = 9;

  // 加载数据
  const loadData = async () => {
    loading = true;
    error = null;

    try {
      // 并行加载文章和分类
      const [articlesData, categoriesData] = await Promise.all([
        articleApi.getArticles(),
        categoryApi.getCategories()
      ]);

      allArticles = articlesData.data || articlesData;
      const apiCategories = categoriesData.data || categoriesData;
      categories = [{ id: 'all', name: '全部' }, ...apiCategories];
    } catch (err) {
      console.error('加载数据失败:', err);
      error = err.response?.data?.message || '加载数据失败，请稍后重试';
      allArticles = [];
    } finally {
      loading = false;
    }
  };

  // 筛选文章
  $: filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 筛选条件变化时重置到第一页
  $: if (searchQuery || selectedCategory) {
    currentPage = 1;
  }

  // 分页计算
  $: totalPages = Math.ceil(filteredArticles.length / pageSize);
  $: paginatedArticles = filteredArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 页码列表（最多显示5个页码）
  $: pageNumbers = (() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  onMount(() => {
    loadData();
  });
</script>

<div class="articles-page">
  <div class="page-header">
    <div class="container">
      <h1>📚 文章列表</h1>
      <p>探索丰富的技术文章，学习最新的开发知识</p>
    </div>
  </div>

  <div class="container">
    <!-- 搜索和筛选 -->
    <div class="filters-section">
      <div class="search-box">
        <input
          type="text"
          placeholder="🔍 搜索文章..."
          bind:value={searchQuery}
          class="search-input"
        />
      </div>

      <div class="categories">
        {#each categories as category (category.id)}
          <button
            class="category-btn"
            class:active={selectedCategory === (category.id === 'all' ? 'all' : category.name)}
            on:click={() => selectedCategory = category.id === 'all' ? 'all' : category.name}
          >
            {category.name}
          </button>
        {/each}
      </div>
    </div>

    <!-- 文章网格 -->
    {#if loading}
      <Loading message="加载文章列表中..." size="large" />
    {:else if error}
      <ErrorMessage message={error} onRetry={loadData} />
    {:else}
      <div class="results-info">
        <p>找到 <strong>{filteredArticles.length}</strong> 篇文章
          {#if totalPages > 1}
            ，第 <strong>{currentPage}</strong> / <strong>{totalPages}</strong> 页
          {/if}
        </p>
      </div>

      {#if paginatedArticles.length > 0}
        <div class="articles-grid">
          {#each paginatedArticles as article (article.id)}
            <ArticleCard {article} />
          {/each}
        </div>
      {:else}
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>没有找到相关文章</h3>
          <p>尝试调整搜索条件或选择其他分类</p>
        </div>
      {/if}
    {/if}

    <!-- 分页 -->
    {#if !loading && !error && totalPages > 1}
      <div class="pagination">
        <button class="page-btn" disabled={currentPage === 1} on:click={() => goToPage(currentPage - 1)}>
          ← 上一页
        </button>
        <div class="page-numbers">
          {#each pageNumbers as page (page)}
            <button
              class="page-number"
              class:active={page === currentPage}
              on:click={() => goToPage(page)}
            >
              {page}
            </button>
          {/each}
        </div>
        <button class="page-btn" disabled={currentPage === totalPages} on:click={() => goToPage(currentPage + 1)}>
          下一页 →
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .articles-page {
    min-height: calc(100vh - 80px);
    padding-bottom: 4rem;
  }

  .page-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

  /* 筛选区域 */
  .filters-section {
    margin-bottom: 2rem;
  }

  .search-box {
    margin-bottom: 1.5rem;
  }

  .search-input {
    width: 100%;
    padding: 1rem 1.5rem;
    font-size: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .categories {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .category-btn {
    padding: 0.6rem 1.2rem;
    border: 2px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.3s ease;
    color: #4a5568;
  }

  .category-btn:hover {
    border-color: #667eea;
    color: #667eea;
  }

  .category-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: transparent;
    color: white;
  }

  /* 结果信息 */
  .results-info {
    margin-bottom: 1.5rem;
    color: #718096;
  }

  .results-info strong {
    color: #667eea;
  }

  /* 文章网格 */
  .articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  /* 无结果 */
  .no-results {
    text-align: center;
    padding: 4rem 2rem;
    color: #718096;
  }

  .no-results-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .no-results h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #2d3748;
  }

  /* 分页 */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 3rem;
  }

  .page-btn {
    padding: 0.6rem 1.2rem;
    border: 2px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .page-btn:hover:not(:disabled) {
    border-color: #667eea;
    color: #667eea;
  }

  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-numbers {
    display: flex;
    gap: 0.5rem;
  }

  .page-number {
    width: 40px;
    height: 40px;
    border: 2px solid #e2e8f0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .page-number:hover {
    border-color: #667eea;
    color: #667eea;
  }

  .page-number.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: transparent;
    color: white;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .page-header h1 {
      font-size: 2rem;
    }

    .page-header p {
      font-size: 1rem;
    }

    .articles-grid {
      grid-template-columns: 1fr;
    }

    .categories {
      gap: 0.5rem;
    }

    .category-btn {
      font-size: 0.85rem;
      padding: 0.5rem 1rem;
    }

    .pagination {
      flex-wrap: wrap;
    }
  }
</style>
