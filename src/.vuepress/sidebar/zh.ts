import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/": [
    "",
    "/get-started/",
    {
      text: "开发指南",
      icon: "code",
      prefix: "development/",
      link: "development/",
      children: "structure",
    },
    {
      text: "用户指南",
      icon: "book",
      prefix: "guide/",
      link: "guide/",
      children: "structure",
    },
    "/sites/",
  ],
});
