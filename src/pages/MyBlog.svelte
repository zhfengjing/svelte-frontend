<script>
  import { link } from 'svelte-spa-router';

  const skills = [
    { name: 'JavaScript', level: 95, icon: '🟨' },
    { name: 'Svelte', level: 90, icon: '🔶' },
    { name: 'React', level: 85, icon: '⚛️' },
    { name: 'TypeScript', level: 88, icon: '🔷' },
    { name: 'Node.js', level: 82, icon: '🟩' },
    { name: 'Web3', level: 75, icon: '⛓️' }
  ];

  const timeline = [
    { year: '2024', title: '全栈开发工程师', company: '科技公司', description: '负责前端架构设计和技术分享' },
    { year: '2023', title: '高级前端工程师', company: '互联网公司', description: '主导多个大型项目的前端开发' },
    { year: '2022', title: '前端工程师', company: '创业公司', description: '参与产品从0到1的建设' },
    { year: '2021', title: '开始博客写作', company: '个人', description: '分享技术心得和学习笔记' }
  ];

  const projects = [
    {
      name: 'Web3 钱包应用',
      description: '基于 Svelte 开发的去中心化钱包',
      tech: ['Svelte', 'Web3.js', 'Ethers.js'],
      link: '#',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop'
    },
    {
      name: '博客管理系统',
      description: '全栈博客平台，支持 Markdown',
      tech: ['React', 'Node.js', 'MongoDB'],
      link: '#',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop'
    },
    {
      name: '数据可视化平台',
      description: '企业级数据分析和可视化工具',
      tech: ['Vue', 'D3.js', 'Python'],
      link: '#',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop'
    }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
    { name: 'Email', icon: '📧', url: 'mailto:blog@example.com' }
  ];

  const stats = [
    { label: '文章', value: '120+', icon: '📝' },
    { label: '粉丝', value: '5.2k', icon: '👥' },
    { label: '点赞', value: '12k', icon: '❤️' },
    { label: '浏览', value: '50k+', icon: '👁️' }
  ];
</script>

<div class="myblog-page">
  <!-- 个人简介区 -->
  <section class="profile-hero">
    <div class="container">
      <div class="profile-content">
        <div class="avatar-section">
          <div class="avatar">👨‍💻</div>
          <div class="status-badge">✨ 在线</div>
        </div>

        <div class="profile-info">
          <h1>张三</h1>
          <p class="title">全栈开发工程师 | 技术博主</p>
          <p class="bio">
            热爱编程，专注于前端开发和 Web3 技术。
            通过博客分享技术见解，帮助更多人学习和成长。
            相信技术可以改变世界 🚀
          </p>

          <div class="social-links">
            {#each socialLinks as social}
              <a href={social.url} class="social-link" target="_blank" rel="noopener">
                <span class="social-icon">{social.icon}</span>
                <span class="social-name">{social.name}</span>
              </a>
            {/each}
          </div>

          <div class="profile-actions">
            <button class="btn btn-primary">📩 联系我</button>
            <button class="btn btn-secondary">📄 下载简历</button>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        {#each stats as stat}
          <div class="stat-card">
            <div class="stat-icon">{stat.icon}</div>
            <div class="stat-value">{stat.value}</div>
            <div class="stat-label">{stat.label}</div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- 技能展示 -->
  <section class="skills-section">
    <div class="container">
      <h2>💪 技能专长</h2>
      <div class="skills-grid">
        {#each skills as skill}
          <div class="skill-item">
            <div class="skill-header">
              <span class="skill-icon">{skill.icon}</span>
              <span class="skill-name">{skill.name}</span>
              <span class="skill-percent">{skill.level}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-progress" style="width: {skill.level}%"></div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- 项目展示 -->
  <section class="projects-section">
    <div class="container">
      <h2>🚀 精选项目</h2>
      <div class="projects-grid">
        {#each projects as project}
          <div class="project-card">
            <div class="project-image">
              <img src={project.image} alt={project.name} />
              <div class="project-overlay">
                <a href={project.link} class="view-project">查看项目 →</a>
              </div>
            </div>
            <div class="project-content">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div class="project-tech">
                {#each project.tech as tech}
                  <span class="tech-tag">{tech}</span>
                {/each}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- 时间线 -->
  <section class="timeline-section">
    <div class="container">
      <h2>📅 职业历程</h2>
      <div class="timeline">
        {#each timeline as item, index}
          <div class="timeline-item" class:left={index % 2 === 0} class:right={index % 2 !== 0}>
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-year">{item.year}</div>
              <h3>{item.title}</h3>
              <p class="timeline-company">{item.company}</p>
              <p class="timeline-desc">{item.description}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA 区域 -->
  <section class="cta-section">
    <div class="container">
      <div class="cta-card">
        <h2>💬 让我们一起交流</h2>
        <p>如果你对我的文章感兴趣，或者想要交流技术问题，欢迎随时联系我！</p>
        <div class="cta-buttons">
          <a href="/articles" use:link class="btn btn-primary">浏览文章</a>
          <button class="btn btn-secondary">发送消息</button>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .myblog-page {
    min-height: calc(100vh - 80px);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  section {
    padding: 4rem 0;
  }

  section h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
    color: #2d3748;
  }

  /* 个人简介区 */
  .profile-hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 5rem 0 3rem;
  }

  .profile-content {
    display: flex;
    gap: 3rem;
    align-items: center;
    margin-bottom: 3rem;
  }

  .avatar-section {
    position: relative;
  }

  .avatar {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 6rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .status-badge {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: #10b981;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .profile-info {
    flex: 1;
  }

  .profile-info h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .profile-info .title {
    font-size: 1.3rem;
    opacity: 0.95;
    margin-bottom: 1rem;
  }

  .profile-info .bio {
    font-size: 1.1rem;
    line-height: 1.6;
    opacity: 0.9;
    margin-bottom: 1.5rem;
  }

  .social-links {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .social-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    text-decoration: none;
    color: white;
    transition: all 0.3s ease;
  }

  .social-link:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  .social-icon {
    font-size: 1.2rem;
  }

  .profile-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
    transition: transform 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.2);
  }

  .stat-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.3rem;
  }

  .stat-label {
    opacity: 0.9;
  }

  /* 技能展示 */
  .skills-section {
    background: #f7fafc;
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .skill-item {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .skill-header {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 1rem;
  }

  .skill-icon {
    font-size: 1.5rem;
  }

  .skill-name {
    flex: 1;
    font-weight: 600;
    color: #2d3748;
  }

  .skill-percent {
    color: #667eea;
    font-weight: 600;
  }

  .skill-bar {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
  }

  .skill-progress {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
    transition: width 1s ease;
  }

  /* 项目展示 */
  .projects-section {
    background: white;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
  }

  .project-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }

  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  .project-image {
    position: relative;
    height: 200px;
    overflow: hidden;
  }

  .project-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .project-card:hover .project-image img {
    transform: scale(1.1);
  }

  .project-overlay {
    position: absolute;
    inset: 0;
    background: rgba(102, 126, 234, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .project-card:hover .project-overlay {
    opacity: 1;
  }

  .view-project {
    color: white;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .project-content {
    padding: 1.5rem;
  }

  .project-content h3 {
    font-size: 1.3rem;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  .project-content p {
    color: #718096;
    margin-bottom: 1rem;
  }

  .project-tech {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .tech-tag {
    background: #f7fafc;
    color: #667eea;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
  }

  /* 时间线 */
  .timeline-section {
    background: #f7fafc;
  }

  .timeline {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 0;
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  }

  .timeline-item {
    position: relative;
    margin-bottom: 3rem;
    display: flex;
  }

  .timeline-item.left {
    justify-content: flex-end;
    padding-right: calc(50% + 30px);
  }

  .timeline-item.right {
    justify-content: flex-start;
    padding-left: calc(50% + 30px);
  }

  .timeline-marker {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    background: #667eea;
    border: 4px solid white;
    border-radius: 50%;
    z-index: 1;
  }

  .timeline-content {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 350px;
  }

  .timeline-year {
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
  }

  .timeline-content h3 {
    font-size: 1.2rem;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  .timeline-company {
    color: #667eea;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .timeline-desc {
    color: #718096;
    line-height: 1.5;
  }

  /* CTA 区域 */
  .cta-section {
    background: white;
  }

  .cta-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4rem 3rem;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }

  .cta-card h2 {
    color: white;
    margin-bottom: 1rem;
  }

  .cta-card p {
    font-size: 1.2rem;
    opacity: 0.95;
    margin-bottom: 2rem;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* 按钮 */
  .btn {
    display: inline-block;
    padding: 0.8rem 2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    font-size: 1rem;
  }

  .btn-primary {
    background: white;
    color: #667eea;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid white;
  }

  .btn-secondary:hover {
    background: white;
    color: #667eea;
  }

  /* 响应式设计 */
  @media (max-width: 1024px) {
    .profile-content {
      flex-direction: column;
      text-align: center;
    }

    .profile-info {
      align-items: center;
    }

    .social-links,
    .profile-actions {
      justify-content: center;
    }

    .timeline::before {
      left: 0;
    }

    .timeline-item.left,
    .timeline-item.right {
      justify-content: flex-start;
      padding-left: 30px;
      padding-right: 0;
    }

    .timeline-marker {
      left: 0;
    }
  }

  @media (max-width: 768px) {
    .avatar {
      width: 150px;
      height: 150px;
      font-size: 4rem;
    }

    .profile-info h1 {
      font-size: 2rem;
    }

    section h2 {
      font-size: 2rem;
    }

    .projects-grid,
    .skills-grid {
      grid-template-columns: 1fr;
    }

    .cta-card {
      padding: 3rem 1.5rem;
    }
  }
</style>
