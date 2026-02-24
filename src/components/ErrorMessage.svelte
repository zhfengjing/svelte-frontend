<script>
  export let message = '加载失败，请稍后重试';
  export let onRetry = null;
</script>

<div class="error-container">
  <div class="error-icon">⚠️</div>
  <h3 class="error-title">出错了</h3>
  <p class="error-message">{message}</p>
  {#if onRetry}
    <button class="retry-btn" on:click={onRetry}>
      🔄 重试
    </button>
  {/if}
</div>

<style>
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
  }

  .error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.6;
  }

  .error-title {
    font-size: 1.5rem;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  .error-message {
    color: #718096;
    margin-bottom: 1.5rem;
    max-width: 400px;
  }

  .retry-btn {
    padding: 0.8rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .retry-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
</style>
