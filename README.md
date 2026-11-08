# Marshio 风格博客起步模板

这套模板复用了 [marshio.me](https://marshio.me/) 的公开技术栈：

- VuePress 2
- VuePress Theme Hope
- Markdown 内容
- GitHub Actions
- GitHub Pages

它不包含原站作者的文章、图片、备案信息、搜索配置或评论配置。

本地建议使用 Node.js 24 和 pnpm 11.24。

## 本地启动

```powershell
pnpm install
pnpm dev
```

浏览器打开 `http://localhost:8080/`。

## 构建

```powershell
pnpm build
```

构建结果位于 `blog/.vuepress/dist/`。

## 发布前修改

1. 在 `blog/.vuepress/theme.ts` 中修改名字、GitHub 地址、邮箱和域名。
2. 如果仓库名不是 `用户名.github.io`，把 `blog/.vuepress/config.ts` 中的 `base` 改成 `"/仓库名/"`。
3. 在 `blog/README.md` 中修改首页文案和项目卡片。
4. 替换 `blog/.vuepress/public/logo.svg` 与 `hero.svg`。
5. 推到 GitHub 的 `main` 分支，然后在仓库的 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。

## 写文章

在 `blog/posts/`、`blog/notes/` 或 `blog/tools/` 下新建 `.md` 文件。示例：

```md
---
title: 文章标题
date: 2026-11-06
category: 分类
tag:
  - 标签一
  - 标签二
---

# 文章标题

正文。
```

## 自定义域名

先在 GitHub Pages 设置中填写域名，再按 GitHub 给出的 DNS 记录配置域名解析。启用 HTTPS 后等待证书签发即可。
