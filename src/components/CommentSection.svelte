<script>
  import { onMount } from 'svelte';
  // skill: svelte-data-fetching — 必须导入
  import Loading from './Loading.svelte';
  import ErrorMessage from './ErrorMessage.svelte';
  import { commentApi } from '../services/api.js';

  export let articleId;      // 父组件传入
  export let currentUser = '匿名用户'; // 可由父组件覆盖

  // ── skill rule 1: 页面级主状态 ─────────────────────────────
  let comments = [];
  let loading = true;
  let error = null;

  // ── skill rule 1: 操作级局部状态 ───────────────────────────
  let commentText = '';
  let submitting = false;
  let deletingId = null;

  // ── skill rule 2: 数据加载函数（try-catch-finally 三段） ───
  const loadComments = async () => {
    loading = true;
    error = null;
    try {
      const res = await commentApi.getComments(articleId);
      // skill rule: 兼容 .data 包装层
      comments = res.data || res;
    } catch (err) {
      console.error('加载评论失败:', err);
      // skill rule: 优先取后端 message，降级通用提示
      error = err.response?.data?.message || '加载评论失败，请稍后重试';
    } finally {
      loading = false;
    }
  };

  // ── skill rule 3: 操作函数 — 提交评论 ──────────────────────
  const handleSubmit = async () => {
    if (!commentText.trim()) {
      alert('请输入评论内容');
      return;
    }

    submitting = true; // 局部 loading，不影响整个评论列表
    try {
      const res = await commentApi.createComment(articleId, {
        content: commentText,
        author: currentUser,
        date: new Date().toISOString().split('T')[0]
      });
      const newComment = res.data || res;

      // skill rule: 直接更新本地状态，✅ 不重新请求整个列表
      comments = [newComment, ...comments];
      commentText = '';
    } catch (err) {
      console.error('发表评论失败:', err);
      // skill rule: 操作级错误用 alert
      alert(err.response?.data?.message || '发表评论失败，请稍后重试');
    } finally {
      submitting = false;
    }
  };

  // ── skill rule 3: 操作函数 — 删除评论 ──────────────────────
  const handleDelete = async (id) => {
    if (!confirm('确定删除这条评论？')) return;

    deletingId = id; // skill rule: 用 id 标识具体操作项
    try {
      await commentApi.deleteComment(articleId, id);
      // skill rule: 直接更新本地状态
      comments = comments.filter(c => c.id !== id);
    } catch (err) {
      console.error('删除评论失败:', err);
      alert(err.response?.data?.message || '删除失败，请稍后重试');
    } finally {
      deletingId = null;
    }
  };

  // ── skill rule 4: 生命周期挂载 ─────────────────────────────
  onMount(() => {
    loadComments();
  });

  // articleId 变化时重新加载（如父组件切换文章）
  $: if (articleId) {
    loadComments();
  }
</script>

<section class="comment-section">
  <h2 class="section-title">💬 评论 ({comments.length})</h2>

  <!-- 评论输入框 -->
  <form class="comment-form" on:submit|preventDefault={handleSubmit}>
    <textarea
      bind:value={commentText}
      placeholder="写下你的想法..."
      rows="4"
      disabled={submitting}
      class="comment-input"
    ></textarea>
    <!-- skill rule: 按钮 disabled + 文案切换 -->
    <button type="submit" class="submit-btn" disabled={submitting}>
      {submitting ? '发表中...' : '发表评论'}
    </button>
  </form>

  <!-- ── skill rule: 三态渲染结构 ────────────────────────── -->
  {#if loading}
    <Loading message="加载评论中..." />
  {:else if error}
    <ErrorMessage message={error} onRetry={loadComments} />
  {:else}
    <div class="comments-list">
      {#if comments.length === 0}
        <div class="empty-tip">暂无评论，来发表第一条吧！</div>
      {:else}
        <!-- skill rule: {#each} 必须带 key -->
        {#each comments as comment (comment.id)}
          <div class="comment-item">
            <div class="comment-avatar">👤</div>
            <div class="comment-body">
              <div class="comment-header">
                <span class="comment-author">{comment.author}</span>
                <span class="comment-date">{comment.date}</span>
              </div>
              <p class="comment-content">{comment.content}</p>
            </div>
            <!-- skill rule: 删除操作用 deletingId 标识进行中的项 -->
            {#if comment.author === currentUser}
              <button
                class="delete-btn"
                disabled={deletingId === comment.id}
                on:click={() => handleDelete(comment.id)}
                aria-label="删除评论"
              >
                {deletingId === comment.id ? '删除中...' : '🗑️'}
              </button>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</section>

<style>
  .comment-section {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 2px solid #e2e8f0;
  }

  .section-title {
    font-size: 1.4rem;
    color: #2d3748;
    margin-bottom: 1.5rem;
  }

  /* 输入框 */
  .comment-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .comment-input {
    width: 100%;
    padding: 0.9rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.2s ease;
  }

  .comment-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .comment-input:disabled {
    background: #f7fafc;
    cursor: not-allowed;
  }

  .submit-btn {
    align-self: flex-end;
    padding: 0.7rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .submit-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  /* 评论列表 */
  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .empty-tip {
    text-align: center;
    padding: 2.5rem;
    color: #a0aec0;
    background: #f7fafc;
    border-radius: 12px;
    font-size: 0.95rem;
  }

  .comment-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1.1rem 1.25rem;
    background: #f7fafc;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    transition: box-shadow 0.2s ease;
  }

  .comment-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .comment-avatar {
    font-size: 1.8rem;
    flex-shrink: 0;
  }

  .comment-body {
    flex: 1;
    min-width: 0;
  }

  .comment-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.4rem;
  }

  .comment-author {
    font-weight: 600;
    color: #2d3748;
    font-size: 0.95rem;
  }

  .comment-date {
    color: #a0aec0;
    font-size: 0.85rem;
  }

  .comment-content {
    color: #4a5568;
    line-height: 1.6;
    margin: 0;
    word-break: break-word;
  }

  .delete-btn {
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.3rem 0.5rem;
    border-radius: 6px;
    color: #a0aec0;
    transition: all 0.2s ease;
  }

  .delete-btn:hover:not(:disabled) {
    background: #fff5f5;
    color: #e53e3e;
  }

  .delete-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    font-size: 0.8rem;
  }

  @media (max-width: 768px) {
    .submit-btn {
      width: 100%;
    }

    .comment-item {
      padding: 0.9rem 1rem;
    }
  }
</style>
