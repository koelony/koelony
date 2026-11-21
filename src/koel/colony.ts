import type { Status } from "../i18n/types";
import type { BirdSpec } from "./Flock";

/**
 * Where every little koel stands. Move, add or remove a bird here; `BirdSpec` (Flock.tsx) says what
 * each field does. `x` runs along the bird's own line, and `1em` is one bird, so "+ 1.5em" stands
 * the next one beside it at any screen size.
 *
 * They are meant to be busy: every bird breathes all the time, and its act comes round every few
 * seconds (`every`), out of step with its neighbours (`phase`). `flit` birds take off and fly along
 * their line and back, so something on screen is always on the move.
 */

/**
 * The end of the hero staff, right to left. They come after the big koel has called, and stand a
 * line lower each, so the three step up towards it. Only as many as the row has room for are shown.
 * None is on the top line: on a phone the row above ends in a character right over it.
 */
export const HERO: BirdSpec[] = [
  { x: "calc(100% - 1.2em)", line: 1, face: -1, act: "hop nod", every: 4.2, phase: 0.1 },
  {
    x: "calc(100% - 3.3em)",
    line: 2,
    size: 0.88,
    look: -14,
    from: -1,
    act: "peck nod",
    every: 3.6,
    phase: 0.5,
    wait: 0.45,
  },
  {
    x: "calc(100% - 5.6em)",
    line: 3,
    face: -1,
    size: 0.94,
    lean: -10,
    act: "turn nod",
    every: 5.2,
    phase: 0.3,
    wait: 0.95,
  },
];

/**
 * On the header's bottom rule, in the gap between the logo and the menu: they stay on screen the
 * whole way down the page. Wide desktop screens only, where that gap is wide enough.
 */
export const HEADER: BirdSpec[] = [
  { x: "25%", act: "patrol", every: 9, wait: 2.6, xl: true, size: 0.8 },
  {
    x: "calc(25% + 3.4em)",
    face: -1,
    size: 0.72,
    act: "peck nod",
    every: 3.4,
    phase: 0.4,
    wait: 2.9,
    xl: true,
  },
  {
    x: "39%",
    face: -1,
    size: 0.76,
    act: "flit nod",
    reach: "3em",
    every: 8.5,
    phase: 0.6,
    wait: 3.2,
    xl: true,
  },
];

/** Section rules on the home page. `line: 2` sits in the staff under the rule, like a note. */
export const ASR_RULE: BirdSpec[] = [
  { x: "71%", face: -1, act: "hop nod", every: 4.4, phase: 0.2 },
  {
    x: "calc(71% + 1.5em)",
    size: 0.86,
    lean: -12,
    from: -1,
    act: "turn nod",
    every: 5.6,
    phase: 0.6,
    wait: 0.3,
  },
  { x: "17%", line: 2, size: 0.9, act: "hop", every: 4.8, phase: 0.4, wait: 0.7, wide: true },
  { x: "45%", size: 0.82, act: "flit nod", reach: "4em", every: 8, phase: 0.2, wait: 0.5 },
  { x: "90%", face: -1, size: 0.78, act: "patrol", every: 9.5, wait: 0.9, wide: true },
];
export const SIZES_RULE: BirdSpec[] = [
  { x: "72%", face: -1, size: 0.9, act: "peck nod", every: 3.8, phase: 0.4, wait: 0.5 },
  { x: "30%", size: 0.8, act: "flit", reach: "3em", every: 7.5, phase: 0.7, wait: 0.8 },
];
export const USED_BY_RULE: BirdSpec[] = [
  { x: "84%", face: -1, lean: 6, act: "peck nod", every: 4, phase: 0.35, wait: 0.2 },
  { x: "58%", size: 0.84, act: "flit nod", reach: "4.5em", every: 8.5, phase: 0.1, wait: 0.5 },
  {
    x: "calc(84% + 1.5em)",
    size: 0.78,
    lean: -10,
    act: "hop nod",
    every: 4.6,
    phase: 0.7,
    wait: 0.4,
    wide: true,
  },
];

/** The top edge of the demo band. The second looks down at the pen. */
export const BAND_EDGE: BirdSpec[] = [
  { x: "11%", from: -1, act: "tilt nod", every: 4.4, phase: 0.3 },
  { x: "62%", face: -1, look: 16, act: "nod", every: 3.2, phase: 0.7, wait: 0.3 },
  {
    x: "calc(62% + 1.6em)",
    face: -1,
    size: 0.84,
    lean: -14,
    act: "hop nod",
    every: 4.8,
    phase: 0.2,
    wait: 0.7,
  },
  { x: "33%", size: 0.82, act: "patrol", every: 9, phase: 0.5, wait: 0.5 },
  {
    x: "86%",
    face: -1,
    size: 0.8,
    act: "flit",
    reach: "4em",
    every: 7.8,
    phase: 0.4,
    wait: 0.9,
    wide: true,
  },
];

/**
 * The roadmap. `x` is measured from the model's dot: negative is back along its inked line, positive
 * is ahead of it on the rail. Rows of the same stage take these in turn, so the rows do not match.
 * Released: it has arrived, and others have joined it. In training: one hops on along the rail
 * towards the next stage and back, one works at the line. Research: one keeps trying to fly on to
 * the next stage and coming back.
 */
export const TRACK: Record<Status, BirdSpec[][]> = {
  released: [
    [
      { x: "-1.05em", from: -1, act: "hop nod", every: 4, phase: 0.3 },
      {
        x: "-3.2em",
        face: -1,
        size: 0.84,
        lean: -10,
        act: "turn nod",
        every: 5.5,
        phase: 0.2,
        wait: 0.4,
      },
      { x: "-5.4em", size: 0.78, act: "peck", every: 3.4, phase: 0.6, wait: 0.7 },
    ],
  ],
  training: [
    [
      { x: "0.95em", from: -1, act: "patrol nod", every: 8 },
      { x: "-2.4em", size: 0.8, act: "peck nod", every: 3.6, phase: 0.5, wait: 0.3 },
    ],
    [
      { x: "-1.15em", from: -1, lean: 4, act: "peck", every: 3.2, phase: 0.5 },
      { x: "1.2em", face: -1, size: 0.82, act: "hop nod", every: 4.4, phase: 0.2, wait: 0.3 },
    ],
  ],
  research: [
    [
      {
        x: "-1.25em",
        size: 0.92,
        lean: -12,
        act: "flit nod",
        reach: "3.6em",
        every: 7,
        phase: 0.6,
      },
    ],
    [{ x: "-1.1em", face: -1, size: 0.86, act: "hop nod", every: 4.2, phase: 0.1 }],
    [
      { x: "-1em", from: -1, size: 0.9, look: 14, act: "tilt nod", every: 4.6, phase: 0.1 },
      {
        x: "1.3em",
        size: 0.8,
        act: "flit",
        reach: "3em",
        every: 8,
        phase: 0.3,
        wait: 0.4,
      },
    ],
  ],
};

/**
 * The staff that closes the page: the colony, standing as notes. Three pairs, a low bird and a
 * higher one, each pair a line higher than the last, which is the koel's own call; and a few more
 * that cannot keep still.
 */
export const CHORUS: BirdSpec[] = [
  { x: "8%", line: 4, act: "hop nod", every: 4, phase: 0.2 },
  { x: "calc(8% + 1.5em)", line: 2, size: 0.9, act: "hop", every: 4.6, phase: 0.6, wait: 0.15 },
  { x: "34%", line: 3, size: 0.94, act: "turn nod", every: 5.4, phase: 0.1, wait: 0.5 },
  { x: "calc(34% + 1.5em)", line: 1, act: "nod", every: 3.4, phase: 0.5, wait: 0.65 },
  { x: "64%", line: 2, size: 0.9, act: "peck nod", every: 3.8, phase: 0.8, wait: 1 },
  {
    x: "calc(64% + 1.55em)",
    line: 0,
    look: -18,
    act: "tilt nod",
    every: 4.4,
    phase: 0.3,
    wait: 1.15,
  },
  { x: "85%", line: 1, face: -1, size: 0.86, act: "hop nod", every: 4.8, wait: 1.5, wide: true },
  {
    x: "93%",
    line: 3,
    face: -1,
    lean: -10,
    act: "nod",
    every: 3,
    phase: 0.4,
    wait: 1.7,
    wide: true,
  },
  { x: "20%", line: 4, size: 0.82, act: "patrol", every: 9, phase: 0.3, wait: 0.4 },
  {
    x: "48%",
    line: 0,
    size: 0.8,
    act: "flit nod",
    reach: "3.5em",
    every: 7.6,
    phase: 0.5,
    wait: 0.9,
  },
  { x: "76%", line: 4, face: -1, size: 0.84, act: "peck", every: 3.6, phase: 0.1, wait: 1.3 },
];

/** Section rules on the ASR page. */
export const ASR_PAGE = {
  models: [
    { x: "78%", face: -1, act: "hop nod", every: 4.2, phase: 0.2 },
    {
      x: "calc(78% + 1.5em)",
      size: 0.86,
      lean: -12,
      from: -1,
      act: "peck nod",
      every: 3.8,
      phase: 0.5,
      wait: 0.3,
    },
    { x: "40%", size: 0.82, act: "flit nod", reach: "4em", every: 8, phase: 0.3, wait: 0.5 },
  ],
  sizes: [
    { x: "92%", face: -1, size: 0.9, act: "peck nod", every: 3.6, phase: 0.4, wait: 0.5 },
    { x: "58%", size: 0.8, act: "patrol", every: 9, wait: 0.7, wide: true },
  ],
  bench: [
    { x: "13%", from: -1, act: "tilt nod", every: 4.4, phase: 0.3, wait: 0.2 },
    { x: "62%", face: -1, size: 0.84, act: "flit", reach: "4em", every: 7.6, phase: 0.6 },
  ],
  weights: [
    { x: "67%", face: -1, act: "turn nod", every: 5.2, phase: 0.3 },
    { x: "31%", line: 1, size: 0.9, act: "hop nod", every: 4.4, phase: 0.7, wait: 0.5, wide: true },
    { x: "86%", size: 0.8, act: "patrol", every: 9.5, phase: 0.2, wait: 0.8, wide: true },
  ],
} satisfies Record<string, BirdSpec[]>;
