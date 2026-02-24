<script>
  const currentYear = new Date().getFullYear();
</script>

<footer>
  <div class="container">
    <div class="footer-content">
      <div class="footer-section">
        <h3>📝 关于博客</h3>
        <p>分享技术、记录生活，与你一起成长</p>
      </div>

      <div class="footer-section">
        <h3>🔗 快速链接</h3>
        <ul>
          <li><a href="/">首页</a></li>
          <li><a href="/articles">文章列表</a></li>
          <li><a href="/popular">热门文章</a></li>
          <li><a href="/myblog">我的博客</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>📧 联系方式</h3>
        <ul>
          <li>📮 Email: blog@example.com</li>
          <li>🐙 GitHub: @yourusername</li>
          <li>🐦 Twitter: @yourusername</li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {currentYear} 我的博客. 保留所有权利.</p>
      <p>用 ❤️ 和 Svelte 构建</p>
    </div>
  </div>
</footer>

<style>
  footer {
    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
    color: white;
    margin-top: auto;
    padding: 3rem 0 1rem;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .footer-section h3 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    color: #fff;
  }

  .footer-section p {
    color: #cbd5e0;
    line-height: 1.6;
  }

  .footer-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-section ul li {
    margin-bottom: 0.8rem;
  }

  .footer-section a {
    color: #cbd5e0;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .footer-section a:hover {
    color: #667eea;
  }

  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 1.5rem;
    text-align: center;
    color: #a0aec0;
    font-size: 0.9rem;
  }

  .footer-bottom p {
    margin: 0.5rem 0;
  }

  @media (max-width: 768px) {
    footer {
      padding: 2rem 0 1rem;
    }

    .footer-content {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .footer-section {
      text-align: center;
    }
  }
</style>
