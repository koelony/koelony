/**
 * The page's motion is in the stylesheet; this only tells it where the reader is. Every
 * `[data-watch]` element gets `data-seen` the first time it comes on screen (lines rule themselves,
 * sizes confirm) and carries `data-in` for as long as it is on screen (loops run only then).
 *
 * `html.watch` says the observer is live. Until then, and if it never arrives, styles.css shows the
 * finished state after a few seconds, so nothing depends on this having run.
 */
export function watchPage(): () => void {
  const nodes = document.querySelectorAll<HTMLElement>("[data-watch]");
  if (!("IntersectionObserver" in window)) {
    for (const node of nodes) node.dataset.seen = "";
    return () => {};
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const node = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          node.dataset.seen = "";
          node.dataset.in = "";
        } else {
          delete node.dataset.in;
        }
      }
    },
    // A little way up from the bottom edge, so a line starts drawing where the eye already is.
    { rootMargin: "0px 0px -10% 0px" },
  );
  for (const node of nodes) observer.observe(node);
  document.documentElement.classList.add("watch");
  return () => observer.disconnect();
}
