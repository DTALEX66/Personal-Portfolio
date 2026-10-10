/* ============================================================
   DT ALEX STUDIOS · scene.js — 首页 Hero 的 WebGL 舞台
   ------------------------------------------------------------
   参考站 unseen.co 的门后首页是一个不滚动的全屏 3D 场景，
   这里用同一手法，但配色与素材仍是本项目的暗色板（底 #0C0B0D / 暖白字 / 腮红强调）。

   约束：
   · 滚轮不接管页面滚动（只用指针拖拽与视差）
   · prefers-reduced-motion → 只渲染一帧静图，不起 RAF 循环
   · WebGL 不可用 → 抛错给调用方，回退到原 CSS 2.5D 世界
   · 材质用 MeshBasicMaterial，保证作品图颜色不被光照改变
   ============================================================ */
(function (global) {
  "use strict";

  /* 装饰几何（描边、阴影面）一律不参与射线拾取。
     Line 的默认命中阈值是 1 个世界单位，比一张卡片还大。 */
  function NO_RAYCAST() {}

  /* 全屏玻璃层（菜单 / 索引层）打开时让身后的场景停帧，两个理由叠在一起：
     ① 那两层是满屏 backdrop-filter，背景每失效一次就得重模糊一次；场景停住后
        合成器不再重算，模糊只付一次，而不是每帧一次。
     ② 层盖满视口时身后本来就被遮住，继续算帧是纯浪费。
     不立刻停：先让抽卡收回的弹簧跑完（700ms，与层自己揭开的时间同量级），
     否则卡片会冻在"半出"的姿态上，透过玻璃看得见一个怪形状。 */
  var idleStamp = 0;
  function overlayIdle(now) {
    var b = global.document && global.document.body;
    if (!b || !b.classList.contains("overlay-open")) { idleStamp = 0; return false; }
    if (!idleStamp) idleStamp = now;
    return now - idleStamp > 700;
  }

  /* "每帧逼近固定比例"把观感绑在帧率上：0.06/帧在 60fps 约 0.25s 收敛，
     在 20fps 只有 3 帧、不到 0.15s 就到底，慢机器上手感反而更快。
     按 dt 折算成等效比例后，任何帧率下同样的墙钟时间走同样的行程；
     dt = 1/60 时因子正好回到 0.06，所以 60fps 下画面一分不变。 */
  function easeTo(cur, tgt, per60, dt) {
    /* dt 可能是 NaN（没有时间戳的调用）或后台唤醒的巨大值：两者都退回一帧，
       否则一次 NaN 会把位置永久毒掉。 */
    var h = (dt > 0 ? Math.min(dt, 0.25) : 1 / 60) * 60;
    return cur + (tgt - cur) * (1 - Math.pow(1 - per60, h));
  }
  function decayTo(v, per60, dt) {
    var h = (dt > 0 ? Math.min(dt, 0.25) : 1 / 60) * 60;
    return v * Math.pow(per60, h);
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* 软阴影贴图：一次性画到 canvas 上，避免实时阴影贴图开销 */
  function shadowTexture(THREE) {
    var c = document.createElement("canvas");
    c.width = c.height = 128;
    var g = c.getContext("2d");
    var rad = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    rad.addColorStop(0, "rgba(0,0,0,0.45)");
    rad.addColorStop(0.55, "rgba(0,0,0,0.20)");
    rad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = rad;
    g.fillRect(0, 0, 128, 128);
    var t = new THREE.CanvasTexture(c);
    t.needsUpdate = true;
    return t;
  }

  /* 位置用视锥归一化坐标（nx, ny ∈ -1..1），换屏幕不会出画，也不会压到文字区 */
  /* 纸纹背景：参考站的画面之所以不空，是因为底不是纯色，
     而是一张有纤维和颗粒的纸。暗色主题下这张纸是深炭色，
     颗粒改由亮 speck 承担——纯色一块会让贴图卡片像浮在屏幕上。 */
  function paperTexture(THREE, base) {
    var c = document.createElement("canvas");
    c.width = c.height = 512;
    var g = c.getContext("2d");
    g.fillStyle = base || "#15131A";
    g.fillRect(0, 0, 512, 512);
    var i, x, y, a;
    for (i = 0; i < 9000; i++) {                       // 细颗粒
      x = Math.random() * 512; y = Math.random() * 512;
      a = 0.012 + Math.random() * 0.05;
      g.fillStyle = (Math.random() < 0.22 ? "rgba(0,0,0," : "rgba(255,255,255,") + a + ")";
      g.fillRect(x, y, 1, 1);
    }
    for (i = 0; i < 260; i++) {                        // 短纤维
      x = Math.random() * 512; y = Math.random() * 512;
      g.strokeStyle = "rgba(242,238,233," + (0.018 + Math.random() * 0.042) + ")";
      g.beginPath(); g.moveTo(x, y);
      g.lineTo(x + (Math.random() - 0.5) * 26, y + (Math.random() - 0.5) * 8);
      g.stroke();
    }
    var grd = g.createRadialGradient(256, 236, 90, 256, 256, 400);
    grd.addColorStop(0, "rgba(0,0,0,0)");
    grd.addColorStop(1, "rgba(0,0,0,0.30)");          // 轻晕影
    g.fillStyle = grd; g.fillRect(0, 0, 512, 512);
    var tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    tex.colorSpace = THREE.SRGBColorSpace || tex.colorSpace;
    return tex;
  }

  /* 圆角矩形轮廓。卡片所有面都由它生成，所以圆角是**几何圆角**——
     用 alphaMap 裁出来的圆角在斜视角下会露出直角边。 */
  function roundedShape(THREE, w, h, r) {
    var s = new THREE.Shape();
    var x = -w / 2, y = -h / 2;
    r = Math.min(r, w / 2, h / 2);
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
    s.lineTo(x + w, y + h - r);
    s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
    s.lineTo(x + r, y + h);
    s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
    s.lineTo(x, y + r);
    s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
    return s;
  }

  /* 玻璃高光：一条左下→右上的白渐变 + 顶部一条亮带。
     真·背景模糊要 render target 逐帧 blur，本站不做逐帧 filter，
     所以苹果那套玻璃质感靠"半透明本体 + 高光层 + 亮边"三件事拼出来。 */
  var _sheen = null;
  function sheenTexture(THREE) {
    if (_sheen) return _sheen;
    var c = document.createElement("canvas");
    c.width = c.height = 256;
    var g = c.getContext("2d");
    /* CanvasTexture 默认 flipY，画布 y=0 那行对应 uv v=1（卡片顶边）。
       所以"顶部亮带"要画在画布的 y=0 处。 */
    var diag = g.createLinearGradient(256, 256, 0, 0);      // 右下 → 左上
    diag.addColorStop(0, "rgba(255,255,255,0)");
    diag.addColorStop(0.55, "rgba(255,255,255,0.10)");
    diag.addColorStop(1, "rgba(255,255,255,0.30)");
    g.fillStyle = diag; g.fillRect(0, 0, 256, 256);
    var top = g.createLinearGradient(0, 0, 0, 130);
    top.addColorStop(0, "rgba(255,255,255,0.26)");
    top.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = top; g.fillRect(0, 0, 256, 256);
    /* 底部一道回光：玻璃板下沿会接住从下面反射回来的光，
       只有顶部高光会看起来像贴纸，不像一块有厚度的板。 */
    var bot = g.createLinearGradient(0, 256, 0, 176);
    bot.addColorStop(0, "rgba(255,255,255,0.14)");
    bot.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = bot; g.fillRect(0, 0, 256, 256);
    _sheen = new THREE.CanvasTexture(c);
    _sheen.colorSpace = THREE.SRGBColorSpace || _sheen.colorSpace;
    return _sheen;
  }

  /* 抽卡时扫过卡面的镜面光带。它只在**运动中**出现：透明度跟着抬起量走正弦，
     位置跟着抬起量平移，静止在列里时完全透明——所以它不参与"看图"，只参与"手感"。
     每张卡 clone 一份，因为 offset 是贴图实例自己的状态，共享会五张一起动。 */
  var _sweep = null;
  function sweepTexture(THREE) {
    if (_sweep) return _sweep;
    var c = document.createElement("canvas");
    c.width = c.height = 256;
    var g = c.getContext("2d");
    var lg = g.createLinearGradient(0, 256, 256, 0);      // 一条垂直于左下→右上的斜光带
    lg.addColorStop(0.30, "rgba(255,255,255,0)");
    lg.addColorStop(0.46, "rgba(255,255,255,0.66)");
    lg.addColorStop(0.52, "rgba(255,255,255,0.20)");
    lg.addColorStop(0.64, "rgba(255,255,255,0)");
    g.fillStyle = lg; g.fillRect(0, 0, 256, 256);
    _sweep = new THREE.CanvasTexture(c);
    _sweep.wrapS = _sweep.wrapT = THREE.RepeatWrapping;
    _sweep.colorSpace = THREE.SRGBColorSpace || _sweep.colorSpace;
    return _sweep;
  }

  /* 玻璃板的那圈边：左上亮、右下压暗。真玻璃的边缘光就是这条，
     没有它，圆角矩形读起来是"图片加了圆角"，不是"一块板"。 */
  var _edge = null;
  function edgeTexture(THREE) {
    if (_edge) return _edge;
    var c = document.createElement("canvas");
    c.width = c.height = 128;
    var g = c.getContext("2d");
    var lg = g.createLinearGradient(6, 6, 122, 122);
    lg.addColorStop(0, "rgba(255,255,255,1)");
    lg.addColorStop(0.42, "rgba(255,255,255,0.46)");
    lg.addColorStop(1, "rgba(255,255,255,0.10)");
    g.fillStyle = lg; g.fillRect(0, 0, 128, 128);
    _edge = new THREE.CanvasTexture(c);
    _edge.colorSpace = THREE.SRGBColorSpace || _edge.colorSpace;
    return _edge;
  }

  /* ShapeGeometry 把顶点 x/y 原样写进 uv，等于"1 世界单位 = 1 uv"，
     画面会被放大几十倍。重映射回 0..1 是**承重**的，不是修饰。 */
  function remapUV(geo, w, h) {
    var pos = geo.attributes.position, uvs = geo.attributes.uv;
    for (var i = 0; i < pos.count; i++) {
      uvs.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
    }
    uvs.needsUpdate = true;
  }

  /* 一圈等宽边框面：外圆角矩形挖掉内圆角矩形。 */
  function roundedRing(THREE, w, h, r, band) {
    var outer = roundedShape(THREE, w, h, r);
    var inner = roundedShape(THREE, w - band * 2, h - band * 2, Math.max(0.02, r - band));
    var pts = inner.getPoints(64).slice();
    pts.push(pts[0]);
    outer.holes.push(new THREE.Path(pts));
    return outer;
  }

  /* 一列叠放的玻璃卡片：位置全部由 column 参数算出来，不是一张张手摆。
     每张同一个 x、同一尺寸、按 overlap 等步距互相压住，整块在 band 内垂直居中；
     装不下就整列等比缩小（走 scale，不重建几何），"整齐"因此不依赖手调数字。

     抽出 / 收回是**弹簧**，不是每帧固定比例逼近（要读起来像"抽出来再插回卡槽"，
     而不是"到点就没了"）：
     · 抽出欠阻尼（ζ≈0.56）→ 冲过头一点再落定，读起来是"抽出来"；
     · 松开时先给一记向外的初速（蓄力），再换过阻尼往回加速插进卡槽；
     · 位移、放大、倾角、扫光、接触阴影全部由同一个 x 驱动，
       所以任何一帧截屏都是自洽的姿态，不会出现"位置到了、高光还在原地"。
     弹簧按 dt 积分：实测每帧 ×0.16 的老写法在 30fps 下走完 616ms、
     22fps 下要走 833ms，动效速度绑在帧率上，弱机降档就变样——现在与帧率无关。 */
  var EX_K = 170, EX_C = 15;        // 抽出：ω≈13.0、ζ≈0.58 → 约 11% 过冲，约 0.40s 落定
  var IN_K = 190, IN_C = 26;        // 插回：ω≈13.8、ζ≈0.94 → 加速入槽、收尾不回弹
  var WIND_MS = 0.12;               // 松手先向外顶住这么多秒（抽卡的"回手"）
  var WIND_TO = 1.10;               // 蓄力期间停在这个抬起量
  var H = 1 / 120;                  // 固定积分步长：动效速度与帧率彻底解绑
  /* 为什么必须固定步长：直接按当帧 dt 积分，26fps 实测一帧就走掉 32% 行程，
     弹簧在低帧率下发散——表现正好是"没有动效，一下就回去了"。 */
  function spring(u, dt) {
    u.acc = Math.min(0.25, (u.acc || 0) + dt);
    while (u.acc >= H) {
      /* 蓄力预算也在子步里扣。放在帧外的话，蓄力时长就被帧长量化了：
         实测 15fps 顶到下一帧、6.6fps 顶满一整帧 151ms，顶得更远就要花更多时间退回来，
         插回落定从 394ms 变成 640ms——编舞又偷偷绑回帧率了。 */
      var want = u.tgt ? 1 : (u.hold > 0 ? WIND_TO : 0);
      var k = u.tgt ? EX_K : IN_K, c = u.tgt ? EX_C : IN_C;
      if (u.hold > 0) u.hold = Math.max(0, u.hold - H);
      u.v += (k * (want - u.x) - c * u.v) * H;
      u.x += u.v * H;
      u.acc -= H;
    }
    if (u.x < 0) { u.x = 0; u.v = Math.max(0, u.v); }
    var end = u.tgt ? 1 : (u.hold > 0 ? WIND_TO : 0);
    if (u.acc < H && Math.abs(u.v) < 0.01 && Math.abs(end - u.x) < 0.002) { u.x = end; u.v = 0; }
  }
  function place(THREE, camera, stage, items, shadowTex, onReady, column) {
    /* 几何只按"建好时"的尺寸建一次；之后所有尺寸变化都走 scale。
       弱机降档会把相机从 10.5 推到 12/15，视锥宽度跟着变，
       所以占屏比例每帧都要按当帧视锥反算，不能只算一次。 */
    function frustumW() {
      var h = Math.tan((camera.fov * Math.PI / 180) / 2) * camera.position.z;
      return h * camera.aspect * 2;
    }
    var builtW = column.wFrac != null ? column.wFrac * frustumW() : column.w;
    var view = { scrW: 1, scrH: 1, camz: 1, liftZ: 1 };
    var cards = [];
    items.forEach(function (it, i) {
      var ar = it.ar || 1.778;
      var card = makeCard(THREE, it.src, builtW, builtW / ar, shadowTex, onReady,
        { depth: column.depth, radius: column.radius });
      card.userData.ar = ar; card.userData.w = builtW; card.userData.h = builtW / ar;
      card.userData.phase = 0;              // 整列同相呼吸：各自乱相位就不成一条线了
      card.userData.amp = 0.014;
      card.userData.x = 0; card.userData.v = 0; card.userData.tgt = 0;
      card.userData.hold = 0; card.userData.acc = 0;
      card.userData.base = { sx: column.cx, sy: 0.5, z: 0, k: 1 };
      stage.add(card);
      cards.push(card);
    });

    /* 屏幕分数意图 + 当前抬起量 → 真实世界变换。
       透视会自己破坏"整齐"：同一世界尺寸在近处投影更大、同一世界 x 在近处投影
       更偏外，实测五张差到 103px 宽、40px 偏心，整列顶出画面右缘。
       所以按深度把尺寸和坐标一起收回同一比例 q = 剩余视距 / 视距。
       x 是弹簧位置（0=在列里，1=完整抽出，过冲时短暂 >1）；v 只用来带二次动效：
       起手仰得更多、插回时机头一沉，玻璃板才像被手放过。 */
    function draw(c) {
      var u = c.userData, b = u.base, x = u.x || 0, v = u.v || 0;
      /* 抬起的量必须盖过整摞的总深度，否则最上面那张"抽出来"之后
         仍然排在最下面几张后面，根本没能完整显示（实测 1.15 < 2.10 就是这样）。 */
      var z = b.z + view.liftZ * x;
      var q = (view.camz - z) / view.camz;
      /* 抬起时往**屏幕中线**靠。sy 是从顶部量的分数（0=顶、1=底），
         所以必须绕 0.5 缩放：原先写成 b.sy*(1-k) 是把上半列往顶边推、
         下半列往底边推，方向整个反了——抽出最上面那张会顶进导航条就是这个。 */
      var sy = 0.5 + (b.sy - 0.5) * (1 - 0.16 * x);
      c.position.set((b.sx - 0.5) * view.scrW * q, (0.5 - sy) * view.scrH * q, z);
      /* 抽出来不许越宽：横向预算由 column.wMax 说了算（横向占据到一半为止）。
         过冲和指针视差会把靠前的那张往屏外推，实测最右一张出画 16px、
         最上一张顶进 60px 的导航条，所以放大先按"投影后不超过 wMax"夹一道；
         多出来的"更近"交给 z、倾角、接触阴影和扫光去表达。
         夹的是**增量**——静止那张必须一分不差地留在原位，所以只砍 0.14·x 那一段。 */
      var wNow = b.k * builtW / view.scrW;            // 这张静止后占屏宽的比例
      var grow = 1 + Math.min(0.14 * x, Math.max(0, (column.wMax || 9) / wNow - 1));
      u.s0 = b.k * q * grow;
      c.scale.setScalar(u.s0);
      u.lift = Math.max(0, x);
      var g = u.g;
      if (!g) return;
      /* 二次动效：抬起时向镜头倾，速度带着倾角——起手向外甩一点、插回时机头一沉，
         玻璃板才像被手放过，而不是被 setAttribute 挪过。 */
      c.rotation.x = Math.max(-0.20, Math.min(0.07, -0.13 * x + 0.008 * v));
      /* 边和亮随抬起量提亮：板子离光源更近，边缘当然更亮 */
      g.rim.material.opacity = 0.50 + 0.34 * Math.min(1.15, x);
      g.ring.material.opacity = 0.42 + 0.42 * Math.min(1, x);
      /* 扫光：正弦让它在两端归零，只有路上看得见 */
      g.sweep.material.opacity = 0.62 * Math.sin(Math.PI * Math.max(0, Math.min(1, x)));
      g.sweep.material.map.offset.x = -0.72 * x;
      /* 接触阴影：抬得越高，影子越大、越淡、越往右下跑——这是"真的离开桌面"的凭据 */
      var s = 1 + 0.26 * x;
      g.sh.scale.set(s, s, 1);
      g.sh.position.set(u.w * (0.10 + 0.07 * x), u.h * (-0.20 - 0.06 * x), g.sh.position.z);
      g.sh.material.opacity = 0.9 - 0.34 * x;
    }

    function apply() {
      var hh = Math.tan((camera.fov * Math.PI / 180) / 2) * camera.position.z;
      var hw = hh * camera.aspect;
      view.scrH = hh * 2; view.scrW = hw * 2; view.camz = camera.position.z;
      var n = cards.length;
      var wWant = column.wFrac != null ? column.wFrac * view.scrW : column.w;
      var kk = wWant / builtW;                                   // 几何尺寸 → 占屏比例
      var chh = (wWant / cards[0].userData.ar) / view.scrH;      // 一张占屏高分数
      var avail = column.bottom - column.top;
      /* overlap：每张被下一张压住的比例（文件陈列的叠法）。
         步距 = 卡高 ×(1-overlap)，整列总高 = h + (n-1)×步距。 */
      var step = chh * (1 - (column.overlap || 0));
      var need = chh + (n - 1) * step;
      var fit = need > avail ? avail / need : 1;                 // 纵向装不下 → 整列等比缩
      var k = fit * kk;
      var hF = chh * fit, sF = step * fit;
      var first = column.top + (avail - need * fit) / 2;         // 首张顶边（整块垂直居中）
      var zs = column.zStep || 0;
      view.liftZ = zs * (n - 1) * k + 0.45;           // 抬过整摞的最前面那张，再多让一点
      cards.forEach(function (c, i) {
        /* 叠放必须有前后：全部共面就会在重叠区 z-fighting。
           越往下 z 越大（越靠近相机），下面那张压住上面那张；
           zStep 必须大于卡片厚度+0.02，否则后一张的本体会穿过前一张的画面。 */
        c.userData.base = { sx: column.cx, sy: first + i * sF + hF / 2, z: zs * i * k, k: k };
        draw(c);
      });
    }
    apply();
    return { cards: cards, apply: apply, draw: draw };
  }
  /* 玻璃卡片：几何圆角 + 往后挤出的真实厚度 + 半透明本体 + 高光层 + 亮边。
     画面仍是 MeshBasicMaterial，作品图颜色不受光照改变。 */
  function makeCard(THREE, url, w, h, shadowTex, onReady, glass) {
    var group = new THREE.Group();
    var depth = (glass && glass.depth) || 0;
    var shape = null, faceGeo;

    if (glass) {
      shape = roundedShape(THREE, w, h, glass.radius);
      faceGeo = new THREE.ShapeGeometry(shape, 16);
      remapUV(faceGeo, w, h);
    } else {
      faceGeo = new THREE.PlaneGeometry(w, h);
    }

    /* 贴图到位前先用玻璃深色压着，避免闪一块白牌 */
    var faceMat = new THREE.MeshBasicMaterial({ color: glass ? 0x241F27 : 0xffffff });
    var mesh = new THREE.Mesh(faceGeo, faceMat);
    group.add(mesh);

    if (glass) {
      /* 带一点斜切边（bevel）：玻璃的厚度感主要就来自那道倒角，
         纯直角挤出在正视角下几乎看不出是"块"。 */
      var body = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, {
          depth: depth, bevelEnabled: true, bevelThickness: 0.02,
          bevelSize: 0.024, bevelSegments: 1, curveSegments: 16 }),
        new THREE.MeshBasicMaterial({ color: 0x2A2432, transparent: true, opacity: 0.95 }));
      /* 挤出是从 z=0 往 +z 走的，所以本体要整体再往后挪一点：
         它的前盖如果和画面共面（都在 0），深度上就会和画面打架，
         表现是作品图被一层暗玻璃糊住——第一眼看到的就是这个。 */
      body.position.z = -depth - 0.03;
      group.add(body);

      var outline = shape.getPoints(64).slice();
      outline.push(outline[0]);                       // getPoints 不自动闭合，补一刀免得左下角开口
      var rim = new THREE.Line(new THREE.BufferGeometry().setFromPoints(outline),
        new THREE.LineBasicMaterial({ color: 0xF2EEE9, transparent: true, opacity: 0.5 }));
      rim.position.z = 0.002;
      /* 装饰件一律不参与拾取：Raycaster 的 Line 阈值默认是 1 个世界单位，
         比一张卡还大，会让邻卡的描边把命中抢过去（实测 hover 全打错卡）。 */
      rim.raycast = NO_RAYCAST;
      group.add(rim);
      var rimBack = rim.clone();                      // 背沿也来一圈，厚度才有"块"的轮廓
      rimBack.position.z = -depth - 0.045;
      rimBack.material = new THREE.LineBasicMaterial({
        color: 0xF2EEE9, transparent: true, opacity: 0.2 });
      rimBack.raycast = NO_RAYCAST;
      group.add(rimBack);

      var sheen = new THREE.Mesh(faceGeo, new THREE.MeshBasicMaterial({
        map: sheenTexture(THREE), transparent: true, depthWrite: false }));
      sheen.position.z = 0.004;
      group.add(sheen);

      /* 边缘那一圈：挖空的圆角矩形面，左上亮右下暗。
         厚度 + 这圈边，才是"一块玻璃板"；只有高光的话是"一张贴纸"。 */
      var band = Math.min(w, h) * 0.024;
      var ringGeo = new THREE.ShapeGeometry(roundedRing(THREE, w, h, glass.radius, band), 16);
      remapUV(ringGeo, w, h);
      var ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
        map: edgeTexture(THREE), transparent: true, opacity: 0.42, depthWrite: false }));
      ring.position.z = 0.006;
      group.add(ring);

      /* 扫光：贴图 clone 一份，offset 是每张自己的 */
      var sweepTex = sweepTexture(THREE).clone();
      sweepTex.needsUpdate = true;
      var sweep = new THREE.Mesh(faceGeo, new THREE.MeshBasicMaterial({
        map: sweepTex, transparent: true, opacity: 0, depthWrite: false }));
      sweep.position.z = 0.008;
      group.add(sweep);
      group.userData.g = { rim: rim, rimBack: rimBack, sheen: sheen, ring: ring, sweep: sweep };
    }

    /* 阴影比卡片大一圈并往右下偏：叠放时它会落在下面那张上，
       那一摞文件的层次就是靠这条压出来的。抬起时由 draw() 放大、推远、压淡。 */
    var sh = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.9, h * 1.5),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.9 }));
    sh.position.set(w * 0.10, -h * 0.20, -depth - 0.06);
    sh.raycast = NO_RAYCAST;                          // 阴影比卡片大一圈，更不能参与命中
    group.add(sh);
    if (group.userData.g) group.userData.g.sh = sh;

    var loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(url, function (tex) {
      tex.colorSpace = THREE.SRGBColorSpace || tex.colorSpace;
      tex.anisotropy = 4;
      faceMat.map = tex;
      faceMat.color.set(0xffffff);                    // 不还原成白，画面会被灰底压暗
      faceMat.needsUpdate = true;
      group.userData.ready = true;
      if (onReady) onReady();
    }, undefined, function () { group.visible = false; if (onReady) onReady(); });

    return group;
  }

  function start(opts) {
    var THREE = global.THREE;
    if (!THREE) throw new Error("three.js missing");

    var host = opts.host;
    var canvas = opts.canvas;
    var gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) throw new Error("WebGL unavailable");

    var REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace || renderer.outputColorSpace;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    var stage = new THREE.Group();
    scene.add(stage);

    var shadowTex = shadowTexture(THREE);
    /* 静帧模式下贴图是异步的：每张贴图到位都重绘一次，否则画面全白 */
    var redraw = function () { renderer.render(scene, camera); };
    var layout = place(THREE, camera, stage, opts.items || [], shadowTex, redraw, opts.column);
    var cards = layout.cards;

    /* ---- 指针视差 + 拖拽轨道（不接管滚轮） ---- */
    var px = 0, py = 0, tpx = 0, tpy = 0;
    var yaw = 0, pitch = 0, tyaw = 0, tpitch = 0;
    var dragging = false, sx = 0, sy = 0, baseYaw = 0, basePitch = 0, velY = 0, velX = 0;

    /* 一列整齐的卡片经不起大角度旋转：转到侧向就看不出"列"了。
       所以拖拽偏航夹在 ±0.34rad，只保留"能感到是立体的一摞"的幅度。 */
    var YAW_MAX = 0.34;
    function clampYaw(v) { return Math.max(-YAW_MAX, Math.min(YAW_MAX, v)); }

    addEventListener("pointermove", function (e) {
      tpx = (e.clientX / innerWidth - 0.5);
      tpy = (e.clientY / innerHeight - 0.5);
      if (!dragging) return;
      var dx = (e.clientX - sx) / innerWidth, dy = (e.clientY - sy) / innerHeight;
      tyaw = clampYaw(baseYaw + dx * 1.1);
      tpitch = Math.max(-0.28, Math.min(0.28, basePitch + dy * 0.5));
      velY = dx * 1.1; velX = dy * 0.5;
    }, { passive: true });

    host.addEventListener("pointerdown", function (e) {
      if (e.target.closest("a,button")) return;
      dragging = true; sx = e.clientX; sy = e.clientY; baseYaw = tyaw; basePitch = tpitch;
      host.classList.add("is-grabbing");
    });
    addEventListener("pointerup", function () {
      if (!dragging) return;
      dragging = false; host.classList.remove("is-grabbing");
    });

    function resize() {
      var w = host.clientWidth || innerWidth, h = host.clientHeight || innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      /* 窄屏拉远相机，归一化布局随之收缩 */
      resize._z = camera.aspect < 0.75 ? 15 : (camera.aspect < 1.2 ? 12 : 10.5);
      camera.position.z = resize._z;
      camera.updateProjectionMatrix();
      layout.apply();
    }

    var t0 = performance.now(), last = t0, frames = 0, acc = 0, tier = 0, painted = 0;
    var DPR0 = renderer.getPixelRatio();

    /* 参考站实测：连续低帧时自动降 pixel ratio（他们从 2 → 1.5 → 1）。
       WebGL 在弱机/集显上否则只会掉帧，不会自己收手。 */
    function fpsGuard(now) {
      frames++; acc += (now - last); last = now;
      if (acc < 1000) return;
      var fps = frames * 1000 / acc;
      frames = 0; acc = 0;
      if (fps < 42 && tier < 2) {
        tier++;
        renderer.setPixelRatio(Math.max(1, DPR0 - tier * 0.5));
        resize();
      }
    }

    /* 悬停命中的卡片被抽出来（参考站 onHover: scale → original + 10） */
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), hovered = null;
    function pick(e) {
      var r = canvas.getBoundingClientRect();
      /* 指针不在首屏那块矩形里就不必算射线：一是省掉在页脚每帧做的拾取，
         二是这同时修掉了"指针移出窗口后卡片永远举着"——那条路径上一个
         pointermove 都不会再来，只能靠"离开矩形"或下面的出窗事件收手。 */
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        hovered = null; return;
      }
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ndc, camera);
      /* Group 自己不会被射线命中，recursive 必须是 true；
         命中拿到的是子网格，要沿 parent 爬回所属卡片，否则 hover 比对不上。 */
      var hit = ray.intersectObjects(cards, true);
      var o = hit.length ? hit[0].object : null;
      while (o && cards.indexOf(o) < 0) o = o.parent;
      hovered = o || null;
    }
    if (!REDUCED) {
      addEventListener("pointermove", pick, { passive: true });
      /* 指针离开窗口时浏览器不再发 pointermove，必须显式收手 */
      document.documentElement.addEventListener("pointerleave", function () { hovered = null; });
      addEventListener("blur", function () { hovered = null; });
    }

    /* 读数接口：交出每张卡片**投影之后**的屏幕盒。
       "排得整齐不齐"只能量真实画面几何，读源码里的数字证明不了渲染。
       setColumn 可以在运行时改列参数再按同一段代码重排一次，
       用来复核"卡片压字 / 重叠 / 顶出画面"这几类倒退。 */
    var api = {
      debug: function () {
      var r = canvas.getBoundingClientRect();
      var box = function (c) {
        var xs = [], ys = [], i, v;
        for (i = 0; i < 4; i++) {
          var sx = (i === 0 || i === 3) ? -1 : 1, sy = (i < 2) ? -1 : 1;
          v = new THREE.Vector3(sx * c.userData.w / 2, sy * c.userData.h / 2, 0);
          c.localToWorld(v); v.project(camera);
          xs.push((v.x * 0.5 + 0.5) * r.width + r.left);
          ys.push((0.5 - v.y * 0.5) * r.height + r.top);
        }
        return { x0: Math.min.apply(null, xs), x1: Math.max.apply(null, xs),
                 y0: Math.min.apply(null, ys), y1: Math.max.apply(null, ys) };
      };
      return {
        n: cards.length, column: !!opts.column, yaw: +stage.rotation.y.toFixed(3),
        locked: locked(), tier: tier, painted: painted,
        /* hover 直接报命中序号：靠"哪张变宽了"反推命中会被视差位移骗过去。 */
        hover: cards.indexOf(hovered),
        viewport: [innerWidth, innerHeight],
        cards: cards.map(function (c, i) {
          var b = box(c);
          return { i: i, cx: +(((b.x0 + b.x1) / 2) / innerWidth).toFixed(4),
                   cy: +(((b.y0 + b.y1) / 2) / innerHeight).toFixed(4),
                   w: Math.round(b.x1 - b.x0), h: Math.round(b.y1 - b.y0),
                   x0: Math.round(b.x0), x1: Math.round(b.x1),
                   y0: Math.round(b.y0), y1: Math.round(b.y1),
                   ready: !!c.userData.ready, vis: c.visible, s0: +(c.userData.s0 || 1).toFixed(3),
                   lift: +(c.userData.lift || 0).toFixed(3), z: +c.position.z.toFixed(3),
                   /* 弹簧状态 + 玻璃随动量：把"抽出是有过程的"这件事本身交出来，
                      边光/扫光/接触阴影是否跟着抬走，一看便知。 */
                   x: +(c.userData.x || 0).toFixed(4), v: +(c.userData.v || 0).toFixed(4),
                   tgt: c.userData.tgt || 0, tilt: +c.rotation.x.toFixed(4),
                   rim: c.userData.g ? +c.userData.g.rim.material.opacity.toFixed(3) : 0,
                   ring: c.userData.g ? +c.userData.g.ring.material.opacity.toFixed(3) : 0,
                   sw: c.userData.g ? +c.userData.g.sweep.material.opacity.toFixed(3) : 0,
                   sho: c.userData.g ? +c.userData.g.sh.material.opacity.toFixed(3) : 0,
                   shs: c.userData.g ? +c.userData.g.sh.scale.x.toFixed(3) : 0 };
        })
      };
    },
      /* 命中排查：把这条射线的所有交点按距离交出来，
         不然"hover 打错卡"只能靠猜。 */
      pickAt: function (x, y) {
        var r = canvas.getBoundingClientRect();
        ndc.x = ((x - r.left) / r.width) * 2 - 1;
        ndc.y = -((y - r.top) / r.height) * 2 + 1;
        ray.setFromCamera(ndc, camera);
        return ray.intersectObjects(cards, true).slice(0, 6).map(function (h) {
          var o = h.object, up = 0;
          while (o && o.parent && cards.indexOf(o) < 0) { o = o.parent; up++; }
          return { card: cards.indexOf(o), type: h.object.type, mat: h.object.material && h.object.material.type,
                   dist: +h.distance.toFixed(3), up: up, z: +h.object.position.z.toFixed(3) };
        });
      },
      setColumn: function (patch) {
        Object.assign(opts.column, patch);
        layout.apply();
        renderer.render(scene, camera);
        return api.debug();
      }
    };
    canvas.__hero = api;

    /* 参考站对相机做了 z 向推移（cameraTranslateZ）：滚离 Hero 时镜头缓缓推远，
       场景不是被"滚走"，而是被"穿过"。这里按 Hero 的滚动进度插值。 */
    var dolly = 0, tDolly = 0;
    function onScroll() {
      var h = host.clientHeight || innerHeight;
      var k = Math.max(0, Math.min(1, scrollY / h));
      tDolly = k * 3.4;
    }
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* 四种情况一律把卡收回去，而且不等指针事件：拖拽中（抬起的卡会跟着镜头晃、
       自己盖住指针造成命中抖动）、全屏层开着（索引/菜单盖住首屏，卡片还在外面
       就是漏在另一层的物件）、标签页隐藏。每帧算一次，代价是一次 classList 查询。 */
    function locked() {
      return dragging || document.hidden ||
             document.body.classList.contains("overlay-open");
    }

    var lastT = 0;
    function frame(now) {
      /* 停帧要排在 painted++ 之前：那个计数数的是"真的算过几帧"，
         外部拿它判断动效有没有在跑，停帧期间它必须不涨。 */
      if (overlayIdle(now)) { lastT = 0; return; }
      painted++;                        // 只数"真的算过几帧"，外部按 rAF 采样比它密
      var t = (now - t0) / 1000;
      /* dt 上限 250ms：后台标签回来时 now 会跳几秒，不夹的话弹簧一步冲到底，
         表现就是"没有动效，直接结束就返回了"。上限取 250 而不是 100：
         弱机降档到 6–7fps 时一帧就有 150ms，夹在 100 会把真实时长抹掉。 */
      var dt = lastT ? Math.min(0.25, Math.max(0.001, (now - lastT) / 1000)) : 1 / 60;
      lastT = now;
      fpsGuard(now);
      if (!dragging) {
        tyaw = clampYaw(tyaw + velY * 0.5); tpitch += velX * 0.2;
        velY = decayTo(velY, 0.9, dt); velX = decayTo(velX, 0.9, dt);
      }
      yaw = easeTo(yaw, tyaw, 0.06, dt); pitch = easeTo(pitch, tpitch, 0.06, dt);
      px = easeTo(px, tpx, 0.05, dt); py = easeTo(py, tpy, 0.05, dt);
      dolly = easeTo(dolly, tDolly, 0.07, dt);

      /* 视差系数是量出来的：偏航每多一份，靠前的那张就被横向多推一份。
         0.18 时抽出那张被推出右缘 16px、顶进导航条，压到 0.12 后左右各留得住十几像素。 */
      stage.rotation.y = yaw + px * 0.12;
      stage.rotation.x = pitch + py * 0.07;
      camera.position.x = px * 0.42;
      camera.position.y = -py * 0.35;
      camera.position.z = resize._z + dolly;
      camera.lookAt(0, 0, 0);

      var lock = locked();
      for (var i = 0; i < cards.length; i++) {
        var c = cards[i], u = c.userData;
        var tgt = (!lock && c === hovered) ? 1 : 0;
        if (tgt !== u.tgt) {
          /* 松手先向外顶一下再插回去——抽卡的"甩手"就是这一下 */
          if (!tgt && u.x > 0.12) u.hold = WIND_MS; else u.hold = 0;
          u.tgt = tgt;
        }
        spring(u, dt);
        layout.draw(c);
        c.position.y += Math.sin(t * 0.55 + u.phase) * u.amp;   // 同相微动，列仍然是直的
      }
      renderer.render(scene, camera);
    }

    resize();
    addEventListener("resize", resize);

    if (REDUCED) {
      renderer.render(scene, camera);           // 静帧，不循环
      return { reduced: true, stop: function () {} };
    }
    var raf = requestAnimationFrame(function loop(now) { frame(now); raf = requestAnimationFrame(loop); });
    return {
      reduced: false,
      stop: function () { cancelAnimationFrame(raf); }
    };
  }

  /* ============================================================
     线框球体 + 表面项目面片（参考站 /world/ 手法），用于深色个人项目带
     ============================================================ */
  function sphere(opts) {
    var THREE = global.THREE;
    if (!THREE) throw new Error("three.js missing");
    var host = opts.host, canvas = opts.canvas;
    var gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) throw new Error("WebGL unavailable");

    var REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!host.clientWidth || !host.clientHeight) throw new Error("sphere host has no size");
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));

    var FOV = 40;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

    var world = new THREE.Group();
    scene.add(world);

    var R = 4.4;
    /* 球面本体。以前这里是一条 WireframeGeometry(SphereGeometry)——它连每个面片的
       对角线一起画，密到 46×30 段就是一张三角网，读起来是 3D 视口的调试视图，
       而且没有实体挡在后面，球背的线透过来糊在一起，整个球是"平的"。
       现在换成三样叠出来的一个真实球：
         core   —— 不透明的暗色实体，烘一张径向渐变假造来自左上方的光，
                   同时负责遮住球背的线；
         lattice —— 正经的经纬网（12 条经线 + 7 条纬线，只有弧线没有斜线）；
         halo   —— 一张朝向相机的光环贴片，给轮廓一圈边缘光。
       仍然是 MeshBasicMaterial + 静态贴图：不开实时光，也没有逐帧 filter。 */
    function gradTexture(draw, size) {
      var cv = document.createElement("canvas");
      cv.width = cv.height = size || 256;
      draw(cv.getContext("2d"), cv.width);
      var t = new THREE.CanvasTexture(cv);
      if (THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
      return t;
    }
    var core = new THREE.Mesh(
      new THREE.SphereGeometry(R, 48, 32),
      new THREE.MeshBasicMaterial({
        color: 0xffffff, depthWrite: true,
        map: gradTexture(function (c, s) {
          // 必须是"沿 v 方向的线性渐变"：球面贴图是等距经纬的，
          // 径向渐变会把光斑焊在球面上，球一转光斑跟着转，看着像脏污不是光照。
          // 线性渐变对应纬度带，绕 Y 自转时不变，才读得出"上面受光、下面落光"。
          var g = c.createLinearGradient(0, 0, 0, s);
          g.addColorStop(0, "#332E3A");
          g.addColorStop(0.42, "#1D1A24");
          g.addColorStop(0.78, "#0E0D12");
          g.addColorStop(1, "#0A090C");
          c.fillStyle = g; c.fillRect(0, 0, s, s);
        })
      }));
    world.add(core);

    var lattice = (function () {
      var pts = [], MERIDIANS = 12, PARALLELS = 7, SEG = 96, i, j, k, a, b, r, lat, lon;
      function push(p, q) { pts.push(p[0], p[1], p[2], q[0], q[1], q[2]); }
      function sph(latv, lonv) {
        return [R * Math.cos(latv) * Math.cos(lonv), R * Math.sin(latv), R * Math.cos(latv) * Math.sin(lonv)];
      }
      for (i = 0; i < MERIDIANS; i++) {                       // 经线：过两极的半大圆
        lon = i * Math.PI / MERIDIANS;
        for (j = 0; j < SEG; j++) {
          a = -Math.PI / 2 + j / SEG * Math.PI;
          b = -Math.PI / 2 + (j + 1) / SEG * Math.PI;
          push(sph(a, lon), sph(b, lon));
        }
      }
      for (i = 1; i <= PARALLELS; i++) {                      // 纬线：含赤道，两端不重复极点
        lat = -Math.PI / 2 + i / (PARALLELS + 1) * Math.PI;
        r = R * Math.cos(lat);
        for (j = 0; j < SEG; j++) {
          a = j / SEG * Math.PI * 2; b = (j + 1) / SEG * Math.PI * 2;
          push([r * Math.cos(a), R * Math.sin(lat), r * Math.sin(a)],
               [r * Math.cos(b), R * Math.sin(lat), r * Math.sin(b)]);
        }
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      return g;
    })();
    var cage = new THREE.LineSegments(lattice,
      new THREE.LineBasicMaterial({ color: 0xC3BCB2, transparent: true, opacity: 0.30 }));
    cage.renderOrder = 1;
    world.add(cage);

    /* 赤道单独再画一遍、比别的纬线亮一档，还带一点品牌色：
       一堆等价的圈读不出方向，有一条基准线，它才是"一个被摆正的仪器"。 */
    var eqPts = [], EQ = 128, q, qa0, qa1;
    for (q = 0; q < EQ; q++) {
      qa0 = q / EQ * Math.PI * 2; qa1 = (q + 1) / EQ * Math.PI * 2;
      eqPts.push(R * Math.cos(qa0), 0, R * Math.sin(qa0), R * Math.cos(qa1), 0, R * Math.sin(qa1));
    }
    var eqGeo = new THREE.BufferGeometry();
    eqGeo.setAttribute("position", new THREE.Float32BufferAttribute(eqPts, 3));
    var equator = new THREE.LineSegments(eqGeo,
      new THREE.LineBasicMaterial({ color: 0xE7B5A4, transparent: true, opacity: 0.16 }));
    equator.renderOrder = 1;
    world.add(equator);

    /* 深空版：把"一颗摆在带子里的球"换成"镜头前的一颗行星"。三样都是量回来的做法，
       不是凭感觉加的：
       shade —— 明暗界线（terminator）。nullschool 的球面动态范围只有 #303030→#000005，
                靠一张烘焙好的"轮廓压暗"渐变就写出了体积。这里用一张乘色贴片
                （THREE.MultiplyBlending：dst *= src），所以贴片上"不变"的区域必须是纯白
                而不是透明——乘色下透明=乘 0=涂黑。它挂在 scene 上不随球自转：太阳不动。
                尺寸 R*2.16 是从透视来的：在 z=0 那层，半径 R 的球投影轮廓是
                R*d/sqrt(d²−R²) ≈ 1.08R（d≈11.5），不是 R。
       atmo  —— 大气壳。three-globe 的"高级感"来源就是这一层：BackSide 菲涅尔壳、
                1.15 倍半径、pow 3.5、一个去饱和冷色、NormalBlending（不是加色堆亮）。
                这里用 1.08 倍 + pow 3.2 + 冰蓝，冷 rim 配暖球面才是行星，
                上一版那圈品牌橙是"描一圈"，恰好是 nullschool 刻意避免的。
       stars —— 深空的必要信息。three-globe 的 Particles 层默认白色、尺寸 0.5 球半径单位；
                这里分两层（多数暗小 + 少数亮大），单层的点尺寸一致会假。 */
    var shade = new THREE.Mesh(new THREE.PlaneGeometry(R * 2.16, R * 2.16),
      new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, depthWrite: false, depthTest: false,
        blending: THREE.MultiplyBlending,
        map: gradTexture(function (c, s) {
          c.fillStyle = "#ffffff"; c.fillRect(0, 0, s, s);      // 白色 = 乘 1 = 不改
          var g = c.createRadialGradient(s * 0.34, s * 0.30, s * 0.05, s * 0.5, s * 0.5, s * 0.52);
          g.addColorStop(0, "#ffffff");
          g.addColorStop(0.55, "#CFC9D4");
          g.addColorStop(0.86, "#6A6472");
          g.addColorStop(1, "#3A3640");
          c.save();
          c.beginPath(); c.arc(s / 2, s / 2, s * 0.5, 0, Math.PI * 2); c.clip();
          c.fillStyle = g; c.fillRect(0, 0, s, s); c.restore();
        }, 512)
      }));
    shade.renderOrder = 2;
    scene.add(shade);

    var atmo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.045, 48, 32),
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color(0xBFC6CE) },
                    uSun: { value: new THREE.Vector2(-0.55, 0.72).normalize() } },
        vertexShader: "varying vec3 vN;\n"
          + "void main(){ vN = normalize(normalMatrix * normal);\n"
          + "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        /* 第一版 pow 3.2 × 0.85 在 1.08 倍半径上渲染成一圈很厚的浅蓝"游泳圈"；
           收紧到 1.045 / pow 7 / 0.55 之后变成了一根均匀的灰边——那还是"画了一个圈"，
           不是大气。差的这一版才是关键：真实的边缘光**不是沿轮廓均匀的**，
           它朝着太阳那一侧最亮、背着太阳那侧基本没有。所以用视线空间的法线 xy
           和一个固定的太阳方向（左上）做点积来调制强度，
           和下面那张明暗界线贴片同一个光源方向，两者才对得上。 */
        fragmentShader: "uniform vec3 uColor; uniform vec2 uSun; varying vec3 vN;\n"
          + "void main(){ float f = clamp(1.0 + vN.z, 0.0, 1.0);\n"
          + "  vec2 s = normalize(vN.xy + vec2(1e-5));\n"
          + "  float side = clamp(dot(s, uSun) * 0.5 + 0.5, 0.0, 1.0);\n"
          + "  float i = pow(f, 6.0) * (0.06 + 0.72 * pow(side, 1.7));\n"
          + "  gl_FragColor = vec4(uColor, i); }",
        side: THREE.BackSide, transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending
      }));
    atmo.renderOrder = 4;
    scene.add(atmo);

    /* 一条倾斜的轨道线：深空里"被测量过的天体"这个感觉，一半是这条线给的。 */
    var orbit = new THREE.Line((function () {
      var pts = [], i, a, rr = R * 1.62;
      for (i = 0; i <= 160; i++) { a = i / 160 * Math.PI * 2; pts.push(new THREE.Vector3(rr * Math.cos(a), 0, rr * Math.sin(a))); }
      return new THREE.BufferGeometry().setFromPoints(pts);
    })(), new THREE.LineBasicMaterial({ color: 0x8FA6B8, transparent: true, opacity: 0.16 }));
    orbit.rotation.set(0.42, 0, 0.26);
    orbit.renderOrder = 1;
    scene.add(orbit);

    var stars = (function () {
      function layer(count, size, opacity, tint) {
        var pts = [], i, v;
        for (i = 0; i < count; i++) {
          v = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
            .normalize().multiplyScalar(R * (5.2 + Math.random() * 3.4));
          pts.push(v.x, v.y, v.z);
        }
        var g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
        return new THREE.Points(g, new THREE.PointsMaterial({
          color: tint, size: size, sizeAttenuation: true,
          transparent: true, opacity: opacity, depthWrite: false
        }));
      }
      var grp = new THREE.Group();
      grp.add(layer(900, 0.055, 0.55, 0xE8E6EA));      // 多数：小而暗，铺出深度
      grp.add(layer(140, 0.115, 0.9, 0xFFFFFF));       // 少数：亮一点，才有疏密
      scene.add(grp);
      return grp;
    })();

    var texLoader = new THREE.TextureLoader();
    var cards = [];
    var n = Math.max((opts.items || []).length, 1);
    (opts.items || []).forEach(function (it, i) {
      /* 均匀一圈 + 轻微上下错落：任何朝向都有约一半卡片面对镜头，
         黄金角螺旋在只有 3 项时会让球面看起来是空的 */
      var theta = (i / n) * Math.PI * 2 + 0.5;
      var phi = Math.PI / 2 + (i - (n - 1) / 2) * 0.3;
      var pos = new THREE.Vector3(
        R * Math.sin(phi) * Math.cos(theta),
        R * Math.cos(phi),
        R * Math.sin(phi) * Math.sin(theta));
      var w = it.w || 2.4;
      var holder = new THREE.Group();                        // 卡片 + 描边，一起贴在球面上
      holder.position.copy(pos).multiplyScalar(1.035);       // 抬离球面，避免与网格线共面闪烁
      holder.lookAt(pos.clone().multiplyScalar(2));           // 朝外
      /* 这张"背板"就是卡片的边。以前它是 0x0d0b09 —— 比球面还暗，等于没有，
         卡片看着像直接贴在黑球上的一块截图。换成比球面亮一档的发丝边，
         卡片才有"一件东西浮在球面上"的层次。 */
      var back = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.16, w / 1.6 + 0.16),
        new THREE.MeshBasicMaterial({ color: 0x3B353E, transparent: true, opacity: 0, depthWrite: false }));
      back.position.z = -0.02;
      holder.add(back);
      var mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
      var plane = new THREE.Mesh(new THREE.PlaneGeometry(w, w / 1.6), mat);
      plane.renderOrder = 3;                                  // 明暗界线(renderOrder 2)之后画：卡片是"被照亮的物件"，不该被压暗
      holder.add(plane);
      world.add(holder);
      cards.push({ holder: holder, face: mat, edge: back.material });
      texLoader.load(it.src, function (t) {
        mat.map = t; mat.needsUpdate = true; fade();
        if (REDUCED) renderer.render(scene, camera);
      }, undefined, function () { holder.visible = false; fade(); if (REDUCED) renderer.render(scene, camera); });
    });

    /* 绕到球背的卡片随朝向淡出，只留正对镜头的半球 */
    var nrm = new THREE.Vector3(), toCam = new THREE.Vector3(), wp = new THREE.Vector3();
    function fade() {
      for (var i = 0; i < cards.length; i++) {
        var c = cards[i];
        c.holder.getWorldPosition(wp);
        c.holder.getWorldDirection(nrm);
        toCam.copy(camera.position).sub(wp).normalize();
        var k = THREE.MathUtils.clamp(nrm.dot(toCam) / 0.34, 0, 1);
        c.face.opacity = k;
        c.edge.opacity = k * 0.9;
      }
    }

    var spin = 0.0012, tyaw = 0.6, yaw = 0, dragging = false, sx = 0, base = 0, vel = 0;
    host.addEventListener("pointerdown", function (e) {
      if (e.target.closest("a,button")) return;
      dragging = true; sx = e.clientX; base = tyaw; host.classList.add("is-grabbing");
    });
    addEventListener("pointermove", function (e) {
      if (!dragging) return;
      tyaw = base + (e.clientX - sx) * 0.006; vel = (e.clientX - sx) * 0.0004;
    }, { passive: true });
    addEventListener("pointerup", function () { dragging = false; host.classList.remove("is-grabbing"); });

    /* 参考站轮播除拖拽外还有 prev/next 按钮——显式导航，键盘用户也需要它。
       一旦用按钮定位就停掉自动自转，否则永远对不准。 */
    var idx = 0;
    function goTo(i) {
      var n = Math.max(cards.length, 1);
      idx = ((i % n) + n) % n;
      spin = 0;
      tyaw = 0.6 + idx * (Math.PI * 2 / n);
      vel = 0;
      if (REDUCED) { world.rotation.y = tyaw; fade(); renderer.render(scene, camera); }
      return idx;
    }

    function resize() {
      var w = host.clientWidth, h = host.clientHeight || 520;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      /* 取景：1.38 是"整颗球塞进带子里"（球只占画布高 72%），那就是一个摆件。
         参考站 /world/ 的实拍里经纬网是跑出画面四边的——行星比镜头大，读者才觉得自己
         在"看着一个世界"。0.95 让球在竖直方向溢出约 12%。
         相机同时下移 0.26R：球心抬到画面中线之上，带子底下留出一条真空，
         1/3 计数和"拖动旋转"提示落在那片真空里，不再压在卡片上（B 变体实测会压）。 */
      var tanV = Math.tan((FOV * Math.PI / 180) / 2);
      var need = R * 0.95;
      camera.position.z = Math.max(need / tanV, need / (tanV * camera.aspect));
      camera.position.y = -R * 0.26;
      camera.updateProjectionMatrix();
      fade();
    }

    /* 指针倾斜：参考站 updateHoverRotation 用 lerp 0.1 逼近 ±3° / ∓2° */
    var mx = 0, my = 0, tmx = 0, tmy = 0;
    addEventListener("pointermove", function (e) {
      tmx = (e.clientX / innerWidth - 0.5) * 2;
      tmy = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });

    var last = performance.now(), frames = 0, acc = 0, tier = 0, DPR0 = renderer.getPixelRatio();
    var lastTick = performance.now();
    function tick(now) {
      /* 球体和首屏舞台同理：菜单/索引层是满屏玻璃，身后那两层画布只要还在更新，
         浏览器就要把整块背景重新模糊一遍。停帧的判据与理由见 overlayIdle。 */
      if (overlayIdle(now)) { lastTick = now; return; }
      var dt = Math.min(0.1, Math.max(0.001, (now - lastTick) / 1000)); lastTick = now;
      if (!dragging) { tyaw += (spin + vel) * dt * 60; vel = decayTo(vel, 0.94, dt); }
      yaw = easeTo(yaw, tyaw, 0.08, dt);
      mx = easeTo(mx, tmx, 0.1, dt); my = easeTo(my, tmy, 0.1, dt);
      world.rotation.y = yaw + mx * 0.0349;               // ±2°
      world.rotation.x = 0.14 + my * 0.0524;              // ±3°
      /* 星空自己极慢地走：它不转的话，卡片在动、星星不动，读者会觉得星星是
         贴在窗口上的；转得和球一样快又会被当成球的一部分。取球速的约 1/20。 */
      stars.rotation.y += 0.00007 * dt * 60;
      fade();
      renderer.render(scene, camera);
      frames++; acc += (now - last); last = now;
      if (acc >= 1000) {
        if (frames * 1000 / acc < 42 && tier < 2) {
          tier++; renderer.setPixelRatio(Math.max(1, DPR0 - tier * 0.5)); resize();
        }
        frames = 0; acc = 0;
      }
    }

    resize();
    addEventListener("resize", resize);
    if (REDUCED) { world.rotation.y = 0.6; fade(); renderer.render(scene, camera); return { reduced: true, goTo: goTo, stop: function () {} }; }
    var raf = requestAnimationFrame(function loop(now) { tick(now); raf = requestAnimationFrame(loop); });
    return { reduced: false, goTo: goTo, stop: function () { cancelAnimationFrame(raf); } };
  }

  /* ============================================================
     房间场景（参考站 /contact/ 的 3D 房间手法）：
     相机在盒子内部，自己的作品像画作一样挂在墙上，指针视差 + 拖拽环视。
     材质仍是 MeshBasicMaterial；光照用一张径向渐变贴图假造光池，不开实时光。
     ============================================================ */
  function room(opts) {
    var THREE = global.THREE;
    if (!THREE) throw new Error("three.js missing");
    var host = opts.host, canvas = opts.canvas;
    var gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) throw new Error("WebGL unavailable");
    if (!host.clientWidth || !host.clientHeight) throw new Error("room host has no size");

    var REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(opts.bg || 0x141210);
    var camera = new THREE.PerspectiveCamera(56, 1, 0.1, 120);
    camera.position.set(0, 1.9, 4.6);

    var room3 = new THREE.Group();
    scene.add(room3);

    var W = 22, H = 8, D = 15;
    /* 六个面分开做，并画出房间轮廓：
       单个 BackSide 盒体所有面同色，看不到墙角，画面会读成"黑空间里飘着两张图"。 */
    var faces = [];
    function face(w, h, color, pos, rot) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide }));
      m.position.set(pos[0], pos[1], pos[2]);
      m.rotation.set(rot[0], rot[1], rot[2]);
      room3.add(m);
      faces.push(m);
      return m;
    }
    face(W, D, 0x241f1a, [0, -0.4, 0], [-Math.PI / 2, 0, 0]);          // 地板（接光池）
    face(W, D, 0x0d0b0a, [0, H - 0.4, 0], [Math.PI / 2, 0, 0]);        // 天花
    face(W, H, 0x1c1916, [0, H / 2 - 0.4, -D / 2], [0, 0, 0]);         // 前墙
    face(D, H, 0x171412, [-W / 2, H / 2 - 0.4, 0], [0, Math.PI / 2, 0]); // 左墙
    face(D, H, 0x141110, [W / 2, H / 2 - 0.4, 0], [0, -Math.PI / 2, 0]);  // 右墙

    /* 墙角线：一眼建立"这是个房间"的透视 */
    var edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W, H, D)),
      new THREE.LineBasicMaterial({ color: 0x6a6157, transparent: true, opacity: 0.5 }));
    edges.position.y = H / 2 - 0.4;
    room3.add(edges);

    /* 地面光池：一张径向渐变贴在地板上，假出顶光 */
    var pool = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.72, D * 0.72),
      new THREE.MeshBasicMaterial({ map: shadowTexture(THREE), transparent: true, opacity: 0.5, depthWrite: false }));
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(0, -0.38, 0);
    room3.add(pool);

    var texLoader = new THREE.TextureLoader();
    var redraw = function () { renderer.render(scene, camera); };
    var items = opts.items || [];

    function hang(it) {
      var w = it.w || 3.2, h = it.h || 2.1;
      var g = new THREE.Group();
      var face = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
      g.add(face);
      var frame = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.16, h + 0.16),
        new THREE.MeshBasicMaterial({ color: 0x0d0b09 }));
      frame.position.z = -0.02;
      g.add(frame);
      /* 墙上的落影 */
      var sh = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.35, h * 1.35),
        new THREE.MeshBasicMaterial({ map: shadowTexture(THREE), transparent: true, opacity: 0.42, depthWrite: false }));
      sh.position.set(0.18, -0.22, -0.05);
      g.add(sh);

      g.position.set(it.x || 0, it.y || 1.6, it.z || 0);
      g.rotation.y = it.ry || 0;
      room3.add(g);

      texLoader.load(it.src, function (t) {
        face.material.map = t; face.material.opacity = 1; face.material.needsUpdate = true;
        if (REDUCED) redraw();
      }, undefined, function () { g.visible = false; if (REDUCED) redraw(); });
    }
    items.forEach(hang);

    /* 环视：yaw/pitch 都夹住范围，不让人转到墙外 */
    var tyaw = 0, tpitch = 0, yaw = 0, pitch = 0, dragging = false, sx = 0, sy = 0, byaw = 0, bpitch = 0;
    addEventListener("pointermove", function (e) {
      if (dragging) {
        tyaw = Math.max(-0.85, Math.min(0.85, byaw + (e.clientX - sx) / innerWidth * 1.5));
        tpitch = Math.max(-0.20, Math.min(0.20, bpitch + (e.clientY - sy) / innerHeight * 0.5));
        return;
      }
      tyaw = Math.max(-0.30, Math.min(0.30, (e.clientX / innerWidth - 0.5) * 0.42));
      tpitch = Math.max(-0.10, Math.min(0.10, (e.clientY / innerHeight - 0.5) * 0.16));
    }, { passive: true });
    host.addEventListener("pointerdown", function (e) {
      if (e.target.closest("a,button")) return;
      dragging = true; sx = e.clientX; sy = e.clientY; byaw = tyaw; bpitch = tpitch;
      host.classList.add("is-grabbing");
    });
    addEventListener("pointerup", function () { dragging = false; host.classList.remove("is-grabbing"); });

    /* 参考站 /contact/ 有 change 处理器直接换 world/text/grass 的材质；
       这里等价地提供展厅灯光色调切换（换面色 + 背景 + 墙角线）。 */
    var THEMES = opts.themes || [];
    function setTheme(i) {
      if (!THEMES.length) return 0;
      var t = THEMES[((i % THEMES.length) + THEMES.length) % THEMES.length];
      faces.forEach(function (m, k) { m.material.color.setHex((t.faces && t.faces[k]) || t.bg); });
      scene.background.setHex(t.bg);
      edges.material.color.setHex(t.edge || 0x6a6157);
      pool.material.opacity = t.pool == null ? 0.5 : t.pool;
      if (REDUCED) redraw();
      return i;
    }
    var themeIdx = 0;

    function resize() {
      var w = host.clientWidth, h = host.clientHeight || 520;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      /* 窄屏往后退，否则相机贴墙、画面被裁 */
      camera.position.z = camera.aspect < 0.85 ? 8.2 : (camera.aspect < 1.25 ? 6.4 : 5.2);
      camera.updateProjectionMatrix();
    }
    var lastRoom = performance.now();
    function tick(now) {
      /* 案例详情页的顶栏同样能开菜单——那是一层满屏玻璃。展厅相机虽然只在指针
         动的时候才转，但它每帧都在重绘，玻璃就得每帧重模糊。判据见 overlayIdle。 */
      if (overlayIdle(now)) { lastRoom = now; return; }
      var dt = Math.min(0.1, Math.max(0.001, (now - lastRoom) / 1000)); lastRoom = now;
      yaw = easeTo(yaw, tyaw, 0.06, dt); pitch = easeTo(pitch, tpitch, 0.06, dt);
      camera.rotation.y = -yaw;
      camera.rotation.x = -pitch;
      renderer.render(scene, camera);
    }
    resize();
    addEventListener("resize", resize);
    if (REDUCED) { redraw(); return { reduced: true, setTheme: setTheme, stop: function () {} }; }
    var raf = requestAnimationFrame(function loop(t) { tick(t); raf = requestAnimationFrame(loop); });
    return { reduced: false, setTheme: setTheme, stop: function () { cancelAnimationFrame(raf); } };
  }

  /* ---------------- strip：参考站的非滚动作品列表 ----------------
     参考站四页全部 scrollHeight==视口、overflow:hidden、一个满屏 canvas、零 DOM 图片。
     看起来在滚，其实是滚轮驱动场景位移。这里就是那个位移：
     卡片是贴图平面，offset 是小数索引，滚轮/拖拽改 target，每帧 lerp 追过去。
     DOM 只留覆盖层的文字和一份隐藏标签（SEO/读屏），和参考站同一手法。 */
  function strip(opts) {
    var THREE = global.THREE;
    if (!THREE) throw new Error("three.js missing");
    var host = opts.host, canvas = opts.canvas;
    var gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) throw new Error("WebGL unavailable");
    var REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace || renderer.outputColorSpace;

    var scene = new THREE.Scene();
    if (opts.bg != null) scene.background = new THREE.Color(opts.bg);
    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    var root = new THREE.Group();
    scene.add(root);
    var shadowTex = shadowTexture(THREE);

    /* 贴一张纸做底，而不是只给 scene.background 一个色值 */
    var paper = new THREE.Mesh(new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: paperTexture(THREE, opts.paperBase || "#15131A"), depthWrite: false }));
    paper.position.z = -6;
    scene.add(paper);

    var items = opts.items || [];
    var cards = [];
    var SPACING = 1.4;            // 每帧按视口重算，先占位
    var OFF = 0.18;               // 焦点卡往下挪一点：上方留给词标和筛选，别叠在一起
    /* stop() 之后仍可能有贴图回调到达：那时再 render 就等于把刚释放的纹理又传一遍。
       用一个 stopped 标志把重绘和迟到的回调一起关在门外。 */
    var stopped = false;
    var redraw = function () { if (!stopped) renderer.render(scene, camera); };

    items.forEach(function (it, i) {
      var g = new THREE.Group();
      var mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
      var mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
      g.add(mesh);
      var frame = new THREE.Mesh(new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ color: 0x2E2A31, transparent: true, opacity: 0.9 }));
      frame.position.z = -0.012; frame.scale.set(1.02, 1.02, 1);
      g.add(frame);
      var sh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.15),
        new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
      sh.position.set(0.06, -0.12, -0.05);
      g.add(sh);
      g.userData = { i: i, ar: it.ar || 1.6, mesh: mesh, mat: mat, frame: frame, sh: sh, ready: false };
      root.add(g);
      cards.push(g);

      if (!it.src) {                       // 空态作品位：没有图也要占一格，不能凭空消失
        mesh.visible = false; frame.visible = false; sh.visible = false;
        var ph = new THREE.Mesh(new THREE.PlaneGeometry(1, 1),
          new THREE.MeshBasicMaterial({ color: 0x2A2630, transparent: true, opacity: 0.95 }));
        g.add(ph); g.userData.ph = ph;
        g.userData.ready = true;
        return;
      }
      var loader = new THREE.TextureLoader();
      loader.setCrossOrigin("anonymous");
      loader.load(it.src, function (tex) {
        /* 换筛选时上一批请求还在飞。已经 stop 就把这张纹理直接释放掉——
           挂到一个没人渲染的材质上，它就是白占的显存。 */
        if (stopped) { tex.dispose(); return; }
        tex.colorSpace = THREE.SRGBColorSpace || tex.colorSpace;
        tex.anisotropy = 4;
        mat.map = tex; mat.needsUpdate = true;
        g.userData.ready = true;
        if (opts.onReady) opts.onReady(i);
        redraw();
      }, undefined, function () {
        /* 加载失败要让人看出来，而不是留一张白牌假装是作品 */
        mat.color.set(0x55505E); g.userData.ready = true; redraw();
      });
    });

    /* 卡片要"填满可用的那块"，不是先按固定高再被宽度挤小——
       那样 5.8:1 的横幅会缩成一条，画面中间就剩一小块。 */
    /* 词标区与焦点条都是 DOM，它们各占多少必须量出来。
       以前是写死的 boxH = halfH*0.84 再整体下移 OFF = halfH*0.30，
       实测焦点条压在焦点卡上 30%–45%（1280×800 那档最狠）——
       作品集里被压住的偏偏就是正在看的那张作品。 */
    function band() {
      var r = canvas.getBoundingClientRect();
      var head = host.querySelector(".stagehead"), cap = host.querySelector("#stagecap");
      var hb = head ? head.getBoundingClientRect().bottom : r.top;
      var ct = (cap && !cap.hidden) ? cap.getBoundingClientRect().top : r.bottom;
      var top = hb - r.top + 8, bot = ct - r.top - 8;
      /* 让位带必须收在画布自己那块盒子里。静帧档焦点条是 position:static，
         落在画布下面——不夹的话 bot 会超出画布底，卡片按"画布外的带"居中，
         下半截就被画布边缘切掉。 */
      top = Math.max(8, Math.min(top, r.height - 8));
      bot = Math.min(r.height - 8, Math.max(bot, top + 8));
      /* 极矮窗口：量出来的带子自己都不够高。以前整条换成按比例的
         16%–80%，等于把卡片又抬回页头底下——top=60 而页头下沿是 138，卡片顶边量到
         101，"全部作品"那排字直接写在卡片贴图上。改成只往下要：top 是量出来的页头
         下沿，不能碰；往下伸进焦点条那块不透明暗底后面，最多被盖住而不会把字压花。
         门槛 22%→20%：812×375 让位之后真实带子是 83px，22% 要 82.5px——半个像素的
         余量不叫余量，焦点条再高 1px 就动用兜底、卡片下半截塞进条后面。 */
      if (bot - top < r.height * 0.20) {
        bot = Math.max(bot, Math.min(r.height - 8, top + r.height * 0.20));
      }
      return {top: top, bot: bot, h: r.height};
    }

    function fit() {
      if (stopped) return false;
      /* 量 canvas 自己的盒子，不是 host 的。setSize 传 updateStyle=false，
         所以画布缓冲区必须和 CSS 给的那块盒子一致，否则浏览器会把缓冲区
         硬缩进盒子里——静帧那一档 canvas 被媒体查询改成 height:62dvh，
         host 却还是 ~100dvh，卡片被压成 480×170（本该 480×270），
         而让位带是按 host 高度算的，页头那 268px 根本没被让出来，
         副标题和筛选胶囊就直接写在卡片上了。 */
      var cb = canvas.getBoundingClientRect();
      var w = Math.round(cb.width), h = Math.round(cb.height);
      if (!w || !h) return false;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      var halfH = Math.tan((camera.fov * Math.PI / 180) / 2) * camera.position.z;
      var halfW = halfH * camera.aspect;
      var b = band(), px = h / (2 * halfH);      // 1 世界单位 = 多少屏幕像素
      /* 顶部留给词标+筛选，底部留给焦点条：卡片只在这两条之间的自由带里长大，
         焦点卡中心落在自由带中心，所以既不被字压也不被条盖。 */
      var boxH = Math.min(halfH * 0.84, (b.bot - b.top) / px * 0.98);
      var boxW = halfW * 1.62;
      cards.forEach(function (g) {
        var ar = g.userData.ar || 1.6;
        var ch = boxH, cw = ch * ar;
        if (cw > boxW) { cw = boxW; ch = cw / ar; }
        g.userData.w = cw; g.userData.h = ch;
      });
      SPACING = boxH * 1.30;
      OFF = halfH * ((b.top + b.bot) / h - 1);   // 布局里焦点卡在 y = -OFF
      /* 底图要铺满相机在 z=-6 处看到的范围，留 20% 余量防边缘露色 */
      var bh = Math.tan((camera.fov * Math.PI / 180) / 2) * (camera.position.z + 6);
      paper.scale.set(bh * camera.aspect * 2.4, bh * 2.4, 1);
      camera.updateProjectionMatrix();
      layout();
      redraw();
      return true;
    }

    var offset = 0, target = 0, vel = 0;
    function layout() {
      var n = cards.length;
      cards.forEach(function (g, i) {
        var d = i - offset;                                 // 以焦点行为原点的距离
        var u = g.userData;
        g.position.set(0, -d * SPACING - OFF, -Math.abs(d) * 0.55);
        var w = u.w || 1, h = u.h || 1;                     // fit() 之前先给个安全值
        var near = Math.max(0, 1 - Math.abs(d));            // 1=焦点，0=远离
        var sc = 0.88 + 0.12 * near;
        u.k = sc;
        g.scale.set(w * sc, h * sc, 1);
        g.rotation.x = Math.max(-0.5, Math.min(0.5, d * 0.30));   // 远处的纸往下折
        /* 邻卡要快速退到"几乎看不见"：它们和顶栏、焦点条在同一块屏幕上，
           淡得不够就会糊在词标上（实测上一版第 1 张压在 DT ALEX 字标上）。 */
        var op = Math.max(0, 1 - Math.pow(Math.abs(d), 0.85) * 1.9);
        u.mat.opacity = op; u.frame.material.opacity = op * 0.9; u.sh.material.opacity = op * 0.8;
        if (u.ph) u.ph.material.opacity = op * 0.9;
        g.visible = op > 0.02;
      });
      var idx = Math.max(0, Math.min(n - 1, Math.round(offset)));
      if (idx !== layout.last && opts.onFocus) { layout.last = idx; opts.onFocus(idx); }
    }
    layout.last = -1;

    function clamp(t) { return Math.max(0, Math.min(cards.length - 1, t)); }
    var lastStep = performance.now();
    function step(now) {
      if (stopped) return;                 // 已经交还画布：这一帧既不推进也不再画
      var dt = Math.min(0.1, Math.max(0.001, (now - lastStep) / 1000)); lastStep = now;
      target = clamp(target + vel);
      vel = decayTo(vel, 0.86, dt);
      if (Math.abs(vel) < 0.0004) vel = 0;
      var prev = offset;
      offset = easeTo(offset, target, 0.14, dt);
      if (Math.abs(offset - prev) > 0.0004 || vel) layout();
      /* 必须每帧真的画：只改 position 不 render 的话，状态在推进、
         画面却永远停在第 0 帧——看起来就是"滚了但图没换"。 */
      renderer.render(scene, camera);
      raf = requestAnimationFrame(step);
    }

    var raf = 0, capRO = null;
    /* resize 处理器必须是有名字的：匿名写法在 stop() 里摘不掉，
       而换一次筛选就 add 一遍——点几轮之后每次缩放窗口都有 N 个处理器
       去 setSize 一个已经废弃的 renderer。 */
    function onResize() { fit(); }
    if (!fit()) {                            // 尺寸没就绪就等一帧，别静默画成 0×0
      requestAnimationFrame(function retry() {
        if (stopped) return;                 // 等尺寸期间被换掉：别把已经释放的场景救活
        if (fit() || REDUCED) begin(); else requestAnimationFrame(retry);
      });
    } else begin();

    function begin() {
      /* 焦点条的高度随作品文字长短变（标题一行还是两行、说明的换行数不同），
         只在挂载那一刻量一次会留下 1%–4% 的压角。跟着它的尺寸变化重排一次。 */
      var capEl = host.querySelector("#stagecap");
      if (capEl && window.ResizeObserver) {
        capRO = new ResizeObserver(function () { fit(); });
        capRO.observe(capEl);
      }
      if (REDUCED) {
        /* 静帧：不起补间循环，但"点卡片进入"这句提示得真的成立，所以挂点击。
           滚轮不接管——那条 reduced-motion 的 CSS 已经把这一页解锁成可滚文档，
           滚轮此时该归文档，抢走它用户就滚不动了。 */
        host.addEventListener("pointerdown", onDown);
        addEventListener("pointerup", onUp);
        addEventListener("resize", onResize);
        offset = target = 0; layout(); redraw(); return;
      }
      addEventListener("wheel", onWheel, { passive: false });
      host.addEventListener("pointerdown", onDown);
      addEventListener("pointermove", onMove, { passive: true });
      addEventListener("pointerup", onUp);
      addEventListener("resize", onResize);
      raf = requestAnimationFrame(step);
    }

    /* 停手就吸附：不然会停在两张卡中间，焦点条说 02、画面正中却是 01，
       看起来像错位而不是"正在浏览"。 */
    var snap = 0;
    /* 静帧模式没有补间循环：改了 target 必须自己算一次布局并画一帧，
       否则 ↑↓、方向键、点清单条目全是"按了没反应"，画面永久停在第 0 张。 */
    function snapNow() { offset = target; layout(); redraw(); }
    function wantSnap() {
      clearTimeout(snap);
      snap = setTimeout(function () {
        target = clamp(Math.round(target)); vel = 0;
        if (REDUCED) snapNow();
      }, 230);
    }

    var UNIT = 0.0016;
    function onWheel(e) {
      /* 页面本来就不滚，所以这里接管滚轮不会和文档滚动打架；
         但修饰键滚轮（缩放）和横向滚必须放行，否则抢了浏览器缩放。 */
      if (e.ctrlKey || e.metaKey) return;
      var d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (!d) return;
      e.preventDefault();
      target = clamp(target + d * UNIT * (e.deltaMode === 1 ? 18 : 1));
      wantSnap();
    }
    var down = false, sy = 0, moved = 0;
    function onDown(e) {
      if (e.target.closest("a,button")) return;
      down = true; sy = e.clientY; moved = 0;
      clearTimeout(snap);
      host.classList.add("is-grabbing");
    }
    function onMove(e) {
      if (!down) return;
      var dy = e.clientY - sy;
      moved = Math.max(moved, Math.abs(dy));
      sy = e.clientY;
      target = clamp(target - dy * 0.0042);
    }
    function onUp() {
      if (!down) return;
      down = false; host.classList.remove("is-grabbing");
      wantSnap();
    }

    var api = {
      /* 状态读数：把内部状态挂在 canvas 上，才能区分"焦点条写着 02"和
         "画面正中其实是第 1 张"这类错位——只看 DOM 永远查不出来。 */
      debug: function () { return { offset: offset, target: target, spacing: SPACING, off: OFF,
                                   cards: cards.map(function (g, i) {
                                     /* 投影之后的屏幕盒：焦点条 / 词标 / 筛选胶囊都是 DOM，
                                        只有把卡的四角投到屏幕上，才能算出"画面和文字谁压了谁"。
                                        卡是 1×1 面片按组缩放，所以取 ±0.5 的局部角即可。 */
                                     var r = canvas.getBoundingClientRect(), xs = [], ys = [];
                                     for (var q = 0; q < 4; q++) {
                                       var v = new THREE.Vector3((q === 0 || q === 3) ? -0.5 : 0.5,
                                                                 (q < 2) ? -0.5 : 0.5, 0);
                                       g.localToWorld(v); v.project(camera);
                                       xs.push((v.x * 0.5 + 0.5) * r.width + r.left);
                                       ys.push((0.5 - v.y * 0.5) * r.height + r.top);
                                     }
                                     return { i: i, y: +g.position.y.toFixed(3), vis: g.visible,
                                              rot: +g.rotation.x.toFixed(3), k: +(g.userData.k || 0).toFixed(3),
                                              ready: !!g.userData.ready, hasMap: !!g.userData.mat.map,
                                              x0: Math.round(Math.min.apply(null, xs)),
                                              x1: Math.round(Math.max.apply(null, xs)),
                                              y0: Math.round(Math.min.apply(null, ys)),
                                              y1: Math.round(Math.max.apply(null, ys)),
                                              tex: (g.userData.mat.map && g.userData.mat.map.image && g.userData.mat.map.image.src || "").split("/").pop() };
                                   }) }; },
      goTo: function (i) { target = clamp(i); vel = 0; if (REDUCED) snapNow(); },
      next: function () { api.goTo(Math.round(target) + 1); },
      prev: function () { api.goTo(Math.round(target) - 1); },
      count: function () { return cards.length; },
      index: function () { return Math.round(offset); },
      stop: function () {
        if (stopped) return;
        stopped = true;
        cancelAnimationFrame(raf);
        removeEventListener("wheel", onWheel);
        removeEventListener("pointermove", onMove);
        removeEventListener("pointerup", onUp);
        removeEventListener("resize", onResize);
        host.removeEventListener("pointerdown", onDown);
        if (capRO) { capRO.disconnect(); capRO = null; }
        /* 显存要自己收：换一次筛选就重建整套贴图，11 张 1672×941 约 70MB，
           不释放的话点几轮就把上下文压垮——表现是画面整片变黑，不是"慢一点"。
           统一用 traverse 收，卡片结构以后变了也不用回来改这里。 */
        scene.traverse(function (o) {
          if (o.geometry) o.geometry.dispose();
          var ms = Array.isArray(o.material) ? o.material : [o.material];
          ms.forEach(function (m) { if (!m) return; if (m.map) m.map.dispose(); m.dispose(); });
        });
        renderer.dispose();
        if (canvas.__strip === api) canvas.__strip = null;
      },
      reduced: REDUCED
    };
    canvas.__strip = api;
    return api;
  }

  global.DTSCENE = { start: start, sphere: sphere, room: room, strip: strip, ready: ready };

})(typeof window !== "undefined" ? window : this);
