<script>
  import { link } from 'svelte-spa-router';

  export let article;
  export let featured = false;
</script>

<article class="article-card" class:featured>
  <div class="card-image">
    <img src={article.image} alt={article.title} />
    {#if article.category}
      <span class="category-badge">{article.category}</span>
    {/if}
    {#if featured}
      <span class="featured-badge">🔥 热门</span>
    {/if}
  </div>

  <div class="card-content">
    <h3 class="card-title">
      <a href={`/article/${article.id}`} use:link>{article.title}</a>
    </h3>

    <p class="card-excerpt">{article.excerpt}</p>

    <div class="card-meta">
      <span class="author">✍️ {article.author}</span>
      <span class="date">📅 {article.date}</span>
      <span class="views">👁️ {article.views}</span>
    </div>

    <a href={`/article/${article.id}`} use:link class="read-more">
      阅读更多 →
    </a>
  </div>
</article>

<style>
  .article-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .article-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }

  .article-card.featured {
    border: 2px solid #ff6b6b;
  }

  .card-image {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .article-card:hover .card-image img {
    transform: scale(1.1);
  }

  .category-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(102, 126, 234, 0.9);
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .featured-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 107, 107, 0.9);
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .card-content {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .card-title {
    margin: 0 0 1rem 0;
    font-size: 1.4rem;
    line-height: 1.4;
  }

  .card-title a {
    color: #2d3748;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .card-title a:hover {
    color: #667eea;
  }

  .card-excerpt {
    color: #718096;
    line-height: 1.6;
    margin-bottom: 1rem;
    flex: 1;
  }

  .card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.9rem;
    color: #a0aec0;
    margin-bottom: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
  }

  .card-meta span {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .read-more {
    display: inline-flex;
    align-items: center;
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .read-more:hover {
    color: #764ba2;
    gap: 0.5rem;
  }

  @media (max-width: 768px) {
    .card-title {
      font-size: 1.2rem;
    }

    .card-meta {
      font-size: 0.8rem;
      gap: 0.5rem;
    }
  }
</style>
