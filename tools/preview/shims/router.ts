/**
 * Maps the app's real routes onto hash routes so the preview runs as a single file.
 * "/" -> "#/", "/case" -> "#/case", "/#intake" -> "#/" plus a scroll to that section.
 */
export interface Target { path: string; anchor: string }

export function parse(href: string): Target {
  const [rawPath, anchor = ''] = href.split('#');
  const path = rawPath === '' || rawPath === '/' ? '/' : rawPath.replace(/\/$/, '');
  return { path, anchor };
}

export function toHash(href: string): string {
  return '#' + parse(href).path;
}

export function navigate(href: string): void {
  const { path, anchor } = parse(href);
  const next = '#' + path;
  if (window.location.hash !== next) window.location.hash = next;
  else window.dispatchEvent(new HashChangeEvent('hashchange'));
  setTimeout(() => {
    const el = anchor ? document.getElementById(anchor) : null;
    window.scrollTo({ top: el ? el.offsetTop - 72 : 0, behavior: 'smooth' });
  }, 80);
}

export function currentPath(): string {
  return window.location.hash.replace(/^#/, '') || '/';
}

export function useRouter() {
  return { push: navigate, replace: navigate, back: () => window.history.back(), prefetch: () => {} };
}

export function usePathname(): string {
  return currentPath();
}
