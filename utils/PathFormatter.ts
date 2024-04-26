export function pathFormatter(path: string): string {
  return path.replace(/:(\w+)/g, "{$1}");
}
