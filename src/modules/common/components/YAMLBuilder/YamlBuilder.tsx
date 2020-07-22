// @ts-nocheck
import React, { useEffect, useState } from 'react'
import MonacoEditor from 'react-monaco-editor'
import '@wings-software/monaco-yaml/lib/esm/monaco.contribution'
import { languages } from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor'
import YamlWorker from 'worker-loader!@wings-software/monaco-yaml/lib/esm/yaml.worker'
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

const YAMLBuilder = (props: YamlBuilderProps) => {
  const { height, width, fileName, entityType, existingYaml } = props
  const [entityYaml, setEntityYaml] = useState()
  const { bind } = props

  const handler = React.useMemo(
    () =>
      ({
        getLatestYaml: () => entityYaml
      } as YamlBuilderHandlerBinding),
    [entityYaml]
  )

  React.useEffect(() => {
    bind?.(handler)
  }, [bind, handler])

  function loadEntitySchemas(entityType: string) {
    const jsonSchemas = JSONSchemaService.fetchEntitySchemas(entityType)
    return jsonSchemas
  }

  const onYamlChange = (updatedYaml: string): void => {
    setEntityYaml(updatedYaml)
  }

  useEffect(() => {
    const jsonSchemas = loadEntitySchemas(entityType)
    yaml?.yamlDefaults.setDiagnosticsOptions(jsonSchemas)
    setEntityYaml(props.existingYaml)
  }, [existingYaml, entityType])

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
