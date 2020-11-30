import { YamlEntity } from '@common/constants/YamlConstants'
import secretsSchema from './mocks/secrets-schema.json'
import connectorSchema from './mocks/connector-schema.json'
import pipelineSchema from './mocks/pipeline-schema.json'

//TODO @vardan Can this be moved to a separate util file?
const getApiUrlTemplate = (entity: string) =>
  `%2Fyamlschema%2Fschemafile%3Ffilename%3Dschema%2F${entity}%2F${entity}.json`

const apiUrlMap = new Map<YamlEntity, string>()
apiUrlMap.set(YamlEntity.PIPELINE, getApiUrlTemplate(YamlEntity.PIPELINE.toLowerCase()))
apiUrlMap.set(YamlEntity.CONNECTOR, getApiUrlTemplate(YamlEntity.CONNECTOR.toLowerCase()))

export function fetchEntitySchemas(entityType: string): Record<string, any> | undefined {
  switch (entityType) {
    case YamlEntity.SECRET:
      return secretsSchema
    //TODO @vardan enable later on
    // case YamlEntity.PIPELINE:
    // TODO: mock schema containg ci related elements (service and run step for demo)
    case YamlEntity.PIPELINE:
      return pipelineSchema
    case YamlEntity.CONNECTOR:
      return connectorSchema
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
