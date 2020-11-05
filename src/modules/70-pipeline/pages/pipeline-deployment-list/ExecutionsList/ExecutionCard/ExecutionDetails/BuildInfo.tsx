import React from 'react'
import type { PipelineExecutionSummaryDTO } from 'services/cd-ng'

import css from '../ExecutionCard.module.scss'

export interface BuildInfoProps {
  pipelineExecution: PipelineExecutionSummaryDTO
}

export default function BuildInfo(_props: BuildInfoProps): React.ReactElement {
  return <div className={css.buildInfo}>Build Info Goes Here</div>
}
