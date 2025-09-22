import { defineUserConfig } from "vuepress";
import { baiduAnalyticsPlugin } from '@vuepress/plugin-baidu-analytics';

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

  plugins: [
    baiduAnalyticsPlugin({
      id: "a591ac9c82f25db246cf2638a700796d",
    }),
  ],

  head: [
    ["meta",
      { name : "algolia-site-verification", content : "45A00783C983D991" },
    ],
  ],
  // Enable it with pwa
  // shouldPrefetch: false,
});
