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
