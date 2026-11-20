/** How the rest of the page talks to the koel. Safe to import anywhere; only call in the browser. */
export const NUDGE_EVENT = "koel:nudge";

/** Something happened right under the koel: if it is sitting on `perch`, it bobs. */
export const nudgeKoel = (perch: string) =>
  window.dispatchEvent(new CustomEvent(NUDGE_EVENT, { detail: perch }));
