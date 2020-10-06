import { YamlEntity } from 'modules/common/constants/YamlConstants'
import k8sConnectorSnippets from './mocks/snippets/connector/kubernetes/snippets.json'
import gitConnectorSnippets from './mocks/snippets/connector/git/snippets.json'
import dockerConnectorSnippets from './mocks/snippets/connector/docker/snippets.json'
import secretSnippets from './mocks/snippets/secret/secrets-snippets.json'
import type { SnippetInterface } from '../../common/interfaces/SnippetInterface'

export function fetchSnippets(
  entityType: string,
  entitySubType?: string,
  _query?: string
): { error?: any; response?: SnippetInterface[] } | undefined {
  //TODO integrate snippet search using _query param when apis are available
  switch (entityType) {
    case YamlEntity.SECRET:
      return secretSnippets
    case YamlEntity.CONNECTOR:
      switch (entitySubType) {
        case 'K8sCluster':
          return k8sConnectorSnippets
        case 'Git':
          return gitConnectorSnippets
        case 'DockerRegistry':
          return dockerConnectorSnippets
        default:
          return
      }
    default:
      return
  }
}
