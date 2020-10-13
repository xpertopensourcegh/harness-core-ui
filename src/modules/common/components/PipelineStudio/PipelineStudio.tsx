import React from 'react'
import { Icon, Text } from '@wings-software/uikit'
import cx from 'classnames'
import type { NestedRoute, Route } from 'framework/exports'
import i18n from './PipelineStudio.i18n'
import { PipelineCanvas } from './PipelineCanvas/PipelineCanvas'
import { RightBar } from './RightBar/RightBar'
import css from './PipelineStudio.module.scss'

export interface PipelineStudioProps {
  onClose: () => void
  className?: string
  title?: string
  routePipelineStudio: Route<{
    orgIdentifier: string
    projectIdentifier: string
    pipelineIdentifier: string | number
  }>
  routePipelineStudioUI: NestedRoute<{
    orgIdentifier: string
    projectIdentifier: string
    pipelineIdentifier: string | number
  }>
  routePipelineStudioYaml: NestedRoute<{
    orgIdentifier: string
    projectIdentifier: string
    pipelineIdentifier: string | number
  }>
}

export const PipelineStudio: React.FC<PipelineStudioProps> = ({
  children,
  onClose,
  className = '',
  routePipelineStudio,
  routePipelineStudioUI,
  routePipelineStudioYaml,
  title = i18n.pipelineStudio
}): JSX.Element => {
  return (
    <div className={cx(css.container, className)}>
      <div className={css.leftBar}>
        <div>
          <Icon name="harness" size={29} className={css.logoImage} />
          <Text className={css.title}>{title}</Text>
        </div>
        <div>
          <div className={css.closeBtn} title="Dashboard" onClick={onClose}>
            <Icon name="cross" margin="xsmall" padding="xsmall" size={21} className={css.logoImage} />
          </div>
        </div>
      </div>
      <PipelineCanvas
        routePipelineStudio={routePipelineStudio}
        routePipelineStudioUI={routePipelineStudioUI}
        routePipelineStudioYaml={routePipelineStudioYaml}
      >
        {children}
      </PipelineCanvas>
      <RightBar />
    </div>
  )
}
