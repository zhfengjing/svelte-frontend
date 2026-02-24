import request from './request.js';
import { API_ENDPOINTS } from '../config/api.js';

/**
 * 文章相关 API
 */
export const articleApi = {
  // 获取文章列表
  getArticles: (params = {}) => {
    return request({
      method: 'GET',
      url: API_ENDPOINTS.ARTICLES,
      params // 支持分页、筛选等参数：{ page, pageSize, category, search }
    });
  },

  // 获取文章详情
  getArticleById: (id) => {
    return request({
      method: 'GET',
      url: API_ENDPOINTS.ARTICLE_DETAIL(id)
    });
  },

  // 获取热门文章
  getPopularArticles: (params = {}) => {
    return request({
      method: 'GET',
      url: API_ENDPOINTS.POPULAR_ARTICLES,
      params // 支持参数：{ timeRange: 'today' | 'week' | 'month' | 'all' }
    });
  },

  // 创建文章
  createArticle: (data) => {
    return request({
      method: 'POST',
      url: API_ENDPOINTS.CREATE_ARTICLE,
      data
    });
  },

  // 更新文章
  updateArticle: (id, data) => {
    return request({
      method: 'PUT',
      url: API_ENDPOINTS.UPDATE_ARTICLE(id),
      data
    });
  },

  // 删除文章
  deleteArticle: (id) => {
    return request({
      method: 'DELETE',
      url: API_ENDPOINTS.DELETE_ARTICLE(id)
    });
  }
};

/**
 * 分类相关 API
 */
export const categoryApi = {
  // 获取所有分类
  getCategories: () => {
    return request({
      method: 'GET',
      url: API_ENDPOINTS.CATEGORIES
    });
  }
};

/**
 * 标签相关 API
 */
export const tagApi = {
  // 获取所有标签
  getTags: () => {
    return request({
      method: 'GET',
      url: API_ENDPOINTS.TAGS
    });
  }
};

/**
 * 评论相关 API
 */
export const commentApi = {
  // 获取文章评论
  getComments: (articleId) => {
    return request({
      method: 'GET',
      url: API_ENDPOINTS.COMMENTS(articleId)
    });
  },

  // 创建评论
  createComment: (articleId, data) => {
    return request({
      method: 'POST',
      url: API_ENDPOINTS.CREATE_COMMENT(articleId),
      data
    });
  }
};

/**
 * 关注相关 API
 */
export const followApi = {
  // 查询关注状态
  getFollowStatus: (authorId) => {
    return request({
      method: 'GET',
      url: API_ENDPOINTS.FOLLOW_AUTHOR(authorId)
    });
  },

  // 关注作者
  followAuthor: (authorId) => {
    return request({
      method: 'POST',
      url: API_ENDPOINTS.FOLLOW_AUTHOR(authorId)
    });
  },

  // 取消关注作者
  unfollowAuthor: (authorId) => {
    return request({
      method: 'DELETE',
      url: API_ENDPOINTS.UNFOLLOW_AUTHOR(authorId)
    });
  }
};

/**
 * 订阅相关 API
 */
export const subscribeApi = {
  // 订阅博客
  subscribe: (email) => {
    return request({
      method: 'POST',
      url: API_ENDPOINTS.SUBSCRIBE,
      data: { email }
    });
  }
};

/**
 * 用户相关 API
 */
export const userApi = {
  // 获取用户信息
  getUserProfile: () => {
    return request({
      method: 'GET',
      url: API_ENDPOINTS.USER_PROFILE
    });
  },

  // 获取用户统计数据
  getUserStats: () => {
    return request({
      method: 'GET',
      url: API_ENDPOINTS.USER_STATS
    });
  }
};
