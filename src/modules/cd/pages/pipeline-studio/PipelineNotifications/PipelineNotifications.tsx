import React from 'react'
import { Text } from '@wings-software/uikit'
import i18n from './PipelineNotifications.i18n'
import css from './PipelineNotifications.module.scss'

export const PipelineNotifications: React.FC = (): JSX.Element => {
  return (
    <div className={css.pipelineNotifications}>
      <div className={css.header}>
        <Text
          inline
          color="white"
          font={{ size: 'medium' }}
          icon="yaml-builder-notifications"
          iconProps={{ color: 'white' }}
        >
          {i18n.notifications}
        </Text>
      </div>
      <div className={css.content}></div>
    </div>
  )
}
