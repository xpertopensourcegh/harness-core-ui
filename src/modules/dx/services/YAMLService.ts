import snippets from './mocks/snippets.json'
import type { SnippetInterface } from '../../common/interfaces/SnippetInterface'

export function fetchSnippets(): SnippetInterface[] {
  return snippets
}
