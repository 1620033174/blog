import { sidebar } from "vuepress-theme-hope";

export const sidebarConfig = sidebar({
  "/": false,
  "/posts/": "structure",
  "/notes/": "structure",
  "/tools/": "structure",
});

export default sidebarConfig;
