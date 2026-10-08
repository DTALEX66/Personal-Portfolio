/* ============================================================
   DT ALEX STUDIOS · 内容模型（单源）
   移植自 web/assets/js/projects.js（口径一致），
   媒体路径统一指向已确认存在的 web/assets/media/*.webp。
   真实性：real = 真实产出 / concept = 自定概念渲染（页面标注）
          / placeholder = 作品位（Replace with real work）
   ============================================================ */
window.DTS = {
  brand: "DT ALEX STUDIOS",
  owner: "DT ALEX",
  role: "Graphic & Visual Designer",
  year: "2026",

  opening: {
    letters: ["D", "T", "A", "L", "E", "X"],
    title: "DT ALEX STUDIOS",
    sub: "PERSONAL PORTFOLIO · 2026",
    loader: ["GRAPHIC", "BRAND", "TYPE", "SPACE", "MOTION", "IMAGE", "CODE", "SYSTEM"]
  },

  world: {
    name: "DT ALEX",
    role: "Graphic & Visual Designer",
    tags: ["Graphic", "Brand", "3D", "Motion", "Digital"],
    explore: "DRAG TO EXPLORE",
    cta: "VIEW SELECTED WORK ↓"
  },

  nav: [
    { n: "01", zh: "索引", en: "Index", href: "index.html" },
    { n: "02", zh: "作品", en: "Projects", href: "projects.html" },
    { n: "03", zh: "联系", en: "Contact", href: "contact.html" },
    { n: "04", zh: "实验", en: "Labs", href: "labs.html" }
  ],

  tags: ["ALL", "GRAPHIC", "BRAND", "VISUAL", "3D", "SPACE", "MOTION", "VIDEO", "DIGITAL", "PERSONAL"],

  /* ---------------------------------------------- 视觉作品（PRIORITY 02） */
  work: [
    {
      slug: "nebula-culture-wall",
      title: "NEBULA 文化墙",
      titleEn: "NEBULA CULTURE WALL",
      year: "2026",
      category: ["3D", "SPACE", "VISUAL"],
      type: "Spatial Graphics / Concept",
      role: "Concept / Art Direction / Visualisation",
      client: "自定概念项目（非真实客户）",
      truth: "concept",
      one: "一整套企业大堂文化墙的空间视觉：主墙面、夜景、施工节点与材料板，用同一套图形语言贯穿。",
      narrative: {
        why: "想检验一套品牌图形语言离开平面、进入空间和材料之后是否仍然成立——这是关于尺度、光与材料的练习。",
        how: "以主墙面为母题做 3D 概念渲染：日间主视觉、夜景照明、墙面细节、材料板、施工节点；把斜切角度同时用作导视轮廓与图标切口，换媒介不换语法。",
        current: "概念与渲染方向（非已落地施工），作为空间图形的能力练习。",
        reflect: "如果重来，我会更早把施工、材料与照明约束纳入渲染，让概念从一开始就贴着可落地性走。"
      },
      cover: "culture-wall-night",
      media: [
        { kind: "full", src: "culture-wall-main", cap: "主墙面 · 日间", meta: "Wide" },
        { kind: "full", src: "culture-wall-night", cap: "夜景照明", meta: "Night" },
        { kind: "double", src: ["culture-wall-detail", "material-board"], cap: ["墙面细节", "材料板"] },
        { kind: "full", src: "construction-detail", cap: "施工节点", meta: "Detail" },
        { kind: "double", src: ["brand-identity-board", "brand-application"], cap: ["品牌识别板", "品牌应用"] }
      ]
    },
    {
      slug: "nebula-wayfinding",
      title: "NEBULA 导视与识别",
      titleEn: "WAYFINDING & IDENTITY",
      year: "2026",
      category: ["SPACE", "BRAND", "GRAPHIC"],
      type: "Signage / Brand Application",
      role: "Concept / Graphic Design",
      client: "自定概念项目（非真实客户）",
      truth: "concept",
      one: "把文化墙的图形语言延展到导视牌、识别板与办公空间，验证它在小尺度和低对比条件下是否还成立。",
      narrative: {
        why: "主墙面成立之后，下一个问题是：这套语言在小尺度、低对比、远距离下还认得出吗。",
        how: "把斜切角度变成导视牌轮廓、识别板边框与图标切口，延展到导视系统、识别板与材料板，同一套语言换媒介。",
        current: "概念方向（非真实客户委托，Ongoing）。",
        reflect: "如果重来，我会先做一块 1:1 的实样再看渲染——小尺度印刷与屏幕渲染的误差是概念阶段最难骗过自己的部分。"
      },
      cover: "wayfinding-system",
      media: [
        { kind: "full", src: "wayfinding-system", cap: "导视系统", meta: "Signage" },
        { kind: "double", src: ["brand-application", "brand-identity-board"], cap: ["品牌应用", "识别板"] },
        { kind: "full", src: "material-board", cap: "材料板", meta: "Material" }
      ]
    },
    {
      slug: "nocturne",
      title: "NOCTURNE 气味的留白",
      titleEn: "NOCTURNE",
      year: "2026",
      category: ["BRAND", "VISUAL", "GRAPHIC"],
      type: "Concept / Brand & Packaging",
      role: "概念自拟 · 品牌 / 视觉方向",
      client: "—",
      truth: "concept",
      one: "自拟独立香氛品牌的识别与包装：以矿物质感和冷静留白表达夜色，不靠繁复叙事取胜。",
      narrative: {
        why: "香气类品牌惯于堆叠叙事。我想试另一种做法：像夜间空气一样，靠材质、比例和细节慢慢显现。",
        how: "烟熏玻璃、岩面与银色弧线构成主视觉母题；瓶身比例保持克制，包装结构强调触感与留白，再延展到静物摄影与数字橱窗。",
        current: "完整自拟概念：识别、包装、材质与数字橱窗共用一套语言（非客户委托，未商业发布）。",
        reflect: "这套材质语言落到真实产品时，要先验证的是运输与货架光照，而不是画面好不好看。"
      },
      cover: "nocturne-hero",
      media: [
        { kind: "double", src: ["nocturne-packaging", "nocturne-material"], cap: ["包装静物", "烟熏玻璃与岩面"] }
      ]
    },
    {
      slug: "field-index",
      title: "FIELD INDEX 城市植物档案",
      titleEn: "FIELD INDEX",
      year: "2026",
      category: ["GRAPHIC", "VISUAL"],
      type: "Concept / Editorial & Publication",
      role: "概念自拟 · 编辑设计 / 摄影",
      client: "—",
      truth: "concept",
      one: "把城市植物如何适应环境的田野记录，转译成可阅读的视觉档案与出版物。",
      narrative: {
        why: "植物在城市缝隙里怎么活下来本身是好问题；难的是让观察、地图和图像在纸上连成一条阅读路径。",
        how: "编号、网格、局部放大的叶脉纹理与地图切片作为编辑线索；跨页留安静段落，让资料页、图像页与短叙事交替。",
        current: "完整自拟编辑概念：封面、标本跨页、采样地图与线上索引共用同一编号规则。",
        reflect: "线上索引最容易做成好看但查不动的画廊；编号能回到街区路径才是它成立的条件。"
      },
      cover: "field-index-hero",
      media: [
        { kind: "double", src: ["field-index-spread", "field-index-map"], cap: ["标本跨页", "采样地图"] }
      ]
    },
    {
      slug: "tideline",
      title: "TIDELINE 潮汐仍在",
      titleEn: "TIDELINE",
      year: "2026",
      category: ["GRAPHIC", "VISUAL"],
      type: "Concept / Poster & Campaign",
      role: "概念自拟 · 海报 / 平面",
      client: "—",
      truth: "concept",
      one: "自拟海洋保护主题海报系列：三张画面拼合潮流与鱼形，在单张与整体之间切换阅读。",
      narrative: {
        why: "海洋里的安全感是怎么被一点点侵蚀的？一组海报要既能单看，又能拼成一个完整主张。",
        how: "断裂的水纹构成跨幅主图形，局部加信号红作警觉点；标题与信息区走稳定网格，保证系列一致又各自成立。",
        current: "完整自拟概念：涨潮、回流、海面静止三联，配数字裁切与展览墙顺序。",
        reflect: "与任何既存活动或品牌无关；这类主题容易滑向插画素材感，所以图形必须来自同一套断裂规则。"
      },
      cover: "tideline-hero",
      media: [
        { kind: "double", src: ["tideline-poster-detail", "tideline-campaign"], cap: ["单张构图细节", "活动长图"] }
      ]
    },
    {
      slug: "kinetic-field",
      title: "KINETIC FIELD 字形运动研究",
      titleEn: "KINETIC FIELD",
      year: "2026",
      category: ["MOTION", "VISUAL", "GRAPHIC"],
      type: "Concept / Motion & Typography",
      role: "概念自拟 · 动态 / 创意编码",
      client: "—",
      truth: "concept",
      one: "把网格里的字形当作有重量、速度与阻力的物体：加速、碰撞、回弹与归位四个节拍。",
      narrative: {
        why: "如果字不是贴在画面上的信息，而是受力、碰撞、停顿和释放的对象，阅读节奏会怎样变化。",
        how: "固定基线与边距，用有限色彩区分运动层级；动势由加速、碰撞、回弹组成，静帧仍保留清晰层级与方向。",
        current: "以分镜板与关键帧静帧呈现的研究（未做成可播放成片）。",
        reflect: "研究类动态最怕只剩好看的关键帧；节拍定义清楚了，静帧才谈得上是证据。"
      },
      cover: "kinetic-field-hero",
      media: [
        { kind: "double", src: ["kinetic-storyboard", "kinetic-frame"], cap: ["节奏分镜", "关键帧"] }
      ]
    },
    {
      slug: "form-study",
      title: "FORM STUDY 06 折面坐具",
      titleEn: "FORM STUDY 06",
      year: "2026",
      category: ["3D", "VISUAL"],
      type: "Concept / 3D & Product",
      role: "概念自拟 · 三维可视化 / 材质研究",
      client: "—",
      truth: "concept",
      one: "单一材料连续弯折构成坐面与支撑：冷金属与深蓝半透明材质下的轻量感研究。",
      narrative: {
        why: "用连续折面同时拿到稳定支撑和视觉上的轻，是这组研究想推到的边界。",
        how: "三分之四视角做主渲染，配合材质近景、轮廓线与构造拆解图，让结构本身成为主角。",
        current: "概念表达：主渲染、材质近景与构造视图（不宣称工程验证或量产）。",
        reflect: "一旦写成「可量产」就越界了；这套图能支撑的结论只到形态与材质关系。"
      },
      cover: "form-study-hero",
      media: [
        { kind: "double", src: ["form-study-detail", "form-study-material"], cap: ["折边与半透明坐面", "材质细节"] }
      ]
    },
    {
      slug: "after-hours",
      title: "AFTER HOURS 夜行文化计划",
      titleEn: "AFTER HOURS",
      year: "2026",
      category: ["BRAND", "VISUAL", "GRAPHIC"],
      type: "Concept / Campaign & Key Visual",
      role: "概念自拟 · 活动识别 / 艺术指导",
      client: "—",
      truth: "concept",
      one: "自拟夜间艺术节的主视觉与延展：用城市冷色光带串联不同的观看场景。",
      narrative: {
        why: "夜晚不只是活动时间，它也可以是城市里另一种共同生活的空间。",
        how: "冷色光带、城市廊道与竖向画幅构成主视觉；红色只作少量节奏标记，延展到海报、票面与现场屏幕共用同一网格与标题区。",
        current: "完整自拟活动识别：主 KV、系列海报、移动票面与现场屏幕（非真实节庆或委托）。",
        reflect: "夜景物料容易一片炫光；红色被限制成切换标记，是为了让光带还能读出层次。"
      },
      cover: "after-hours-hero",
      media: [
        { kind: "double", src: ["after-hours-posters", "after-hours-screen"], cap: ["海报与票面", "现场屏幕"] }
      ]
    },
  ],

  /* ---------------------------------------------- 个人项目（PRIORITY 03） */
  personal: [
    {
      slug: "aaos",
      name: "AAOS",
      full: "星环知识平台 ArcheAxis Knowledge",
      year: "2026—",
      tags: ["Knowledge", "Human-AI", "Local-first", "Learning", "Research"],
      status: "Ongoing",
      flag: "个人爱好 · AI 能力展示",
      one: "本地优先的个人知识与 Human–AI 双向学习系统：统一承载多格式资料、研究、人的学习与 AI 学习资产，内容先保存、核验可追溯。",
      why: "用 AI 越久，资料、聊天记录和研究堆得越多，真正重要的那条却越来越难找回来；换一个工具，历史就断一次。所以做自己的知识系统，而不是继续加一个工具。",
      how: "内容先保存——原创、假设、草稿、AI 生成内容都允许先留下，识别忠实度核验与专业依据分析分开记录、按需执行；六空间、五十个入口、十六个能力家族，每条回答都带可追溯的证据链。机器学习不训练基础模型，候选内容不会自动变成可信事实。",
      current: "界面与信息结构已可用（Ongoing）。下一步补完多格式内容的本地识别闭环（OCR / ASR / 抽帧），让人机共学从候选走向受治理的资产。",
      reflect: "如果重来，我会把「核验」设计成一等公民而不是后补步骤——它应该和保存同时发生。",
      /* 封面用 2400×1350 的 aaos-hero：brand-hero 是 1920×330 的横幅，
         放进按 16:9 排的作品列表里会比别人矮一截。 */
      cover: "aaos-hero",
      logo: "logo-aaos",
      case: "cases/archeaxis.html",
      media: [
        /* 01 案例吸收原先三条重复的 archeaxis-* 条目：品牌识别 → 信息架构 → 产品界面 → 学习闭环
           frame 逐条标：mac = 产品界面（桌面样机），paper = 品牌/规范板（装裱板）。
           这个字段只能按"这张图到底是什么"来标，不能按图片比例猜——
           420×800 的构成拆解和 460×800 的主标志都是竖幅板子，按比例猜会被塞进手机样机。
           规范板一律 full：这些板子本身是 800–1920 宽的设计稿，塞进双栏只剩 296px 宽，
           字阶、图标、栅格全部糊成一团；双栏只留给同比例的成对界面截图。 */
        { kind: "full", src: "primary-logo", cap: "主标志 · AA 组合", meta: "Logo", ch: "how", frame: "paper" },
        { kind: "full", src: "logo-variations", cap: "标志变体", ch: "how", frame: "paper" },
        { kind: "full", src: "color-system", cap: "色彩系统", ch: "how", frame: "paper" },
        { kind: "full", src: "typography", cap: "字体系统", ch: "how", frame: "paper" },
        { kind: "full", src: "graphic-language", cap: "图形语言", ch: "how", frame: "paper" },
        { kind: "full", src: "icon-system", cap: "图标系统", ch: "how", frame: "paper" },
        { kind: "full", src: "construction", cap: "构成逻辑", ch: "how", frame: "paper" },
        { kind: "full", src: "naming", cap: "名称与构成", meta: "Naming", ch: "why", frame: "paper" },
        { kind: "full", src: "information-architecture", cap: "信息架构", ch: "how", frame: "paper" },
        { kind: "full", src: "module-map", cap: "模块地图", ch: "how", frame: "paper" },
        { kind: "full", src: "ui-capture", cap: "捕获入口", meta: "界面", ch: "why", frame: "mac" },
        { kind: "full", src: "aaos-01-capture", cap: "内容先保存／捕获入口", meta: "设计稿 · 示例数据", ch: "why", frame: "mac" },
        { kind: "full", src: "aaos-02-evidence", cap: "资料与证据浏览", meta: "设计稿 · 示例数据", ch: "how", frame: "mac" },
        { kind: "full", src: "aaos-b05-evidence-detail", cap: "证据详情／后续核验", meta: "设计稿 · 示例数据", ch: "how", frame: "mac" },
        { kind: "double", src: ["ui-knowledge-object", "ui-machine"], cap: ["知识对象", "机器学习视图"], meta: ["设计稿 · 示例数据", "设计稿 · 示例数据"], ch: "how", frame: "mac" },
        { kind: "full", src: "aaos-04-human", cap: "人的学习", meta: "设计稿 · 示例数据", ch: "current", frame: "mac" },
        { kind: "full", src: "aaos-05-workspace", cap: "工作区", meta: "设计稿 · 示例数据", ch: "current", frame: "mac" },
        { kind: "full", src: "aaos-06-memory", cap: "知识关联", meta: "设计稿 · 示例数据", ch: "current", frame: "mac" },
        { kind: "full", src: "ui-spatial-future", cap: "空间化未来", meta: "界面", ch: "current", frame: "mac" },
        { kind: "full", src: "ui-evidence-review", cap: "证据复核", meta: "界面", ch: "reflect", frame: "mac" }
      ]
    },
    {
      slug: "work-lab",
      name: "WORK-LAB",
      full: "工作流实验室 Workflow Lab",
      year: "2026—",
      tags: ["Workflow", "Agent", "Control", "Observer", "Delivery"],
      status: "Ongoing",
      flag: "个人爱好 · AI 能力展示",
      one: "客户端中立的个人 AI 工作流治理、控制与交付系统：跨原生客户端保留一致的规则、任务、授权与验收标准，用真实回执判定完成。",
      why: "不同 Agent 客户端各管一套规则、技能和记忆，能力声明重复且容易漂移；换一个客户端，规则和验收标准就丢一次。想保留的是工作方法的可迁移性：软件、模型、Provider 可替换，方法不随品牌消失。",
      how: "任务以任务包（task pack）走可审计闭环——单写者写入、只读并行审计、交付门禁，完成与否按真实回执判定；观测面板二十二个只读视图，把任务、执行、审批、审计与成本放在同一屏，缺数据如实写 UNKNOWN，不用零值补曲线。",
      current: "控制平面与观测面板已成型（Ongoing）。下一步把审批回路、失败恢复与发布门禁做完整，从「看得见」走到「控得住」；新客户端通过同一 Adapter 契约接入。",
      reflect: "如果重来，我会先定义「完成」的证据，再谈自动化——没有回执的自动只会放大错误。",
      cover: "work-lab-hero",
      logo: "logo-work-lab",
      case: "cases/work-lab.html",
      media: [
        { kind: "full", src: "work-lab-01-taskpacks", cap: "任务包", meta: "设计稿 · 示例数据", ch: "why", frame: "mac" },
        { kind: "full", src: "work-lab-02-observer", cap: "Observer 只读观察", meta: "设计稿 · 示例数据", ch: "how", frame: "mac" },
        { kind: "full", src: "work-lab-03-audit", cap: "审计追踪", meta: "设计稿 · 示例数据", ch: "how", frame: "mac" },
        { kind: "full", src: "work-lab-b05-execution-detail", cap: "执行与回执展示", meta: "设计稿 · 示例数据", ch: "current", frame: "mac" }
      ]
    },
    {
      slug: "design-lab",
      name: "DESIGN-LAB",
      full: "视觉设计实验室 Visual Design Lab",
      year: "2026—",
      tags: ["Design", "AI-native", "Production", "Preflight", "Host-native"],
      status: "Ongoing",
      flag: "个人爱好 · AI 能力展示",
      one: "AI 原生、平台中立、宿主原生的职业视觉设计系统：把方法、质量、权利、预检与可编辑交付组织成可读回、可恢复的设计闭环。",
      why: "一天里在参考、生成、排版、改稿、导出之间来回切换十几次，问题不是工具不够，而是它们彼此不通；做过什么判断、为什么这样改，也没人记得。想把自己的专业判断与可复用生产能力留在自己手里。",
      how: "参考导入后由服务端读回预览，Brief → Direction → DesignSystem 每一步存成可回溯的版本链，并发提交被拦下而不是静默覆盖；预检只探测与报告，不安装、不改变环境；可编辑交付带 BOM、版本与恢复路径。证据分级 E0–E5 已接通。",
      current: "工作台与版本链可用（Ongoing）。下一步按 10 月新主线搜集高星、高赞、高收藏的设计能力，分类归档、中立化，形成 Design Capability Library；并把预检规则做细，让交付问题在设计阶段就暴露。",
      reflect: "如果重来，我会更早把「权利分层」写进数据模型——设计系统的伦理问题比效率问题更早出现。",
      cover: "design-lab-hero",
      logo: "logo-design-lab",
      case: "cases/design-lab.html",
      media: [
        { kind: "full", src: "design-lab-01-projects", cap: "项目上下文", meta: "设计稿 · 示例数据", ch: "why", frame: "mac" },
        { kind: "full", src: "design-lab-02-brand", cap: "设计系统", meta: "设计稿 · 示例数据", ch: "how", frame: "mac" },
        { kind: "full", src: "design-lab-03-preflight", cap: "生产预检", meta: "设计稿 · 示例数据", ch: "how", frame: "mac" },
        { kind: "full", src: "design-lab-04-deliverables", cap: "可编辑交付", meta: "设计稿 · 示例数据", ch: "current", frame: "mac" },
        { kind: "full", src: "design-lab-05-evidence", cap: "证据展示", meta: "设计稿 · 示例数据", ch: "current", frame: "mac" }
      ]
    }
  ],

  /* ---------------------------------------------- 实验（PRIORITY 03.5） */
  experiments: [
    { slug: "graphic-language", title: "图形语言推演", kind: "Graphic", src: "graphic-language", note: "轨道 · 星座 · 流动 · 层叠，四种母题" },
    { slug: "material-board", title: "材料板", kind: "3D", src: "material-board", note: "光的反射率与粗糙度对比" },
    { slug: "type-scale", title: "字阶实验", kind: "Type", src: "typography", note: "同一栅格下压六级字阶" },
    { slug: "space-future", title: "空间前瞻", kind: "Digital", src: "ui-spatial-future", note: "把知识做成可以走进去的房间" },
    { slug: "capability-atlas", title: "能力图谱", kind: "Digital", src: "ui-capability-atlas", note: "十六个能力家族的关系图" },
    { slug: "signal-map", title: "径向信号图", kind: "Code", src: "live-observer", note: "Agent / Task Pack / Workflow 的关系视图" },
    { slug: "preflight", title: "交付前预检", kind: "Code", src: "live-preflight", note: "把问题拦在导出之前" },
    { slug: "construction", title: "构成拆解", kind: "Graphic", src: "construction", note: "基准轴与八列栅格" },
    { slug: "application-sheet", title: "应用延展", kind: "Graphic", src: "applications-left", note: "同一套语言换媒介" },
    { slug: "placeholder-ai-image", title: "AI 图像实验", kind: "AI Image", src: "", note: "Replace with real work" },
    { slug: "placeholder-shader", title: "Shader 实验", kind: "WebGL", src: "", note: "Replace with real work" },
    { slug: "placeholder-video", title: "影像片段", kind: "AI Video", src: "", note: "Replace with real work" }
  ],

  archive: [
    { year: "2026", slug: "nebula-culture-wall", title: "NEBULA 文化墙", cat: "Space", personal: false },
    { year: "2026", slug: "nebula-wayfinding", title: "NEBULA 导视与识别", cat: "Space", personal: false },
    { year: "2026", slug: "nocturne", title: "NOCTURNE 气味的留白", cat: "Brand", personal: false },
    { year: "2026", slug: "field-index", title: "FIELD INDEX 城市植物档案", cat: "Graphic", personal: false },
    { year: "2026", slug: "tideline", title: "TIDELINE 潮汐仍在", cat: "Graphic", personal: false },
    { year: "2026", slug: "kinetic-field", title: "KINETIC FIELD 字形运动研究", cat: "Motion", personal: false },
    { year: "2026", slug: "form-study", title: "FORM STUDY 06 折面坐具", cat: "3D", personal: false },
    { year: "2026", slug: "after-hours", title: "AFTER HOURS 夜行文化计划", cat: "Brand", personal: false },
    { year: "2026—", slug: "aaos", title: "AAOS · 星环知识平台", cat: "Personal", personal: true },
    { year: "2026—", slug: "work-lab", title: "WORK-LAB", cat: "Personal", personal: true },
    { year: "2026—", slug: "design-lab", title: "DESIGN-LAB", cat: "Personal", personal: true }
  ],

  about: {
    line: "我是 DT ALEX，主要从事平面和视觉设计。",
    body: [
      "平时的工作涉及品牌、平面、空间以及部分数字设计。",
      "工作之外也会研究 3D、动态影像、软件、AI 和编程，并持续做一些自己的项目。",
      "DT ALEX STUDIOS 用来整理这些年的作品和尝试。"
    ],
    fields: ["Brand", "Graphic", "Visual", "3D", "Motion", "Digital", "Personal Projects"],
    cert: "全媒体运营证书（自学并考取）",
    traits: "性格低调、细心、责任感强；有团队合作意识与一定的领导、管理和培训经验；具备良好的职业道德与团队精神。"
  },

  contact: {
    kicker: "SAY HELLO",
    big: "I LOOK FORWARD TO HEARING FROM YOU",
    cols: [
      { k: "合作洽谈", kEn: "New Business", email: "", note: "邮箱待公布 · 可先通过下方链接找到我" },
      { k: "一般联系", kEn: "General", email: "", note: "邮箱待公布 · 可先通过下方链接找到我" }
    ],
    socials: [
      { label: "GITHUB", href: "https://github.com/DTALEX66" },
      { label: "INSTAGRAM", href: "" },
      { label: "BEHANCE", href: "" },
      { label: "站酷", href: "" }
    ],
    location: "China · 廊坊"
  },

  /* media helper: key → 站内自包含媒体（assets/media，含子目录与尺寸后缀） */
  FILES: {
    /* graphic */
    "brand-hero": "graphic/brand-hero-1920",
    "primary-logo": "graphic/primary-logo-460",
    "logo-variations": "graphic/logo-variations-540",
    /* 三个个人项目的标识锁定（图形 + 字标），从 4K 黑白稿按亮度蒙版抠出来。
       走 FILES 而不是在页面里写字面路径：素材对账按这张表认路径，
       写在别处的会被算成没挂上的素材。三张都带 alpha，深色页面上不需要底板。 */
    "logo-aaos": "logos/aaos-lockup",
    "logo-work-lab": "logos/work-lab-lockup",
    "logo-design-lab": "logos/design-lab-lockup",
    "color-system": "graphic/color-system-800",
    "typography": "graphic/typography-800",
    "graphic-language": "graphic/graphic-language-800",
    "icon-system": "graphic/icon-system-960",
    "construction": "graphic/construction-420",
    "applications-left": "graphic/applications-left-960",
    "applications-right": "graphic/applications-right-960",
    "naming": "graphic/naming-960",
    "brand-essence": "graphic/brand-essence-960",
    "information-architecture": "graphic/information-architecture-1920",
    "module-map": "graphic/module-map-750",
    "navigation": "graphic/navigation-520",
    "homepage-structure": "graphic/homepage-structure-920",
    "ui-capture-inbox": "graphic/ui-capture-inbox-530",
    "ui-evidence-library": "graphic/ui-evidence-library-520",
    "ui-memory-map": "graphic/ui-memory-map-560",
    "ui-workspace": "graphic/ui-workspace-960",
    "ui-originals": "graphic/ui-originals-520",
    "ui-human-learning": "graphic/ui-human-learning-610",
    "ui-machine-learning": "graphic/ui-machine-learning-610",
    "ui-search-review": "graphic/ui-search-review-580",
    /* space */
    "culture-wall-main": "space/culture-wall-main-960",
    "culture-wall-night": "space/culture-wall-night-960",
    "culture-wall-detail": "space/culture-wall-detail-960",
    "material-board": "space/material-board-960",
    "construction-detail": "space/construction-detail-960",
    "brand-identity-board": "space/brand-identity-board-960",
    "brand-application": "space/brand-application-960",
    "wayfinding-system": "space/wayfinding-system-960",
    /* archeaxis */
    "01": "archeaxis/01-1920",
    "ui-capture": "archeaxis/ui-capture-1920",
    "ui-knowledge-object": "archeaxis/ui-knowledge-object-1920",
    "ui-machine": "archeaxis/ui-machine-1920",
    "ui-library": "archeaxis/ui-library-1920",
    "ui-review": "archeaxis/ui-review-1920",
    "ui-correction": "archeaxis/ui-correction-1920",
    "ui-evidence-review": "archeaxis/ui-evidence-review-1920",
    "ui-spatial-future": "archeaxis/ui-spatial-future-1920",
    "ui-capability-atlas": "archeaxis/ui-capability-atlas-1920",
    /* work-lab */
    "live-overview": "work-lab/live-overview-1440",
    "live-observer": "work-lab/live-observer-1440",
    "live-editor": "work-lab/live-editor-1440",
    "02": "work-lab/02-1440", "03": "work-lab/03-1440", "04": "work-lab/04-1440",
    "05": "design-lab/05-1440", "06": "work-lab/06-1440", "07": "work-lab/07-1440", "08": "work-lab/08-1440",
    "09": "work-lab/09-1440", "10": "work-lab/10-1440", "11": "work-lab/11-1440", "12": "work-lab/12-1440",
    /* design-lab */
    "live-dashboard": "design-lab/live-dashboard-1440",
    "live-preflight": "design-lab/live-preflight-1440",
    "live-workbench": "design-lab/live-workbench-1440",
    "aaos-hero": "labs/aaos-hero-2400",
    "aaos-b05-evidence-detail": "labs/aaos-b05-evidence-detail-1600",
    "work-lab-b05-execution-detail": "labs/work-lab-b05-execution-detail-1600",
    "aaos-01-capture": "labs/aaos-01-capture-1600",
    "aaos-02-evidence": "labs/aaos-02-evidence-1600",
    "aaos-03-originals": "labs/aaos-03-originals-1600",
    "aaos-04-human": "labs/aaos-04-human-1600",
    "aaos-05-workspace": "labs/aaos-05-workspace-1600",
    "aaos-06-memory": "labs/aaos-06-memory-1600",
    "work-lab-hero": "labs/work-lab-hero-2400",
    "work-lab-01-taskpacks": "labs/work-lab-01-taskpacks-1600",
    "work-lab-02-observer": "labs/work-lab-02-observer-1600",
    "work-lab-03-audit": "labs/work-lab-03-audit-1600",
    "work-lab-04-approvals": "labs/work-lab-04-approvals-1600",
    "design-lab-hero": "labs/design-lab-hero-2400",
    "design-lab-01-projects": "labs/design-lab-01-projects-1600",
    "design-lab-02-brand": "labs/design-lab-02-brand-1600",
    "design-lab-03-preflight": "labs/design-lab-03-preflight-1600",
    "design-lab-04-deliverables": "labs/design-lab-04-deliverables-1600",
    "design-lab-05-evidence": "labs/design-lab-05-evidence-1600",

    /* concepts —— 自拟概念案例（10 案包里的 6 个），全部 truth:"concept" */
    "nocturne-hero": "concepts/nocturne-hero",
    "nocturne-material": "concepts/nocturne-material",
    "nocturne-packaging": "concepts/nocturne-packaging",
    "field-index-hero": "concepts/field-index-hero",
    "field-index-map": "concepts/field-index-map",
    "field-index-spread": "concepts/field-index-spread",
    "tideline-hero": "concepts/tideline-hero",
    "tideline-campaign": "concepts/tideline-campaign",
    "tideline-poster-detail": "concepts/tideline-poster-detail",
    "kinetic-field-hero": "concepts/kinetic-field-hero",
    "kinetic-frame": "concepts/kinetic-frame",
    "kinetic-storyboard": "concepts/kinetic-storyboard",
    "form-study-hero": "concepts/form-study-hero",
    "form-study-detail": "concepts/form-study-detail",
    "form-study-material": "concepts/form-study-material",
    "after-hours-hero": "concepts/after-hours-hero",
    "after-hours-posters": "concepts/after-hours-posters",
    "after-hours-screen": "concepts/after-hours-screen"
  },
  /* 素材真实像素尺寸（由 assets/media 下的文件本身算出，勿手改）。
     渲染时用来给 <img> 补 width/height：槽位按图自身比例撑开，
     既不为凑比例裁掉内容，也不把小图拉大发光。 */
  IMGDIM: {
    "01": [1920, 1080],
    "02": [1440, 810],
    "03": [1440, 810],
    "04": [1440, 810],
    "05": [1440, 810],
    "06": [1440, 810],
    "07": [1440, 810],
    "08": [1440, 810],
    "09": [1440, 810],
    "10": [1440, 810],
    "11": [1440, 810],
    "12": [1440, 810],
    "aaos-01-capture": [1600, 900],
    "aaos-02-evidence": [1600, 900],
    "aaos-03-originals": [1600, 900],
    "aaos-04-human": [1600, 900],
    "aaos-05-workspace": [1600, 900],
    "aaos-06-memory": [1600, 900],
    "aaos-b05-evidence-detail": [1600, 900],
    "aaos-hero": [2400, 1350],
    "after-hours-hero": [1672, 941],
    "after-hours-posters": [1672, 941],
    "after-hours-screen": [1672, 941],
    "applications-left": [960, 441],
    "applications-right": [960, 441],
    "brand-application": [960, 720],
    "brand-essence": [960, 192],
    "brand-hero": [1920, 330],
    "brand-identity-board": [960, 720],
    "color-system": [800, 310],
    "construction": [420, 800],
    "construction-detail": [960, 720],
    "culture-wall-detail": [960, 540],
    "culture-wall-main": [960, 540],
    "culture-wall-night": [960, 540],
    "design-lab-01-projects": [1600, 900],
    "design-lab-02-brand": [1600, 900],
    "design-lab-03-preflight": [1600, 900],
    "design-lab-04-deliverables": [1600, 900],
    "design-lab-05-evidence": [1600, 900],
    "design-lab-hero": [2400, 1350],
    "field-index-hero": [1672, 941],
    "field-index-map": [1672, 941],
    "field-index-spread": [1672, 940],
    "form-study-detail": [1672, 941],
    "form-study-hero": [1672, 941],
    "form-study-material": [1672, 941],
    "graphic-language": [800, 520],
    "homepage-structure": [920, 730],
    "icon-system": [960, 178],
    "information-architecture": [1920, 339],
    "kinetic-field-hero": [1672, 941],
    "kinetic-frame": [1672, 941],
    "kinetic-storyboard": [1672, 941],
    "live-dashboard": [1440, 900],
    "live-editor": [1440, 945],
    "live-observer": [1440, 945],
    "live-overview": [1440, 945],
    "live-preflight": [1440, 900],
    "live-workbench": [1440, 3631],
    "logo-aaos": [1034, 1212],
    "logo-design-lab": [1091, 1065],
    "logo-variations": [540, 800],
    "logo-work-lab": [1138, 999],
    "material-board": [960, 720],
    "module-map": [750, 730],
    "naming": [960, 219],
    "navigation": [520, 730],
    "nocturne-hero": [1672, 941],
    "nocturne-material": [1672, 941],
    "nocturne-packaging": [1672, 941],
    "primary-logo": [460, 800],
    "tideline-campaign": [1672, 941],
    "tideline-hero": [1672, 941],
    "tideline-poster-detail": [1672, 941],
    "typography": [800, 530],
    "ui-capability-atlas": [1920, 1080],
    "ui-capture": [1920, 1080],
    "ui-capture-inbox": [530, 670],
    "ui-correction": [1920, 1080],
    "ui-evidence-library": [520, 670],
    "ui-evidence-review": [1920, 1080],
    "ui-human-learning": [610, 340],
    "ui-knowledge-object": [1920, 1080],
    "ui-library": [1920, 1080],
    "ui-machine": [1920, 1080],
    "ui-machine-learning": [610, 340],
    "ui-memory-map": [560, 540],
    "ui-originals": [520, 670],
    "ui-review": [1920, 1080],
    "ui-search-review": [580, 540],
    "ui-spatial-future": [1920, 1080],
    "ui-workspace": [960, 494],
    "wayfinding-system": [960, 720],
    "work-lab-01-taskpacks": [1600, 900],
    "work-lab-02-observer": [1600, 900],
    "work-lab-03-audit": [1600, 900],
    "work-lab-04-approvals": [1600, 900],
    "work-lab-b05-execution-detail": [1600, 900],
    "work-lab-hero": [2400, 1350]
  },
  M: function (key) {
    var f = this.FILES[key];
    if (!f) return "";
    return "assets/media/" + f + ".webp";
  }
};

/* 组合全项目列表：work + personal，统一 detail 入口 */
(function () {
  var all = [];
  /* 三个真实个人系统排在最前（01–03），概念案例随后（04–11）。
     编号由这里决定，改顺序就等于改案例编号，别在别处再排一次。 */
  DTS.personal.forEach(function (p) {
    all.push({
      id: p.slug, kind: "personal", title: p.name, titleEn: p.name, year: p.year,
      category: ["PERSONAL"], type: "Personal Project / AI & Systems", role: "个人爱好 · AI 能力展示",
      client: p.full, truth: "real", one: p.one, cover: p.cover,
      /* 这个投影是逐字段列出来的：源对象上加了新字段（比如标识 logo），
         不写在这里就会被静默丢掉，页面拿到的是没有这个键的对象。 */
      logo: p.logo, case: p.case,
      media: p.media || (p.interface || []).map(function (k) { return { kind: "full", src: k, cap: "", meta: "" }; }),
      narrative: { why: p.why, how: p.how, current: p.current, reflect: p.reflect },
      personal: true, status: p.status, flag: p.flag, tags: p.tags, full: p.full
    });
  });
  DTS.work.forEach(function (w) {
    all.push({
      id: w.slug, kind: "work", title: w.title, titleEn: w.titleEn, year: w.year,
      category: w.category, type: w.type, role: w.role, client: w.client,
      truth: w.truth, one: w.one, cover: w.cover, media: w.media,
      narrative: w.narrative || null, personal: false, status: null, flag: null
    });
  });
  DTS.all = all;
  DTS.byId = {};
  all.forEach(function (it) { DTS.byId[it.id] = it; });
})();
