import { defineConfig } from 'tsup';

// For the CJS build, make `require('get-nepday-of-week')` return the function
// itself (as 0.x did) while keeping the named exports (`getNepdayOfWeek`,
// `WEEKDAYS_NE`, `WEEKDAYS_EN`, `default`) reachable as properties on it.
// tsup's `cjsInterop` only does this when `default` is the sole export, so we
// append the interop ourselves.
const CJS_FOOTER = [
  'module.exports = Object.assign(module.exports.default, module.exports);',
  "Object.defineProperty(module.exports, '__esModule', { value: true });",
].join('\n');

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2020',
  platform: 'neutral',
  splitting: false,
  // Keep rollup out of the pipeline: tsup's `treeshake` re-emits the CJS
  // exports after esbuild's footer, which would break the interop below.
  treeshake: false,
  esbuildOptions(options, context) {
    if (context.format === 'cjs') {
      options.footer = { ...options.footer, js: CJS_FOOTER };
    }
  },
});
