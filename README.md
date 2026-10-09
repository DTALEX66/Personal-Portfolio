# DT ALEX STUDIOS — Personal Portfolio

个人作品集站点。纯静态：没有构建步骤、没有打包器、没有外部子资源，
把 `site-unseen/` 当站点根目录用任意静态服务器打开即可。

```
cd site-unseen
python -m http.server 4200 --bind 127.0.0.1
# 打开 http://127.0.0.1:4200/
```

## 页面

| 文件 | 内容 |
| --- | --- |
| `index.html` | 入口门 + WebGL 世界 + 作品列表 + 三个自研系统 + 实验场 |
| `projects.html` | 全部作品：3D 透视纸张画廊，无 WebGL 时退成卡片网格 |
| `project.html?id=…` | 案例详情（十个案例共用一个渲染器，靠 `id` 取数据） |
| `cases/index.html` | 三个自研系统的案例总览 |
| `cases/{archeaxis,work-lab,design-lab}.html` | 三套完整产品案例页（品牌 + UI + UX + 线上物料，14 章节） |
| `cases/brand-ui-kit.html` | 品牌与 UI 基础套件 |
| `cases/source_ui/…` | 三套交互演示（示例数据，未接真实服务） |
| `labs.html` | 实验场切片 |
| `about.html` / `contact.html` | 关于 / 联系 |

三个自研系统的主详情是 `cases/` 下的完整案例页，列表卡、球体、索引层、上下篇都直接指向它；
`project.html?id=…` 保留为作品集版式的概览页，并在首屏给出进入完整案例页的入口。


## 结构

```
site-unseen/
  css/studios-unseen.css   设计令牌 + 全部样式（单文件）
  js/data.js               内容模型：作品、案例、素材表、素材真实尺寸
  js/en-copy.js            中文源文 → 英文配对
  js/core.js               语言/动效开关、双语工具、外壳交互
  js/scene.js              WebGL 场景（首页世界、列表、球体）
  assets/js/vendor/        three.js 本地单文件（603 KB）
  assets/fonts/            四款开源字体（自托管 woff2，SIL OFL 许可证随字体同目录）
  assets/media/            184 个素材，全部站内，不引用外部路径
  cases/                   三套完整产品案例页 + 交互演示（41 个文件 / 2.5 MB）
    cases/assets/          案例页配图（31 张 webp）与 Inter（含 SIL OFL 许可证）
```

案例页的 CJK 不随站分发全量字体包：`@font-face` 走 `local()` 系统字体栈，
拉丁体 Inter 以 woff/ttf 随站，许可证与字体同目录分发。

## 内容口径

- **三个自研系统**是真实产出（Ongoing）：星环知识系统 ArcheAxis Knowledge、
  工作流实验室 Workflow Lab、视觉设计实验室 Visual Design Lab。
- **八个概念案例**标为「自定概念 / Concept」——是自定的概念练习，不是客户交付。
- **作品位**在没有真实作品时保留空态并写明「待补真实作品」，不用占位图冒充。
- 界面截图一律标注「设计稿 · 示例数据」，不代表线上能力清单。
- 联系方式与社交链接按实际填写；空缺就留空态，不编造。

## 双语

中文为源文，英文是逐字段配对（`js/en-copy.js`）。右上角「中 / EN」切换，
实现方式是成对 `<span class="t-zh"> / .t-en>`，属性值（`alt`、`aria-label`）取纯文本。

## 配图规则

产品界面放进桌面样机（屏幕盒等于画面本身），品牌与规范板放进装裱板，
空间/渲染件用无边距框。三类框都**不钉死长宽比**：画面按素材自身比例撑开框形，
因此不存在裁切；素材也不被放大——小于栏宽时居中留白，不拉糊。

## 动效与无障碍

- 遵循 `prefers-reduced-motion: reduce`：整页转为可滚动静态版，扫光、编舞、
  自动旋转全部撤掉，键盘浏览与内容可读性不受影响。
- 无 WebGL 环境（或驱动被屏蔽）时，3D 列表与首页世界退化为可浏览的卡片网格。
- 动效只插值合成层属性（`transform` / `opacity` / `clip-path`），不用逐帧滤镜。
- 全站一条 `:focus-visible` 焦点环；滚轮永不劫持页面滚动。

## 仓库范围

跟踪 `site-unseen/` 全部内容与仓库根的 `README.md` / `.gitignore` / `.gitattributes`
（`.gitignore` 是白名单式：先忽略整棵目录，再逐项放行）。工作目录里的参考素材包、
原始工程文件、上一版站点、阶段快照与本地校验工作区都不入库——
其中第三方参考包含署名 / 非商业 / 禁止演绎限制。检出统一用 LF（`.gitattributes`），
避免 Windows 的换行转换把本地校验脚本的源码锚点打红。见 `.gitignore`。
