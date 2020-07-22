import jsonSchema from './mocks/entity-schema-response.json'
import secretsSchema from './mocks/secrets-schema.json'
import { YamlEntity } from 'modules/common/constants/YamlConstants'

export function fetchEntitySchemas(entityType: string): object {
  switch (entityType) {
    case YamlEntity.SECRET:
      return secretsSchema
    default:
      return jsonSchema
  }
}
