/* ============================================================
   DT ALEX STUDIOS · 英文镜像文案层（与中文同口径的翻译，不改任何事实）
   依赖 js/data.js 的 window.DTS；在 data.js 之后加载。
   EN[slug]  = { one, why, how, current, reflect }
   CEN[中文说明] = 英文说明（跨项目复用）
   XEN[实验 slug] = 英文注记
   ============================================================ */
(function () {
  "use strict";
  var D = window.DTS;
  if (!D) return;

  D.EN = {
    "archeaxis-identity": {
      one: "A brand system for a knowledge platform: primary mark, colour, typography, graphic language and applications. Positioning — a local-first personal knowledge and Human–AI co-learning system.",
      why: "The brand needed a visible language for “local-first, two-way learning, content saved first, verification traceable” — not another template-like identity kit.",
      how: "An AA monogram inside a double orbit ring that stays legible at 16px; the primary Aurora Teal sits at lightness 0.742 and dark scenes rest on Deep Space at 0.09; derived colours are generated with color-mix; one graphic language runs through type, icons and every application.",
      current: "A complete brand language covering web, documents, space and interface (Ongoing, evolving with the product).",
      reflect: "Given the same start I would settle the information architecture before touching the visuals — visual languages change fast, architectures change slowly."
    },
    "nebula-culture-wall": {
      one: "A full set of spatial graphics for a corporate lobby culture wall: main wall, night lighting, construction node and material board, held together by one graphic language.",
      why: "I wanted to test whether a brand’s graphic language still holds once it leaves the flat plane and enters space and material — an exercise in scale, light and material.",
      how: "3D concept renders anchored on the main wall: daytime key visual, night lighting, wall detail, material board and construction node; the same angled cut becomes the signage outline and the icon notch — the medium changes, the grammar does not.",
      current: "Concept and rendering direction (not a built commission), kept as a spatial-graphics capability exercise.",
      reflect: "I would bring construction, material and lighting constraints into the renders earlier, so the concept starts from buildability."
    },
    "archeaxis-editorial": {
      one: "Layout studies from before and after the brand settled: naming, essence, construction logic and homepage structure, all worked out on a single grid.",
      why: "Before the brand existed, three questions had to be answered: what is it called, what does it believe, and where does its layout come from.",
      how: "Naming → essence → construction logic → product information architecture → module map → navigation and homepage structure, all resting on the same 8-column grid and one baseline axis; content changes, the skeleton does not.",
      current: "Kept as part of the brand design process (Ongoing).",
      reflect: "I would open this kind of working-out up earlier — the process says more about design judgement than the outcome does."
    },
    "archeaxis-site": {
      one: "A ten-page product site: light narrative chapters alternating with dark product scenes, with motion kept to a single scroll story.",
      why: "The product is conceptually dense, so the site’s job is to make someone who reaches the third screen know what this is.",
      how: "One idea per screen: light chapters carry the narrative, dark scenes carry the product; motion is reduced to a single scroll story; the pages are real and openable, including the live evidence-review page.",
      current: "Ten pages implemented and iterating with the product (Ongoing).",
      reflect: "I would give each dark scene a quieter way in — not every visitor starts at the first screen of the story."
    },
    "nebula-wayfinding": {
      one: "Extending the wall’s graphic language to signage, identity boards and office space, to test whether it still holds at small scale and low contrast.",
      why: "Once the main wall worked, the next question was whether the language is still recognisable at small scale, low contrast and viewing distance.",
      how: "The angled cut becomes the signage outline, the identity-board frame and the icon notch, extended across the wayfinding system, identity boards and material board — one language, different media.",
      current: "Concept direction (not a client commission, Ongoing).",
      reflect: "I would produce a 1:1 physical sample before the renders — the gap between small-format print and screen rendering is the hardest thing to lie to yourself about at concept stage."
    },
    "aaos": {
      one: "A local-first personal knowledge and Human–AI co-learning system: multi-format content, research, human learning and AI assets in one base — saved first, verified traceably.",
      why: "The longer I use AI, the more documents, chats and research pile up — and the one line that actually mattered gets hard to find again. Change tools once and the history breaks. So I built my own knowledge system instead of adding another tool.",
      how: "Content is saved first — originals, hypotheses, drafts and AI-generated material may all stay; fidelity verification and professional analysis are recorded separately and run on demand. Six spaces, fifty entry points, sixteen capability families, and every answer carries a traceable evidence chain. Machine learning does not train foundation models; candidate content never becomes trusted fact automatically.",
      current: "The interface and information structure are usable (Ongoing). Next: complete the local identification loop for multi-format content (OCR / ASR / frame extraction), so human–machine co-learning moves from candidates to governed assets.",
      reflect: "I would design verification as a first-class citizen rather than a later step — it should happen at the same moment as saving."
    },
    "work-lab": {
      one: "A client-neutral personal AI workflow governance, control and delivery system: one consistent set of rules, tasks, permissions and acceptance criteria across native clients, with completion judged by real receipts.",
      why: "Different agent clients each manage their own rules, skills and memory, so capability declarations repeat and drift; change a client and the rules and acceptance criteria are lost once more. What I wanted to keep is the portability of working method: software, models and providers can be replaced, method does not disappear with a brand.",
      how: "Tasks run as auditable task packs — single-writer intake, read-only parallel audit, a delivery gate, and completion decided by real receipts. The observation panel puts tasks, execution, approval, audit and cost on one screen across twenty-two read-only views, writing UNKNOWN where data is missing instead of patching curves with zeros.",
      current: "The control plane and observation panel are in place (Ongoing). Next: finish the approval loop, failure recovery and release gates — from visible to controllable; new clients connect through the same adapter contract.",
      reflect: "I would define the evidence of “done” before talking about automation — automation without receipts only amplifies mistakes."
    },
    "design-lab": {
      one: "An AI-native, platform-neutral, host-native professional visual design system: methods, quality, rights, preflight and editable delivery organised into a readable, recoverable design loop.",
      why: "In one day I switch between reference, generation, layout, revision and export a dozen times. The problem is not a shortage of tools but that they do not talk to each other — and nobody remembers what judgement was made or why it changed. I wanted my professional judgement and reusable production capability to stay in my own hands.",
      how: "Imported references are read back from the server for preview; every step from Brief to Direction to DesignSystem is stored as a traceable version chain, and concurrent submissions are blocked rather than silently overwritten. Preflight only probes and reports — it installs nothing and changes no environment. Editable delivery ships with a BOM, a version and a recovery path. Evidence tiers E0–E5 are wired in.",
      current: "The workbench and version chain are usable (Ongoing). Next: collect highly rated design capabilities along the October mainline, classify and neutralise them into a Design Capability Library, and refine preflight so delivery problems surface during design.",
      reflect: "I would write rights layering into the data model earlier — the ethics of a design system show up before its efficiency does."
    },
    "nocturne": {
      one: "A self-initiated identity and packaging system for an independent fragrance brand: mineral texture and restrained negative space to express night, rather than layered storytelling.",
      why: "Fragrance brands habitually stack narrative. I wanted to try the opposite: let it arrive slowly through material, proportion and detail, like night air.",
      how: "Smoked glass, rock face and a silver arc form the master motif. Bottle proportions stay restrained, packaging structure emphasises touch and negative space, then extends into still-life photography and a digital storefront.",
      current: "A complete self-initiated concept: identity, packaging, material and digital storefront share one language (not a client commission, never commercially released).",
      reflect: "If this material language met a real product, the first thing to prove would be shipping and shelf lighting — not whether the frame looks good."
    },
    "field-index": {
      one: "Field notes on how city plants adapt, translated into a readable visual archive and publication.",
      why: "How plants survive in the seams of a city is a good question on its own. The hard part is connecting observation, maps and imagery into a reading path on paper.",
      how: "Catalogue numbers, grids, magnified leaf-vein texture and map slices act as editorial cues. Double-page spreads leave quiet passages so data pages, image pages and short narrative alternate.",
      current: "A complete self-initiated editorial concept: cover, specimen spreads, sampling map and online index share one numbering rule.",
      reflect: "An online index most easily becomes a gallery that looks good but cannot be searched. The numbering only earns its keep if it leads back to the street."
    },
    "tideline": {
      one: "A self-initiated ocean-conservation poster series: three panels assemble tide and fish shape, switching between single reading and whole.",
      why: "How is a sense of safety eroded in the ocean, one degree at a time? A poster set has to stand alone and still combine into one argument.",
      how: "Fractured water lines form the spanning master graphic, with signal red placed as alert points. Titles and information run on a stable grid so the series stays consistent while each sheet holds on its own.",
      current: "A complete self-initiated concept: high tide, backflow and flat sea as a triptych, plus digital crops and an exhibition wall sequence.",
      reflect: "Unrelated to any existing event or brand. This subject slides easily into stock-illustration feel, so every shape has to come from the same fracture rule."
    },
    "kinetic-field": {
      one: "Type inside a grid treated as objects with weight, speed and resistance: four beats of acceleration, collision, rebound and return.",
      why: "If letterforms are not information pasted onto the frame but things that take force, collide, pause and release — how does reading rhythm change?",
      how: "Baseline and margins are fixed; a limited palette separates motion layers. Momentum is built from acceleration, collision and rebound, and still frames keep a clear hierarchy and direction.",
      current: "A study presented as a storyboard and key frames (not rendered as a playable film).",
      reflect: "Motion studies most often survive as nothing but pretty key frames. Once the beats are actually defined, a still frame can count as evidence."
    },
    "form-study": {
      one: "One continuous fold of a single material forms seat and support: a lightness study in cold metal and deep-blue translucent.",
      why: "Getting stable support and visual lightness out of one continuous folded surface is the boundary this study pushes against.",
      how: "A three-quarter view carries the main render, supported by material close-ups, an outline drawing and an exploded structure view, so the structure itself is the subject.",
      current: "Concept expression: main render, material close-up and structural views (no engineering validation or mass production claimed).",
      reflect: "The moment this reads as ready for production it overstates the work. These images support conclusions about form and material only."
    },
    "after-hours": {
      one: "A self-initiated night arts festival: cold urban light bands stitch together different ways of looking after dark.",
      why: "Night is not only an operating hour. It can also be another kind of shared urban space.",
      how: "Cold light bands, urban corridors and a vertical frame build the key visual. Red appears only as a sparse rhythmic mark; posters, ticket faces and venue screens share one grid and title zone.",
      current: "A complete self-initiated event identity: key visual, poster family, mobile ticket and venue screens (not a real festival or commission).",
      reflect: "Night-time material collapses into glare easily. Red is deliberately limited to a change marker so the light bands still read in layers."
    }
  };

  /* 名称 / 角色 / 客户（详情页概览栏使用）——合并进上面的 EN，避免重复键覆盖 */
  (function () {
    var EXTRA = {
      "aaos": { full: "ArcheAxis Knowledge", role: "Hobby · AI capability" },
      "work-lab": { full: "Workflow Lab", role: "Hobby · AI capability" },
      "design-lab": { full: "Visual Design Lab", role: "Hobby · AI capability" },
      "nebula-culture-wall": { client: "Self-initiated concept (not a client commission)" },
      "nebula-wayfinding": { client: "Self-initiated concept (not a client commission)" },
      /* 概念案例的 role 是中文，EN 模式必须有镜像，否则详情页概览栏会漏中文 */
      "nocturne": { role: "Self-initiated concept · Brand / Visual direction" },
      "field-index": { role: "Self-initiated concept · Editorial design / photography" },
      "tideline": { role: "Self-initiated concept · Poster / graphic" },
      "kinetic-field": { role: "Self-initiated concept · Motion / creative coding" },
      "form-study": { role: "Self-initiated concept · 3D visualisation / material study" },
      "after-hours": { role: "Self-initiated concept · Event identity / art direction" }
    };
    Object.keys(EXTRA).forEach(function (k) {
      if (!D.EN[k]) D.EN[k] = {};
      Object.keys(EXTRA[k]).forEach(function (f) { D.EN[k][f] = EXTRA[k][f]; });
    });
  })();

  /* 中文说明 → 英文说明 */
  D.CEN = {
    "主标志 · AA 组合": "Primary mark · AA monogram",
    "标志变体": "Logo variations",
    "色彩系统": "Colour system",
    "品牌应用 · 名片 / 海报 / 网页": "Applications · card / poster / web",
    "字体系统": "Typography system",
    "图形语言": "Graphic language",
    "图标系统": "Icon system",
    "构成逻辑": "Construction logic",
    "品牌应用 · 延展": "Applications · rollout",
    "品牌应用": "Applications",
    "名称解读": "Naming",
    "品牌内核": "Brand essence",
    "产品信息架构": "Product information architecture",
    "模块地图": "Module map",
    "名称与构成": "Naming and composition",
    "信息架构": "Information architecture",
    "捕获入口": "Capture entry",
    "机器学习视图": "Machine-learning view",
    "空间化未来": "Spatial future",
    "证据复核": "Evidence review",
    "识别板": "Identity board",
    "导航结构": "Navigation structure",
    "首页结构": "Homepage structure",
    "主墙面 · 日间": "Main wall · daytime",
    "夜景照明": "Night lighting",
    "墙面细节": "Wall detail",
    "材料板": "Material board",
    "施工节点": "Construction node",
    "品牌识别板": "Identity board",
    "导视系统": "Wayfinding system",
    "捕获 · 产品画面": "Capture · product view",
    "知识对象": "Knowledge object",
    "机器学习": "Machine learning",
    "资料库": "Library",
    "复核": "Review",
    "AI 纠错": "AI correction",
    "空间前瞻": "Spatial future",
    "证据复核 · 页面实装": "Evidence review · shipped page",
    "界面": "Interface",
    "主界面": "Main interface",
    "内容先保存／捕获入口": "Save first / capture entry",
    "资料与证据浏览": "Browsing material and evidence",
    "证据详情／后续核验": "Evidence detail / later verification",
    "人的学习": "Human learning",
    "工作区": "Workspace",
    "知识关联": "Knowledge links",
    "任务包": "Task packs",
    "Observer 只读观察": "Observer, read-only",
    "审计追踪": "Audit trail",
    "执行与回执展示": "Execution and receipts",
    "项目上下文": "Project context",
    "设计系统": "Design system",
    "生产预检": "Production preflight",
    "可编辑交付": "Editable delivery",
    "证据展示": "Evidence view",
    "产品总览": "Product overview",
    "治理总览": "Governance overview",
    "设计项目总览": "Design project overview",
    "捕获入口 · 内容先保存": "Capture entry — content saved first",
    "证据库 · 资料与来源浏览": "Evidence library — material and provenance",
    "原创编辑 · 想法先落地": "Originals editor — ideas land first",
    "人类学习 · 路线与复习": "Human learning — paths and review",
    "工作区 · 项目与上下文": "Workspace — projects and context",
    "记忆地图 · 知识关联": "Memory map — knowledge links",
    "任务包 · 可审计交接": "Task packs — auditable handoff",
    "观察者 · 严格只读": "Observer — strictly read-only",
    "审计追踪 · 每步留痕": "Audit trail — every step recorded",
    "审批中心 · 高风险确认点": "Approvals — confirmation points for risky actions",
    "项目上下文 · 单一工作台": "Project context — one workbench",
    "品牌系统 · 可编辑对象": "Brand system — editable objects",
    "生产预检 · 只探测与报告": "Production preflight — probes and reports only",
    "交付中心 · BOM 与恢复路径": "Delivery centre — BOM and recovery path",
    "证据系统 · E0–E5 分级": "Evidence system — tiers E0–E5",
    "设计稿 · 示例数据": "Specimen · sample data",
    /* 概念案例图注 */
    "包装静物": "Packaging still life",
    "烟熏玻璃与岩面": "Smoked glass and rock face",
    "标本跨页": "Specimen spread",
    "采样地图": "Sampling map",
    "单张构图细节": "Single-sheet composition detail",
    "活动长图": "Campaign long image",
    "节奏分镜": "Motion storyboard",
    "关键帧": "Key frame",
    "折边与半透明坐面": "Folded edge and translucent seat",
    "材质细节": "Material detail",
    "海报与票面": "Posters and ticket faces",
    "现场屏幕": "Venue screens"
  };

  D.XEN = {
    "graphic-language": "Orbit, constellation, flow, layering — four motifs",
    "material-board": "Reflectance and roughness comparison",
    "type-scale": "Six type levels pressed onto one grid",
    "space-future": "Turning knowledge into a room you can walk into",
    "capability-atlas": "A map of sixteen capability families",
    "signal-map": "Agent, task pack and workflow relationships",
    "preflight": "Stopping problems before export",
    "construction": "Baseline axis and eight-column grid",
    "application-sheet": "One language, different media",
    "placeholder-ai-image": "Replace with real work",
    "placeholder-shader": "Replace with real work",
    "placeholder-video": "Replace with real work"
  };

  /* 实验标题英文 */
  D.XTEN = {
    "graphic-language": "Graphic Language Study",
    "material-board": "Material Board",
    "type-scale": "Type Scale",
    "space-future": "Spatial Future",
    "capability-atlas": "Capability Atlas",
    "signal-map": "Radial Signal Map",
    "preflight": "Delivery Preflight",
    "construction": "Construction Study",
    "application-sheet": "Application Sheet",
    "placeholder-ai-image": "AI Image Study",
    "placeholder-shader": "Shader Study",
    "placeholder-video": "Video Fragment"
  };

  D.ABOUTEN = {
    line: "I am DT ALEX, working mainly in graphic and visual design.",
    body: [
      "Day-to-day work covers brand, graphic, spatial and part of digital design.",
      "Outside work I study 3D, motion imagery, software, AI and programming, and keep building my own projects.",
      "DT ALEX STUDIOS is where the work and the experiments are kept."
    ],
    cert: "Full-Media Operations Certificate (self-studied and earned)",
    traits: "Quiet, careful, accountable; comfortable collaborating, with some experience leading, managing and training; strong professional ethics."
  };

  D.NOTEEN = "Email coming soon — reach me through the links below";
  D.LOCEN = "China · Langfang";
})();
