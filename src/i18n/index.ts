import type { Locale } from "../site";
import { en } from "./en";
import type { Dict } from "./types";
import { zhHK } from "./zh-hk";

export const DICTS: Record<Locale, Dict> = { en, "zh-hk": zhHK };

export type { Dict, Status } from "./types";
