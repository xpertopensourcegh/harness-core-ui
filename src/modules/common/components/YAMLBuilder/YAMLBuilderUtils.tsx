import { parse } from 'yaml'

/**
 * @description Find json path(s) of a given node in json from it's nearest parent
 * @param jsonObj json equivalent of yaml
 * @param leafNode leaf node whose path(s) from the nearest parent needs to be known
 * @param delimiter delimiter to be used in node path(s) from parent
 * @returns exactly matching json path in the tree
 */
const findLeafToParentPath = (jsonObj: Record<string, any>, leafNode: string, delimiter = '.') => {
  let matchingPath: string[] = []
  function findPath(currJSONObj: any, currentDepth: number, previous?: string) {
    Object.keys(currJSONObj).forEach((key: string) => {
      const value = currJSONObj[key]
      const type = Object.prototype.toString.call(value)
      const isObject = type === '[object Object]' || type === '[object Array]'
      const newKey = previous ? previous + delimiter + key : key
      if (isObject && Object.keys(value).length) {
        if (key.match(leafNode)) {
          matchingPath.push(newKey)
        }
        return findPath(value, currentDepth + 1, newKey)
      }
      if (newKey.match(leafNode)) {
        matchingPath.push(newKey)
      }
    })
  }
  findPath(jsonObj, 1)
  return matchingPath.length > 0 ? matchingPath[0] : null
}

/**
 * Get YAML from editor with placeholder added at current position in editor
 * @param editor
 * @param shouldAddPlaceholder whether to add a placeholder at current position in editor during yaml->json conversion
 */
const getYAMLFromEditor = (editor: any, shouldAddPlaceholder: boolean): string | null => {
  const currentPositionInEditor = editor?.getPosition(),
    textInCurrentEditorLine = editor?.getValue(currentPositionInEditor)?.trim(),
    currentLineNumber = currentPositionInEditor?.lineNumber,
    splitedText = textInCurrentEditorLine?.split('\n').slice(0, currentLineNumber),
    currentLineContent = splitedText?.[currentLineNumber - 1]
  const lengthOfCurrentText = textInCurrentEditorLine?.length
  if (lengthOfCurrentText > 0) {
    let textToInsert = ''
    if (shouldAddPlaceholder) {
      textToInsert = textInCurrentEditorLine[lengthOfCurrentText - 1] === ':' ? '' : ': ' + 'placeholder'
    }
    splitedText[currentLineNumber - 1] = [
      currentLineContent?.slice(0, currentPositionInEditor.column - 1),
      textToInsert,
      currentLineContent?.slice(currentPositionInEditor.column - 1)
    ].join('')
    editor.setPosition(currentPositionInEditor)
    return splitedText.join('\n')
  }
  return null
}

function getJSONFromYAML(yaml: string): Record<string, any> {
  try {
    return parse(yaml)
  } catch (error) {
    throw error
  }
}

/**
 * Get current property to parent json path
 * @param editor
 * @param shouldAddPlaceholder
 */
const getMetaDataForKeyboardEventProcessing = (
  editor: any,
  shouldAddPlaceholder: boolean = false
): { currentProperty: string; yamlInEditor: string; parentToCurrentPropertyPath: string | null } | null => {
  const yamlInEditor = getYAMLFromEditor(editor, shouldAddPlaceholder)
  if (yamlInEditor) {
    const jsonEquivalentOfYAMLInEditor = getJSONFromYAML(yamlInEditor)
    const textInCurrentEditorLine = editor.getModel()?.getLineContent(editor.getPosition().lineNumber)
    const currentProperty = textInCurrentEditorLine?.split(':').map((item: string) => item.trim())[0]
    const parentToCurrentPropertyPath = findLeafToParentPath(jsonEquivalentOfYAMLInEditor, currentProperty)
    return { currentProperty, yamlInEditor, parentToCurrentPropertyPath }
  }
  return null
}

export { findLeafToParentPath, getYAMLFromEditor, getMetaDataForKeyboardEventProcessing }
