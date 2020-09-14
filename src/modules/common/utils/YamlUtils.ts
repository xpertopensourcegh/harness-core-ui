// @ts-nocheck
import * as yamlLanguageService from '@wings-software/monaco-yaml/lib/esm/languageservice/yamlLanguageService'
import { TextDocument, Diagnostic } from 'vscode-languageserver-types'

/**
 * @description Validate yaml syntactically (syntax correctness)
 *
 * @param {yaml} yaml to validate
 * @returns Promise of list of syntax errors, if any
 *
 * Example usage :

  validateYAML(yaml)
    .then(val => {
      // do something
    })
    .catch(error => {
      // show error
    })
 */
const validateYAML = (yaml: string): Thenable<Diagnostic[]> => {
  if (!yaml) {
    return Promise.reject('Invalid or empty yaml')
  }
  const textDocument = TextDocument.create('', 'yaml', 0, yaml)
  return yamlLanguageService.getLanguageService().doValidation(textDocument, false)
}

/**
 * @description Validate yaml semantically (adherence to a schema)
 *
 * @param {yaml} yaml to validate
 * @param {schemas} array of schemas to validate yaml against
 * @returns Promise of list of semantic errors, if any
 *
 * Example usage :

  validateYAMLWithSchema(yaml, schemas)
    .then(val => {
      // do something
    })
    .catch(error => {
      // show error
    })
 */

//TODO will add type later on
const validateYAMLWithSchema = (yaml: string, schemas): Thenable<Diagnostic[]> => {
  if (!yaml) {
    return Promise.reject('Invalid or empty yaml')
  }
  if (!schemas || (schemas && Array.isArray(schemas) && schemas.length === 0)) {
    return Promise.reject('No schema specified')
  }
  const textDocument = TextDocument.create('', 'yaml', 0, yaml)
  const languageService = setUpLanguageService(schemas)
  return languageService.doValidation(textDocument, false)
}

//TODO will add type later on
const setUpLanguageService = schemas => {
  const languageService = yamlLanguageService.getLanguageService()
  const languageSetting = addYAMLLanguageSettingsToSchema(schemas)
  languageService.configure(languageSetting)
  return languageService
}

const addYAMLLanguageSettingsToSchema = schemaSet => {
  const languageSetting = {
    validate: true,
    enableSchemaRequest: true,
    hover: true,
    completion: true,
    schemas: []
  }
  schemaSet.map(schema => {
    languageSetting.schemas.push({
      uri: '',
      fileMatch: ['*'],
      schema
    })
  })
  return languageSetting
}

export { validateYAML, validateYAMLWithSchema, addYAMLLanguageSettingsToSchema }
