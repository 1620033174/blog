---
title: 从 404 到自动部署：我的 VuePress 博客搭建复盘
date: 2026-11-08
category: 建站
tag:
  - VuePress
  - GitHub Pages
  - GitHub Actions
star: true
cover: /hero.svg
---

# 从 404 到自动部署：我的 VuePress 博客搭建复盘

这次搭博客，真正花时间的不是写页面，而是把本地代码、GitHub 仓库、Actions、Pages 和账号权限这几层关系理顺。最终方案使用 VuePress 2、VuePress Theme Hope 和 GitHub Pages，写完 Markdown 后推送到 `main`，网站会自动构建并发布。

这篇文章记录整个过程、遇到的问题和最后的操作方式，方便自己以后回看，也希望能帮到准备搭博客的人。

## 一、为什么选择 VuePress

最初参考的网站是 [Marshio 的博客](https://marshio.me/)。查看页面源码后可以确认，它使用的是：

- VuePress 2
- VuePress Theme Hope
- Markdown 内容
- GitHub Actions 自动构建
- GitHub Pages 静态托管
- Cloudflare 代理自定义域名

这种方案有几个明显优点：

1. 文章可以直接用 Markdown 写。
2. 页面是静态文件，不需要数据库和服务器。
3. GitHub Pages 免费托管公开仓库的网站。
4. Theme Hope 自带博客首页、分类、标签、时间线、侧边栏和深色模式。
5. 内容保存在 Git 仓库里，天然具备版本历史和备份能力。

整体结构可以理解为：

```text
Markdown 文章
    ↓
VuePress 编译
    ↓
HTML / CSS / JavaScript
    ↓
GitHub Actions
    ↓
GitHub Pages
    ↓
浏览器访问
```

## 二、本地项目如何组织

项目中最重要的目录是：

```text
blog/
├── .vuepress/
│   ├── config.ts        # 站点路径和 VuePress 配置
│   ├── theme.ts         # 作者、导航、博客和插件配置
│   ├── navbar.ts        # 顶部导航
│   ├── sidebar.ts       # 侧边栏
│   ├── styles/          # 自定义样式
│   └── public/          # Logo、背景图等静态资源
├── posts/               # 随笔和完整文章
├── notes/               # 技术笔记
├── tools/               # 工具页面
├── README.md            # 博客首页
└── me.md                # 关于我
```

写文章只需要在 `blog/posts/`、`blog/notes/` 或 `blog/tools/` 下新建 Markdown 文件。

一篇文章的头部需要填写 frontmatter：

```md
---
title: 文章标题
date: 2026-11-08
category: 分类名称
tag:
  - 标签一
  - 标签二
---

# 文章标题

正文内容。
```

本地预览命令：

```powershell
pnpm install
pnpm dev
```

然后访问 `http://localhost:8080/`。

生产构建命令：

```powershell
pnpm build
```

构建结果会生成在 `blog/.vuepress/dist/`。

## 三、GitHub 项目页不等于用户主页

我的仓库名是 `blog`，因此 GitHub Pages 地址是：

```text
https://1620033174.github.io/blog/
```

而不是：

```text
https://1620033174.github.io/
```

这两种地址对应不同的仓库：

- `用户名.github.io` 仓库对应用户主页根路径。
- 其他仓库是项目页面，地址中必须带仓库名。
- 项目页面需要在 VuePress 中配置：

```ts
export default defineUserConfig({
  base: "/blog/",
});
```

我一开始访问根地址，所以看到的是 GitHub Pages 的 404。页面没有部署在这里，并不代表 GitHub Pages 没有配置成功。

## 四、个人账号和公司账号必须隔离

这台电脑默认使用公司的 Git 身份，但博客属于个人 GitHub 账号。直接使用全局账号会产生两个问题：

1. 提交作者信息错误。
2. 推送时使用没有权限的账号，返回 403。

为了避免切换全局身份，我为个人博客仓库单独配置了 SSH 别名和仓库级 Git 用户信息。这样公司项目继续使用原来的默认身份，个人博客只使用自己的 SSH 密钥。

核心原则是：

- 不修改公司项目的全局配置。
- 不同账号使用不同 SSH 密钥。
- 仓库级配置只影响当前仓库。
- 不把访问令牌直接写进仓库或远程 URL。

## 五、Actions 显示失败，但代码不一定有问题

补齐源码和工作流后，GitHub Actions 仍然失败。最关键的判断依据是：

```text
steps: 0
runner_id: 0
```

工作流虽然存在，但没有任何一个步骤真正开始执行。失败注释是：

```text
The job was not started because your account is locked due to a billing issue.
```

这说明问题不在 Node.js、pnpm、VuePress 或 YAML 配置，而是 GitHub 账号层面的计费状态阻止了运行器启动。

排查过程中确认：

- 当前公开仓库的 Actions 用量是免费额度。
- 页面显示的计费金额已被包含额度抵扣。
- 实际问题来自付款方式授权状态。

更新付款方式和账单信息后，重新触发工作流，`build` 和 `deploy` 最终都成功执行。

这次得到的经验是：**不要只看“Actions 失败”，要看失败发生在第几步。**

如果 Job 在 `steps: 0` 就失败，通常不是构建代码的问题，而应该检查：

- 账号状态
- 计费与付款授权
- Actions 是否被禁用
- 仓库权限

## 六、临时使用 gh-pages 发布

在 Actions 被锁定的那段时间，网站仍然需要能够访问，所以使用了另一种发布方式：

```text
本地 pnpm build
→ 生成静态文件
→ 推送到 gh-pages 分支
→ GitHub Pages 直接发布
```

这种方式不需要 Actions，适合作为临时方案或备用方案。缺点是不能自动更新，每次修改文章后都要在本地重新构建并推送生成结果。

两种发布方式的最终结果相同，区别只在构建位置：

| 方式 | 构建位置 | 是否自动 | 依赖 Actions |
| --- | --- | --- | --- |
| GitHub Actions | GitHub 云端 | 是 | 是 |
| gh-pages 分支 | 本地电脑 | 否 | 否 |

最终 Payment method 更新生效后，网站恢复使用 GitHub Actions 自动部署。

## 七、现在如何发布文章

日常操作只有四步：

### 1. 新建文章

在 `blog/posts/` 下创建 Markdown 文件。

### 2. 本地预览

```powershell
pnpm dev
```

检查标题、正文、图片、代码块和链接。

### 3. 提交到 Git

```powershell
git status
git add .
git commit -m "docs: add new article"
git push origin main
```

### 4. 等待自动发布

推送后打开仓库的 Actions 页面，等待 `Deploy blog` 运行成功。

如果 `build` 和 `deploy` 都显示绿色，新文章就已经发布。

## 八、这次踩坑后的检查清单

以后新建博客，可以按下面的顺序检查：

- 确认仓库里有完整源码，不只是 README。
- 确认仓库名和 `base` 路径一致。
- 区分用户主页和项目页面地址。
- 确认 Git 提交作者是正确的。
- 确认推送使用的 GitHub 身份有仓库权限。
- 检查 Actions 失败发生在第几步。
- `steps: 0` 优先排查账号和权限，而不是业务代码。
- 公开仓库标准 Linux 运行器可以免费构建。
- Pages 的发布来源要与工作流方式一致。
- 部署成功后同时检查 Actions 和线上页面，不要只看其中一处。

## 九、下一步

当前博客已经具备持续写作的基础条件。接下来准备按顺序完成：

- 修改博客名称、作者介绍和社交链接
- 替换 Logo 和首页背景
- 整理“随笔、笔记、工具箱”的内容结构
- 持续发布文章
- 需要时再购买域名并配置 Cloudflare

Cloudflare 和自定义域名都不是博客运行的必要条件。先把内容写起来，比过早折腾域名更重要。

这次搭博客最大的收获，是理解了静态博客并不是“把代码推到 GitHub 就结束”，而是一条由代码、构建、部署、域名和账号权限共同组成的链路。把每一层分清楚，问题就会容易定位很多。
