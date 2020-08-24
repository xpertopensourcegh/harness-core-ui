import React from 'react'
import { Text } from '@wings-software/uikit'
import { RightBar } from '../RightBar/RightBar'
import i18n from './PipelineVariables.i18n'
import css from './PipelineVariables.module.scss'

export const PipelineVariables: React.FC = (): JSX.Element => {
  return (
    <div className={css.pipelineVariables}>
      <div className={css.variablesContainer}>
        <Text font={{ size: 'large' }}>{i18n.variables}</Text>
      </div>
      <RightBar />
    </div>
  )
}
