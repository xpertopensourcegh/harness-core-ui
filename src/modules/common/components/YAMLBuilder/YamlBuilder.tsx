// @ts-nocheck
import React, { useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import 'monaco-yaml/esm/monaco.contribution'
import { languages } from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor'
import YamlWorker from 'worker-loader!monaco-yaml/esm/yaml.worker'
import EditorWorker from 'worker-loader!monaco-editor/esm/vs/editor/editor.worker'

import { JSONSchemaService } from 'modules/dx/services'
import { YamlBuilderProps } from 'modules/common/interfaces/YAMLBuilderProps'
import { Tag, Intent } from '@wings-software/uikit'
import cx from 'classnames'

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

const YAMLBuilder = (props: YamlBuilderProps) => {
  const [existingYaml, setValue] = useState()

  function loadEntitySchemas() {
    const jsonSchemas = JSONSchemaService.fetchEntitySchemas({})
    return jsonSchemas
  }

  useEffect(() => {
    const jsonSchemas = loadEntitySchemas()
    yaml?.yamlDefaults.setDiagnosticsOptions(jsonSchemas)
    setValue(props.existingYaml)
  }, [existingYaml])

  const { height, width, fileName, entityType } = props
  console.log(props, fileName, entityType)

  return (
    <div className={css.main}>
      <div className={css.flexCenter}>
        <span className={cx(css.filePath, css.flexCenter)}>{fileName}</span>
        <Tag minimal="true">{entityType}</Tag>
      </div>
      <div className={css.builder}>
        <MonacoEditor
          width={width ?? 800}
          height={height ?? 600}
          language="yaml"
          value={existingYaml}
          onChange={setValue}
        />
      </div>
    </div>
  )
}

export default YAMLBuilder
