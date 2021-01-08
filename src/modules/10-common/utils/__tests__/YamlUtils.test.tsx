import { stringify } from 'yaml'
import yaml from './mocks/sample.yaml'
import schema from './mocks/schema.json'

import { validateYAMLWithSchema, validateYAML } from '../YamlUtils'

jest.mock('@wings-software/monaco-yaml/lib/esm/languageservice/yamlLanguageService', () => ({
  getLanguageService: jest.fn()
}))

describe('Test YamlUtils', () => {
  test('Test validateYAMLWithSchema & validateYAML methods', () => {
    validateYAMLWithSchema(stringify(yaml), schema)?.then(res => {
      expect(res).toHaveLength(0)
    })
    validateYAML(stringify(yaml))?.then(res => {
      expect(res).toHaveLength(0)
    })
  })
})
