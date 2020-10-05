import { YamlEntity } from 'modules/common/constants/YamlConstants'
import k8sConnectorSnippets from './mocks/snippets/connector/kubernetes/snippets.json'
import secretSnippets from './mocks/secrets-snippets.json'
import type { SnippetInterface } from '../../common/interfaces/SnippetInterface'

export function fetchSnippets(
  entityType: string,
  _query?: string
): { error?: any; response?: SnippetInterface[] } | undefined {
  //TODO integrate snippet search using _query param when apis are available
  switch (entityType) {
    case YamlEntity.SECRET:
      return secretSnippets
    case YamlEntity.CONNECTOR:
      return k8sConnectorSnippets
    default:
      return
  }
}
