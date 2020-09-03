// @ts-nocheck
import React, { useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import '@wings-software/monaco-yaml/lib/esm/monaco.contribution'
import { languages } from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor'
import YamlWorker from 'worker-loader!@wings-software/monaco-yaml/lib/esm/yaml.worker'
import EditorWorker from 'worker-loader!monaco-editor/esm/vs/editor/editor.worker'
import { Toaster, Intent } from '@blueprintjs/core'
import cx from 'classnames'
import * as YAML from 'yaml'
import { Tag, Layout } from '@wings-software/uikit'
import type {
  YamlBuilderProps,
  YamlBuilderHandlerBinding,
  CompletionItemInterface
} from 'modules/common/interfaces/YAMLBuilderProps'
import SnippetSection from 'modules/common/components/SnippetSection/SnippetSection'
import { JSONSchemaService } from 'modules/dx/services'

import css from './YamlBuilder.module.scss'

monaco.editor.defineTheme('vs', {
  base: 'vs',
  inherit: false,
  rules: [
    { token: 'type', foreground: '1D76FF' },
    { token: 'string', foreground: '22272D' },
    { token: 'comment', foreground: '9aa5b5' }
  ]
})
monaco.editor.setTheme('vs')

window.MonacoEnvironment = {
  getWorker(workerId, label: string) {
    if (label === 'yaml') {
      return new YamlWorker()
    }
    return new EditorWorker()
  }
}

const toaster = Toaster.create()

/**
 * @description Find json path(s) of a given node in json from it's nearest parent
 * @param obj json object
 * @param leaf leaf node whose path(s) from the nearest parent needs to be known
 * @param delimiter delimiter to be used in node path(s) from parent
 * @returns exactly matching json path in the tree
 */
const findLeafToParentPath = (obj: Record<string, any>, leaf: string, delimiter: string = '.'): string => {
  let matchingPath
  function findPath(currObj: Record<string, any>, currentDepth: number, previous?: string) {
    Object.keys(currObj).forEach(function (key) {
      const value = currObj[key]
      const type = Object.prototype.toString.call(value)
      const isObject = type === '[object Object]' || type === '[object Array]'
      const newKey = previous ? previous + delimiter + key : key
      if (isObject && Object.keys(value).length) {
        return findPath(value, currentDepth + 1, newKey)
      }
      if (newKey.match(leaf)) {
        matchingPath = newKey
      }
    })
  }
  findPath(obj, 1)
  return matchingPath
}

function getJSONFromYAML(yaml: string): Record<string, any> {
  try {
    return YAML.parse(yaml)
  } catch (error) {
    // TODO decide how to handle this
    toaster.show({ message: 'Error while content parsing', intent: Intent.DANGER, timeout: 5000 })
    return {}
  }
}

const YAMLBuilder: React.FC<YamlBuilderProps> = props => {
  const {
    height,
    width,
    fileName,
    entityType,
    existingYaml,
    isReadOnlyMode,
    showSnippetSection = true,
    invocationMap,
    bind,
    snippets,
    showIconMenu = false,
    onSnippetSearch,
    onExpressionTrigger
  } = props
  const [currentYaml, setCurrentYaml] = useState<string | undefined>('')
  const TRIGGER_CHAR_FOR_NEW_EXPR = '$'
  const TRIGGER_CHAR_FOR_PARTIAL_EXPR = '.'
  const KEY_CODE_FOR_DOLLAR_SIGN = 'Digit4'
  const KEY_CODE_FOR_SEMI_COLON = 'Semicolon'
  const KEY_CODE_FOR_PERIOD = 'Period'

  const handler = React.useMemo(
    () =>
      ({
        getLatestYaml: () => currentYaml
      } as YamlBuilderHandlerBinding),
    [currentYaml]
  )

  useEffect(() => {
    bind?.(handler)
  }, [bind, handler])

  useEffect(() => {
    const { yaml } = languages || {}
    const jsonSchemas = loadJSONSchemaForEntity(entityType)
    yaml?.yamlDefaults.setDiagnosticsOptions(jsonSchemas)
    setCurrentYaml(props.existingYaml)
  }, [existingYaml, entityType])

  function loadJSONSchemaForEntity(entityType: string) {
    const jsonSchemas = JSONSchemaService.fetchEntitySchemas(entityType)
    return jsonSchemas
  }

  const onYamlChange = (updatedYaml: string): void => {
    setCurrentYaml(updatedYaml)
  }

  const editorDidMount = (editor, monaco) => {
    if (editor) {
      if (!props.isReadOnlyMode) {
        editor.focus()
      }
      editor.onKeyDown((event: KeyboardEvent) => handleEditorKeyDownEvent(event, editor))
    }
  }

  const disposePreviousSuggestions = (): void => {
    if (expressionCompletionDisposer) {
      expressionCompletionDisposer.dispose()
    }
    if (runTimeCompletionDisposer) {
      runTimeCompletionDisposer.dispose()
    }
  }

  /** For expressions */
  const getExpressionFromCurrentLine = (editor): string => {
    const textInCurrentEditorLine = editor.getModel().getLineContent(editor.getPosition().lineNumber)
    const [property, expression] = textInCurrentEditorLine.split(':').map(item => item.trim())
    return expression
  }

  let expressionCompletionDisposer: { dispose: () => void }
  function registerCompletionItemProviderForExpressions(
    editor,
    triggerCharacters: string[],
    matchingPath: string,
    currentExpression?: string = ''
  ): void {
    if (editor) {
      const suggestionsPromise = onExpressionTrigger ? onExpressionTrigger(matchingPath, currentExpression) : null
      if (suggestionsPromise) {
        suggestionsPromise.then(suggestions => {
          expressionCompletionDisposer = editor?.languages?.registerCompletionItemProvider('yaml', {
            triggerCharacters,
            provideCompletionItems: () => {
              return { suggestions }
            }
          })
        })
      }
    }
  }

  /** For RT Inputs */
  let runTimeCompletionDisposer: { dispose: () => void }
  function registerCompletionItemProviderForRTInputs(
    editor,
    suggestionsPromise: Promise<CompletionItemInterface[]>
  ): void {
    if (editor) {
      suggestionsPromise.then(suggestions => {
        runTimeCompletionDisposer = editor?.languages?.registerCompletionItemProvider('yaml', {
          triggerCharacters: [' '],
          provideCompletionItems: () => {
            return { suggestions }
          }
        })
      })
    }
  }

  const invokeCallBackForMatchingYAMLPaths = (monaco, matchingPath: string, editor): void => {
    invocationMap?.forEach((callBackFunc, yamlPath) => {
      if (matchingPath.match(yamlPath) && typeof callBackFunc === 'function') {
        const suggestionsPromise = callBackFunc(matchingPath, getYAMLFromEditor(editor, true))
        registerCompletionItemProviderForRTInputs(monaco, suggestionsPromise)
      }
    })
  }

  const getYAMLFromEditor = (editor, shouldAddPlaceholder: boolean): string => {
    const currentEditorPosition = editor.getPosition(),
      textInCurrentEditorLine = editor.getValue(currentEditorPosition).trim(),
      currentLineNumber = currentEditorPosition.lineNumber,
      splitedText = textInCurrentEditorLine.split('\n').slice(0, currentLineNumber),
      currentLineContent = splitedText[currentLineNumber - 1]
    let textToInsert = ''
    if (shouldAddPlaceholder) {
      textToInsert = textInCurrentEditorLine[textInCurrentEditorLine.length - 1] === ':' ? '' : ': ' + 'placeholder'
    }
    splitedText[currentLineNumber - 1] = [
      currentLineContent?.slice(0, currentEditorPosition.column - 1),
      textToInsert,
      currentLineContent?.slice(currentEditorPosition.column - 1)
    ].join('')
    editor.setPosition(currentEditorPosition)

    return splitedText.join('\n')
  }

  const getMetaDataForKeyboardEventProcessing = (
    editor,
    shouldAddPlaceholder: boolean = false
  ): Record<string, string> => {
    const yamlInEditor = getYAMLFromEditor(editor, shouldAddPlaceholder)
    const jsonEquivalentOfYAMLInEditor = getJSONFromYAML(yamlInEditor)
    const textInCurrentEditorLine = editor.getModel().getLineContent(editor.getPosition().lineNumber)
    const [currentProperty, value] = textInCurrentEditorLine?.split(':').map(item => item.trim())
    const parentToCurrentPropertyPath = findLeafToParentPath(jsonEquivalentOfYAMLInEditor, currentProperty)
    return { currentProperty, yamlInEditor, parentToCurrentPropertyPath }
  }

  const handleEditorKeyDownEvent = (event: KeyboardEvent, editor): void => {
    const { shiftKey, code } = event
    //TODO Need to check hotkey for cross browser/cross OS compatibility
    //TODO Need to debounce this function call for performance optimization
    if (shiftKey) {
      if (code === KEY_CODE_FOR_DOLLAR_SIGN) {
        const { currentProperty, yamlInEditor, parentToCurrentPropertyPath } = getMetaDataForKeyboardEventProcessing(
          editor
        )
        disposePreviousSuggestions()
        registerCompletionItemProviderForExpressions(monaco, [TRIGGER_CHAR_FOR_NEW_EXPR], parentToCurrentPropertyPath)
      } else if (code === KEY_CODE_FOR_SEMI_COLON && invocationMap?.size > 0) {
        const { currentProperty, yamlInEditor, parentToCurrentPropertyPath } = getMetaDataForKeyboardEventProcessing(
          editor,
          true
        )
        disposePreviousSuggestions()
        invokeCallBackForMatchingYAMLPaths(monaco, parentToCurrentPropertyPath, editor)
      }
    }
    if (code === KEY_CODE_FOR_PERIOD) {
      const { currentProperty, yamlInEditor, parentToCurrentPropertyPath } = getMetaDataForKeyboardEventProcessing(
        editor
      )
      disposePreviousSuggestions()
      registerCompletionItemProviderForExpressions(
        monaco,
        [TRIGGER_CHAR_FOR_PARTIAL_EXPR],
        parentToCurrentPropertyPath,
        getExpressionFromCurrentLine(editor)
      )
    }
  }

  return (
    <div className={css.main}>
      <Layout.Horizontal className={css.layout}>
        <div className={cx(css.builderSection, { [css.editorOnly]: !showSnippetSection })}>
          <div className={css.flexCenter}>
            <span className={cx(css.filePath, css.flexCenter)}>{fileName}</span>
            {fileName && entityType ? <Tag className={css.entityTag}>{entityType}</Tag> : null}
          </div>
          <MonacoEditor
            defaultValue={existingYaml}
            width={width ?? '800px'}
            height={height ?? '600px'}
            language="yaml"
            value={currentYaml}
            onChange={onYamlChange}
            editorDidMount={editorDidMount}
            options={{ readOnly: isReadOnlyMode, wordBasedSuggestions: false }}
          />
        </div>
        {showSnippetSection ? (
          <SnippetSection
            showIconMenu={showIconMenu}
            entityType={entityType}
            snippets={snippets}
            onSnippetSearch={onSnippetSearch}
          />
        ) : null}
      </Layout.Horizontal>
    </div>
  )
}

export default YAMLBuilder
