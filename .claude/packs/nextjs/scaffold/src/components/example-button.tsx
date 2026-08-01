'use client';
// "use client" because it holds interaction state — it is the interactive
// LEAF, never the whole page (PACK.md rule: Server Components by default).

// ─────────────────────────────────────────────────────────────────────────────
// AGENCY REFERENCE COMPONENT — DELETE once the project has real components.
// It exists only to show the expected style:
//   1. Props typed with a union of literals (never an enum — PACK.md rule).
//   2. Extends native attributes (Omit of what the component controls).
//   3. Accessible loading state: aria-busy + disabled, without swapping the
//      text out of nowhere (screen readers announce the state change).
//   4. type="button" as the default — a button inside a <form> must not
//      submit by accident.
//   5. Styling via data attribute (data-variant) — CSS/Tailwind decides the
//      look; the component only exposes the state.
// ─────────────────────────────────────────────────────────────────────────────

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

type ExampleButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-busy'
> & {
  children: ReactNode;
  /** Visual variant. Style it via the [data-variant="..."] selector. */
  variant?: Variant;
  /** During an async action (a pending Server Action, for example). */
  loading?: boolean;
};

export function ExampleButton({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  type = 'button',
  ...rest
}: ExampleButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      data-variant={variant}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
    >
      {loading && (
        // Decorative indicator: hidden from screen readers — the real state
        // is already in aria-busy/disabled.
        <span aria-hidden="true">… </span>
      )}
      {children}
    </button>
  );
}

// Typical usage (with useActionState, the PACK.md mutation pattern):
//
//   const [state, formAction, pending] = useActionState(myAction, null);
//   <ExampleButton type="submit" loading={pending}>Submit</ExampleButton>
