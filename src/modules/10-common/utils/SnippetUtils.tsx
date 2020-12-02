import type { IconName } from '@wings-software/uikit'
import { YamlEntity, YamlSubEntity } from '@common/constants/YamlConstants'
import type { GetYamlSnippetMetadataQueryParams } from 'services/cd-ng'

export const getIconNameForTag = (tag: string): IconName => {
  switch (tag) {
    case 'k8s':
      return 'app-kubernetes'
    case 'docker':
      return 'service-dockerhub'
    case 'git':
      return 'service-github'
    case 'secretmanager':
      return 'lock'
    default:
      return 'main-code-yaml'
  }
}

export const getSnippetTags = (
  entityType: YamlEntity,
  entitySubType?: YamlSubEntity
): GetYamlSnippetMetadataQueryParams['tags'] => {
  const tags: GetYamlSnippetMetadataQueryParams['tags'] = []
  switch (entityType) {
    case YamlEntity.CONNECTOR:
      tags.push('connector')
      switch (entitySubType) {
        case 'K8sCluster':
          tags.push('k8s')
          break
        case 'DockerRegistry':
          tags.push('docker')
          break
      }
      break
    default:
  }
  return tags
}
