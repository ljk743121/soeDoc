---
title: 自定义音乐源
icon: puzzle-piece
category: 
 - 开发
---

# 自定义音乐源

Voice of SZSY 支持添加自定义音乐源，使系统能够从更多平台搜索和获取音乐资源。本文将详细介绍如何为系统添加自定义音乐源。

## 实现步骤

### Step 1: 定义音乐数据解析逻辑

首先，您需要在服务器端定义音乐数据解析函数。按照以下步骤操作：

1. 打开文件 `server/utils/song.ts`
2. 在文件中添加您的自定义音乐源解析函数
3. 确保函数返回的数据严格遵守以下类型定义：

```typescript
interface MusicData {
  id: string; // 音乐标识符
  name: string; // 曲目名称
  artists: string; // 艺术家信息
  album?: string; // 专辑名称（非必填）
  source: string; // 源名称
  imgId: string; // 封面图标识符（用于获取缩略图）
  duration: number; // 时长（单位：s）
}
```

**示例代码：**

```typescript
// 自定义音乐源解析函数示例
export async function searchCustomMusic(keyword: string): Promise<MusicData[]> {
  try {
    // 发送请求到自定义音乐源的API
    const response = await fetch(`https://custom-music-api.example.com/search?q=${encodeURIComponent(keyword)}`);
    const data = await response.json();
    
    // 解析返回的数据
    return data.results.map((item: any) => ({
      id: item.id,
      name: item.title,
      artists: item.artist,
      album: item.album || '',
      source: 'custom', // 自定义源名称
      imgId: item.coverId,
      duration: item.duration,
    }));
  } catch (error) {
    console.error('搜索自定义音乐源失败:', error);
    return [];
  }
}
```

### Step 2: 获取音乐播放链接

接下来，您需要实现一个函数来获取音乐的播放链接：

```typescript
// 获取自定义音乐源的播放链接
export async function getCustomMusicUrl(songId: string): Promise<string> {
  try {
    // 发送请求获取播放链接
    const response = await fetch(`https://custom-music-api.example.com/url?id=${encodeURIComponent(songId)}`);
    const data = await response.json();
    
    // 返回播放链接
    return data.url;
  } catch (error) {
    console.error('获取自定义音乐源播放链接失败:', error);
    throw error;
  }
}
```

### Step 3: 在搜索接口注入新数据源

完成数据解析函数后，您需要在 TRPC 路由配置中添加自定义源逻辑：

1. 打开文件 `server/trpc/routers/search.ts`
2. 在 `mixSearch` 函数中添加自定义源的搜索逻辑
3. 在 `mixGetUrlAPI` 函数中添加获取自定义源播放链接的逻辑

**示例代码：**

```typescript
// 在 mixSearch 函数中添加自定义源搜索
  mixSearch: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        source: z.string(),
        type: z.enum(["search", "id"]),
      }),
    )
    .query(async ({ input }) => {
      if (input.source === "wy") {
        return await searchApi.searchSongsWy(input.key, input.type);
      } else if (input.source === "tx") {
        return await searchApi.searchSongsQQ(input.key, input.type);
      } else if (input.source === "custom"){
        return await searchCustomMusic(input.key, input.type);
      } else {
        throw new TRPCError({ code: "BAD_REQUEST", message: "未知的源" });
      }
    }),
// 在 mixGetUrlAPI 函数中添加自定义源播放链接获取
  mixGetUrl: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        source: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.id)
        throw new TRPCError({ code: "BAD_REQUEST", message: "缺少ID参数" });
      let songInfo = { url: "", pay: false };
      if (input.source === "custom") {
        try {
          songInfo = await searchApi.getSongUrlCustom(input.id);
        } catch (e: any) {
          if (e.message === "歌曲为VIP歌曲") {
            songInfo = await searchApi.getSongUrlCustomVip(input.id, ctx.user);
          } else {
            throw new TRPCError({ code: "BAD_REQUEST", message: `失败:${e.message}` });
          }
        }
      } else {
        throw new TRPCError({ code: "BAD_REQUEST", message: "未知的源" });
      }
      if (!songInfo.url)
        throw new TRPCError({ code: "BAD_REQUEST", message: "歌曲链接为空" });
      return songInfo;
    }),
```

## 音乐源配置

您可以在环境变量中配置自定义音乐源的相关参数：

1. 打开 `.env` 文件
2. 添加自定义音乐源的配置参数

```bash
# 自定义音乐源配置
CUSTOM_MUSIC_API_URL=https://custom-music-api.example.com
CUSTOM_MUSIC_API_KEY=your_api_key_here
```

然后在`server/env.ts`中导入环境变量：

```typescript
const envSchema = z.object({
  ...
  CUSTOM_MUSIC_API_URL: z.string().url().optional(),
  CUSTOM_MUSIC_API_KEY: z.string().optional(),
});
```
再在项目中使用环境变量：

```typescript
import { env } from "~~/server/env";

const baseUrl = env.CUSTOM_MUSIC_API_URL;
```

## 测试自定义音乐源

添加自定义音乐源后，您需要进行测试以确保其正常工作：

1. 启动开发服务器：`pnpm run dev`
2. 进入歌曲投稿页面
3. 尝试从自定义音乐源搜索歌曲
4. 检查搜索结果是否正确显示
5. 测试歌曲的播放功能

## 音乐源扩展最佳实践

1. **错误处理**：确保添加足够的错误处理逻辑，防止自定义音乐源的问题影响整个系统
2. **性能优化**：优化API请求，减少延迟，提高用户体验
3. **缓存机制**：实现合理的缓存机制，减少API请求次数
4. **限流处理**：处理API限流情况，避免因请求过多被封
5. **兼容性**：确保返回的数据格式与系统要求完全一致
6. **文档完善**：为您的自定义音乐源添加详细的使用文档

## 常见问题

**Q: 自定义音乐源无法搜索到歌曲怎么办？**
A: 检查API地址是否正确，API密钥是否有效，以及网络连接是否正常。

**Q: 搜索结果正确但无法播放歌曲怎么办？**
A: 检查播放链接获取函数是否正确，以及返回的播放链接是否可以正常访问。 **项目默认配置不包含网易云和QQ音乐的VIP歌曲获取，请自行配置**