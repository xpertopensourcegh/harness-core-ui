import React from 'react'
// import cx from 'classnames'
import { Card, Icon } from '@wings-software/uikit'
// import * as BP from '@blueprintjs/core'
import { Link, useParams } from 'react-router-dom'

import type { PipelineExecutionSummaryDTO } from 'services/cd-ng'
import { UserLabel, Duration, TimeAgo } from '@common/exports'
// import { ExecutionStatusLabel, ExecutionStageGraph, RenderStageButtonInfo } from '@pipeline/exports'
import ExecutionStatusLabel from '@pipeline/components/ExecutionStatusLabel/ExecutionStatusLabel'
import ExecutionActions from '@pipeline/components/ExecutionActions/ExecutionActions'
import { String } from 'framework/exports'

import { routeCDPipelineExecutionPipline } from 'navigation/cd/routes'
// import { ExecutionServiceTooltip } from './ExecutionServiceTooltip'
// import ExecutionActionButtons from './ExecutionActionButtons/ExecutionActionButtons'
// import ExecutionCardMenu from './ExecutionCardMenu/ExecutionCardMenu'
import MiniExecutionGraph from './MiniExecutionGraph/MiniExecutionGraph'
import ServicesDeployed from './ExecutionDetails/ServicesDeployed'
import BuildInfo from './ExecutionDetails/BuildInfo'
import css from './ExecutionCard.module.scss'

export interface ExecutionCardProps {
  pipelineExecution: PipelineExecutionSummaryDTO
}

export default function ExecutionCard(props: ExecutionCardProps): React.ReactElement {
  const { pipelineExecution } = props
  const { orgIdentifier, projectIdentifier, accountId } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

  // TODO: update these vars based on BE data
  const HAS_CD = true
  const HAS_CI = false

  return (
    <Card elevation={0} className={css.card}>
      <div className={css.icons} data-ci={HAS_CI} data-cd={HAS_CD}>
        {HAS_CI ? <Icon name="ci-main" /> : null}
        {HAS_CD ? <Icon name="cd-main" size={20} /> : null}
      </div>
      <div>
        <div className={css.content}>
          <div>
            <Link
              className={css.title}
              to={routeCDPipelineExecutionPipline.url({
                orgIdentifier,
                pipelineIdentifier: pipelineExecution?.pipelineIdentifier || '',
                executionIdentifier: pipelineExecution?.planExecutionId || '',
                projectIdentifier
              })}
            >
              <span className={css.pipelineName}>{pipelineExecution?.pipelineName}</span>
              <String
                className={css.executionId}
                stringID="execution.pipelineIdentifierText"
                vars={pipelineExecution}
              />
            </Link>
            {HAS_CI ? (
              <div className={css.ciData}>
                <String className={css.sectionTitle} stringID="buildText" />
                <BuildInfo pipelineExecution={pipelineExecution} />
              </div>
            ) : null}
            {HAS_CD ? (
              <div className={css.cdData}>
                <String className={css.sectionTitle} stringID="deploymentText" />
                <ServicesDeployed pipelineExecution={pipelineExecution} />
              </div>
            ) : null}
          </div>
          <MiniExecutionGraph pipelineExecution={pipelineExecution} />
          <div className={css.actions}>
            <ExecutionStatusLabel status={pipelineExecution.executionStatus} />
            <ExecutionActions
              executionStatus={pipelineExecution.executionStatus}
              params={{
                accountId,
                orgIdentifier,
                pipelineIdentifier: pipelineExecution?.pipelineIdentifier || '',
                executionIdentifier: pipelineExecution?.planExecutionId || '',
                projectIdentifier
              }}
            />
          </div>
        </div>
        <div className={css.footer}>
          <div className={css.triggerInfo}>
            <UserLabel name={pipelineExecution.triggerInfo?.triggeredBy?.name || 'Anonymous'} />
            <String
              className={css.triggerType}
              stringID={`execution.triggerType.${pipelineExecution.triggerInfo?.triggerType}`}
            />
          </div>
          <div className={css.timers}>
            <Duration
              icon="time"
              iconProps={{ size: 12 }}
              startTime={pipelineExecution?.startedAt}
              endTime={pipelineExecution?.endedAt}
            />
            <TimeAgo iconProps={{ size: 12 }} icon="calendar" time={pipelineExecution?.startedAt || 0} />
          </div>
        </div>
      </div>
    </Card>
  )
}
