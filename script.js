// Keep theme state private so future scripts cannot accidentally overwrite these variables.
(() => {
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme = null;

  // Storage may contain an old/invalid value or be blocked by browser privacy settings.
  // Validate it and handle failures so either case can fall back to the system preference.
  try {
    const stored = localStorage.getItem('portfolio-theme');
    if (stored === 'light' || stored === 'dark') savedTheme = stored;
  } catch {
    // Leave savedTheme unset so the system preference can be used below.
  }

  // Centralize visual and accessibility updates so they cannot drift apart.
  // The null check allows an early call before the body (and button) has been parsed.
  function applyTheme(theme) {
    root.dataset.theme = theme;
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) toggle.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  // Respect an explicit saved choice ahead of the system default, avoiding a reset on each visit.
  applyTheme(savedTheme || (systemTheme.matches ? 'dark' : 'light'));

  // A system change should not override a visitor's deliberate choice on this site.
  systemTheme.addEventListener('change', (event) => {
    if (!savedTheme) applyTheme(event.matches ? 'dark' : 'light');
  });

  // Colors are applied early to reduce flashing, but event setup must wait for the button to exist.
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    // Synchronize the newly parsed button with the theme already applied to <html>.
    toggle.hidden = false;
    applyTheme(root.dataset.theme);
    // A native button maps mouse and keyboard activation to click; extra key handlers could toggle twice.
    toggle.addEventListener('click', () => {
      savedTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(savedTheme);
      // Apply first, then save: blocked storage must not prevent the visible theme from changing.
      try {
        localStorage.setItem('portfolio-theme', savedTheme);
      } catch {
        // The in-memory choice still blocks system overrides for this page, even if saving fails.
      }
    });
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-navigation');
  if (!header || !menuToggle || !navigation) return;

  const mobileLayout = window.matchMedia('(max-width: 900px)');

  // One function keeps the visible menu and button state in sync. aria-expanded
  // tells assistive technology whether the button's controlled links are revealed.
  function setMenuOpen(open) {
    const expanded = mobileLayout.matches && open;
    menuToggle.setAttribute('aria-expanded', String(expanded));
    menuToggle.setAttribute('aria-label', expanded ? 'Close navigation menu' : 'Open navigation menu');
    // hidden also removes collapsed links from keyboard focus and the accessibility tree.
    navigation.hidden = mobileLayout.matches && !expanded;
  }

  menuToggle.addEventListener('click', () => {
    // Keep focus on this disclosure button: Tab reaches the first link naturally,
    // and Shift+Tab can still reach the theme control. This is not a modal dialog.
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  header.addEventListener('focusout', (event) => {
    // Dismiss when Tab leaves the header so its expanded sticky area cannot hide
    // the next focused element. Do not steal focus from the visitor's destination.
    if (!header.contains(event.relatedTarget)) setMenuOpen(false);
  });

  navigation.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || !mobileLayout.matches) return;
    // Close after navigation so the dropdown does not cover the chosen section.
    // Focus the destination before hiding the link that the keyboard user activated.
    const destination = document.querySelector(link.getAttribute('href'));
    if (destination) {
      destination.setAttribute('tabindex', '-1');
      destination.focus({ preventScroll: true });
    }
    setMenuOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  mobileLayout.addEventListener('change', () => {
    // Reset on resize so desktop links stay visible and mobile starts collapsed.
    const focusWillHide = mobileLayout.matches && navigation.contains(document.activeElement);
    const toggleHadFocus = document.activeElement === menuToggle;
    setMenuOpen(false);
    if (focusWillHide) menuToggle.focus();
    if (!mobileLayout.matches && toggleHadFocus) navigation.querySelector('a').focus();
  });

  setMenuOpen(false);
  header.classList.add('navigation-ready');
  menuToggle.hidden = false;
});
