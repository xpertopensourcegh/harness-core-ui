export function getIdentifierFromName(str: string): string {
  return str
    .trim()
    .replace(/[^0-9a-zA-Z_$ ]/g, '') // remove special chars except _ and $
    .replace(/ +/g, '_') // replace spaces with _
}

export const illegalIdentifiers = [
  'or',
  'and',
  'eq',
  'ne',
  'lt',
  'gt',
  'le',
  'ge',
  'div',
  'mod',
  'not',
  'null',
  'true',
  'false',
  'new',
  'var',
  'return'
]
