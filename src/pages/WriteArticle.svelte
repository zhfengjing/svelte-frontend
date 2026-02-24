<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { articleApi, categoryApi } from '../services/api.js';

  export let params = {};

  let article = {
    title: '',
    category: 'frontend',
    tags: '',
    image: '',
    excerpt: '',
    content: ''
  };

  let showPreview = false;
  let saving = false;
  let categories = [];
  let loadingCategories = true;
  let loadingArticle = false;

  $: editMode = !!params.id;

  // 加载分类列表
  const loadCategories = async () => {
    loadingCategories = true;
    try {
      const response = await categoryApi.getCategories();
      const categoriesData = response.data || response;
      categories = categoriesData;
      if (categories.length > 0 && !editMode) {
        article.category = categories[0].id;
      }
    } catch (err) {
      console.error('加载分类失败:', err);
      categories = [
        { id: 'frontend', name: '前端开发' },
        { id: 'web3', name: 'Web3' },
        { id: 'programming', name: '编程语言' },
        { id: 'design', name: '设计' }
      ];
    } finally {
      loadingCategories = false;
    }
  };

  // 编辑模式：加载已有文章数据
  const loadArticleForEdit = async () => {
    loadingArticle = true;
    try {
      const res = await articleApi.getArticleById(params.id);
      const data = res.data || res;
      article = {
        title: data.title || '',
        category: data.category_id || data.category || 'frontend',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
        image: data.image || '',
        excerpt: data.excerpt || '',
        content: data.content || ''
      };
    } catch (err) {
      console.error('加载文章失败:', err);
      alert('加载文章失败，返回我的博客');
      push('/myblog');
    } finally {
      loadingArticle = false;
    }
  };

  const handleSubmit = async (isDraft = false) => {
    if (!article.title.trim()) {
      alert('请输入文章标题');
      return;
    }
    if (!article.content.trim()) {
      alert('请输入文章内容');
      return;
    }

    saving = true;
    try {
      const articleData = {
        ...article,
        isDraft,
        tags: article.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        categoryId: article.category,
        author: '当前用户',
        date: new Date().toISOString().split('T')[0]
      };

      if (editMode) {
        // 更新文章
        await articleApi.updateArticle(params.id, articleData);
        alert(isDraft ? '草稿已保存！' : '文章已更新并发布！');
        push('/myblog');
      } else {
        // 创建文章
        const response = await articleApi.createArticle(articleData);
        const created = response.data || response;

        // 将新文章 id 存入 localStorage，用于"我的文章"列表
        const ids = JSON.parse(localStorage.getItem('myArticleIds') || '[]');
        ids.unshift(created.id);
        localStorage.setItem('myArticleIds', JSON.stringify(ids));

        alert(isDraft ? '草稿已保存！' : '文章已发布！');
        if (!isDraft) {
          push('/articles');
        }
      }
    } catch (err) {
      console.error('保存文章失败:', err);
      alert(err.response?.data?.message || '保存文章失败，请稍后重试');
    } finally {
      saving = false;
    }
  };

  onMount(async () => {
    await loadCategories();
    if (params.id) {
      loadArticleForEdit();
    }
  });

  // 路由参数变化时重新加载（从创建页跳到编辑页等场景）
  $: if (params.id) {
    loadArticleForEdit();
  }

  const togglePreview = () => {
    showPreview = !showPreview;
  };

  const insertMarkdown = (type) => {
    const textarea = document.querySelector('.content-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = article.content.substring(start, end);
    let newText = '';

    switch(type) {
      case 'bold':
        newText = `**${selectedText || '粗体文字'}**`;
        break;
      case 'italic':
        newText = `*${selectedText || '斜体文字'}*`;
        break;
      case 'heading':
        newText = `## ${selectedText || '标题'}`;
        break;
      case 'link':
        newText = `[${selectedText || '链接文字'}](url)`;
        break;
      case 'image':
        newText = `![${selectedText || '图片描述'}](图片URL)`;
        break;
      case 'code':
        newText = `\`${selectedText || '代码'}\``;
        break;
      case 'codeblock':
        newText = `\`\`\`\n${selectedText || '代码块'}\n\`\`\``;
        break;
      case 'list':
        newText = `- ${selectedText || '列表项'}`;
        break;
    }

    article.content = article.content.substring(0, start) + newText + article.content.substring(end);

    // 重新聚焦并设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  // 自动生成摘要
  $: if (article.content && !article.excerpt) {
    const plainText = article.content.replace(/[#*`\[\]]/g, '').trim();
    article.excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
  }
</script>

<div class="write-article-page">
  <div class="container">
    <div class="page-header">
      <h1>{editMode ? '✏️ 编辑文章' : '✍️ 写文章'}</h1>
      <div class="header-actions">
        {#if editMode}
          <button class="btn btn-secondary" on:click={() => push('/myblog')} disabled={saving}>
            ← 返回
          </button>
        {/if}
        <button class="btn btn-secondary" on:click={togglePreview} disabled={saving}>
          {showPreview ? '📝 编辑' : '👁️ 预览'}
        </button>
        <button class="btn btn-outline" on:click={() => handleSubmit(true)} disabled={saving}>
          {saving ? '保存中...' : '💾 保存草稿'}
        </button>
        <button class="btn btn-primary" on:click={() => handleSubmit(false)} disabled={saving}>
          {saving ? '发布中...' : (editMode ? '🚀 更新发布' : '🚀 发布文章')}
        </button>
      </div>
    </div>

    {#if loadingArticle}
      <div class="loading-overlay">加载文章数据中...</div>
    {/if}

    {#if !showPreview}
      <!-- 编辑模式 -->
      <div class="editor-container">
        <!-- 基本信息 -->
        <div class="form-section">
          <div class="form-group">
            <label for="title">文章标题 *</label>
            <input
              id="title"
              type="text"
              bind:value={article.title}
              placeholder="输入一个吸引人的标题..."
              class="input-field title-input"
              maxlength="100"
            />
            <span class="char-count">{article.title.length}/100</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="category">分类</label>
              <select id="category" bind:value={article.category} class="select-field">
                {#each categories as cat}
                  <option value={cat.id}>{cat.name}</option>
                {/each}
              </select>
            </div>

            <div class="form-group">
              <label for="tags">标签</label>
              <input
                id="tags"
                type="text"
                bind:value={article.tags}
                placeholder="用逗号分隔，如: React, JavaScript, Web开发"
                class="input-field"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="image">封面图片 URL</label>
            <input
              id="image"
              type="url"
              bind:value={article.image}
              placeholder="https://example.com/image.jpg"
              class="input-field"
            />
            {#if article.image}
              <div class="image-preview">
                <img src={article.image} alt="封面预览" on:error={() => article.image = ''} />
              </div>
            {/if}
          </div>

          <div class="form-group">
            <label for="excerpt">摘要</label>
            <textarea
              id="excerpt"
              bind:value={article.excerpt}
              placeholder="简短描述文章内容（自动生成，也可手动编辑）..."
              class="textarea-field"
              rows="3"
              maxlength="300"
            ></textarea>
            <span class="char-count">{article.excerpt.length}/300</span>
          </div>
        </div>

        <!-- Markdown 编辑器 -->
        <div class="form-section">
          <label>文章内容 * (支持 Markdown)</label>

          <!-- Markdown 工具栏 -->
          <div class="markdown-toolbar">
            <button type="button" class="toolbar-btn" on:click={() => insertMarkdown('bold')} title="粗体">
              <strong>B</strong>
            </button>
            <button type="button" class="toolbar-btn" on:click={() => insertMarkdown('italic')} title="斜体">
              <em>I</em>
            </button>
            <button type="button" class="toolbar-btn" on:click={() => insertMarkdown('heading')} title="标题">
              H
            </button>
            <div class="toolbar-divider"></div>
            <button type="button" class="toolbar-btn" on:click={() => insertMarkdown('link')} title="链接">
              🔗
            </button>
            <button type="button" class="toolbar-btn" on:click={() => insertMarkdown('image')} title="图片">
              🖼️
            </button>
            <div class="toolbar-divider"></div>
            <button type="button" class="toolbar-btn" on:click={() => insertMarkdown('code')} title="行内代码">
              {'<>'}
            </button>
            <button type="button" class="toolbar-btn" on:click={() => insertMarkdown('codeblock')} title="代码块">
              {'{ }'}
            </button>
            <button type="button" class="toolbar-btn" on:click={() => insertMarkdown('list')} title="列表">
              ≡
            </button>
          </div>

          <textarea
            bind:value={article.content}
            placeholder="开始写作...

支持 Markdown 语法：
- **粗体** 或 *斜体*
- ## 标题
- [链接](url)
- ![图片](url)
- \`代码\`
- 列表等
"
            class="textarea-field content-editor"
            rows="20"
          ></textarea>
          <div class="editor-tips">
            <span>💡 提示：支持 Markdown 语法</span>
            <span class="char-count">{article.content.length} 字符</span>
          </div>
        </div>
      </div>
    {:else}
      <!-- 预览模式 -->
      <div class="preview-container">
        <div class="preview-header">
          <h1 class="preview-title">{article.title || '无标题'}</h1>
          <div class="preview-meta">
            <span>📁 {categories.find(c => c.id === article.category)?.name}</span>
            {#if article.tags}
              <span>🏷️ {article.tags}</span>
            {/if}
          </div>
        </div>

        {#if article.image}
          <div class="preview-cover">
            <img src={article.image} alt={article.title} />
          </div>
        {/if}

        {#if article.excerpt}
          <div class="preview-excerpt">
            <strong>摘要：</strong>{article.excerpt}
          </div>
        {/if}

        <div class="preview-content">
          {#if article.content}
            {@html article.content
              .replace(/\n/g, '<br>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/##\s(.*?)(<br>|$)/g, '<h2>$1</h2>')
              .replace(/###\s(.*?)(<br>|$)/g, '<h3>$1</h3>')
              .replace(/`(.*?)`/g, '<code>$1</code>')
              .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
              .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
              .replace(/^-\s(.*?)(<br>|$)/gm, '<li>$1</li>')
            }
          {:else}
            <p class="empty-content">暂无内容</p>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .write-article-page {
    min-height: calc(100vh - 80px);
    padding: 2rem 0 4rem;
    background: #f7fafc;
  }

  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* 页面头部 */
  .page-header {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
    color: #2d3748;
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  /* 编辑器容器 */
  .editor-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* 表单区域 */
  .form-section {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .form-section > label {
    display: block;
    font-size: 1.2rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
    position: relative;
  }

  .form-group label {
    display: block;
    font-weight: 600;
    color: #4a5568;
    margin-bottom: 0.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  /* 输入框样式 */
  .input-field,
  .select-field,
  .textarea-field {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s ease;
  }

  .input-field:focus,
  .select-field:focus,
  .textarea-field:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .title-input {
    font-size: 1.3rem;
    font-weight: 600;
  }

  .select-field {
    cursor: pointer;
  }

  .textarea-field {
    resize: vertical;
    line-height: 1.6;
  }

  .content-editor {
    font-family: 'Courier New', monospace;
    min-height: 400px;
  }

  .char-count {
    position: absolute;
    right: 0.5rem;
    bottom: -1.5rem;
    font-size: 0.85rem;
    color: #a0aec0;
  }

  /* 图片预览 */
  .image-preview {
    margin-top: 1rem;
    border-radius: 8px;
    overflow: hidden;
    max-width: 400px;
  }

  .image-preview img {
    width: 100%;
    height: auto;
    display: block;
  }

  /* Markdown 工具栏 */
  .markdown-toolbar {
    display: flex;
    gap: 0.5rem;
    padding: 0.8rem;
    background: #f7fafc;
    border: 2px solid #e2e8f0;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    flex-wrap: wrap;
  }

  .toolbar-btn {
    padding: 0.5rem 0.8rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.2s ease;
    min-width: 35px;
  }

  .toolbar-btn:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }

  .toolbar-divider {
    width: 1px;
    background: #e2e8f0;
    margin: 0 0.3rem;
  }

  .editor-tips {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
    font-size: 0.85rem;
    color: #718096;
  }

  /* 预览容器 */
  .preview-container {
    background: white;
    padding: 3rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .preview-header {
    margin-bottom: 2rem;
  }

  .preview-title {
    font-size: 2.5rem;
    color: #2d3748;
    margin-bottom: 1rem;
    line-height: 1.3;
  }

  .preview-meta {
    display: flex;
    gap: 1.5rem;
    color: #718096;
    flex-wrap: wrap;
  }

  .preview-cover {
    margin-bottom: 2rem;
    border-radius: 12px;
    overflow: hidden;
  }

  .preview-cover img {
    width: 100%;
    height: auto;
    display: block;
  }

  .preview-excerpt {
    background: #f7fafc;
    padding: 1.5rem;
    border-left: 4px solid #667eea;
    border-radius: 8px;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .preview-content {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #2d3748;
  }

  .preview-content :global(h2) {
    font-size: 1.8rem;
    margin: 2rem 0 1rem;
    color: #2d3748;
  }

  .preview-content :global(h3) {
    font-size: 1.4rem;
    margin: 1.5rem 0 0.8rem;
    color: #4a5568;
  }

  .preview-content :global(code) {
    background: #f7fafc;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    color: #667eea;
  }

  .preview-content :global(a) {
    color: #667eea;
    text-decoration: underline;
  }

  .preview-content :global(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
  }

  .preview-content :global(li) {
    margin-left: 2rem;
    margin-bottom: 0.5rem;
  }

  .empty-content {
    text-align: center;
    color: #a0aec0;
    padding: 3rem;
  }

  .loading-overlay {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    color: #718096;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }

  /* 按钮 */
  .btn {
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
    font-size: 0.95rem;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: #f7fafc;
    color: #4a5568;
    border: 2px solid #e2e8f0;
  }

  .btn-secondary:hover {
    background: #e2e8f0;
  }

  .btn-outline {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
  }

  .btn-outline:hover {
    background: #667eea;
    color: white;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: stretch;
    }

    .page-header h1 {
      font-size: 1.5rem;
    }

    .header-actions {
      flex-direction: column;
    }

    .header-actions .btn {
      width: 100%;
    }

    .form-section {
      padding: 1.5rem;
    }

    .preview-container {
      padding: 1.5rem;
    }

    .preview-title {
      font-size: 1.8rem;
    }

    .markdown-toolbar {
      gap: 0.3rem;
    }

    .toolbar-btn {
      padding: 0.4rem 0.6rem;
      font-size: 0.85rem;
      min-width: 30px;
    }
  }
</style>
