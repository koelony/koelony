/**
 * Placeholder koel "K" mark, after the concept sketch: a black K of rounded lobes with a white koel
 * and a red eye. Final artwork pending.
 */
export function Logo({ size = 32, title }: { size?: number; title?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className="logo-mark"
    >
      <path
        fill="currentColor"
        d="M12 22a12 12 0 0 1 24 0v8L54 12a20 20 0 0 1 28 28L66 54a20 20 0 0 1-2 34 20 20 0 0 1-22-4L36 78v2a12 12 0 0 1-24 0Z"
      />
      <path
        fill="var(--paper, #fff)"
        d="M15 78c3-20 16-30 28-38 6-4 8-14 16-16 6-1 10 1 13 4l7 1-8 2c-6 2-10 8-11 14 0 12-8 22-22 28-8 4-15 8-19 12-3 0-4-3-4-7Z"
      />
      <circle cx="63" cy="29" r="2.6" fill="var(--koel-red, #d0201a)" />
    </svg>
  );
}
