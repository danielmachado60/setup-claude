// @ts-check

/* ────────────────────────────────────────────────────────────────────────────
   main.js — single entry point (ESM; <script type="module"> is already
   deferred, no redundant defer attribute — PACK.md).

   Pack pattern: each behavior is a function initX(el); the initialization
   block at the end of the file finds the elements via [data-*] and calls the
   init. JS finds elements by data attribute, NEVER by styling class — CSS
   and JS stay decoupled.

   THE MENU BELOW IS A DELETABLE EXAMPLE. It serves as a style reference
   (aria-expanded, progressive enhancement, event delegation, cleanup). If
   the project has no mobile menu, delete initMenu and its call at the bottom.
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Accessible mobile menu.
 *
 * Progressive enhancement: in the HTML the button starts with [hidden] and
 * the list is always visible — without JS the site remains 100% navigable.
 * This init:
 *   1. reveals the button (a "closed" menu only exists when there is JS to
 *      open it);
 *   2. toggles aria-expanded on click — the CSS collapses/shows the list
 *      based on THAT attribute (the accessible state is the single source of
 *      truth; no .open class duplicating state);
 *   3. closes on Escape returning focus to the button, and when a link in
 *      the list is clicked (same-page anchors).
 *
 * @param {HTMLElement} root Element with [data-menu] containing button and list.
 * @returns {() => void} Cleanup that removes the listeners — the PACK.md
 *   contract (harmless here because the header lives for the whole page, but
 *   every module that registers a listener exposes how to unregister it).
 */
function initMenu(root) {
  const button = root.querySelector('[data-menu-button]');
  const list = root.querySelector('[data-menu-list]');
  if (
    !(button instanceof HTMLButtonElement) ||
    !(list instanceof HTMLElement)
  ) {
    return () => {};
  }

  button.hidden = false;

  /** @param {boolean} open */
  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
  };

  const isOpen = () => button.getAttribute('aria-expanded') === 'true';

  const onButtonClick = () => {
    setOpen(!isOpen());
  };

  /** @param {KeyboardEvent} event */
  const onKeydown = (event) => {
    if (event.key === 'Escape' && isOpen()) {
      setOpen(false);
      button.focus(); // focus must not "die" inside an area that just closed
    }
  };

  /**
   * Event delegation: ONE listener on the list, never one per link (PACK.md).
   * @param {MouseEvent} event
   */
  const onListClick = (event) => {
    if (event.target instanceof Element && event.target.closest('a')) {
      setOpen(false);
    }
  };

  button.addEventListener('click', onButtonClick);
  root.addEventListener('keydown', onKeydown);
  list.addEventListener('click', onListClick);

  return () => {
    button.removeEventListener('click', onButtonClick);
    root.removeEventListener('keydown', onKeydown);
    list.removeEventListener('click', onListClick);
  };
}

/**
 * Current year in the footer © — avoids a stale footer on a site nobody
 * reopens. The HTML carries the hardcoded year as a no-JS fallback.
 * @param {Element} el Element with [data-year].
 */
function initYear(el) {
  el.textContent = String(new Date().getFullYear());
}

/* ── Initialization ─────────────────────────────────────────────────────────
   One querySelectorAll per behavior. New behavior = a new initX function
   above + one line here. */
document.querySelectorAll('[data-menu]').forEach((el) => {
  if (el instanceof HTMLElement) initMenu(el);
});

document.querySelectorAll('[data-year]').forEach((el) => {
  initYear(el);
});
