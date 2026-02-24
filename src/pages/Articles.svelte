<script>
  import ArticleCard from '../components/ArticleCard.svelte';

  let searchQuery = '';
  let selectedCategory = 'all';

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'frontend', name: '前端开发' },
    { id: 'web3', name: 'Web3' },
    { id: 'programming', name: '编程语言' },
    { id: 'design', name: '设计' }
  ];

  const allArticles = [
    {
      id: 1,
      title: 'Svelte 完整指南：从入门到精通',
      excerpt: '深入学习 Svelte 框架，掌握现代前端开发技术。本文将带你了解 Svelte 的核心概念和最佳实践。',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
      author: '张三',
      date: '2024-02-20',
      views: '1.2k',
      category: '前端开发',
      categoryId: 'frontend'
    },
    {
      id: 2,
      title: 'Web3 开发入门：构建去中心化应用',
      excerpt: '探索区块链技术和 Web3 生态系统，学习如何构建去中心化应用程序。',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
      author: '李四',
      date: '2024-02-18',
      views: '980',
      category: 'Web3',
      categoryId: 'web3'
    },
    {
      id: 3,
      title: 'TypeScript 高级技巧与最佳实践',
      excerpt: '提升你的 TypeScript 技能，学习高级类型系统和设计模式。',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop',
      author: '王五',
      date: '2024-02-15',
      views: '856',
      category: '编程语言',
      categoryId: 'programming'
    },
    {
      id: 4,
      title: '响应式设计完全指南',
      excerpt: '学习如何创建在所有设备上都能完美显示的网站，掌握响应式设计的精髓。',
      image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&h=250&fit=crop',
      author: '赵六',
      date: '2024-02-12',
      views: '725',
      category: '设计',
      categoryId: 'design'
    },
    {
      id: 5,
      title: 'React vs Vue vs Svelte：2024框架对比',
      excerpt: '深入比较三大前端框架的优缺点，帮助你选择最适合项目的技术栈。',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
      author: '张三',
      date: '2024-02-10',
      views: '1.5k',
      category: '前端开发',
      categoryId: 'frontend'
    },
    {
      id: 6,
      title: '智能合约开发实战教程',
      excerpt: '从零开始学习 Solidity，编写并部署你的第一个智能合约。',
      image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400&h=250&fit=crop',
      author: '李四',
      date: '2024-02-08',
      views: '892',
      category: 'Web3',
      categoryId: 'web3'
    },
    {
      id: 7,
      title: 'Python 数据分析完整教程',
      excerpt: '使用 Python 进行数据分析，掌握 Pandas、NumPy 和 Matplotlib。',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop',
      author: '王五',
      date: '2024-02-05',
      views: '1.1k',
      category: '编程语言',
      categoryId: 'programming'
    },
    {
      id: 8,
      title: 'UI/UX设计趋势2024',
      excerpt: '探索最新的用户界面和用户体验设计趋势，保持你的设计现代化。',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
      author: '赵六',
      date: '2024-02-03',
      views: '678',
      category: '设计',
      categoryId: 'design'
    },
    {
      id: 9,
      title: '前端性能优化完全指南',
      excerpt: '学习如何优化网站性能，提升用户体验和搜索引擎排名。',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
      author: '张三',
      date: '2024-02-01',
      views: '945',
      category: '前端开发',
      categoryId: 'frontend'
    }
  ];

  $: filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
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
        {#each categories as category}
          <button
            class="category-btn"
            class:active={selectedCategory === category.id}
            on:click={() => selectedCategory = category.id}
          >
            {category.name}
          </button>
        {/each}
      </div>
    </div>

    <!-- 文章网格 -->
    <div class="results-info">
      <p>找到 <strong>{filteredArticles.length}</strong> 篇文章</p>
    </div>

    {#if filteredArticles.length > 0}
      <div class="articles-grid">
        {#each filteredArticles as article}
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

    <!-- 分页（示例） -->
    <div class="pagination">
      <button class="page-btn" disabled>← 上一页</button>
      <div class="page-numbers">
        <button class="page-number active">1</button>
        <button class="page-number">2</button>
        <button class="page-number">3</button>
      </div>
      <button class="page-btn">下一页 →</button>
    </div>
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
