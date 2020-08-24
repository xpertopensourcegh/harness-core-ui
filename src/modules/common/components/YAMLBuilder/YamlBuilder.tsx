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

import { JSONSchemaService } from 'modules/dx/services'
import { Tag, Layout } from '@wings-software/uikit'
import type {
  YamlBuilderProps,
  YamlBuilderHandlerBinding,
  CompletionItemInterface
} from 'modules/common/interfaces/YAMLBuilderProps'
import SnippetSection from 'modules/common/components/SnippetSection/SnippetSection'

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
    onSnippetSearch
  } = props
  const [currentYaml, setCurrentYaml] = useState<string | undefined>('')

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
    const jsonSchemas = loadEntitySchemas(entityType)
    yaml?.yamlDefaults.setDiagnosticsOptions(jsonSchemas)
    setCurrentYaml(props.existingYaml)
  }, [existingYaml, entityType])

  function loadEntitySchemas(entityType: string) {
    const jsonSchemas = JSONSchemaService.fetchEntitySchemas(entityType)
    return jsonSchemas
  }

  function provideCompletionItems(suggestions: CompletionItemInterface[]) {
    return { suggestions }
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
  function fetchAutocompleteItemsForExpressions(callBackFunc: Function): CompletionItemInterface[] {
    const response = callBackFunc()
    if (response?.length > 0) {
      //TODO Add type when available
      const suggestions = response.map((item: any) => {
        return {
          label: item,
          kind: monaco.languages.CompletionItemKind.Value,
          insertText: '{' + item + '}'
        }
      })
      return suggestions
    }
    return []
  }

  let expressionCompletionDisposer: { dispose: () => void }
  function registerCompletionItemProviderForExpressions(editor, matchingPath: string): void {
    if (editor) {
      const suggestions = fetchAutocompleteItemsForExpressions(JSONSchemaService.fetchExpressions)
      expressionCompletionDisposer = editor?.languages?.registerCompletionItemProvider('yaml', {
        triggerCharacters: ['$'],
        provideCompletionItems: () => provideCompletionItems(suggestions)
      })
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
          provideCompletionItems: () => provideCompletionItems(suggestions)
        })
      })
    }
  }

  const invokeCallBackForMatchingYAMLPaths = (monaco, matchingPath: string): void => {
    invocationMap?.forEach((callBackFunc, yamlPath) => {
      if (matchingPath.match(yamlPath) && typeof callBackFunc === 'function') {
        const suggestionsPromise = callBackFunc(matchingPath)
        registerCompletionItemProviderForRTInputs(monaco, suggestionsPromise)
      }
    })
  }

  const getValidatedYAMLFromEditor = (editor): string => {
    const currentEditorPosition = editor.getPosition(),
      currentEditorText = editor.getValue(currentEditorPosition).trim(),
      currentLineNumber = currentEditorPosition.lineNumber,
      splitedText = currentEditorText.split('\n').slice(0, currentLineNumber),
      currentLineContent = splitedText[currentLineNumber - 1],
      textToInsert = currentEditorText[currentEditorText.length - 1] === ':' ? '' : ': ' + 'placeholder'
    splitedText[currentLineNumber - 1] = [
      currentLineContent.slice(0, currentEditorPosition.column - 1),
      textToInsert,
      currentLineContent.slice(currentEditorPosition.column - 1)
    ].join('')
    editor.setPosition(currentEditorPosition)

    return splitedText.join('\n')
  }

  const handleEditorEvent = (event: KeyboardEvent, editor): void => {
    const { shiftKey, code } = event
    //TODO Need to check hotkey for cross browser/cross OS compatibility
    //TODO Need to debounce this function call for performance optimization
    if (shiftKey) {
      disposePreviousSuggestions()
      const currentToken = editor.getModel().getLineContent(editor.getPosition().lineNumber)
      const validatedYAML = getValidatedYAMLFromEditor(editor)
      const sanitizedToken = currentToken.replace(':', '').trim()
      const jsonObjForYamlInEditor = getJSONFromYAML(validatedYAML)
      const parentToCurrentTokenYAMLPath = findLeafToParentPath(jsonObjForYamlInEditor, sanitizedToken)
      if (sanitizedToken && validatedYAML)
        if (code === 'Digit4') {
          registerCompletionItemProviderForExpressions(monaco, parentToCurrentTokenYAMLPath)
        } else if (code === 'Semicolon') {
          invokeCallBackForMatchingYAMLPaths(monaco, parentToCurrentTokenYAMLPath)
        }
    }
  }

  const onYamlChange = (updatedYaml: string): void => {
    setCurrentYaml(updatedYaml)
  }

  const editorDidMount = (editor, monaco) => {
    if (editor) {
      if (!props.isReadOnlyMode) {
        editor.focus()
      }
      editor.onKeyDown((event: KeyboardEvent) => handleEditorEvent(event, editor))
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
