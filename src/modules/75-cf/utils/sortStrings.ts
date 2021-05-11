export const sortStrings = (arr: string[]): string[] => [...arr].sort((a, b) => a.localeCompare(b))
