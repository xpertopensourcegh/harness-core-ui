// @ts-nocheck
import React, { useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import '@wings-software/monaco-yaml/lib/esm/monaco.contribution'
import { languages } from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor'
import YamlWorker from 'worker-loader!@wings-software/monaco-yaml/lib/esm/yaml.worker'
import EditorWorker from 'worker-loader!monaco-editor/esm/vs/editor/editor.worker'

import { JSONSchemaService } from 'modules/dx/services'
import { Tag } from '@wings-software/uikit'
import { YamlBuilderProps } from 'modules/common/interfaces/YAMLBuilderProps'
import cx from 'classnames'

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
  getWorker(workerId, label) {
    if (label === 'yaml') {
      return new YamlWorker()
    }
    return new EditorWorker()
  }
}

const { yaml } = languages || {}

interface CompletionItemInterface {
  label: string
  kind: monaco.languages.CompletionItemKind
  value: string
}

let yamlInEditor

const YAMLBuilder: React.FC<YamlBuilderProps> = props => {
  const { height, width, fileName, entityType, existingYaml, isReadOnlyMode, showSnippetsSection } = props
  const [currentYaml, setCurrentYaml] = useState()

  const { bind } = props

  const handler = React.useMemo(
    () =>
      ({
        getLatestYaml: () => currentYaml
      } as YamlBuilderHandlerBinding),
    [currentYaml]
  )

  React.useEffect(() => {
    bind?.(handler)
  }, [bind, handler])

  function loadEntitySchemas(entityType: string) {
    const jsonSchemas = JSONSchemaService.fetchEntitySchemas(entityType)
    return jsonSchemas
  }

  const onYamlChange = (updatedYaml: string): void => {
    yamlInEditor = updatedYaml
    setCurrentYaml(updatedYaml)
  }

  function fetchAutocompleteItems(yamlPath: string): CompletionItemInterface[] {
    const resultSet = JSONSchemaService.fetchSuggestions(yamlPath)
    const suggestions = resultSet.map(item => {
      return {
        label: item,
        kind: monaco.languages.CompletionItemKind.Value,
        insertText: '{' + item + '}'
      }
    })
    return suggestions
  }

  function provideCompletionItems(suggestions: CompletionItemInterface[]) {
    return { suggestions }
  }

  let deRegisterExistingCompletionProvider
  function registerCompletionItemProvider(editor, context: string): void {
    if (!context) {
      return
    }
    if (deRegisterExistingCompletionProvider) {
      deRegisterExistingCompletionProvider.dispose()
    }
    if (editor) {
      const suggestions = fetchAutocompleteItems(context)
      deRegisterExistingCompletionProvider = editor?.languages?.registerCompletionItemProvider('yaml', {
        triggerCharacters: ['$'],
        provideCompletionItems: (...args) => provideCompletionItems(suggestions, ...args)
      })
    }
  }

  function getContextFromYamlPath(yamlInEditor: string, currentToken: string): string {
    let currentContext = ''
    if (!yamlInEditor || !currentToken) {
      return currentContext
    }
    const currentTag = currentToken.replace(':', '')
    const tokens = yamlInEditor.split('\n')
    let tags = tokens.map(token => {
      if (token) {
        const [key, value] = token.split(':')
        return key ? key.trim() : ''
      }
    })
    const currIndex = tags.indexOf(currentTag)
    if (currIndex < 0) {
      return currentContext
    } else {
      tags = tags.splice(0, currIndex + 1)
    }
    if (tags.length > 0) {
      currentContext = tags.reduce((acc, curr) => acc.concat('.').concat(curr))
    }
    return currentContext
  }

  const editorDidMount = (editor, monaco) => {
    if (editor) {
      if (!props.isReadOnlyMode) {
        editor.focus()
      }
      editor.onKeyDown(event => {
        const { shiftKey, code } = event
        //TODO Need to check hotkey for cross browser/cross OS compatibility
        if (shiftKey && code === 'Digit4') {
          const currentToken = editor.getModel().getLineContent(editor.getPosition().lineNumber)
          const currentContext = getContextFromYamlPath(yamlInEditor, currentToken.trim())
          //TODO Need to debounce this function call for performance optimization
          registerCompletionItemProvider(monaco, currentContext)
        }
      })
    }
  }

  useEffect(() => {
    const jsonSchemas = loadEntitySchemas(entityType)
    yaml?.yamlDefaults.setDiagnosticsOptions(jsonSchemas)
    setCurrentYaml(props.existingYaml)
  }, [existingYaml, entityType])

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
