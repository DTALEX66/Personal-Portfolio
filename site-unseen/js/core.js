/* ============================================================
   DT ALEX STUDIOS · core.js
   进入门 / 光标 / 全屏菜单 / Index 模式 / 页面转场 / 声音 / 揭示
   ============================================================ */
(function () {
  "use strict";
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = window.matchMedia("(pointer: fine)").matches;
  var D = window.DTS;

  /* ---------------- 中英切换（配对 span，与旧站同一机制） ---------------- */
  var Lang = (function () {
    var KEY = "dt-lang", lang = "zh";
    try { lang = localStorage.getItem(KEY) || "zh"; } catch (e) {}
    if (lang !== "en") lang = "zh";
    function apply() {
      document.documentElement.setAttribute("data-lang", lang);
      document.documentElement.setAttribute("lang", lang === "en" ? "en" : "zh-CN");
      var bs = document.querySelectorAll("[data-lang-btn]");
      for (var i = 0; i < bs.length; i++)
        bs[i].setAttribute("aria-pressed", bs[i].getAttribute("data-lang-btn") === lang ? "true" : "false");
    }
    function set(next) {
      lang = next === "en" ? "en" : "zh";
      try { localStorage.setItem(KEY, lang); } catch (e) {}
      apply();
      document.dispatchEvent(new CustomEvent("dt:lang", { detail: { lang: lang } }));
    }
    return {
      get v() { return lang; },
      set: set, apply: apply,
      /* 成对 span：用于 HTML 注入；两侧同文时只出一份，避免重复文本 */
      t: function (zh, en) {
        if (!en || en === zh) return zh;
        return '<span class="t-zh">' + zh + '</span><span class="t-en">' + en + "</span>";
      },
      /* 纯文本取值：用于 textContent / aria-label */
      pick: function (zh, en) { return lang === "en" && en ? en : zh; }
    };
  })();
  window.DT_LANG = Lang;

  /* ---------------- sound (Web Audio, 默认关) ---------------- */
  var Sound = (function () {
    var ctx = null, on = false;
    function ensure() {
      if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } }
      return ctx;
    }
    function blip(freq, dur, vol) {
      if (!on || !ctx) return;
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur);
    }
    return {
      get on() { return on; },
      toggle: function () { on = !on; if (on) ensure(); return on; },
      set: function (v) { on = v; if (on) ensure(); return on; },
      click: function () { blip(660, 0.08, 0.05); },
      enter: function () {
        blip(392, 0.35, 0.05); setTimeout(function () { blip(523, 0.3, 0.05); }, 140);
        setTimeout(function () { blip(659, 0.45, 0.05); }, 300);
      }
    };
  })();
  window.DT_SOUND = Sound;

  /* ---------------- image fallback (web/assets/media 带尺寸后缀) ---------------- */
  var FALLBACK = ["-1920", "-1440", "-960", "-480", "-420", "-460"];
  document.addEventListener(
    "error",
    function (e) {
      var t = e.target;
      if (!t || t.tagName !== "IMG") return;
      var src = t.getAttribute("src") || "";
      var m = src.match(/^(.*?)(?:-(\d+))?\.webp$/);
      if (!m) return;
      var base = m[1];
      /* 刚失败的那个后缀不要再排进队列：原先从 FALLBACK[0] 起排，主图本身就是
         -1920 时会把同一个 404 地址再请求一遍才换尺寸。 */
      var bad = m[2] ? "-" + m[2] : "";
      var order = FALLBACK.filter(function (s) { return s !== bad; });
      var tried = (parseInt(t.dataset.tried || "-1", 10) + 1);
      t.dataset.tried = tried;
      if (tried < order.length) {
        t.src = base + order[tried] + ".webp";
      } else {
        t.style.display = "none";
      }
    },
    true
  );

  /* ---------------- helpers ---------------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function coverOf(it) {
    return it && it.cover ? D.M(it.cover) : "";
  }
  /* 素材真实尺寸按解析后的路径索引：调用方拿到的就是 D.M(key) 的结果，
     不改所有调用点也能补上 width/height。 */
  var DIM_BY_PATH = (function () {
    var m = {}, dim = (D && D.IMGDIM) || {};
    Object.keys(dim).forEach(function (k) {
      var p = D.M(k);
      if (p) m[p] = dim[k];
    });
    return m;
  })();
  function imgHtml(src, alt) {
    if (!src) return "";
    var d = DIM_BY_PATH[src];
    /* width/height 让浏览器在解码前就按真实比例留好盒子：不预留会在图片
       到位瞬间把下方内容顶一下（漂移）。max-width 卡在自身像素宽：
       小图被拉满整栏会发虚，宁可留白居中也不放大。 */
    if (!d) return '<img src="' + src + '" alt="' + (alt || "") + '" loading="lazy" />';
    return '<img class="fit" src="' + src + '" alt="' + (alt || "") + '"' +
      ' width="' + d[0] + '" height="' + d[1] + '" loading="lazy" />';
  }
  function flagLabel(it) {
    /* 空态作品位：不编造项目名/客户/数据，只说明这里等真实作品。中英各一份。 */
    if (it.truth === "placeholder") return Lang.t("待补真实作品", "Slot awaiting real work");
    if (it.personal) return Lang.t("AI 能力展示 · Ongoing", "AI & Systems · Ongoing");
    if (it.truth === "concept") return Lang.t("自定概念", "Concept");
    return it.status || "Ongoing";
  }
  /* 中文说明句 → 配对 span（查 en-copy.js 的 CEN 表） */
  function cap(zh) { return Lang.t(zh, (D.CEN || {})[zh] || ""); }
  /* 条目字段 → 配对 span（查 en-copy.js 的 EN 表：one / why / how / current / reflect / full / role / client）
     叙事字段存放在 it.narrative 下，需回退查找；中文源文缺失时不得只留英文。 */
  function enOf(it, key) {
    var zh = it[key];
    if (zh == null && it.narrative) zh = it.narrative[key];
    zh = zh == null ? "" : zh;
    var e = (D.EN || {})[it.id || it.slug] || {};
    var en = e[key] || "";
    if (!zh) return en;
    return Lang.t(zh, en);
  }
  /* 详情入口：三个自研系统的主详情是交付的完整案例页（cases/…），
     其余案例仍走统一渲染器。写在一处，列表 / 球体 / 索引层 / 上下篇同一口径。 */
  function detailHref(it) {
    return it.case || ("project.html?id=" + (it.id || it.slug));
  }
  /* 项目标题：三个自研系统对外一律用全称——短代号只在内部使用。
     全称在 en-copy 里有英文配对，所以走 enOf（成对 span），不能塞裸中文字符串。 */
  function titleOf(it) {
    if (it.personal && it.full) return enOf(it, "full");
    return Lang.t(it.title, it.titleEn || it.title);
  }
  /* 给页面用的反查：解析后的路径 -> [宽, 高]。
     贴图卡片要按图自身比例摆，不能让 JS 猜一个 1.6。 */
  function imgDim(src) {
    var d = src && DIM_BY_PATH[src];
    return d ? { w: d[0], h: d[1], ar: d[0] / d[1] } : null;
  }

  window.DT = { $: $, $$: $$, coverOf: coverOf, imgHtml: imgHtml, imgDim: imgDim,
    flagLabel: flagLabel, titleOf: titleOf, detailHref: detailHref,
    REDUCED: REDUCED, FINE: FINE, L: Lang, cap: cap, enOf: enOf, replayGate: replayGate, rollify: rollify,
    paperTilt: paperTilt };

  /* ---------------- enter gate ---------------- */
  function buildGate() {
    if ($(".gate")) return;
    var g = document.createElement("div");
    g.className = "gate";
    /* 参考站门构图：自有标志 + 小号全大写品牌 + 三行居中描述 + 单个胶囊 Enter + 底部下划线静音进入 */
    g.innerHTML =
      '<div class="gate__top">' + langSwitch() + "</div>" +
      '<div class="gate__inner">' +
        '<svg class="gate__mark" viewBox="0 0 96 96" role="img" aria-label="DT ALEX STUDIOS">' +
          '<rect x="4" y="4" width="88" height="88" rx="20" fill="#E7B5A4"/>' +
          '<circle cx="48" cy="48" r="34" fill="none" stroke="#170F0C" stroke-width="1.4" opacity=".32"/>' +
          '<circle cx="48" cy="48" r="41" fill="none" stroke="#F2EEE9" stroke-width="1" opacity=".28" stroke-dasharray="4 7"/>' +
          '<text x="48" y="57" text-anchor="middle" font-family="Albert Sans,Helvetica,Arial,sans-serif" font-size="30" font-weight="700" fill="#170F0C" letter-spacing="1">AA</text>' +
        "</svg>" +
        '<div class="gtitle">' + D.opening.title + "</div>" +
        '<p class="gsub">' + Lang.t("一个平面与视觉设计师的个人作品集。品牌、空间、动态与数字，以及三个做到一半的系统。",
                                   "A personal portfolio by a graphic &amp; visual designer. Brand, space, motion and digital — plus three systems still in progress.") + "</p>" +
        '<button class="pill pill--solid gate__enter" data-enter="sound">' + Lang.pick("进入", "Enter") + ' <span class="pill__ic">↘</span></button>' +
      "</div>" +
      '<div class="gate__bottom">' +
        '<button class="quietlink" data-enter="silent">' + Lang.pick("静音进入", "Enter without audio") + "</button>" +
      "</div>";
    document.body.appendChild(g);
    $$("[data-lang-btn]", g).forEach(function (b) {
      b.addEventListener("click", function (e) { e.stopPropagation(); Lang.set(b.getAttribute("data-lang-btn")); });
    });
    requestAnimationFrame(function () { g.classList.add("in"); });
    g.addEventListener("click", function (e) {
      var t = e.target.closest("[data-enter]");
      if (!t) return;
      if (t.getAttribute("data-enter") === "sound") Sound.set(true);
      Sound.enter();
      sessionStorage.setItem("dt-entered", "1");
      g.classList.add("leave");
      setTimeout(function () { g.remove(); }, 1100);
    });
    var sb = $("[data-sound]", g);
    if (sb) sb.addEventListener("click", function (e) {
      e.stopPropagation();
      var on = Sound.toggle();
      sb.innerHTML = Lang.t(on ? "声音：开" : "声音：关", on ? "Sound: on" : "Sound: off");
      Sound.click();
    });
  }
  function maybeGate() {
    if (sessionStorage.getItem("dt-entered")) return;
    preloadThen(buildGate);
  }

  /* 预加载：进度取真实资源完成数，不编造百分比。
     页面把关键素材清单写到 window.DT_PRELOAD；没有清单 / 降低动效 / 已进过门，都直接放行。
     4s 硬兜底，加载卡住也绝不能把人挡在门外。 */
  function preloadThen(done) {
    var urls = (window.DT_PRELOAD || []).filter(Boolean);
    if (!urls.length || REDUCED) { done(); return; }
    var pre = document.createElement("div");
    pre.className = "pre";
    pre.setAttribute("role", "status");
    pre.setAttribute("aria-label", "Loading");
    pre.innerHTML =
      '<svg class="pre__mark" viewBox="0 0 96 96" aria-hidden="true">' +
        '<rect x="4" y="4" width="88" height="88" rx="20" fill="#E7B5A4"/>' +
        '<circle cx="48" cy="48" r="34" fill="none" stroke="#170F0C" stroke-width="1.4" opacity=".32"/>' +
        '<text x="48" y="57" text-anchor="middle" font-family="Albert Sans,Helvetica,Arial,sans-serif" font-size="30" font-weight="700" fill="#170F0C">AA</text>' +
      "</svg>" +
      '<div class="pre__bar"><i class="pre__fill"></i></div>' +
      '<div class="pre__pct">0%</div>';
    document.body.appendChild(pre);
    var fill = pre.querySelector(".pre__fill"), pct = pre.querySelector(".pre__pct");
    var got = 0, settled = false;
    function advance() {
      got++;
      var k = got / urls.length;
      fill.style.transform = "scaleX(" + k.toFixed(3) + ")";
      pct.textContent = Math.round(k * 100) + "%";
      if (got >= urls.length) finish();
    }
    function finish() {
      if (settled) return;
      settled = true;
      pre.classList.add("out");
      setTimeout(function () { pre.remove(); done(); }, 1000);   // .5s delay + .5s 退场
    }
    urls.forEach(function (u) {
      var im = new Image();
      im.onload = advance; im.onerror = advance;
      im.src = u;
    });
    setTimeout(finish, 4000);
  }
  /* 给媒体图加四片遮罩，靠 .in 播两段式擦除。
     遮罩默认是盖住的，所以必须兜底：观察器万一没触发（比如容器过高、
     阈值永远达不到），图片也不能永久被挡住——3s 后强制揭示。 */
  function wipeify() {
    var targets = $$(".dmedia .mi");
    targets.forEach(function (el) {
      if (el.querySelector(".mwipe")) return;
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      var m = document.createElement("div");
      m.className = "mwipe";
      m.setAttribute("aria-hidden", "true");
      m.innerHTML = "<i></i><i></i><i></i><i></i>";
      el.appendChild(m);
      el.setAttribute("data-reveal", "");
    });
    if (REDUCED || !targets.length) return;
    setTimeout(function () {
      targets.forEach(function (el) { el.classList.add("in"); });
    }, 3000);
  }

  /* 把可点击文案换成可反向的滚动层。只处理纯文本节点与 t-zh/t-en 语言 span，
     跳过箭头图标（.pill__ic）；用 dataset.rolled 保证重复调用安全。 */
  function rollify(root) {
    $$(".pill, .swcta, .ppcta, .btn, .quietlink", root || document).forEach(function (el) {
      if (el.dataset.rolled) return;
      el.dataset.rolled = "1";
      /* 描边按钮补四条边条，供 hover 分段擦除（CSS 只动 transform/opacity） */
      if (el.classList.contains("pill") || el.classList.contains("btn")) {
        var frag = document.createElement("span");
        frag.setAttribute("aria-hidden", "true");
        frag.innerHTML = '<i class="bl bl-t"></i><i class="bl bl-r"></i><i class="bl bl-b"></i><i class="bl bl-l"></i>';
        while (frag.firstChild) el.appendChild(frag.firstChild);
      }
      Array.prototype.slice.call(el.childNodes).forEach(function (n) {
        if (n.nodeType === 3 && n.textContent.trim()) {
          var s = document.createElement("span");
          s.innerHTML = roll(n.textContent);
          n.parentNode.replaceChild(s, n);
        } else if (n.nodeType === 1 && /^(t-zh|t-en)$/.test(String(n.className))) {
          n.innerHTML = roll(n.textContent);
        }
      });
    });
  }

  /* 结束页要能循环回开屏：清掉本次会话的进入标记，重新起门并播入场动画 */
  function replayGate() {
    try { sessionStorage.removeItem("dt-entered"); } catch (e) {}
    scrollTo(0, 0);
    buildGate();
  }

  /* ---------------- cursor ---------------- */
  function buildCursor() {
    if (!FINE || REDUCED || $(".curdot")) return;
    var dot = document.createElement("div"); dot.className = "curdot";
    var ring = document.createElement("div"); ring.className = "curring";
    document.body.appendChild(dot); document.body.appendChild(ring);
    /* 点必须一写就落在屏外：不写初始 transform 时它停在 CSS 给的 (0,0)，
       那是左上角一颗约 2.5px 的亮墨点，在鼠标第一次移动之前每屏都挂着。
       下面 x/y 本来就初始化在 -100，元素也得从同一个地方出发。 */
    dot.style.transform = "translate(-100px,-100px) translate(-50%,-50%)";
    document.documentElement.classList.add("has-cursor");
    var x = -100, y = -100, rx = -100, ry = -100;
    /* 参考站实测：内环按下时 scale 1 → 0.8（101px 收到 81px）。
       环的位置/缩放都走 lerp，所以需要一个循环；点用即时跟随，保持"准"。 */
    var press = false, s = 1, ts = 1;
    window.addEventListener("mousemove", function (e) {
      x = e.clientX; y = e.clientY;
      dot.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%)";
    });
    addEventListener("pointerdown", function () { press = true; ts = 0.8; });
    addEventListener("pointerup", function () { press = false; ts = 1; });
    addEventListener("pointercancel", function () { press = false; ts = 1; });
    (function follow() {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      s += (ts - s) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%) scale(" + s.toFixed(3) + ")";
      requestAnimationFrame(follow);
    })();
    function setLabel(label, on) {
      if (!on) { ring.className = "curring"; ring.textContent = ""; return; }
      ring.className = "curring label";
      ring.textContent = label;
    }
    document.addEventListener("mouseover", function (e) {
      var t = e.target.closest("a,button,[data-hover]");
      ring.classList.add("on");
      if (t) {
        var lbl = t.getAttribute("data-hover") || "";
        if (t.closest("[data-drag]")) lbl = "DRAG";
        else if (t.closest(".pcard, .switem, .pp, .irow, .lab")) lbl = "VIEW";
        setLabel(lbl, !!lbl);
      } else setLabel("", false);
    });
    document.addEventListener("mouseout", function () { setLabel("", false); ring.classList.remove("on"); });
  }

  /* 逐字母滚换标签（参考站手法：字母逐个成 span，标签重复两份，hover 上滚） */
  function roll(text) {
    var one = text.split("").map(function (ch) {
      return "<i>" + (ch === " " ? "&nbsp;" : ch) + "</i>";
    }).join("");
    return '<span class="roll"><span class="roll__set">' + one + '</span><span class="roll__set" aria-hidden="true">' + one + "</span></span>";
  }

  /* ---------------- topbar / menu ---------------- */
  function langSwitch() {
    var on = Lang.v;
    return '<span class="langsw" role="group" aria-label="Language / 语言">' +
      '<button type="button" data-lang-btn="zh" aria-pressed="' + (on === "zh") + '">中</button>' +
      '<button type="button" data-lang-btn="en" aria-pressed="' + (on === "en") + '">EN</button></span>';
  }
  /* 暗色主题下顶栏的圆钮是亮底深点，才压得住深场；全屏菜单和索引层打开后
     底就是页面底色，这时圆钮换成描边空心。两个层可能同时开着，
     所以按"有没有开"统一算，不在各处分别 toggle。 */
  function syncOverlay() {
    document.body.classList.toggle("overlay-open", !!$(".menu.open, .indexmode.open"));
  }

  function buildTopbar() {
    var old = $(".topbar");
    if (old) old.remove();
    /* 参考站顶栏没有编号：编号只出现在全屏菜单的 90px 大字上。
       顶栏右侧只有文字链接 + 一个 53×53 圆形菜单按钮；声音开关在左下角。 */
    var navHtml = D.nav.map(function (n) {
      return '<a class="navbtn' + (location.pathname.indexOf(n.href) > -1 ? " on" : "") + '" href="' + n.href + '">' +
        roll(Lang.pick(n.zh, n.en)) + "</a>";
    }).join("");
    var tb = document.createElement("header");
    tb.className = "topbar";
    tb.innerHTML =
      '<a class="logo" href="index.html">DT ALEX <em>Studios</em></a>' +
      '<div class="right">' + navHtml +
      '<button class="dotbtn" data-menu-toggle aria-expanded="false" aria-label="' + Lang.pick("菜单", "Menu") + '"><i></i><i></i></button>' +
      langSwitch() +
      "</div>";
    document.body.prepend(tb);
    $$("[data-lang-btn]", tb).forEach(function (b) {
      b.addEventListener("click", function () { Lang.set(b.getAttribute("data-lang-btn")); Sound.click(); });
    });
    $("[data-menu-toggle]", tb).addEventListener("click", function () {
      var m = $(".menu"); if (!m) return;
      var open = m.classList.toggle("open");
      m.setAttribute("aria-hidden", !open);
      this.setAttribute("aria-expanded", open);
      syncOverlay();
      Sound.click();
    });
    /* 顶栏会随语言切换重建，新按钮默认 aria-expanded=false；
       如果菜单其实开着，得把状态补回来，否则关闭态样式和真实状态不一致。 */
    var mm = $(".menu");
    if (mm && mm.classList.contains("open"))
      $("[data-menu-toggle]", tb).setAttribute("aria-expanded", "true");
    syncOverlay();
    buildSoundBtn();
  }

  /* 左下角 53×53 圆形声音开关（参考站位置） */
  function buildSoundBtn() {
    var old = $(".soundbtn");
    if (old) old.remove();
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "soundbtn";
    btn.setAttribute("data-sound", "");
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML = '<span class="sr">' + Lang.pick("声音：关", "Sound: off") + "</span>" +
      '<i class="wave" aria-hidden="true"></i>';
    document.body.appendChild(btn);
    btn.addEventListener("click", function () {
      var on = Sound.toggle();
      btn.querySelector(".sr").textContent = Lang.pick(on ? "声音：开" : "声音：关", on ? "Sound: on" : "Sound: off");
      btn.setAttribute("aria-pressed", on);
      btn.classList.toggle("on", on);
      Sound.click();
    });
  }

  function buildMenu() {
    if ($(".menu")) return;
    var m = document.createElement("div"); m.className = "menu"; m.setAttribute("aria-hidden", "true");
    var rows = D.nav.map(function (n) {
      return '<a class="mrow" href="' + n.href + '"><span class="num">' + n.n + "</span><span>" +
        Lang.t(n.zh, n.en) + '</span><span class="sub">' + Lang.t(n.en, n.zh) + "</span></a>";
    }).join("");
    var socials = (D.contact.socials || []).map(function (s) {
      if (!s.href || s.href === "#") return "<span>" + s.label + "</span>";
      return '<a href="' + s.href + '" target="_blank" rel="noopener">⮡ ' + s.label + "</a>";
    }).join("");
    m.innerHTML =
      rows +
      '<div class="mbottom">' +
      '<div class="mcols">' + socials + "</div>" +
      '<div class="mcols"><a href="about.html">' + Lang.t("关于我", "About me") + '</a><a href="labs.html">' + Lang.t("实验", "Labs") + "</a></div>" +
      "</div>";
    document.body.appendChild(m);
    /* 开关由 topbar 的圆形按钮负责（buildTopbar 内绑定），此处不再重复绑定 */
    $$(".mrow", m).forEach(function (r) {
      r.addEventListener("click", function () { Sound.click(); });
    });
    /* buildMenu 只跑一次（有 .menu 就早退），Escape 绑在这里不会重复；
       绑到 buildTopbar 里会随语言切换叠加监听器。 */
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !m.classList.contains("open")) return;
      m.classList.remove("open");
      m.setAttribute("aria-hidden", "true");
      var t = $("[data-menu-toggle]");
      if (t) { t.setAttribute("aria-expanded", "false"); t.focus(); }
      syncOverlay();
    });
  }

  /* ---------------- index mode ---------------- */
  var IndexUI = null;
  function buildIndexMode() {
    if ($(".indexmode")) return;
    var im = document.createElement("div");
    im.className = "indexmode"; im.setAttribute("aria-hidden", "true");
    var rows = D.all.map(function (it, i) {
      var cats = (it.category || []).slice();
      /* personal 标记可能已经写在 category 里（数据里是大写 "PERSONAL"），
         再补一次会出现 "PERSONAL · Personal"；比较必须忽略大小写。 */
      var hasPersonal = cats.some(function (c) { return String(c).toLowerCase() === "personal"; });
      if (it.personal && !hasPersonal) cats.push("Personal");
      var cat = cats.join(" · ");
      var cover = coverOf(it);
      return '<a class="irow" href="' + detailHref(it) + '"' + (cover ? ' data-prev="' + cover + '"' : "") + ">" +
        '<span class="iyear">' + it.year + "</span>" +
        '<span class="iname">' + titleOf(it) + "</span>" +
        '<span class="icat">' + cat + "</span></a>";
    }).join("");
    im.innerHTML =
      '<div class="ihead"><div><div class="tag">' + Lang.t("索引模式", "Index Mode") + "</div>" +
      '<h2 class="display m" style="margin-top:8px">' + Lang.t("全部项目", "All Projects") + "</h2></div>" +
      '<button class="close">' + Lang.t("关闭", "Close") + "</button></div>" +
      '<div class="iprev" aria-hidden="true"></div>' +
      '<div class="irows">' + rows + "</div>";
    document.body.appendChild(im);
    var prev = $(".iprev", im), rowsBox = $(".irows", im), prevImg = null;
    $$(".irow", im).forEach(function (r) {
      r.addEventListener("mouseenter", function () {
        var src = r.getAttribute("data-prev");
        if (!src) { if (prev) prev.classList.remove("on"); rowsBox.classList.remove("dim"); return; }
        if (!prevImg) { prevImg = new Image(); prevImg.alt = ""; prev.appendChild(prevImg); }
        if (prevImg.getAttribute("src") !== src) prevImg.src = src;
        prev.classList.add("on");
        rowsBox.classList.add("dim");
      });
      r.addEventListener("mouseleave", function () {
        if (prev) prev.classList.remove("on");
        rowsBox.classList.remove("dim");
      });
      r.addEventListener("click", function () { Sound.click(); });
    });
    function open() { im.classList.add("open"); im.setAttribute("aria-hidden", "false"); syncOverlay(); Sound.click(); }
    function close() { im.classList.remove("open"); im.setAttribute("aria-hidden", "true"); if (prev) prev.classList.remove("on"); syncOverlay(); }
    /* 触发件在左下角圆钮（buildFab），它直接调本句柄。
       上一版在这里 $("[data-index-open]").addEventListener，件不存在时抛异常，
       整个 Index 模式连同 boot 一起断掉。 */
    IndexUI = {
      toggle: function () { im.classList.contains("open") ? close() : open(); },
      open: open, close: close
    };
    $(".close", im).addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "i" || e.key === "I") { im.classList.contains("open") ? close() : open(); }
      if (e.key === "Escape") close();
    });
  }

  /* ---------------- page transitions ---------------- */
  function setupTransitions() {
    /* 擦出：lang-boot 已铺好 .mask.hold，这里等页面就绪再放，最多等 1.4s 兜底 */
    if (window.__dtNav) {
      try { sessionStorage.removeItem("dt-nav"); } catch (e) {}
      var held = $(".mask");
      if (held) {
        var release = function () {
          if (held.dataset.released) return;
          held.dataset.released = "1";
          held.classList.remove("hold");
          held.classList.add("out");
          setTimeout(function () { held.remove(); }, 900);
        };
        if (document.readyState === "complete") setTimeout(release, 120);
        else addEventListener("load", function () { setTimeout(release, 120); });
        setTimeout(release, 1400);                 // 加载卡住也绝不能把页面永久盖住
      }
    }
    var mask = $(".mask");
    if (!mask) {
      if (REDUCED) return;
      mask = document.createElement("div");
      mask.className = "mask";
      mask.setAttribute("aria-hidden", "true");
      mask.innerHTML = D.opening.letters.map(function (L) { return "<span>" + L + "</span>"; }).join("");
      document.body.appendChild(mask);
    }
    if (REDUCED) return;
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[href]");
      if (!a) return;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#" || href.indexOf("http") === 0 || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0 || a.target === "_blank") return;
      e.preventDefault();
      Sound.click();
      try { sessionStorage.setItem("dt-nav", "1"); } catch (err) {}
      mask.classList.add("in");
      setTimeout(function () { window.location.href = href; }, 600);   // cover 走完再跳
      /* 万一没跳成（被拦截/同文档锚点），2.6s 后把遮罩收回去，不能留黑屏 */
      setTimeout(function () {
        if (!document.hidden) { mask.classList.remove("in"); }
      }, 2600);
    });
  }

  /* ---------------- reveal ---------------- */
  function setupReveal() {
    var els = $$("[data-reveal]");
    if (!els.length || REDUCED) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    /* threshold 用比例：一个比视口高得多的容器永远达不到 8% 可见，
       会永久停在 opacity:0。改成顶边一进入视口就揭示。 */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* 左下圆形深色钮 + 五点：唤出 Index 模式（参考站此件在左下角） */
  function buildFab() {
    if ($(".fab")) return;
    var b = document.createElement("button");
    b.className = "fab"; b.type = "button";
    b.setAttribute("data-index-open", "");
    b.setAttribute("aria-label", Lang.pick("打开索引模式", "Open index mode"));
    b.innerHTML = "<i></i><i></i><i></i><i></i><i></i>";
    document.body.appendChild(b);
    b.addEventListener("click", function () { if (IndexUI) IndexUI.toggle(); });
  }

  /* ---------------- boot ---------------- */
  /* 顶栏在页首要透明浮在 3D 场景上，滚进内容后必须有不透明底，
     否则卡片标题会从固定栏下面透出来 */
  function setupTopbarState() {
    var bar = $(".topbar");
    if (!bar) return;
    /* 顶栏到底多高要量出来交给样式用。写死像素的"让位量"会在文字换行、
       换语言或字体晚到时骗人——实测这一档是 89px，不是想象中的 60。
       切语言会整条重建顶栏，所以观察器要重新挂到新元素上（rAF 等重建跑完）。 */
    var ro = window.ResizeObserver ? new ResizeObserver(publish) : null;
    function publish() {
      var b = $(".topbar");
      if (b) document.documentElement.style.setProperty(
        "--topbar-h", Math.round(b.getBoundingClientRect().height) + "px");
    }
    function watch() {
      bar = $(".topbar");
      if (!bar) return;
      if (ro) { ro.disconnect(); ro.observe(bar); }
      publish();
    }
    watch();
    document.addEventListener("dt:lang", function () { requestAnimationFrame(watch); });
    var pending = false;
    function apply() {
      pending = false;
      document.body.classList.toggle("top-solid", scrollY > 8);
    }
    addEventListener("scroll", function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(apply);
    }, { passive: true });
    apply();
  }

  /* 滚动编排：复刻参考站 ASScroll 的 lerp 惯性手感。
     只接管 wheel 事件的"节奏"，不接管滚动本身——滚动位置始终是真实的 window.scrollY，
     所以滚动条、键盘、锚点、查找、触摸都照常工作，不存在吞掉滚轮。
     外部滚动（键盘/拖滚动条/程序 scrollBy）会被检测并同步，不与惯性打架。 */
  function setupSmoothScroll() {
    if (REDUCED || !FINE) return;
    var maxScroll = function () {
      return Math.max(0, document.documentElement.scrollHeight - innerHeight);
    };
    var target = scrollY, current = scrollY, lastApplied = scrollY, raf = 0;

    function loop() {
      var diff = target - current;
      if (Math.abs(diff) < 0.5) {
        current = target;
        if (Math.abs(scrollY - current) > 0.5) { lastApplied = current; jump(current); }
        raf = 0;
        return;
      }
      current += diff * 0.12;
      lastApplied = current;
      jump(current);
      raf = requestAnimationFrame(loop);
    }
    /* 必须显式 instant：html{scroll-behavior:smooth} 会让 scrollTo 自己缓动，
       于是 scrollY 落后于 lastApplied 超过阈值，被下面的"外部滚动"分支误判成用户
       在拖滚动条，反过来把惯性循环取消掉——实测表现为滚轮有 ~680ms 完全没反应。 */
    function jump(y) { window.scrollTo({ top: y, behavior: "instant" }); }
    function kick() { if (!raf) raf = requestAnimationFrame(loop); }

    addEventListener("wheel", function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;          // 交给浏览器缩放/组合键
      var d = e.deltaY;
      if (!d) return;
      if (e.deltaMode === 1) d *= 16; else if (e.deltaMode === 2) d *= innerHeight;
      e.preventDefault();
      target = Math.max(0, Math.min(maxScroll(), target + d));
      kick();
    }, { passive: false });

    addEventListener("scroll", function () {
      if (Math.abs(scrollY - lastApplied) <= 2) return;         // 我们自己滚的
      current = target = lastApplied = scrollY;                 // 外部滚动：对齐，别抢
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }, { passive: true });

    addEventListener("resize", function () {
      target = Math.min(target, maxScroll());
      kick();
    });
  }

  /* 悬浮弯曲纸张：给任意一组元素加 --k（0=斜躺，1=摆平），按视口位置 smoothstep 插值。
     projects 的卡片与首页精选作品共用这一套，只写 transform。 */
  function paperTilt(sel, opts) {
    var o = opts || {};
    var els = $$(sel);
    if (REDUCED) {
      els.forEach(function (e) { e.style.setProperty("--k", "1"); });
      return { destroy: function () {}, refresh: function () {}, sync: function () {} };
    }
    /* 这里不能因为"当前一个都没有"就退化成空壳：
       projects 首次构造时列表还没渲染，refresh() 必须真的能重查到节点。 */
    var ticking = false;
    function sync() {
      ticking = false;
      var vh = innerHeight;
      for (var i = 0; i < els.length; i++) {
        var el = els[i], r = el.getBoundingClientRect();
        if (r.bottom < -120 || r.top > vh + 120) continue;
        var t = ((o.center == null ? 0.62 : o.center) * vh - (r.top + r.height / 2)) / ((o.range == null ? 0.5 : o.range) * vh);
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        el.style.setProperty("--k", (t * t * (3 - 2 * t)).toFixed(3));
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(sync); } }
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    sync();
    return {
      destroy: function () { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); },
      sync: sync,
      /* 列表会被重新渲染（projects 的筛选），缓存下来的节点会变成孤儿，
         所以把重查暴露出去，由渲染方在换完 DOM 后调用。 */
      refresh: function () {
        els = $$(sel);
        if (REDUCED) { els.forEach(function (e) { e.style.setProperty("--k", "1"); }); return; }
        sync();
      }
    };
  }

  function boot() {
    Lang.apply();
    buildTopbar();
    document.addEventListener("dt:lang", buildTopbar);   /* 滚换标签是渲染期烘焙的，切语言需重建 */
    buildMenu();
    buildIndexMode();
    buildFab();
    buildCursor();
    setupTransitions();
    wipeify();          /* 要在 setupReveal 之前：它给媒体图补 data-reveal */
    setupReveal();
    setupTopbarState();
    setupSmoothScroll();
    rollify();          /* 页面内联脚本先于 DOMContentLoaded 跑完，这里能覆盖动态渲染的按钮 */
    maybeGate();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
