<script>
  export let message = '加载中...';
  export let size = 'medium'; // small, medium, large
</script>

<div class="loading-container" class:small={size === 'small'} class:large={size === 'large'}>
  <div class="spinner"></div>
  {#if message}
    <p class="loading-message">{message}</p>
  {/if}
</div>

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
  }

  .loading-container.small {
    padding: 1rem;
  }

  .loading-container.large {
    min-height: 400px;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-container.small .spinner {
    width: 30px;
    height: 30px;
    border-width: 3px;
  }

  .loading-container.large .spinner {
    width: 70px;
    height: 70px;
    border-width: 5px;
  }

  .loading-message {
    margin-top: 1rem;
    color: #718096;
    font-size: 1rem;
  }

  .loading-container.small .loading-message {
    font-size: 0.9rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
