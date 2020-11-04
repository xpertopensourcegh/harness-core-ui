import React from 'react'
import cx from 'classnames'
import type { NestedRoute, Route } from 'framework/exports'
import { PipelineCanvas } from './PipelineCanvas/PipelineCanvas'
import { RightBar } from './RightBar/RightBar'
import css from './PipelineStudio.module.scss'

export interface PipelineStudioProps {
  className?: string
  title?: string
  onClose?: () => void
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
  routePipelineDetail: Route<{
    orgIdentifier: string
    projectIdentifier: string
    pipelineIdentifier: string
  }>
  routePipelineList: Route<{
    orgIdentifier: string
    projectIdentifier: string
  }>
  routePipelineProject: Route<{
    orgIdentifier: string
    projectIdentifier: string
  }>
}

export const PipelineStudio: React.FC<PipelineStudioProps> = ({
  children,
  className = '',
  routePipelineStudio,
  routePipelineStudioUI,
  routePipelineStudioYaml,
  routePipelineDetail,
  routePipelineList,
  routePipelineProject
}): JSX.Element => {
  return (
    <div className={cx(css.container, className)}>
      <PipelineCanvas
        routePipelineStudio={routePipelineStudio}
        routePipelineStudioUI={routePipelineStudioUI}
        routePipelineStudioYaml={routePipelineStudioYaml}
        routePipelineDetail={routePipelineDetail}
        routePipelineList={routePipelineList}
        routePipelineProject={routePipelineProject}
      >
        {children}
      </PipelineCanvas>
      <RightBar />
    </div>
  )
}
