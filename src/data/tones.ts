/**
 * The six tones of Hong Kong Cantonese as pitch contours on Chao's five-level scale (5 = highest),
 * with the textbook minimal set 詩史試時市事 (all "si"). Linguistic notation, not copy.
 */
export type Tone = { n: number; chao: string; from: number; to: number; zi: string; jp: string };

export const TONES: Tone[] = [
  { n: 1, chao: "55", from: 5, to: 5, zi: "詩", jp: "si1" },
  { n: 2, chao: "35", from: 3, to: 5, zi: "史", jp: "si2" },
  { n: 3, chao: "33", from: 3, to: 3, zi: "試", jp: "si3" },
  { n: 4, chao: "21", from: 2, to: 1, zi: "時", jp: "si4" },
  { n: 5, chao: "23", from: 2, to: 3, zi: "市", jp: "si5" },
  { n: 6, chao: "22", from: 2, to: 2, zi: "事", jp: "si6" },
];

/** Start and end level of a Jyutping syllable, read off its tone digit. */
export function contourOf(jyutping: string): { from: number; to: number; stop: boolean } | null {
  const tone = TONES.find((t) => String(t.n) === jyutping.slice(-1));
  if (!tone) return null;
  // Syllables closed by -p, -t or -k are cut short ("checked" tones).
  const stop = /[ptk]\d$/.test(jyutping);
  return { from: tone.from, to: stop ? tone.from : tone.to, stop };
}

/**
 * The koel's call: a low note, then a long rise that overshoots the top of the speaking range.
 * Each pair is [from, to] on the same five-level scale.
 */
export const KOEL_CALL: [number, number][] = [
  [2, 2.3],
  [2.6, 5.9],
];

/** Jyutping for words the page annotates wherever they appear in a heading. */
export const RUBY: Record<string, string[]> = { 噪鵑: ["cou3", "gyun1"] };
