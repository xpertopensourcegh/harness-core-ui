import {
  findLeafToParentPath,
  getYAMLFromEditor,
  getMetaDataForKeyboardEventProcessing,
  getYAMLPathToValidationErrorMap
} from '../YAMLBuilderUtils'
import connector from './mocks/connector.json'
import { parse } from 'yaml'
import type { Diagnostic } from 'vscode-languageserver-types'

const setupMockEditor = (
  editorContent: string,
  position: { lineNumber: number; column: number }
): Record<string, any> => {
  const editor = {
    getPosition: () => Object.assign({}, position),
    getValue: () => editorContent,
    getModel: () =>
      Object.assign(
        {},
        {
          getLineContent: (_lineNum: number) => `delegateName${_lineNum}: dn`
        }
      ),
    setPosition: () => {}
  }
  return editor
}

describe('YAMLBuilder Utils test', () => {
  test('Test findLeafToParentPath method for a top-level attribute', async () => {
    const path = findLeafToParentPath(connector as Record<string, any>, 'name')
    expect(path).toEqual('name')
  })

  test('Test findLeafToParentPath method for a deeply-nested attribute', async () => {
    const path = findLeafToParentPath(connector as Record<string, any>, 'delegateName')
    expect(path).toEqual('spec.spec.delegateName')
  })

  test('Test findLeafToParentPath method for custom delimiter', async () => {
    const path = findLeafToParentPath(connector as Record<string, any>, 'qualifier', '/')
    expect(path).toEqual('tags/1/qualifier')
  })

  test('Test getYAMLFromEditor method, should add placeholder', async () => {
    const editorContent =
      'name: K8sConnector\r\nidentifier: SampleK8s\r\ndescription: Sample K8s connectors\r\naccountIdentifier: ACCOUNT_ID\r\ntags: \r\n  - dev-ops\r\n  - env\r\nlastModifiedAt: 123456789\r\ntype \r\nspec:\r\n  type: InheritFromDelegate\r\n  spec:\r\n    delegateName: delegatek8s'
    const yaml = getYAMLFromEditor(setupMockEditor(editorContent, { lineNumber: 9, column: 7 }), true)
    expect(yaml).not.toBeNull()
    if (yaml) {
      const jsonEquivalent = parse(yaml)
      expect(jsonEquivalent.type).toEqual('placeholder')
    }
  })

  test('Test getYAMLFromEditor method, should not add placeholder', async () => {
    const editorContent =
      'name: K8sConnector\r\nidentifier: SampleK8s\r\ndescription: Sample K8s connectors\r\naccountIdentifier: ACCOUNT_ID\r\ntags:\r\n  - dev-ops\r\n  - env\r\nlastModifiedAt: 123456789\r\ntype: K8s\r\nspec:\r\n  type: InheritFromDelegate\r\n  spec:\r\n    delegateName: delegatek8s'
    const yaml = getYAMLFromEditor(setupMockEditor(editorContent, { lineNumber: 9, column: 7 }), false)
    expect(yaml).not.toBeNull()
    if (yaml) {
      const jsonEquivalent = parse(yaml)
      expect(jsonEquivalent.type).not.toEqual('placeholder')
    }
  })

  test('Test getMetaDataForKeyboardEventProcessing method', async () => {
    const editorContent =
      'name: K8sConnector\r\nidentifier: SampleK8s\r\ndescription: Sample K8s connectors\r\naccountIdentifier: ACCOUNT_ID\r\ntags:\r\n  - dev-ops\r\n  - env\r\nlastModifiedAt: 123456789\r\ntype: K8s\r\nspec:\r\n  type: InheritFromDelegate\r\n  spec:\r\n    delegateName: delegatek8s'
    const { currentProperty } = getMetaDataForKeyboardEventProcessing(
      setupMockEditor(editorContent, { lineNumber: 17, column: 19 }),
      true
    ) as { currentProperty: string; yamlInEditor: string; parentToCurrentPropertyPath: string | null }
    expect(currentProperty).toEqual('delegateName17')
  })

  test('Test getYAMLPathToValidationErrorMap method', async () => {
    const editorContent =
      'name: K8sConnector\r\nidentifier: SampleK8s\r\ndescription: Sample K8s connectors\r\naccountIdentifier: ACCOUNT_ID\r\ntags:\r\n  - dev-ops\r\n  - env\r\nlastModifiedAt: 123456789\r\ntype: K8s\r\nspec:\r\n  type: InheritFromDelegate\r\n  spec:\r\n    delegateName: delegatek8s'
    const validationErrors = [
      { message: 'Expected number but found string', range: { end: { line: 2 } } } as Diagnostic
    ]
    let errorMap = getYAMLPathToValidationErrorMap(
      editorContent,
      validationErrors,
      setupMockEditor(editorContent, { lineNumber: 17, column: 19 })
    )
    expect(errorMap).not.toBeNull()
    expect(errorMap?.size).toEqual(1)
    expect(errorMap?.get('delegateName3')).toEqual(['Expected number but found string'])
    validationErrors.push({ message: 'Incorrect type', range: { end: { line: 2 } } } as Diagnostic)
    errorMap = getYAMLPathToValidationErrorMap(
      editorContent,
      validationErrors,
      setupMockEditor(editorContent, { lineNumber: 17, column: 19 })
    )
    expect(errorMap).not.toBeNull()
    expect(errorMap?.size).toEqual(1)
    const errorMssgs = errorMap?.get('delegateName3')
    expect(errorMssgs?.length).toEqual(validationErrors.length)
    expect(errorMssgs).toEqual(['Expected number but found string', 'Incorrect type'])
  })
})
