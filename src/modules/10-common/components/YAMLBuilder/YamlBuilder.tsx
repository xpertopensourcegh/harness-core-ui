import React, { useEffect, useState, useRef } from 'react'
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor'
import '@wings-software/monaco-yaml/lib/esm/monaco.contribution'
import { IKeyboardEvent, languages } from 'monaco-editor/esm/vs/editor/editor.api'
import type { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor'
//@ts-ignore
import YamlWorker from 'worker-loader!@wings-software/monaco-yaml/lib/esm/yaml.worker'
//@ts-ignore
import EditorWorker from 'worker-loader!monaco-editor/esm/vs/editor/editor.worker'
import cx from 'classnames'
import { scalarOptions, stringify } from 'yaml'
import { Tag, Layout, Icon } from '@wings-software/uicore'
import type {
  YamlBuilderProps,
  YamlBuilderHandlerBinding,
  CompletionItemInterface,
  Theme
} from '@common/interfaces/YAMLBuilderProps'
import SnippetSection from '@common/components/SnippetSection/SnippetSection'
import { validateYAMLWithSchema } from '@common/utils/YamlUtils'
import { sanitize } from '@common/utils/JSONUtils'
import {
  getYAMLFromEditor,
  getMetaDataForKeyboardEventProcessing,
  getYAMLPathToValidationErrorMap,
  DEFAULT_YAML_PATH
} from './YAMLBuilderUtils'

import css from './YamlBuilder.module.scss'
import { debounce, truncate } from 'lodash-es'
import type { Diagnostic } from 'vscode-languageserver-types'
import { useToaster } from '@common/exports'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/exports'
import { useConfirmationDialog } from '@common/modals/ConfirmDialog/useConfirmationDialog'
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'

// Please do not remove this, read this https://eemeli.org/yaml/#scalar-options
scalarOptions.str.fold.lineWidth = 100000
const EDITOR_BASE_DARK_THEME = 'vs-dark'
const EDITOR_BASE_LIGHT_THEME = 'vs'
/* Dark theme colors */
const EDITOR_DARK_BG = '4F5162'
const EDITOR_DARK_FG = 'b8bfca'
const EDITOR_DARK_SELECTION = '91999466'
const EDITOR_WHITESPACE = '666C6880'
const EDITOR_DARK_TYPE = '25a6f7'

/* Light theme colors */
const EDITOR_LIGHT_BG = 'FFFFFF'

/* Common colors */
const EDITOR_COMMENT = '9aa5b5'
const EDITOR_LIGHT_TYPE = '1D76FF'
const EDITOR_LIGHT_STRING = '22272D'

export const EditorTheme = {
  LIGHT: [
    { token: 'type', foreground: `#${EDITOR_LIGHT_TYPE}` },
    { token: 'string', foreground: `#${EDITOR_LIGHT_STRING}` },
    { token: 'comment', foreground: `#${EDITOR_COMMENT}` }
  ],
  DARK: [
    { token: 'type', foreground: `#${EDITOR_DARK_TYPE}` },
    { token: 'string', foreground: `#${EDITOR_DARK_FG}` },
    { token: 'comment', foreground: `#${EDITOR_COMMENT}` }
  ]
}

const getTheme = (theme: Theme) => (theme === 'DARK' ? EDITOR_BASE_DARK_THEME : EDITOR_BASE_LIGHT_THEME)

const MAX_YAML_PARSING_ERR_MSSG_LENGTH = 80

const setUpEditor = (theme: Theme): void => {
  //@ts-ignore
  monaco.editor.defineTheme(getTheme(theme), {
    base: getTheme(theme),
    inherit: theme === 'DARK',
    rules: theme === 'DARK' ? EditorTheme.DARK : EditorTheme.LIGHT,
    colors:
      theme === 'DARK'
        ? {
            'editor.background': `#${EDITOR_DARK_BG}`,
            'editor.foreground': `#${EDITOR_DARK_FG}`,
            'editor.selectionBackground': `#${EDITOR_DARK_SELECTION}`,

            'editor.lineHighlightBackground': `#${EDITOR_DARK_SELECTION}`,
            'editorCursor.foreground': `#${EDITOR_DARK_FG}`,
            'editorWhitespace.foreground': `#${EDITOR_WHITESPACE}`
          }
        : { 'editor.background': `#${EDITOR_LIGHT_BG}` }
  })
  //@ts-ignore
  monaco.editor.setTheme(getTheme(theme))

  //@ts-ignore
  window.MonacoEnvironment = {
    getWorker(_workerId: unknown, label: string) {
      if (label === 'yaml') {
        return new YamlWorker()
      }
      return new EditorWorker()
    }
  }
}

const DEFAULT_EDITOR_HEIGHT = '600px'
const DEFAULT_EDITOR_WIDTH = '800px'

const YAMLBuilder: React.FC<YamlBuilderProps> = (props: YamlBuilderProps): JSX.Element => {
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
    snippetYaml,
    schema,
    needEditorReset,
    onEnableEditMode,
    theme = 'LIGHT',
    yamlSanityConfig
  } = props
  setUpEditor(theme)
  const params = useParams()
  const [currentYaml, setCurrentYaml] = useState<string | undefined>('')
  const [yamlValidationErrors, setYamlValidationErrors] = useState<Map<string, string[]> | undefined>()

  const editorRef = useRef<MonacoEditor>(null)
  const yamlRef = useRef<string | undefined>('')
  yamlRef.current = currentYaml
  const yamlValidationErrorsRef = useRef<Map<string, string[]> | undefined>()
  yamlValidationErrorsRef.current = yamlValidationErrors
  const editorVersionRef = useRef<number>()

  const TRIGGER_CHARS_FOR_NEW_EXPR = ['<', '+']
  const TRIGGER_CHAR_FOR_PARTIAL_EXPR = '.'
  const KEY_CODE_FOR_PLUS_SIGN = 'Equal'
  const ANGULAR_BRACKET_CHAR = '<'
  const KEY_CODE_FOR_SEMI_COLON = 'Semicolon'
  const KEY_CODE_FOR_PERIOD = 'Period'
  const KEY_CODE_FOR_SPACE = 'Space'
  const KEY_CODE_FOR_CHAR_Z = 'KeyZ'

  let expressionCompletionDisposer: { dispose: () => void }
  let runTimeCompletionDisposer: { dispose: () => void }

  const { showError } = useToaster()
  const { getString } = useStrings()

  const getEditorCurrentVersion = (): number | undefined => {
    return editorRef.current?.editor?.getModel()?.getAlternativeVersionId()
  }

  const editorHasUnsavedChanges = (): boolean => {
    return editorVersionRef.current !== getEditorCurrentVersion()
  }

  useEffect(() => {
    return () => {
      disposePreviousSuggestions()
    }
  }, [])

  /* #region Bootstrap editor with schema */

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
    const jsonObjWithoutNulls = JSON.parse(JSON.stringify(jsonObj, replacer).replace(/:\s*null/g, ':""')) as Record<
      string,
      any
    >
    const sanitizedJSONObj = sanitize(jsonObjWithoutNulls, yamlSanityConfig)
    if (sanitizedJSONObj && Object.keys(sanitizedJSONObj).length > 0) {
      const yamlEqOfJSON = stringify(sanitizedJSONObj)
      const sanitizedYAML = yamlEqOfJSON.replace(': null\n', ': \n')
      setCurrentYaml(sanitizedYAML)
      verifyYAML(sanitizedYAML)
    }
  }

  useEffect(() => {
    if (!editorHasUnsavedChanges()) {
      verifyIncomingJSON(existingJSON)
    }
  }, [existingJSON])

  useEffect(() => {
    if (needEditorReset) {
      editorRef.current?.editor?.getModel()?.setValue('')
    }
  }, [needEditorReset])

  useEffect(() => {
    if (schema) {
      const languageSettings = getSchemaWithLanguageSettings(schema)
      setUpYAMLBuilderWithLanguageSettings(languageSettings)
    }
  }, [schema])

  const getSchemaWithLanguageSettings = (schema: string | Record<string, any>): string | Record<string, any> => {
    const schemaObj = typeof schema === 'string' ? JSON.parse(schema) : schema
    return {
      validate: true,
      enableSchemaRequest: true,
      hover: true,
      completion: true,
      schemas: [
        {
          fileMatch: ['*'],
          schema: schemaObj
        }
      ]
    }
  }

  const setUpYAMLBuilderWithLanguageSettings = (languageSettings: string | Record<string, any>): void => {
    //@ts-ignore
    const { yaml } = languages || {}
    yaml?.yamlDefaults.setDiagnosticsOptions(languageSettings)
  }

  /* #endregion */

  /* #region Handle various interactions with the editor */

  const onYamlChange = React.useRef(
    debounce((updatedYaml: string): void => {
      setCurrentYaml(updatedYaml)
      verifyYAML(updatedYaml)
    }, 200)
  ).current

  const verifyYAML = (currentYaml: string): void => {
    try {
      if (schema && currentYaml) {
        validateYAMLWithSchema(currentYaml, getSchemaWithLanguageSettings(schema))
          .then((errors: Diagnostic[]) => {
            processYAMLValidationErrors(currentYaml, errors)
          })
          .catch((error: string) => {
            showError(error, 5000)
          })
      }
    } catch (err) {
      showError(getString('yamlBuilder.yamlError'))
    }
  }

  const processYAMLValidationErrors = (currentYaml: string, validationErrors: Diagnostic[]): void => {
    setYamlValidationErrors(getYAMLPathToValidationErrorMap(currentYaml, validationErrors, editorRef.current?.editor))
  }

  const editorDidMount = (editor: editor.IStandaloneCodeEditor): void => {
    editorVersionRef.current = editor.getModel()?.getAlternativeVersionId()
    if (!props.isReadOnlyMode) {
      editor?.focus()
    }
    editor.onKeyDown((event: IKeyboardEvent) => handleEditorKeyDownEvent(event, editor))
  }

  const disposePreviousSuggestions = (): void => {
    if (expressionCompletionDisposer) {
      expressionCompletionDisposer.dispose()
    }
    if (runTimeCompletionDisposer) {
      runTimeCompletionDisposer.dispose()
    }
  }

  /* #endregion */

  /* #region Custom invocations */

  /** Expressions support */
  const getEditorContentInCurrentLine = (editor: editor.IStandaloneCodeEditor): string | undefined => {
    const currentLineNum = editor.getPosition()?.lineNumber
    if (currentLineNum) {
      return editor.getModel()?.getLineContent(currentLineNum)
    }
  }

  const getExpressionFromCurrentLine = (editor: editor.IStandaloneCodeEditor): string | undefined => {
    const expression = getEditorContentInCurrentLine(editor)
      ?.split(':')
      .map((item: string) => item.trim())?.[1]
    return expression
  }

  function registerCompletionItemProviderForExpressions(
    editor: editor.IStandaloneCodeEditor,
    triggerCharacters: string[],
    matchingPath: string | undefined,
    currentExpression: string | undefined = ''
  ): void {
    if (editor && matchingPath) {
      const suggestionsPromise = onExpressionTrigger ? onExpressionTrigger(matchingPath, currentExpression) : null
      if (suggestionsPromise) {
        suggestionsPromise.then(suggestions => {
          // @ts-ignore
          expressionCompletionDisposer = monaco?.languages?.registerCompletionItemProvider('yaml', {
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
  function registerCompletionItemProviderForRTInputs(
    editor: editor.IStandaloneCodeEditor,
    suggestionsPromise: Promise<CompletionItemInterface[]>
  ): void {
    if (editor) {
      suggestionsPromise.then(suggestions => {
        // @ts-ignore
        runTimeCompletionDisposer = monaco?.languages?.registerCompletionItemProvider('yaml', {
          triggerCharacters: [' '],
          provideCompletionItems: () => {
            return { suggestions }
          }
        })
      })
    }
  }

  const invokeCallBackForMatchingYAMLPaths = (
    editor: editor.IStandaloneCodeEditor,
    matchingPath: string | undefined
  ): void => {
    if (editor && matchingPath) {
      invocationMap?.forEach((callBackFunc, yamlPath) => {
        if (matchingPath.match(yamlPath) && typeof callBackFunc === 'function') {
          const yamlFromEditor = getYAMLFromEditor(editor, true) as string
          const suggestionsPromise = callBackFunc(matchingPath, yamlFromEditor, params)
          registerCompletionItemProviderForRTInputs(editor, suggestionsPromise)
        }
      })
    }
  }

  const shouldInvokeExpressions = (editor: editor.IStandaloneCodeEditor, event: IKeyboardEvent): boolean => {
    const lastKeyStrokeCharacter = getEditorContentInCurrentLine(editor)?.substr(-1)
    const { shiftKey, code } = event
    return lastKeyStrokeCharacter === ANGULAR_BRACKET_CHAR && shiftKey && code === KEY_CODE_FOR_PLUS_SIGN
  }

  /* #endregion */

  const { openDialog } = useConfirmationDialog({
    contentText: getString('yamlBuilder.enableEditContext'),
    titleText: getString('confirm'),
    confirmButtonText: getString('enable'),
    cancelButtonText: getString('cancel'),
    onCloseDialog: async didConfirm => {
      if (didConfirm) {
        onEnableEditMode?.()
      }
    }
  })

  const handleEditorKeyDownEvent = (event: IKeyboardEvent, editor: any): void => {
    if (props.isReadOnlyMode) {
      openDialog()
    }
    try {
      const { shiftKey, code, ctrlKey, metaKey } = event
      //TODO Need to check hotkey for cross browser/cross OS compatibility

      // this is to prevent reset of the editor to empty when there is no undo history
      if ((ctrlKey || metaKey) && code === KEY_CODE_FOR_CHAR_Z) {
        if (
          editorHasUnsavedChanges() &&
          editorVersionRef.current &&
          editorVersionRef.current + 1 === getEditorCurrentVersion()
        ) {
          event.stopPropagation()
          event.preventDefault()
        }
      }
      if (ctrlKey && code === KEY_CODE_FOR_SPACE) {
        disposePreviousSuggestions()
      }
      if (shiftKey) {
        // this is to invoke expressions callback
        if (shouldInvokeExpressions(editor, event)) {
          const yamlPath = getMetaDataForKeyboardEventProcessing(editor)?.parentToCurrentPropertyPath
          disposePreviousSuggestions()
          registerCompletionItemProviderForExpressions(editor, TRIGGER_CHARS_FOR_NEW_EXPR, yamlPath)
        }
        // this is to invoke run-time inputs as suggestions
        else if (code === KEY_CODE_FOR_SEMI_COLON && invocationMap && invocationMap.size > 0) {
          const yamlPath = getMetaDataForKeyboardEventProcessing(editor, true)?.parentToCurrentPropertyPath
          disposePreviousSuggestions()
          invokeCallBackForMatchingYAMLPaths(editor, yamlPath)
        }
      }
      // this is to invoke partial expressions callback e.g. invoke expressions callback on hitting a period(.) after an expression: expr1.expr2. <-
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
    } catch (err) {
      showError(getString('yamlBuilder.yamlError'))
    }
  }

  const getErrorSummary = (): React.ReactElement => {
    const summary: React.ReactElement[] = []
    yamlValidationErrors?.forEach((value, key) => {
      const errorItemSummary = (
        <ul className={css.errorList}>
          <li key={key}>
            {key !== DEFAULT_YAML_PATH
              ? `${getString('yamlBuilder.yamlPath')} ${key}`
              : getString('yamlBuilder.yamlError')}
          </li>
          <ol className={css.details}>
            {Array.isArray(value) ? (
              value?.map(item => (
                <li key={item} className={css.items}>
                  {item}
                </li>
              ))
            ) : (
              <div className={css.items} title={value}>
                {truncate(value, { length: MAX_YAML_PARSING_ERR_MSSG_LENGTH })}
              </div>
            )}
          </ol>
        </ul>
      )
      summary.push(errorItemSummary)
    })
    return <div className={css.errorSummary}>{summary}</div>
  }

  return (
    <div className={css.main}>
      <Layout.Horizontal className={css.layout}>
        <div
          className={cx(
            css.builderSection,
            { [css.editorOnly]: !showSnippetSection },
            { [css.darkBg]: theme === 'DARK' }
          )}
        >
          <div className={cx(css.header)}>
            <div className={css.flexCenter}>
              <span className={cx(css.filePath, css.flexCenter, { [css.lightBg]: theme === 'DARK' })}>{fileName}</span>
              {fileName && entityType ? <Tag className={css.entityTag}>{entityType}</Tag> : null}
            </div>
            <div className={cx(css.flexCenter, css.validationStatus)}>
              {yamlValidationErrors && yamlValidationErrors.size > 0 ? (
                <Popover
                  interactionKind={PopoverInteractionKind.HOVER}
                  position={Position.TOP}
                  content={getErrorSummary()}
                  popoverClassName={css.summaryPopover}
                >
                  <div>
                    <Icon name="main-issue-filled" size={14} className={css.validationIcon} />
                    <span className={css.invalidYaml}>{getString('invalidText')}</span>
                  </div>
                </Popover>
              ) : null}
            </div>
          </div>
          <div className={css.editor}>
            <MonacoEditor
              width={width ?? DEFAULT_EDITOR_WIDTH}
              height={height ?? DEFAULT_EDITOR_HEIGHT}
              language="yaml"
              value={currentYaml}
              onChange={onYamlChange}
              editorDidMount={editorDidMount}
              options={
                {
                  readOnly: isReadOnlyMode,
                  wordBasedSuggestions: false,
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: 13,
                  minimap: {
                    enabled: false
                  }
                } as MonacoEditorProps['options']
              }
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
