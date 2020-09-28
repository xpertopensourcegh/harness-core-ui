import { findLeafToParentPath, getYAMLFromEditor, getMetaDataForKeyboardEventProcessing } from '../YAMLBuilderUtils'
import connector from './mocks/connector.json'
import { parse } from 'yaml'

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
          getLineContent: (_lineNum: number) => '    delegateName:'
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
    const { currentProperty, parentToCurrentPropertyPath } = getMetaDataForKeyboardEventProcessing(
      setupMockEditor(editorContent, { lineNumber: 17, column: 19 }),
      true
    ) as { currentProperty: string; yamlInEditor: string; parentToCurrentPropertyPath: string | null }
    expect(currentProperty).toEqual('delegateName')
    expect(parentToCurrentPropertyPath).toEqual('spec.spec.delegateName')
  })
})
