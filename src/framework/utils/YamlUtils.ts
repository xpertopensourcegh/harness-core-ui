// @ts-nocheck
import * as yamlLanguageService from '@wings-software/monaco-yaml/lib/esm/languageservice/yamlLanguageService'
import { TextDocument, Diagnostic } from 'vscode-languageserver-types'

/**
 * Validation yaml syntactically (syntax correctness)
 *
 * @param yaml
 *
 * @returns list of syntax errors, if any
 *
 * Example usage :

  validateYAML(yaml)
    .then(val => {
      // do something
    })
    .catch(error => {
      show error
    }
 */
const validateYAML = (yaml: string): Thenable<Diagnostic[]> => {
  if (!yaml) {
    return Promise.resolve(null)
  }
  const textDocument = TextDocument.create('', 'yaml', 0, yaml)
  return yamlLanguageService.getLanguageService().doValidation(textDocument, false)
}

export { validateYAML }
