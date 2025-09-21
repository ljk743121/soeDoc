---
title: 数据导出
icon: chart-simple
category: 
 - 管理员指南
---

# 数据导出

从v2.0.1版本开始，系统支持CSV格式的歌曲数据导出

## 导出权限

- **管理员**：可以导出所有类型的数据
- **普通用户**：没有数据导出权限

## 导出功能概述

### 导出内容

歌曲CSV导出包含以下字段：

- 歌曲名 `name`
- 作曲家/歌手 `creator`
- 音源 `source`
- 歌曲ID `songID`
- 歌曲留言 `message`

### 通过界面导出

1. 登录系统
2. 进入"排歌列表"页面
3. 点击"下载CSV文件"按钮或选择导出区间后点击“下载选定区域全部CSV文件”按钮
4. 系统将生成CSV文件并自动下载

### 通过API导出

您也可以通过系统提供的API接口进行CSV数据导出：

**请求**：
- 方法：GET
- 路径：`/api/trpc/arrangements.today`
- 头部：`Authorization: {token}`

**示例代码**：

```javascript
// 使用JavaScript调用API导出CSV数据
async function exportSongsCSV(token) {
  const url = new URL('https://your-domain.com/api/arrangements.today');
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `${token}`,
    },
  });
  
  const blob = await response.blob();
  const urlObject = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = urlObject;
  link.download = `songs.csv`;
  link.click();
  URL.revokeObjectURL(urlObject);
}
```

## 自定义导出数据

系统允许开发者自定义导出数据的内容。如果您想更改导出数据的字段或格式，可以按照以下步骤操作：

### 修改导出逻辑

1. 打开文件 `app/pages/admin/songs/arrange.vue`
2. 找到导出相关的代码逻辑
3. 根据需要修改导出的数据字段和格式

**源文件代码示例**：

```javascript
async function copySongInfo(day: RouterOutput["arrangements"]["list"][0]) {
  if (!day.songs.length) {
    toast.error("排歌表为空");
    return;
  }

  const csvHeader = "name,creator,source,songID\n";
  let csvContent = csvHeader;
  for (const song of day.songs) {
    csvContent += `"${song.name}","${song.creator}","${song.source}","${song.songId}"\n`; //修改这里的导出逻辑
  }
  downloadCsv(csvContent);
}
```

## 注意事项

1. **版权保护**：导出的音乐数据仅用于内部统计分析，请勿用于商业用途
2. **数据安全**：妥善保管导出的数据文件，避免泄露
4. **更新频率**：CSV导出功能从v2.0.1版本开始支持，请确保您的系统已更新到相应版本
5. **自定义导出**：如需更改导出数据内容，请参考"自定义导出数据"部分进行操作