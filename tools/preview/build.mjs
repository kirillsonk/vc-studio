import * as esbuild from 'esbuild';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const out = resolve(root, 'preview');
mkdirSync(out, { recursive: true });

const result = await esbuild.build({
  entryPoints: [resolve(root, 'tools/preview/entry.tsx')],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2020',
  jsx: 'automatic',
  write: false,
  define: { 'process.env.NODE_ENV': '"production"', 'process.env.NEXT_PUBLIC_STUDIO_EMAIL': '""', 'process.env.NEXT_PUBLIC_STUDIO_TELEGRAM': '""', 'process.env.NEXT_PUBLIC_INTAKE_API_URL': '""', 'process.env.NEXT_PUBLIC_PRIVACY_URL': '""', 'process.env.NEXT_PUBLIC_INTAKE_DELIVERY_ENABLED': '"false"' },
  alias: {
    'next/link': resolve(root, 'tools/preview/shims/link.tsx'),
    'next/navigation': resolve(root, 'tools/preview/shims/router.ts'),
    '@': resolve(root, 'src'),
  },
});
// Static assets referenced by absolute path are inlined, the preview is a single file
const symbol = readFileSync(resolve(root, 'public/brand/sborka-symbol.svg'));
const js = result.outputFiles[0].text.replaceAll(
  '/brand/sborka-symbol.svg',
  'data:image/svg+xml;base64,' + symbol.toString('base64'),
);

// Inline the design-system stylesheet by following styles.css's @import list.
const cssEntry = resolve(root, 'src/styles/styles.css');
const imports = [...readFileSync(cssEntry, 'utf8').matchAll(/@import\s+"([^"]+)"/g)].map(m => m[1]);
const css = imports.map(rel => readFileSync(resolve(dirname(cssEntry), rel), 'utf8')).join('\n');

// Inline the webfont: lift the @font-face rules next/font generated and swap each
// woff2 URL for a data URI, so the preview needs no network at all.
const cssDir = resolve(root, '.next/static/css');
const mediaDir = resolve(root, '.next/static/media');
const generated = readdirSync(cssDir).filter(f => f.endsWith('.css')).map(f => readFileSync(resolve(cssDir, f), 'utf8')).join('\n');
const faces = [...generated.matchAll(/@font-face\{[^}]*\}/g)].map(m => m[0]).join('\n');
const fontCss = faces.replace(/url\(\/_next\/static\/media\/([^)]+)\)/g, (_, file) => {
  const b64 = readFileSync(resolve(mediaDir, file)).toString('base64');
  return `url(data:font/woff2;base64,${b64})`;
});

// The Artifact host wraps the file in its own doctype/head/body, so emit page
// content only: title, styles, mount point, bundle.
const html = `<title>Сборка</title>
<style>
${fontCss}
:root{--font-onest:"Onest"}
${css}
/* The host pads :root by the phone safe-area insets; the sticky header clears them. */
.vc-header{top:env(safe-area-inset-top, 0px)}
</style>
<div id="root"></div>
<script>${js}</script>
`;
writeFileSync(resolve(out, 'index.html'), html);
console.log('preview/index.html', (Buffer.byteLength(html) / 1024 / 1024).toFixed(2), 'MB');
