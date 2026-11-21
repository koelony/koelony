/**
 * Where the reader is. The header's bottom rule inks itself from left to right as the page is read
 * (`--read` on <html>, 0 to 1), and the menu marks the section in the middle of the window
 * (`data-here` on its link). Both are plain state, not animation, so reduced motion keeps them.
 */
export function startProgress(): () => void {
  const root = document.documentElement;
  let raf = 0;
  const update = () => {
    raf = 0;
    const max = root.scrollHeight - window.innerHeight;
    const read = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    root.style.setProperty("--read", read.toFixed(4));
  };
  const queue = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  update();
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);

  const links = [...document.querySelectorAll<HTMLAnchorElement>(".nav a[data-section]")];
  const byId = new Map<Element, HTMLAnchorElement>();
  for (const link of links) {
    const section = link.dataset.section && document.getElementById(link.dataset.section);
    if (section) byId.set(section, link);
  }
  // A section is "here" while it crosses a thin band across the middle of the window.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const link = byId.get(entry.target);
        if (!link) continue;
        if (entry.isIntersecting) {
          for (const other of links) delete other.dataset.here;
          link.dataset.here = "";
        } else {
          delete link.dataset.here;
        }
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  for (const section of byId.keys()) observer.observe(section);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("scroll", queue);
    window.removeEventListener("resize", queue);
    observer.disconnect();
    root.style.removeProperty("--read");
  };
}
