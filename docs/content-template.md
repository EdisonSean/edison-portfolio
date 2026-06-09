# Work / Lab 内容填写模板

当前网站只使用一层内容数据：

- Work archive 入口：`data/works.ts`
- Work 项目编辑：`data/workItems/`
- Lab archive 入口：`data/labs.ts`
- Lab 项目编辑：`data/labItems/`
- 没有详情页
- 没有 MDX

如果你想直接复制完整示例，打开 `docs/example-content.md`。

每个项目可以放多个媒体。媒体会按照 `media` 数组里的顺序显示，
并按素材自身的宽高比适配，适合图片、动态 WebP、MP4 混排成瀑布流。
图片、WebP 和 MP4 在接近视口前不会写入真实 `src`，只显示轻量占位；
接近后才开始下载。

## 媒体规则

媒体文件夹建议和项目的 `slug` 使用同一个名字。

```txt
public/
  works/
    your-work-slug/
      cover.jpg
      detail-01.jpg
      loop.webp
      film.mp4
      poster.jpg

  lab/
    your-lab-slug/
      cover.jpg
      detail-01.jpg
      loop.webp
      film.mp4
      poster.jpg
```

浏览器路径不要写 `public`：

```ts
src: "/works/your-work-slug/cover.jpg"
```

## 媒体项写法

静态图片：

```ts
{
  type: "image",
  src: "/works/your-work-slug/cover.jpg",
  description: "Optional description for this image.",
}
```

动态 WebP：

```ts
{
  type: "webp",
  src: "/works/your-work-slug/loop.webp",
}
```

MP4 视频：

```ts
{
  type: "video",
  src: "/works/your-work-slug/film.mp4",
  poster: "/works/your-work-slug/poster.jpg",
  description: "Optional description for this video.",
}
```

说明：

- `image` 可以是 `.jpg`、`.jpeg`、`.png`，或者其他普通图片格式。
- `webp` 用于短循环动态 WebP。
- `video` 用于 MP4 视频，会在进入可视区域时自动静音循环播放，离开可视区域后自动暂停；点击视频可暂停或继续播放。
- `poster` 只对 `video` 有用；图片和 WebP 不需要写。
- `description` 是可选的，只会显示在对应图片或视频下面。
- `layout` 是可选的；不写就是单独一行，写 `layout: "half"` 就在桌面端半宽显示。
- 如果一个页面里会放很多动态内容，优先把 WebP 转成 MP4，再用 `type: "video"`。

单独一行：

```ts
{
  type: "image",
  src: "/works/your-work-slug/cover.jpg",
}
```

两张并排：

```ts
{
  type: "image",
  src: "/works/your-work-slug/detail-01.jpg",
  layout: "half",
},
{
  type: "image",
  src: "/works/your-work-slug/detail-02.jpg",
  layout: "half",
}
```

## Work 项目

Work 只放商业项目。

Work 项目按右侧 Work Index 分类拆到不同文件里：

```txt
data/
  workItems/
    cloth.ts
    fluid.ts
    pyro.ts
    particles.ts
    procedural.ts
    rbd.ts
    product.ts
```

新增项目时，放进它最主要的分类文件。比如主方向是布料模拟，就放进
`data/workItems/cloth.ts`。如果它也应该出现在 Product，
就在 `categories` 里加上对应分类：

```ts
categories: ["cloth", "product"]
```

Featured 只由 `featured: true` 控制。不要在 `categories` 里写 `"featured"`。
`featured.ts` 是占位文件，一般不要把项目复制进去。

```ts
{
  slug: "your-work-slug",
  title: "Display Title",
  projectName: "Campaign / Film Name",
  client: "Client Name",
  year: 2026,
  categories: ["product"],
  media: [
    {
      type: "image",
      src: "/works/your-work-slug/cover.jpg",
      description: "Optional description for this image.",
    },
    {
      type: "webp",
      src: "/works/your-work-slug/loop.webp",
    },
    {
      type: "image",
      src: "/works/your-work-slug/detail-01.jpg",
      layout: "half",
    },
    {
      type: "image",
      src: "/works/your-work-slug/detail-02.jpg",
      layout: "half",
    },
  ],
  role: ["FX design", "look development"],
  description: "One short sentence about the whole project.",
  featured: true,
}
```

Work 可用分类：

```txt
cloth, fluid, pyro, particles, procedural, rbd, product
```

## Lab 项目

Lab 用于非商业实验、R&D、测试、研究和练习。

Lab 项目也按右侧 Lab Index 分类拆到不同文件里：

```txt
data/
  labItems/
    rd.ts
    simulation.ts
    shader.ts
    motion.ts
    practice.ts
```

新增项目时，放进它最主要的分类文件。比如主方向是 shader，就放进
`data/labItems/shader.ts`。如果它也应该出现在 Recent，就在
`categories` 里加上 `"recent"`：

```ts
categories: ["recent", "shader"]
```

`recent.ts` 和 `all.ts` 是交叉/浏览分类占位文件。一般不要把项目复制到
这些文件里；Recent 通过 `"recent"` 分类出现，All 会自动包含所有 Lab 项目。

```ts
{
  slug: "your-lab-slug",
  title: "Display Title",
  year: 2026,
  categories: ["recent", "rd"],
  media: [
    {
      type: "video",
      src: "/lab/your-lab-slug/film.mp4",
      poster: "/lab/your-lab-slug/poster.jpg",
      description: "Optional description for this video.",
    },
  ],
  role: ["R&D note"],
  status: "wip",
  description: "One short sentence about the whole experiment.",
}
```

Lab 可用分类：

```txt
recent, all, rd, simulation, shader, motion, practice
```

`all` 只作为浏览分类使用。大部分 Lab 项目应该使用 `recent`、`rd`、
`simulation`、`shader`、`motion` 或 `practice` 这类分类。
