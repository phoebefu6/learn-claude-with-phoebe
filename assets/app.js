/* learn-claude-with-phoebe - shared page behavior
   Accordions (expand/collapse all), copy-to-clipboard prompt boxes,
   lightbox zoom for figures, projector font-scale toggle. */

(function () {
  "use strict";

  /* ----- expand / collapse all accordions ----- */
  var toggleAllBtn = document.getElementById("toggle-all");
  if (toggleAllBtn) {
    toggleAllBtn.addEventListener("click", function () {
      var cards = document.querySelectorAll("details.card");
      var anyClosed = Array.prototype.some.call(cards, function (d) { return !d.open; });
      cards.forEach(function (d) { d.open = anyClosed; });
      toggleAllBtn.textContent = anyClosed ? "Collapse all" : "Expand all";
    });
  }

  /* ----- projector zoom: 100% -> 125% -> 150% -> 100% ----- */
  var zoomBtn = document.getElementById("zoom-toggle");
  var zoomLevels = ["", "zoom-125", "zoom-150"];
  var zoomLabels = ["Projector zoom: off", "Projector zoom: 125%", "Projector zoom: 150%"];
  var zoomIdx = 0;
  if (zoomBtn) {
    zoomBtn.addEventListener("click", function () {
      document.documentElement.classList.remove("zoom-125", "zoom-150");
      zoomIdx = (zoomIdx + 1) % zoomLevels.length;
      if (zoomLevels[zoomIdx]) document.documentElement.classList.add(zoomLevels[zoomIdx]);
      zoomBtn.textContent = zoomLabels[zoomIdx];
    });
  }

  /* ----- copy buttons on prompt boxes ----- */
  document.querySelectorAll(".prompt-box").forEach(function (box) {
    var btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      var clone = box.cloneNode(true);
      clone.querySelectorAll(".copy-btn, .label").forEach(function (el) { el.remove(); });
      var text = clone.textContent.trim();
      function done() {
        btn.textContent = "Copied ✓";
        btn.classList.add("copied");
        setTimeout(function () {
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        }, 1800);
      }
      function legacyCopy() {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        done();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, legacyCopy);
      } else {
        legacyCopy();
      }
    });
    box.appendChild(btn);
  });

  /* ----- lightbox zoom for figures ----- */
  var lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = '<span class="close-hint">Click anywhere or press Esc to close</span><div class="inner"></div>';
  document.body.appendChild(lightbox);
  var lightboxInner = lightbox.querySelector(".inner");

  document.querySelectorAll("figure.zoomable").forEach(function (fig) {
    fig.addEventListener("click", function () {
      var media = fig.querySelector("svg, img");
      if (!media) return;
      lightboxInner.innerHTML = "";
      lightboxInner.appendChild(media.cloneNode(true));
      lightbox.classList.add("open");
    });
  });

  lightbox.addEventListener("click", function () { lightbox.classList.remove("open"); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") lightbox.classList.remove("open");
  });

  /* ----- micro-interactions (react-bits inspired, vanilla ports) ----- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* BlurText: staggered word reveal on the masthead headline */
  var h1 = document.querySelector(".masthead h1");
  if (h1 && !reduceMotion) {
    var wordIdx = 0;
    var wrapWords = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === Node.TEXT_NODE) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (/^\s+$/.test(part) || part === "") {
              frag.appendChild(document.createTextNode(part));
            } else {
              var span = document.createElement("span");
              span.className = "bw";
              span.style.setProperty("--bw-delay", (wordIdx * 0.07) + "s");
              span.textContent = part;
              frag.appendChild(span);
              wordIdx++;
            }
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          wrapWords(child);
        }
      });
    };
    wrapWords(h1);
  }

  /* SpotlightCard: cursor-following highlight on accordion cards */
  document.querySelectorAll("details.card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ScrollReveal: sections rise in as they enter the viewport */
  if (!reduceMotion) {
    var toReveal = Array.prototype.slice.call(document.querySelectorAll(".section, .cheat"));
    if (toReveal.length) {
      document.documentElement.classList.add("js-reveal");
      var revealCheck = function () {
        var limit = window.innerHeight * 0.92;
        toReveal = toReveal.filter(function (sec) {
          if (sec.getBoundingClientRect().top < limit) {
            sec.classList.add("revealed");
            return false;
          }
          return true;
        });
        if (!toReveal.length) {
          window.removeEventListener("scroll", revealCheck);
          window.removeEventListener("resize", revealCheck);
        }
      };
      window.addEventListener("scroll", revealCheck, { passive: true });
      window.addEventListener("resize", revealCheck);
      revealCheck();
    }
  }
})();
