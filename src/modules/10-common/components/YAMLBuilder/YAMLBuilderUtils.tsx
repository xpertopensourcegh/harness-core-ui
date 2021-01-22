import type { IconName } from '@wings-software/uicore'
import type { Diagnostic } from 'vscode-languageserver-types'
import { parse } from 'yaml'
import { Connectors } from '@connectors/constants'
import type { DetailedReactHTMLElement } from 'react'
import React from 'react'

export const DEFAULT_YAML_PATH = 'DEFAULT_YAML_PATH'

/**
 * @description Find json path(s) of a given node in json from it's nearest parent
 * @param jsonObj json equivalent of yaml
 * @param leafNode leaf node whose path(s) from the nearest parent needs to be known
 * @param delimiter delimiter to be used in node path(s) from parent
 * @returns exactly matching json path in the tree
 */
const findLeafToParentPath = (jsonObj: Record<string, any>, leafNode: string, delimiter = '.'): string | undefined => {
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
  return matchingPath.length > 0 ? matchingPath.slice(-1).pop() : DEFAULT_YAML_PATH
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
): Record<string, string | undefined> | undefined => {
  const yamlInEditor = getYAMLFromEditor(editor, shouldAddPlaceholder)
  if (yamlInEditor) {
    const jsonEquivalentOfYAMLInEditor = getJSONFromYAML(yamlInEditor)
    const textInCurrentEditorLine = editor.getModel()?.getLineContent(editor.getPosition().lineNumber)
    const currentProperty = textInCurrentEditorLine?.split(':').map((item: string) => item.trim())[0]
    const parentToCurrentPropertyPath = findLeafToParentPath(jsonEquivalentOfYAMLInEditor, currentProperty)
    return { currentProperty, yamlInEditor, parentToCurrentPropertyPath }
  }
}

const getPartialYAML = (editor: any, uptoLineNum: number): string => {
  let partialYAML = ''
  const model = editor?.getModel()
  Array.from({ length: uptoLineNum }, (_, i) => i + 1).map(
    lineNum => (partialYAML = partialYAML.concat(model?.getLineContent(lineNum)).concat('\n'))
  )
  return partialYAML
}

/**
 * Get mapping of json path of a property to all errors on the value at that property
 * @param currentYaml
 * @param validationErrors
 * @param editor
 */
const getYAMLPathToValidationErrorMap = (
  _currentYaml: string,
  validationErrors: Diagnostic[],
  editor: any | undefined
): Map<string, string[]> | undefined => {
  const yamlPathToValidationErrorMap = new Map<string, string[]>()

  if (!validationErrors) {
    return
  }

  validationErrors.forEach(valError => {
    try {
      const errorIndex = valError?.range?.end?.line
      const errorLineNum = errorIndex + 1
      const textInCurrentEditorLine = editor?.getModel()?.getLineContent(errorLineNum)?.trim()
      if (textInCurrentEditorLine) {
        const currentProperty = textInCurrentEditorLine?.split(':').map((item: string) => item.trim())?.[0]
        const partialYAML = getPartialYAML(editor, errorLineNum)
        if (partialYAML) {
          const jsonEqOfYAML = getJSONFromYAML(partialYAML)
          if (jsonEqOfYAML && Object.keys(jsonEqOfYAML).length > 0) {
            const path = findLeafToParentPath(jsonEqOfYAML, currentProperty)
            if (path) {
              const existingErrorsOnPath = yamlPathToValidationErrorMap.get(path)
              if (
                existingErrorsOnPath !== undefined &&
                Array.isArray(existingErrorsOnPath) &&
                existingErrorsOnPath.length > 0
              ) {
                existingErrorsOnPath.push(valError.message)
                yamlPathToValidationErrorMap.set(path, existingErrorsOnPath)
              } else {
                yamlPathToValidationErrorMap.set(path, [valError.message])
              }
            }
          }
        }
      }
    } catch (error) {
      yamlPathToValidationErrorMap.set(DEFAULT_YAML_PATH, error)
    }
  })
  return yamlPathToValidationErrorMap
}

const pickIconForEntity = (entity: string): IconName => {
  switch (entity) {
    case Connectors.KUBERNETES_CLUSTER:
      return 'service-kubernetes' as IconName
    case Connectors.GIT:
      return 'service-github' as IconName
    case Connectors.DOCKER:
      return 'service-dockerhub' as IconName
    default:
      return 'main-code-yaml' as IconName
  }
}

/**
 * Get formatted HTML of list items
 * @param errorMap yaml path to validation error map
 */
const getValidationErrorMessagesForToaster = (
  errorMap: Map<string, string[]>
): DetailedReactHTMLElement<{ id: string }, HTMLElement> => {
  const errorRenderItemList: JSX.Element[] = []
  errorMap?.forEach((values: string[], key: string) => {
    errorRenderItemList.push(
      <li key={key}>
        In{' '}
        <b>
          <i>{key}</i>
        </b>
        , {values?.map((value: string) => value.charAt(0).toLowerCase() + value.slice(1))?.join(', ')}
      </li>
    )
  })
  return React.createElement('ul', { id: 'ul-errors' }, errorRenderItemList)
}

export {
  findLeafToParentPath,
  getYAMLFromEditor,
  getMetaDataForKeyboardEventProcessing,
  getYAMLPathToValidationErrorMap,
  pickIconForEntity,
  getValidationErrorMessagesForToaster
}
