// API 配置文件
export const API_CONFIG = {
  // 基础 URL - 根据实际后端服务器地址修改
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',

  // 超时设置（毫秒）
  TIMEOUT: 10000,

  // 请求头配置
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// API 端点
export const API_ENDPOINTS = {
  // 文章相关
  ARTICLES: '/articles',
  ARTICLE_DETAIL: (id) => `/articles/${id}`,
  POPULAR_ARTICLES: '/articles/popular',
  CREATE_ARTICLE: '/articles',
  UPDATE_ARTICLE: (id) => `/articles/${id}`,
  DELETE_ARTICLE: (id) => `/articles/${id}`,

  // 分类相关
  CATEGORIES: '/categories',

  // 标签相关
  TAGS: '/tags',

  // 评论相关
  COMMENTS: (articleId) => `/articles/${articleId}/comments`,
  CREATE_COMMENT: (articleId) => `/articles/${articleId}/comments`,

  // 用户相关
  USER_PROFILE: '/user/profile',
  USER_STATS: '/user/stats',
};
