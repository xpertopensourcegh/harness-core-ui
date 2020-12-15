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
  CompletionItemInterface,
  LanguageSettingInterface
} from '@common/interfaces/YAMLBuilderProps'
import SnippetSection from '@common/components/SnippetSection/SnippetSection'
import { validateYAMLWithSchema } from '@common/utils/YamlUtils'
import {
  getYAMLFromEditor,
  getMetaDataForKeyboardEventProcessing,
  getYAMLPathToValidationErrorMap
} from './YAMLBuilderUtils'
import { useGetYamlSchema, GetYamlSchemaQueryParams } from 'services/cd-ng'
import pipelineSchema from '../../services/mocks/pipeline-schema.json'

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
  const schemaRef = useRef<string>()
  yamlRef.current = currentYaml
  yamlValidationErrorsRef.current = yamlValidationErrors
  schemaRef.current = ''
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

  /* Fetch schema for the editor based on entity type */

  /* Register all the data providers here */
  const { data: connectorSchema, refetch: fetchConnectorSchema } = useGetYamlSchema({
    queryParams: {
      entityType
    },
    lazy: true
  })

  useEffect(() => {
    verifyIncomingJSON(existingJSON)
  }, [existingJSON])

  const fetchSchema = (entityType: GetYamlSchemaQueryParams['entityType']) => {
    switch (entityType) {
      case 'Connectors':
        fetchConnectorSchema()
        return
      default:
        return
    }
  }

  useEffect(() => {
    if (entityType === 'Pipelines') {
      setUpYAMLBuilderWithLanguageSettings(pipelineSchema)
      return
    }
    fetchSchema(entityType)
  }, [entityType])

  useEffect(() => {
    const schema = (connectorSchema?.data as string) || ''
    if (schema) {
      const languageSettings = getSchemaWithLanguageSettings(schema)
      schemaRef.current = schema
      setUpYAMLBuilderWithLanguageSettings(languageSettings)
    }
  }, [connectorSchema])

  const getSchemaWithLanguageSettings = (schema: string): LanguageSettingInterface => {
    return {
      validate: true,
      enableSchemaRequest: true,
      hover: true,
      completion: true,
      schemas: [
        {
          fileMatch: ['*'],
          schema
        }
      ]
    }
  }

  const setUpYAMLBuilderWithLanguageSettings = (languageSettings: Record<string, any>): void => {
    //@ts-ignore
    const { yaml } = languages || {}
    yaml?.yamlDefaults.setDiagnosticsOptions(languageSettings)
  }

  /* Handle various interactions with the editor */
  const onYamlChange = (updatedYaml: string): void => {
    setCurrentYaml(updatedYaml)
    verifyYAMLValidity(updatedYaml)
  }

  const verifyYAMLValidity = (currentYaml: string): void => {
    validateYAMLWithSchema(currentYaml, [schemaRef.current])
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

  /** Expressions support */
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

  /** Run-time Inputs support */
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
