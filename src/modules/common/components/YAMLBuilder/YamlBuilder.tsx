// @ts-nocheck
import React, { useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import 'monaco-yaml/esm/monaco.contribution'
import { languages } from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor'
import YamlWorker from 'worker-loader!monaco-yaml/esm/yaml.worker'
import EditorWorker from 'worker-loader!monaco-editor/esm/vs/editor/editor.worker'

import { JSONSchemaService } from 'modules/dx/services'

import css from './YamlBuilder.module.scss'

window.MonacoEnvironment = {
  getWorker(workerId, label) {
    if (label === 'yaml') {
      return new YamlWorker()
    }
    return new EditorWorker()
  }
}

const { yaml } = languages || {}

interface YamlBuilderProps {
  height?: number
  width?: number
  fileName?: string
  value?: string
}

const YAMLBuilder = (props: YamlBuilderProps) => {
  const [value, setValue] = useState()

  function loadEntitySchemas() {
    const jsonSchemas = JSONSchemaService.fetchEntitySchemas({})
    return jsonSchemas
  }

  useEffect(() => {
    const jsonSchemas = loadEntitySchemas()
    yaml?.yamlDefaults.setDiagnosticsOptions(jsonSchemas)
    setValue(props.value)
  }, [value])

  const { height, width, fileName } = props

  return (
    <div className={css.main}>
      <div className={css.fileName}>{fileName}</div>
      <div className={css.builder}>
        <MonacoEditor width={width ?? 800} height={height ?? 600} language="yaml" value={value} onChange={setValue} />
      </div>
    </div>
  )
}

export default YAMLBuilder
