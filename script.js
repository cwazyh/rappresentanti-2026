/* Rappresentanti d'Istituto 2026/27 — interazioni leggere, zero dipendenze */
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===== 1. Tema chiaro/scuro (stile iOS, salvato in localStorage) ===== */
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");

  const stored = localStorage.getItem("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = stored || (systemDark ? "dark" : "light");

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    const isDark = theme === "dark";
    toggle.setAttribute("aria-checked", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Attiva modalità chiara" : "Attiva modalità scura");
  };

  applyTheme(initialTheme);

  toggle.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });

  /* ===== 2. Scroll reveal con stagger (solo transform/opacity) ===== */
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("visible"));
  } else {
    // Stagger: fratelli nello stesso gruppo entrano sfalsati di 60ms
    const groups = new Map();
    revealEls.forEach((el) => {
      const parent = el.parentElement;
      const index = groups.get(parent) ?? 0;
      el.style.setProperty("--reveal-delay", `${Math.min(index * 60, 300)}ms`);
      groups.set(parent, index + 1);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // animazione una sola volta
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  /* ===== 3. Accordion (uno aperto alla volta, aria-correct) ===== */
  const headers = document.querySelectorAll(".acc-header");

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const isOpen = header.getAttribute("aria-expanded") === "true";

      // Chiudi gli altri (stile Impostazioni iOS)
      headers.forEach((h) => h.setAttribute("aria-expanded", "false"));

      if (!isOpen) header.setAttribute("aria-expanded", "true");
    });
  });

  /* ===== 4. CTA: ondina + badge ===== */
  const voteBtn = document.getElementById("voteBtn");
  const badge = document.getElementById("voteBadge");

  voteBtn.addEventListener("pointerdown", (e) => {
    if (prefersReducedMotion) return;

    const rect = voteBtn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    voteBtn.style.position = "relative";
    voteBtn.style.overflow = "hidden";
    voteBtn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });

  voteBtn.addEventListener("click", () => {
    badge.textContent = "Grazie, e fatevi sentire anche voi, Russell e Guarini!";
    badge.classList.add("show");
  });
})();
