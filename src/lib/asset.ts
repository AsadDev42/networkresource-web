/** Prefixes a /public file path with the deploy sub-path (e.g. /networkresource-web on GitHub Pages). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
