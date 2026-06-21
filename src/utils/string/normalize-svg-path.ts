/** Collapse the multi-line whitespace from path definitions into a clean single-line `d` attribute. */
export const normalizeSvgPath = (path: string): string =>
  path.replace(/\s+/g, " ").trim();
