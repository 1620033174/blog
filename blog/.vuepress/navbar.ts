import { navbar } from "vuepress-theme-hope";

export const navbarConfig = navbar([
  "/",
  "/posts/",
  "/notes/",
  "/tools/",
  { text: "关于我", link: "/me.html", icon: "fa-solid fa-user" },
]);

export default navbarConfig;
