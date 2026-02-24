<script>
  import Router from 'svelte-spa-router';
  import Header from './components/Header.svelte';
  import Footer from './components/Footer.svelte';

  // 为匿名用户生成唯一标识作为认证 token（后端直接将其用作 followerId）
  if (!localStorage.getItem('token')) {
    localStorage.setItem('token', crypto.randomUUID());
  }

  // 导入页面组件
  import Home from './pages/Home.svelte';
  import Articles from './pages/Articles.svelte';
  import ArticleDetail from './pages/ArticleDetail.svelte';
  import Popular from './pages/Popular.svelte';
  import MyBlog from './pages/MyBlog.svelte';
  import WriteArticle from './pages/WriteArticle.svelte';

  // 路由配置
  const routes = {
    '/': Home,
    '/articles': Articles,
    '/article/:id': ArticleDetail,
    '/popular': Popular,
    '/myblog': MyBlog,
    '/write': WriteArticle,
  };
</script>

<div class="app">
  <Header />

  <main class="main-content">
    <Router {routes} />
  </main>

  <Footer />
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #ffffff;
    color: #2d3748;
  }

  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
  }

  :global(a) {
    color: inherit;
    text-decoration: none;
  }

  :global(button) {
    font-family: inherit;
  }

  /* 滚动条样式 */
  :global(::-webkit-scrollbar) {
    width: 10px;
  }

  :global(::-webkit-scrollbar-track) {
    background: #f1f1f1;
  }

  :global(::-webkit-scrollbar-thumb) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 5px;
  }

  :global(::-webkit-scrollbar-thumb:hover) {
    background: linear-gradient(135deg, #5568d3 0%, #653a8b 100%);
  }
</style>
