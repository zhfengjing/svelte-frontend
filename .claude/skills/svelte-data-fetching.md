---
name: svelte-data-fetching
description: >
  当创建或修改需要调用 API 的 Svelte 组件/页面时自动激活。
  强制套用本项目统一的数据请求模式：loading/error 双状态管理、
  try-catch-finally 结构、Loading 和 ErrorMessage 组件、
  以及并行请求优化，确保所有页面风格一致。
triggers:
  - 创建新的 Svelte 页面组件
  - 在 Svelte 组件中新增 API 调用
  - 在 onMount 中执行异步操作
  - 写数据加载、提交、删除等涉及 request.js 的函数
---

# Svelte Data Fetching 规范

本项目所有涉及 API 调用的 Svelte 组件，**必须**按照以下模式编写。这是从现有五个页面（Home、Articles、ArticleDetail、Popular、MyBlog）中提炼的统一规范。

---

## 核心模式

### 1. 状态变量声明（固定结构）

```js
// 页面级主数据加载
let loading = true;   // 初始为 true，防止内容闪烁
let error = null;     // 错误信息字符串

// 局部操作加载（点赞、提交、删除等）
let submitting = false;
let deletingId = null;  // 需要标识具体操作对象时用 id
```

### 2. 数据加载函数（固定结构）

```js
const loadData = async () => {
  loading = true;   // ① 开始：重置状态
  error = null;

  try {
    // ② 并行请求（多个接口用 Promise.all）
    const [dataA, dataB] = await Promise.all([
      someApi.getList(),
      otherApi.getDetail(id).catch(() => ({ data: [] })) // 非关键接口加 .catch 降级
    ]);

    // ③ 统一处理 data 包装层（json-server 返回格式可能不同）
    items = dataA.data || dataA;
  } catch (err) {
    console.error('加载数据失败:', err);
    // ④ 优先取后端 message，降级到通用提示
    error = err.response?.data?.message || '加载失败，请稍后重试';
  } finally {
    loading = false;  // ⑤ 无论成功失败都关闭 loading
  }
};
```

### 3. 操作函数（点赞/提交/删除等）

```js
const handleAction = async () => {
  actionLoading = true;   // 局部 loading，不影响整页
  try {
    const res = await api.doSomething(id, payload);
    // 更新本地状态，避免重新请求整个列表
    localData = res.data || res;
  } catch (err) {
    console.error('操作失败:', err);
    alert(err.response?.data?.message || '操作失败，请稍后重试');
  } finally {
    actionLoading = false;
  }
};
```

### 4. 生命周期挂载

```js
import { onMount } from 'svelte';

onMount(() => {
  loadData();
  // 如有多个初始化任务直接并列调用，不要嵌套
});

// 响应路由参数变化（详情页场景）
$: if (params.id) {
  loadData();
}
```

---

## 模板层规范

```svelte
<!-- 固定三态渲染结构 -->
{#if loading}
  <Loading message="加载中..." size="large" />
{:else if error}
  <ErrorMessage message={error} onRetry={loadData} />
{:else}
  <!-- 正常内容 -->
{/if}
```

**必须导入的组件：**
```js
import Loading from '../components/Loading.svelte';
import ErrorMessage from '../components/ErrorMessage.svelte';
```

**操作按钮的 loading 态：**
```svelte
<button
  disabled={submitting}
  on:click={handleSubmit}
>
  {submitting ? '提交中...' : '提交'}
</button>
```

---

## 错误信息提取规则

```js
// 标准写法（项目全局统一）
error = err.response?.data?.message || '操作失败，请稍后重试';

// 页面级错误 → 赋值给 error 变量，由 ErrorMessage 组件展示
// 操作级错误（点赞/关注等）→ 直接 alert()
```

---

## 数据响应解包规则

json-server 响应体有时直接是数组/对象，有时包在 `.data` 中：

```js
// 统一用这个写法兼容两种情况
const list = response.data || response;
const item = result.data || result;
```

---

## 反模式（不要做）

```js
// ❌ 不要在 catch 里只打日志不设 error
catch (err) { console.error(err) }

// ❌ 不要忘记 finally，loading 可能永远是 true
try { ... } catch { ... }  // 没有 finally

// ❌ 不要用嵌套 .then()，统一用 async/await
api.get().then(res => { api.get2().then(...) })

// ❌ 不要对每个字段单独请求，能并行的用 Promise.all
const a = await api.getA();
const b = await api.getB();  // 应改为 Promise.all

// ❌ 不要在操作成功后重新请求整个列表（有性能问题）
await api.likeArticle(id);
await loadData();  // 应改为直接更新本地状态
```

---

## 快速套用示例

当被要求创建一个"XX列表页"时，输出结构为：

```svelte
<script>
  import { onMount } from 'svelte';
  import Loading from '../components/Loading.svelte';
  import ErrorMessage from '../components/ErrorMessage.svelte';
  import { xxxApi } from '../services/api.js';

  let items = [];
  let loading = true;
  let error = null;

  const loadData = async () => {
    loading = true;
    error = null;
    try {
      const res = await xxxApi.getList();
      items = res.data || res;
    } catch (err) {
      console.error('加载失败:', err);
      error = err.response?.data?.message || '加载失败，请稍后重试';
    } finally {
      loading = false;
    }
  };

  onMount(() => { loadData(); });
</script>

{#if loading}
  <Loading message="加载中..." size="large" />
{:else if error}
  <ErrorMessage message={error} onRetry={loadData} />
{:else}
  {#each items as item (item.id)}
    <!-- 渲染内容 -->
  {/each}
{/if}
```
