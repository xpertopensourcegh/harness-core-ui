import { YamlEntity } from 'modules/common/constants/YamlConstants'
import jsonSchema from './mocks/entity-schema-response.json'
import secretsSchema from './mocks/secrets-schema.json'

export function fetchEntitySchemas(entityType: string): object {
  switch (entityType) {
    case YamlEntity.SECRET:
      return secretsSchema
    default:
      return jsonSchema
  }
}

export function fetchSuggestions(yamlPath: string) {
  return yamlPath === 'cloudProvider'
    ? ['Azure CP1', 'GCP CP3', 'GCP CP8', 'Azure CP5', 'Azure CP1', 'AWS CP2', 'AWS CP9', 'GCP CP4']
    : ['Git Connector', 'Kubernetes Connector', 'Azure', 'GCP']
}
