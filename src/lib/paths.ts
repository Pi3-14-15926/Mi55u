let _base = ''

if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_PATH) {
  _base = process.env.NEXT_PUBLIC_BASE_PATH
}

export function asset(path: string): string {
  if (path.startsWith('/')) return _base + path
  return path
}
