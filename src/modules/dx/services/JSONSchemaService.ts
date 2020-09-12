import { YamlEntity } from 'modules/common/constants/YamlConstants'
import connectorSchema from './mocks/connector-schema.json'
import secretsSchema from './mocks/secrets-schema.json'

export function fetchEntitySchemas(entityType: string): object {
  switch (entityType) {
    case YamlEntity.CONNECTOR:
      return connectorSchema
    case YamlEntity.SECRET:
      return secretsSchema
    default:
      return {}
  }
}

//TODO Remove dummy data when API becomes available
export function fetchExpressions() {
  return [
    'pipeline.stage',
    'pipeline.env',
    'pipeline.env.name',
    'stage.type',
    'stage.name',
    'stage.env',
    'stage.env.name',
    'inputSet.name',
    'inputSet.type'
  ]
}
