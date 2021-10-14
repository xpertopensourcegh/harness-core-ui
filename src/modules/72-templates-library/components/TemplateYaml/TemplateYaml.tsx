import React, { useContext } from 'react'
import { Color, Text } from '@wings-software/uicore'
import MonacoEditor from '@common/components/MonacoEditor/MonacoEditor'

import { TemplateContext } from '../TemplateStudio/TemplateContext/TemplateContext'
import css from './TemplateYaml.module.scss'

export interface TemplateYamlProps {
  templateYaml?: string
}

export const TemplateYaml: React.FC<TemplateYamlProps> = props => {
  const { templateYaml } = props
  const { isReadonly } = useContext(TemplateContext)

  return (
    <div className={css.main}>
      <div className={css.titleHolder}>
        <Text font={{ size: 'normal', weight: 'bold' }} color={Color.GREY_800}>
          template.yaml
        </Text>
      </div>
      <MonacoEditor
        value={templateYaml}
        language={'yaml'}
        height="400"
        options={
          {
            classNames: css.editor,
            fontFamily: "'Roboto Mono', monospace",
            fontSize: 13,
            minimap: {
              enabled: false
            },
            readOnly: isReadonly,
            scrollBeyondLastLine: false
          } as any
        }
      />
    </div>
  )
}
