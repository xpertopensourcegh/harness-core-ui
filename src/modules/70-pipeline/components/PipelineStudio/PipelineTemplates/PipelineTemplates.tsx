import React from 'react'
import { Text } from '@wings-software/uicore'
import i18n from './PipelineTemplates.i18n'
import css from './PipelineTemplates.module.scss'

export const PipelineTemplates: React.FC = (): JSX.Element => {
  return (
    <div className={css.pipelineTemplates}>
      <div className={css.templatesContainer}>
        <Text font={{ size: 'large' }}>{i18n.templates}</Text>
      </div>
    </div>
  )
}
