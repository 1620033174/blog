import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://1620033174.github.io",

  author: {
    name: "1620033174",
    url: "https://github.com/1620033174",
  },

  pure: true,
  logo: "/logo.svg",
  repo: "1620033174/blog",
  docsDir: "blog",

  blog: {
    medias: {
      GitHub: "https://github.com/1620033174",
    },
  },

  locales: {
    "/": {
      navbar,
      sidebar,
      toc: {
        levels: [2, 3, 4],
      },
      displayFooter: true,
      footer: "Copyright © 2026 1620033174",
      blog: {
        name: "1620033174",
        description: "正在学习，也在记录。",
      },
      metaLocales: {
        editLink: "在 GitHub 上编辑此页",
      },
    },
  },

  hotReload: true,

  markdown: {
    alert: true,
    align: true,
    attrs: true,
    codeTabs: true,
    figure: true,
    imgLazyload: true,
    imgSize: true,
    mark: true,
    tabs: true,
    tasklist: true,
  },

  plugins: {
    blog: true,
    icon: {
      assets: "fontawesome-with-brands",
    },
  },
});
