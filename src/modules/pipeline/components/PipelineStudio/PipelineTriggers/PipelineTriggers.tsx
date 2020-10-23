import React from 'react'
import { Text } from '@wings-software/uikit'
import i18n from './PipelineTriggers.i18n'
import css from './PipelineTriggers.module.scss'

export const PipelineTriggers: React.FC = (): JSX.Element => {
  return (
    <div className={css.pipelineTriggers}>
      <div className={css.header}>
        <Text inline color="white" font={{ size: 'medium' }} icon="yaml-builder-trigger" iconProps={{ color: 'white' }}>
          {i18n.triggers}
        </Text>
      </div>
      <div className={css.content}></div>
    </div>
  )
}
