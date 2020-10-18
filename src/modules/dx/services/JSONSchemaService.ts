import { YamlEntity } from 'modules/common/constants/YamlConstants'
import { getRefUrlPrefix } from 'modules/common/utils/SchemaUtils'
import secretsSchema from './mocks/secrets-schema.json'

//TODO @vardan Can this be moved to a separate util file?
const getApiUrlTemplate = (entity: string) =>
  `%2Fyamlschema%2Fschemafile%3Ffilename%3Dschema%2F${entity}%2F${entity}.json`

const apiUrlMap = new Map<YamlEntity, string>()
apiUrlMap.set(YamlEntity.PIPELINE, getApiUrlTemplate(YamlEntity.PIPELINE.toLowerCase()))
apiUrlMap.set(YamlEntity.CONNECTOR, getApiUrlTemplate(YamlEntity.CONNECTOR.toLowerCase()))

export const getBaseSchema = (entity: string, apiUrl: string): Record<string, any> => {
  if (!apiUrl) {
    return {}
  }
  const entityWrapper = {
    [entity]: {
      $ref: getRefUrlPrefix(window.location) + apiUrl
    }
  }

  return {
    validate: true,
    enableSchemaRequest: true,
    hover: true,
    completion: true,
    schemas: [
      {
        fileMatch: ['*'],
        schema: {
          additionalProperties: false,
          properties: entityWrapper
        }
      }
    ]
  }
}

export function fetchEntitySchemas(entityType: string): Record<string, any> | undefined {
  switch (entityType) {
    case YamlEntity.SECRET:
      return secretsSchema
    case YamlEntity.PIPELINE:
      return getBaseSchema(YamlEntity.PIPELINE.toLowerCase(), apiUrlMap.get(YamlEntity.PIPELINE) || '')
    case YamlEntity.CONNECTOR:
      return getBaseSchema(YamlEntity.CONNECTOR.toLowerCase(), apiUrlMap.get(YamlEntity.CONNECTOR) || '')
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
