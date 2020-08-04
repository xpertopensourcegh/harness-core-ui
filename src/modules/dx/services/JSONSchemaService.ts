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

export function fetchExpressions() {
  return ['expr1.prop1.prop2', 'expr1.prop1.prop2', 'expr1.prop2.prop1', 'expr2.prop1.prop2', 'expr3.prop1.prop2']
}
