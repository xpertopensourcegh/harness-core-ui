import React from 'react'
import cx from 'classnames'
import type { PipelinePathProps, ProjectPathProps, PathFn, PipelineType } from '@common/interfaces/RouteInterfaces'

import { PipelineCanvas } from './PipelineCanvas/PipelineCanvas'
import { RightBar } from './RightBar/RightBar'
import css from './PipelineStudio.module.scss'

export interface PipelineStudioProps {
  className?: string
  title?: string
  onClose?: () => void
  routePipelineStudio: PathFn<PipelineType<PipelinePathProps>>
  routePipelineStudioUI: PathFn<PipelineType<PipelinePathProps>>
  routePipelineStudioYaml: PathFn<PipelineType<PipelinePathProps>>
  routePipelineDetail: PathFn<PipelineType<PipelinePathProps>>
  routePipelineList: PathFn<PipelineType<ProjectPathProps>>
  routePipelineProject: PathFn<PipelineType<ProjectPathProps>>
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
        toPipelineStudio={routePipelineStudio}
        toPipelineStudioUI={routePipelineStudioUI}
        toPipelineStudioYaml={routePipelineStudioYaml}
        toPipelineDetail={routePipelineDetail}
        toPipelineList={routePipelineList}
        toPipelineProject={routePipelineProject}
      >
        {children}
      </PipelineCanvas>
      <RightBar />
    </div>
  )
}
