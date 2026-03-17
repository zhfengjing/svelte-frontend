<script>
  import { link, location } from 'svelte-spa-router';

  let mobileMenuOpen = false;

  const toggleMenu = () => {
    mobileMenuOpen = !mobileMenuOpen;
  };

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/articles', label: '文章列表' },
    { path: '/popular', label: '热门文章' },
    { path: '/myblog', label: '我的博客' }
  ];

  const writeButton = { path: '/write', label: '✍️ 写文章' };
</script>

<header>
  <nav class="navbar">
    <div class="container">
      <div class="nav-wrapper">
        <a href="/" use:link class="logo">
          <span class="logo-icon">📝</span>
          <span class="logo-text">我的博客</span>
        </a>

        <button class="mobile-toggle" on:click={toggleMenu} aria-label="切换菜单">
          <span class="hamburger" class:open={mobileMenuOpen}></span>
        </button>

        <div class="nav-menu">
          <ul class="nav-links" class:mobile-open={mobileMenuOpen}>
            {#each navItems as item (item.path)}
              <li>
                <a
                  href={item.path}
                  use:link
                  class:active={$location === item.path}
                  on:click={() => mobileMenuOpen = false}
                >
                  {item.label}
                </a>
              </li>
            {/each}
            <li class="write-btn-container">
              <a
                href={writeButton.path}
                use:link
                class="write-btn"
                class:active={$location === writeButton.path}
                on:click={() => mobileMenuOpen = false}
              >
                {writeButton.label}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .navbar {
    padding: 1rem 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .nav-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    transition: transform 0.3s ease;
  }

  .logo:hover {
    transform: scale(1.05);
  }

  .logo-icon {
    font-size: 1.8rem;
  }

  .mobile-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }

  .hamburger {
    display: block;
    width: 25px;
    height: 2px;
    background: white;
    position: relative;
    transition: all 0.3s ease;
  }

  .hamburger::before,
  .hamburger::after {
    content: '';
    position: absolute;
    width: 25px;
    height: 2px;
    background: white;
    transition: all 0.3s ease;
  }

  .hamburger::before {
    top: -8px;
  }

  .hamburger::after {
    bottom: -8px;
  }

  .hamburger.open {
    background: transparent;
  }

  .hamburger.open::before {
    transform: rotate(45deg);
    top: 0;
  }

  .hamburger.open::after {
    transform: rotate(-45deg);
    bottom: 0;
  }

  .nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
    margin: 0;
    padding: 0;
  }

  .nav-links a {
    color: white;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
  }

  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: white;
    transition: width 0.3s ease;
  }

  .nav-links a:hover::after,
  .nav-links a.active::after {
    width: 80%;
  }

  .nav-links a:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .nav-links a.active {
    background: rgba(255, 255, 255, 0.2);
  }

  /* 写文章按钮样式 */
  .write-btn-container {
    margin-left: 1rem;
  }

  .write-btn {
    background: rgba(255, 255, 255, 0.95) !important;
    color: #667eea !important;
    font-weight: 600 !important;
    padding: 0.6rem 1.5rem !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .write-btn:hover {
    background: white !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .write-btn.active {
    background: white !important;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .write-btn::after {
    display: none !important;
  }

  @media (max-width: 768px) {
    .mobile-toggle {
      display: block;
    }

    .nav-links {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      flex-direction: column;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
      gap: 0.5rem;
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .nav-links.mobile-open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
    }

    .nav-links a {
      display: block;
      text-align: center;
    }

    .write-btn-container {
      margin-left: 0;
      margin-top: 0.5rem;
    }

    .write-btn {
      width: 100%;
    }
  }
</style>
