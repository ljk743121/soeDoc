import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "Voice of SZSY 文档",
      description: "实验之声广播站点歌系统文档",
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
