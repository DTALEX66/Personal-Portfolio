/* 首帧之前把语言与"翻页中"状态定下来，避免先闪另一种语言或闪一下未遮住的页面 */
(function () {
  try {
    var l = localStorage.getItem("dt-lang") || "zh";
    document.documentElement.setAttribute("data-lang", l);
  } catch (e) {
    document.documentElement.setAttribute("data-lang", "zh");
  }
  /* 上一跳是站内跳转：立刻铺一层不透明遮罩，等 core 播擦出动画。
     放在这里而不是 core，是因为 core 要等 DOMContentLoaded，那时页面已经会闪一下。 */
  try {
    if (sessionStorage.getItem("dt-nav")) {
      var m = document.createElement("div");
      m.className = "mask hold";
      m.setAttribute("aria-hidden", "true");
      document.documentElement.appendChild(m);
      window.__dtNav = true;
    }
  } catch (e) {}
})();
