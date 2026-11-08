import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  // 当前仓库是 1620033174/blog，因此项目页面位于 /blog/。
  base: "/blog/",
  lang: "zh-CN",
  title: "我的博客",
  description: "用 Markdown 记录学习、项目与生活",
  bundler: viteBundler(),
  markdown: {
    headers: {
      level: [2, 3, 4],
    },
  },
  theme,
  shouldPrefetch: false,
});
