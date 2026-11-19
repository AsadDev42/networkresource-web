/** Runs in <head> before first paint so the page never flashes the wrong theme. Default: light. */
// The key is versioned: it changed whenever the default changed, so older saved choices don't override it.
export const THEME_KEY = "nr-theme-v3";
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t="light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})();`;
