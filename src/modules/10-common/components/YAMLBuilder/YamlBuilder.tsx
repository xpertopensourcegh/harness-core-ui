import React, { useEffect, useState, useRef } from 'react'
import MonacoEditor from 'react-monaco-editor'
import '@wings-software/monaco-yaml/lib/esm/monaco.contribution'
import { languages } from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor'
//@ts-ignore
import YamlWorker from 'worker-loader!@wings-software/monaco-yaml/lib/esm/yaml.worker'
//@ts-ignore
import EditorWorker from 'worker-loader!monaco-editor/esm/vs/editor/editor.worker'
import cx from 'classnames'
import { stringify } from 'yaml'
import { Tag, Layout, Icon } from '@wings-software/uikit'
import type {
  YamlBuilderProps,
  YamlBuilderHandlerBinding,
  CompletionItemInterface
} from '@common/interfaces/YAMLBuilderProps'
import SnippetSection from '@common/components/SnippetSection/SnippetSection'
import { JSONSchemaService } from '@common/services'
import { validateYAMLWithSchema } from '@common/utils/YamlUtils'
import {
  getYAMLFromEditor,
  getMetaDataForKeyboardEventProcessing,
  getYAMLPathToValidationErrorMap
} from './YAMLBuilderUtils'

import css from './YamlBuilder.module.scss'
import { debounce } from 'lodash-es'
import type { Diagnostic } from 'vscode-languageserver-types'
import { useToaster } from '@common/exports'

//@ts-ignore
monaco.editor.defineTheme('vs', {
  base: 'vs',
  inherit: false,
  rules: [
    { token: 'type', foreground: '1D76FF' },
    { token: 'string', foreground: '22272D' },
    { token: 'comment', foreground: '9aa5b5' }
  ]
})
//@ts-ignore
monaco.editor.setTheme('vs')

//@ts-ignore
window.MonacoEnvironment = {
  getWorker(_workerId: unknown, label: string) {
    if (label === 'yaml') {
      return new YamlWorker()
    }
    return new EditorWorker()
  }
}

const DEFAULT_EDITOR_HEIGHT = '600px'
const DEFAULT_EDITOR_WIDTH = '800px'

const YAMLBuilder: React.FC<YamlBuilderProps> = props => {
  const {
    height,
    width,
    fileName,
    entityType,
    existingJSON,
    isReadOnlyMode,
    showSnippetSection = true,
    invocationMap,
    bind,
    showIconMenu = false,
    onExpressionTrigger,
    snippets,
    onSnippetCopy,
    snippetYaml
  } = props
  const [currentYaml, setCurrentYaml] = useState<string | undefined>('')
  const [yamlValidationErrors, setYamlValidationErrors] = useState<Map<string, string[]> | undefined>()
  const editorRef = useRef<MonacoEditor>(null)
  const yamlRef = useRef<string | undefined>('')
  const yamlValidationErrorsRef = useRef<Map<string, string[]> | undefined>()
  yamlRef.current = currentYaml
  yamlValidationErrorsRef.current = yamlValidationErrors
  const TRIGGER_CHAR_FOR_NEW_EXPR = '$'
  const TRIGGER_CHAR_FOR_PARTIAL_EXPR = '.'
  const KEY_CODE_FOR_DOLLAR_SIGN = 'Digit4'
  const KEY_CODE_FOR_SEMI_COLON = 'Semicolon'
  const KEY_CODE_FOR_PERIOD = 'Period'
  const { showError } = useToaster()

  const handler = React.useMemo(
    () =>
      ({
        getLatestYaml: () => yamlRef.current,
        getYAMLValidationErrorMap: () => yamlValidationErrorsRef.current
      } as YamlBuilderHandlerBinding),
    []
  )

  useEffect(() => {
    bind?.(handler)
  }, [bind, handler])

  useEffect(() => {
    //@ts-ignore
    const { yaml } = languages || {}
    const languageSettings = getYAMLLanguageSettings(entityType)
    yaml?.yamlDefaults.setDiagnosticsOptions(languageSettings)
    verifyIncomingJSON(existingJSON)
  }, [existingJSON, entityType])

  const replacer = (_key: string, value: unknown) => (typeof value === 'undefined' ? '' : value)

  const verifyIncomingJSON = (jsonObj: Record<string, any> | undefined): void => {
    const sanitizedJSON = JSON.parse(JSON.stringify(jsonObj, replacer).replace(/null/g, '""'))
    if (sanitizedJSON && Object.keys(sanitizedJSON).length > 0) {
      const yamlEqOfJSON = stringify(sanitizedJSON)
      const sanitizedYAML = yamlEqOfJSON.replace(': null\n', ': \n')
      setCurrentYaml(sanitizedYAML)
      verifyYAMLValidity(sanitizedYAML)
    }
  }

  const getYAMLLanguageSettings = (entityType: string): Record<string, any> | undefined => {
    const jsonSchemas = JSONSchemaService.fetchEntitySchemas(entityType)
    return jsonSchemas
  }

  const onYamlChange = (updatedYaml: string): void => {
    setCurrentYaml(updatedYaml)
    verifyYAMLValidity(updatedYaml)
  }

  const verifyYAMLValidity = (currentYaml: string): void => {
    const jsonSchemas = JSONSchemaService.fetchEntitySchemas(entityType)
    validateYAMLWithSchema(currentYaml, [jsonSchemas])
      .then((validationErrors: Diagnostic[]) => {
        if (validationErrors && Array.isArray(validationErrors)) {
          const validationErrorMap = getYAMLPathToValidationErrorMap(
            currentYaml,
            validationErrors,
            editorRef?.current?.editor
          )
          setYamlValidationErrors(validationErrorMap)
        }
      })
      .catch((error: string) => {
        showError(error, 5000)
      })
  }

  const editorDidMount = (editor: any) => {
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
  const getExpressionFromCurrentLine = (editor: any): string => {
    const textInCurrentEditorLine = editor.getModel().getLineContent(editor.getPosition().lineNumber)
    const expression = textInCurrentEditorLine.split(':').map((item: string) => item.trim())?.[1]
    return expression
  }

  let expressionCompletionDisposer: { dispose: () => void }
  function registerCompletionItemProviderForExpressions(
    editor: any,
    triggerCharacters: string[],
    matchingPath: string | undefined,
    currentExpression: string | undefined = ''
  ): void {
    if (editor && matchingPath) {
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
    editor: any,
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

  const invokeCallBackForMatchingYAMLPaths = (editor: any, matchingPath: string | undefined): void => {
    if (editor && matchingPath) {
      invocationMap?.forEach((callBackFunc, yamlPath) => {
        if (matchingPath.match(yamlPath) && typeof callBackFunc === 'function') {
          const yamlLFromEditor = getYAMLFromEditor(editor, true) as string
          const suggestionsPromise = callBackFunc(matchingPath, yamlLFromEditor)
          registerCompletionItemProviderForRTInputs(editor, suggestionsPromise)
        }
      })
    }
  }

  const handleEditorKeyDownEvent = (event: KeyboardEvent, editor: any): void => {
    const { shiftKey, code } = event
    //TODO Need to check hotkey for cross browser/cross OS compatibility
    //TODO Need to debounce this function call for performance optimization
    if (shiftKey) {
      if (code === KEY_CODE_FOR_DOLLAR_SIGN) {
        const yamlPath = getMetaDataForKeyboardEventProcessing(editor)?.parentToCurrentPropertyPath
        disposePreviousSuggestions()
        registerCompletionItemProviderForExpressions(editor, [TRIGGER_CHAR_FOR_NEW_EXPR], yamlPath)
      } else if (code === KEY_CODE_FOR_SEMI_COLON && invocationMap && invocationMap.size > 0) {
        const yamlPath = getMetaDataForKeyboardEventProcessing(editor, true)?.parentToCurrentPropertyPath
        disposePreviousSuggestions()
        invokeCallBackForMatchingYAMLPaths(editor, yamlPath)
      }
    }
    if (code === KEY_CODE_FOR_PERIOD) {
      const yamlPath = getMetaDataForKeyboardEventProcessing(editor)?.parentToCurrentPropertyPath
      disposePreviousSuggestions()
      registerCompletionItemProviderForExpressions(
        editor,
        [TRIGGER_CHAR_FOR_PARTIAL_EXPR],
        yamlPath,
        getExpressionFromCurrentLine(editor)
      )
    }
  }

  return (
    <div className={css.main}>
      <Layout.Horizontal className={css.layout}>
        <div className={cx(css.builderSection, { [css.editorOnly]: !showSnippetSection })}>
          <div className={css.header}>
            <div className={css.flexCenter}>
              <span className={cx(css.filePath, css.flexCenter)}>{fileName}</span>
              {fileName && entityType ? <Tag className={css.entityTag}>{entityType}</Tag> : null}
            </div>
            {yamlValidationErrors && yamlValidationErrors.size > 0 ? (
              <div className={cx(css.flexCenter, css.validationStatus)}>
                <Icon name="main-issue-filled" size={14} className={css.validationIcon} />
                <span className={css.invalidYaml}>Invalid</span>
              </div>
            ) : null}
          </div>
          <div className={css.editor}>
            <MonacoEditor
              width={width ?? DEFAULT_EDITOR_WIDTH}
              height={height ?? DEFAULT_EDITOR_HEIGHT}
              language="yaml"
              value={currentYaml}
              onChange={debounce(onYamlChange, 200)}
              editorDidMount={editorDidMount}
              options={{
                readOnly: isReadOnlyMode,
                //@ts-ignore
                wordBasedSuggestions: false,
                fontFamily: "'Roboto Mono', monospace",
                fontSize: 13
              }}
              ref={editorRef}
            />
          </div>
        </div>
        {showSnippetSection ? (
          <SnippetSection
            showIconMenu={showIconMenu}
            entityType={entityType}
            height={height ?? DEFAULT_EDITOR_HEIGHT}
            snippets={snippets}
            onSnippetCopy={onSnippetCopy}
            snippetYaml={snippetYaml}
          />
        ) : null}
      </Layout.Horizontal>
    </div>
  )
}

export default YAMLBuilder
