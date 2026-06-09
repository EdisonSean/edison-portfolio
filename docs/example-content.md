# 示例内容文件

这个文件是给你复制用的，不会被网站自动读取。

你真正需要修改的是：

- Work 项目：`data/workItems/` 里的对应分类文件
- Lab 项目：`data/labItems/` 里的对应分类文件

媒体文件放在：

- Work 媒体：`public/works/项目-slug/`
- Lab 媒体：`public/lab/项目-slug/`

浏览器里使用的路径不要写 `public`，例如：

```ts
src: "/works/my-project/cover.jpg"
```

## Work 示例：多张图片

适合一个项目里有多张横向图，个别图片需要说明文字。

```ts
{
  slug: "nike-air-flow",
  title: "Air Flow",
  projectName: "Nike Air Flow Launch",
  client: "Nike",
  year: 2026,
  categories: ["product"],
  media: [
    {
      type: "image",
      src: "/works/nike-air-flow/cover.jpg",
      description: "Hero frame with the main product silhouette and airflow direction.",
    },
    {
      type: "image",
      src: "/works/nike-air-flow/detail-01.jpg",
      layout: "half",
    },
    {
      type: "image",
      src: "/works/nike-air-flow/detail-02.jpg",
      layout: "half",
      description: "Close-up material pass for the sole and translucent edge detail.",
    },
  ],
  role: ["FX design", "look development"],
  description: "A commercial product motion piece built around soft airflow and material detail.",
  featured: true,
}
```

对应文件位置：

```txt
public/
  works/
    nike-air-flow/
      cover.jpg
      detail-01.jpg
      detail-02.jpg
```

## Work 示例：短循环 MP4

适合短循环、小动效、几秒钟的横向动态内容。页面里动态内容多时，
优先用 MP4，不要堆太多 WebP。

```ts
{
  slug: "adidas-cloth-loop",
  title: "Cloth Loop",
  projectName: "Adidas Cloth Motion Test",
  client: "Adidas",
  year: 2026,
  categories: ["cloth"],
  media: [
    {
      type: "video",
      src: "/works/adidas-cloth-loop/loop.mp4",
      poster: "/works/adidas-cloth-loop/poster.jpg",
      description: "Short loop showing the main cloth timing and fold behavior.",
    },
  ],
  role: ["cloth simulation", "motion design"],
  description: "A short commercial cloth loop focused on folds, weight, and controlled wind motion.",
  featured: true,
}
```

对应文件位置：

```txt
public/
  works/
    adidas-cloth-loop/
      loop.mp4
      poster.jpg
```

## Work 示例：MP4 视频

适合比较长的视频。建议同时放一张 `poster.jpg` 作为视频封面。

```ts
{
  slug: "sony-liquid-reveal",
  title: "Liquid Reveal",
  projectName: "Sony Product Reveal",
  client: "Sony",
  year: 2025,
  categories: ["fluid", "product"],
  media: [
    {
      type: "video",
      src: "/works/sony-liquid-reveal/film.mp4",
      poster: "/works/sony-liquid-reveal/poster.jpg",
      description: "Full reveal edit with liquid motion and product highlight passes.",
    },
    {
      type: "image",
      src: "/works/sony-liquid-reveal/still-01.jpg",
    },
  ],
  role: ["fluid simulation", "rendering", "compositing"],
  description: "A product reveal film using liquid motion, macro splashes, and controlled highlight passes.",
  featured: true,
}
```

对应文件位置：

```txt
public/
  works/
    sony-liquid-reveal/
      film.mp4
      poster.jpg
      still-01.jpg
```

## Lab 示例：静态图片

适合一张实验结果图、对比图、截图。

```ts
{
  slug: "vellum-fold-study",
  title: "Vellum Fold Study",
  year: 2026,
  categories: ["recent", "simulation", "practice"],
  media: [
    {
      type: "image",
      src: "/lab/vellum-fold-study/cover.jpg",
      description: "Fold scale comparison from the final test pass.",
    },
  ],
  role: ["simulation study"],
  status: "study",
  description: "A small cloth study exploring fold scale, stiffness, and art-directable wrinkle behavior.",
}
```

对应文件位置：

```txt
public/
  lab/
    vellum-fold-study/
      cover.jpg
```

## Lab 示例：动态 WebP

适合短测试、循环实验、shader 或 motion 小片段。

```ts
{
  slug: "sdf-blur-pointer",
  title: "SDF Blur Pointer",
  year: 2026,
  categories: ["recent", "rd", "shader"],
  media: [
    {
      type: "webp",
      src: "/lab/sdf-blur-pointer/loop.webp",
    },
  ],
  role: ["Shader R&D"],
  status: "wip",
  description: "A pointer-driven shader experiment testing soft blur response around a generated field.",
}
```

对应文件位置：

```txt
public/
  lab/
    sdf-blur-pointer/
      loop.webp
```

## Lab 示例：MP4 视频

适合较长的测试记录、过程演示、完整 playblast。

```ts
{
  slug: "rbd-fracture-test",
  title: "RBD Fracture Test",
  year: 2025,
  categories: ["simulation", "practice"],
  media: [
    {
      type: "video",
      src: "/lab/rbd-fracture-test/film.mp4",
      poster: "/lab/rbd-fracture-test/poster.jpg",
    },
  ],
  role: ["RBD exercise"],
  status: "archive",
  description: "A focused fracture test for timing, secondary debris, and small-scale impact behavior.",
}
```

对应文件位置：

```txt
public/
  lab/
    rbd-fracture-test/
      film.mp4
      poster.jpg
```

## 最简单的使用方式

1. 从上面复制一个对象。
2. Work 粘贴到 `data/workItems/` 的对应分类文件；Lab 粘贴到 `data/labItems/` 的对应分类文件。
3. 修改 `slug`、标题、分类和项目总描述。
4. 按 `slug` 创建同名媒体文件夹。
5. 把图片、WebP 或 MP4 放进去。
6. 修改每个媒体项的 `src`、`poster` 和可选的 `description`。

新增多个项目时，对象之间要用英文逗号隔开。
