// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react'
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
import { Tag } from '@wings-software/uikit'
import type { YamlBuilderProps, InvocationContext } from 'modules/common/interfaces/YAMLBuilderProps'

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

interface CompletionItemInterface {
  label: string
  kind: monaco.languages.CompletionItemKind
  value: string
}

/**
 * @description Find json path(s) of a given node in json from it's nearest parent
 * @param obj json object
 * @param leaf leaf node whose path(s) from the nearest parent needs to be known
 * @param delimiter delimiter to be used in node path(s) from parent
 * @returns matching json paths(s)
 */
function findLeafToParentPath(obj: Record<string, any>, leaf: string, delimiter?: string): Map<string, string> {
  delimiter = delimiter || '.'
  const paths = new Map<string, string>()

  function findPath(currObj: Record<string, any>, currentDepth: number, previous?: string) {
    Object.keys(currObj).forEach(function (key) {
      const value = currObj[key]
      const type = Object.prototype.toString.call(value)
      const isObject = type === '[object Object]' || type === '[object Array]'
      const newKey = previous ? previous + delimiter + key : key
      if (isObject && Object.keys(value).length) {
        return findPath(value, currentDepth + 1, newKey)
      }
      if (newKey.includes(leaf)) paths.set(leaf, newKey)
    })
  }

  findPath(obj, 1)

  return paths
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
    showSnippetsSection,
    invocationMap,
    bind
  } = props
  const [currentYaml, setCurrentYaml] = useState<string | undefined>('')
  const yamlPathToRTValueMap = useRef(new Map<string, any>())
  const yamlPathToRefetcherMap = useRef(new Map<string, InvocationContext>())

  if (invocationMap && invocationMap.size > 0) {
    invocationMap.forEach((key: InvocationContext, value: string) => {
      const { serviceHook, args } = key,
        yamlPath = value
      if (typeof serviceHook === 'function') {
        const { data, refetch } = serviceHook(args)
        yamlPathToRefetcherMap.current.set(yamlPath, refetch)
        yamlPathToRTValueMap.current.set(yamlPath, data)
      }
    })
  }

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
  function registerCompletionItemProviderForExpressions(editor): void {
    if (editor) {
      const suggestions = fetchAutocompleteItemsForExpressions(JSONSchemaService.fetchExpressions)
      expressionCompletionDisposer = editor?.languages?.registerCompletionItemProvider('yaml', {
        triggerCharacters: ['$'],
        provideCompletionItems: () => provideCompletionItems(suggestions)
      })
    }
  }

  /** For RT Inputs */
  async function fetchRTAutocompleteItems(
    refetcherFunc: Function,
    yamlPath: string
  ): Promise<CompletionItemInterface[]> {
    await refetcherFunc({ accountIdentifier: 'kmpySmUISimoRrJL6NL73w' })
    const rtValueForYamlPath = yamlPathToRTValueMap.current.get(yamlPath)
    if (rtValueForYamlPath?.data?.content?.length > 0) {
      const items = rtValueForYamlPath?.data?.content
      const suggestions = items.map((item: Record<string, any>) => {
        if (item.name) {
          const itemName = item.name.trim()
          return {
            label: itemName,
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: itemName
          }
        }
      })
      return suggestions
    }
    return []
  }

  let runTimeCompletionDisposer: { dispose: () => void }
  async function registerCompletionItemProviderForRTInputs(
    editor,
    yamlPath: string,
    refetcherFunc: Function
  ): Promise<void> {
    if (editor) {
      const suggestions = await fetchRTAutocompleteItems(refetcherFunc, yamlPath)
      runTimeCompletionDisposer = editor?.languages?.registerCompletionItemProvider('yaml', {
        triggerCharacters: [' '],
        provideCompletionItems: () => provideCompletionItems(suggestions)
      })
    }
  }

  const invokeRefetchersWithMatchingYamlPaths = (monaco, paths: Map<string, string>): void => {
    paths.forEach(value => {
      if (yamlPathToRefetcherMap.current.has(value)) {
        const refetcherFunc = yamlPathToRefetcherMap.current.get(value)
        if (refetcherFunc && typeof refetcherFunc === 'function') {
          registerCompletionItemProviderForRTInputs(monaco, value, refetcherFunc)
        }
      }
    })
  }

  const handleEditorEvent = (event: KeyboardEvent, editor): void => {
    const { shiftKey, code } = event
    //TODO Need to check hotkey for cross browser/cross OS compatibility
    //TODO Need to debounce this function call for performance optimization
    if (shiftKey) {
      disposePreviousSuggestions()
      if (code === 'Digit4') {
        registerCompletionItemProviderForExpressions(monaco)
      } else if (code === 'Semicolon') {
        const currentToken = editor.getModel().getLineContent(editor.getPosition().lineNumber)
        const yamlInEditor = editor.getValue()
        if (currentToken && yamlInEditor) {
          const sanitizedToken = currentToken.replace(':', '').trim()
          const sanitizedYaml = yamlInEditor.replace(/\n+$/, '')
          const jsonObjForYamlInEditor = getJSONFromYAML(sanitizedYaml.concat(': placeholder'))
          if (jsonObjForYamlInEditor && Object.keys(jsonObjForYamlInEditor).length > 0) {
            const matchingPaths = findLeafToParentPath(jsonObjForYamlInEditor, sanitizedToken)
            invokeRefetchersWithMatchingYamlPaths(monaco, matchingPaths)
          }
        }
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
    <div className={cx(css.main, { [css.editorOnly]: !showSnippetsSection })}>
      <div className={css.flexCenter}>
        <span className={cx(css.filePath, css.flexCenter)}>{fileName}</span>
        {fileName && entityType ? <Tag className={css.entityTag}>{entityType}</Tag> : null}
      </div>
      <div className={css.builder}>
        <MonacoEditor
          defaultValue={existingYaml}
          width={width ?? 800}
          height={height ?? 600}
          language="yaml"
          value={currentYaml}
          onChange={onYamlChange}
          editorDidMount={editorDidMount}
          options={{ readOnly: isReadOnlyMode }}
        />
      </div>
    </div>
  )
}

export default YAMLBuilder
