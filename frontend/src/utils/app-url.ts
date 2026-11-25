/** Absolute URL to a page in this app. `path` is relative to the basePath, as returned by `usePathname`. */
export const appURL = (path?: string): string => {
  return `${globalThis.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path ?? ''}`;
};
