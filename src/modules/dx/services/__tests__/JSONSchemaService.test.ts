import { LOCAL_API_PORT } from '@common/constants/Common'
import { getBaseSchema } from '../JSONSchemaService'

describe('Test utils from JSONSchemaService', () => {
  test('Test getBaseSchema method', () => {
    const entityType = 'connector',
      apiUrl = '%2FsampleApiUrl'
    const connectorSchema = getBaseSchema(entityType, apiUrl)
    expect(connectorSchema).toBeDefined()
    expect(connectorSchema.schemas[0].schema.properties[entityType]['$ref']).toEqual(
      `http://localhost%3A${LOCAL_API_PORT}${apiUrl}`
    )
  })
})
