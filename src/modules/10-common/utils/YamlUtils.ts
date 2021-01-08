// @ts-nocheck
import * as yamlLanguageService from '@wings-software/monaco-yaml/lib/esm/languageservice/yamlLanguageService'
import { TextDocument, Diagnostic } from 'vscode-languageserver-types'

/**
 * @description Validate yaml syntactically (syntax correctness)
 *
 * @param {yaml} yaml to validate
 * @returns Promise of list of syntax errors, if any
 *
 */
const validateYAML = (yaml: string): Promise<Diagnostic[]> => {
  /* istanbul ignore next */
  if (!yaml) {
    return Promise.reject('Invalid or empty yaml')
  }
  const textDocument = TextDocument.create('', 'yaml', 0, yaml)
  return yamlLanguageService.getLanguageService()?.doValidation(textDocument, false)
}

/**
 * @description Validate yaml semantically (adherence to a schema)
 *
 * @param {yaml} yaml to validate
 * @param {schema} schema to validate yaml against
 * @returns Promise of list of semantic errors, if any
 *
 */

const validateYAMLWithSchema = (yaml: string, schema: string | Record<string, any>): Promise<Diagnostic[]> => {
  /* istanbul ignore next */
  if (!yaml) {
    return Promise.reject('Invalid or empty yaml')
  }
  /* istanbul ignore next */
  if (!schema || (schema && Array.isArray(schema) && schema.length === 0)) {
    return Promise.reject('No schema specified')
  }
  const textDocument = TextDocument.create('', 'yaml', 0, yaml)
  const languageService = setUpLanguageService(schema)
  return languageService?.doValidation(textDocument, false)
}

const setUpLanguageService = schema => {
  const languageService = yamlLanguageService.getLanguageService()
  languageService?.configure(schema)
  return languageService
}

export { validateYAML, validateYAMLWithSchema }
