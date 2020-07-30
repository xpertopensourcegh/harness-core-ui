import { YamlEntity } from 'modules/common/constants/YamlConstants'
import snippets from './mocks/snippets.json'
import secretSnippets from './mocks/secrets-snippets.json'
import type { SnippetInterface } from '../../common/interfaces/SnippetInterface'

export function fetchSnippets(entityType: string): SnippetInterface[] {
  switch (entityType) {
    case YamlEntity.SECRET:
      return secretSnippets
    default:
      return snippets
  }
}
