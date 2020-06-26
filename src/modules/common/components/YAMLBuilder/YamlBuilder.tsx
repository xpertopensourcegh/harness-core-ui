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

monaco.editor.defineTheme('vs', {
  base: 'vs',
  inherit: false,
  rules: [
    { token: 'type', foreground: '1D76FF' },
    { token: 'string', foreground: '22272D' }
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

const YAMLBuilder = (props: YamlBuilderProps) => {
  const [entityYaml, setEntityYaml] = useState()

  function loadEntitySchemas() {
    const jsonSchemas = JSONSchemaService.fetchEntitySchemas({})
    return jsonSchemas
  }

  const onYamlChange = (updatedYaml: string): void => {
    setEntityYaml(updatedYaml)
  }

  useEffect(() => {
    const jsonSchemas = loadEntitySchemas()
    yaml?.yamlDefaults.setDiagnosticsOptions(jsonSchemas)
    setEntityYaml(props.existingYaml)
  }, [props.existingYaml])

  const { height, width, fileName, entityType, existingYaml } = props

  return (
    <div className={css.main}>
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
          value={entityYaml}
          onChange={onYamlChange}
        />
      </div>
    </div>
  )
}

export default YAMLBuilder
