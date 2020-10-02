import React, { useCallback } from 'react'
import cx from 'classnames'
import { get } from 'lodash-es'
import { Container, Text, Layout, Card, CardBody, Color } from '@wings-software/uikit'
import * as BP from '@blueprintjs/core'
import { useHistory, useParams } from 'react-router-dom'
import type { PipelineExecutionSummaryDTO, StageExecutionSummaryDTO } from 'services/cd-ng'
import {
  ExecutionStatusLabel,
  UserLabel,
  Duration,
  TimeAgo,
  ExecutionStatus,
  ExecutionStageGraph,
  RenderStageButtonInfo
} from 'modules/common/exports'
import { routeCDPipelineExecutionGraph } from 'modules/cd/routes'
import i18n from './ExecutionCard.i18n'
import { ExecutionServiceTooltip } from './ExecutionServiceTooltip'
import { ExecutionActionButtons } from './ExecutionActionButtons'
import { ExecutionCardMenu } from './ExecutionCardMenu'
import css from './ExecutionCard.module.scss'

export interface ExecutionCardProps {
  pipelineExecution: PipelineExecutionSummaryDTO
}

export const ExecutionCard: React.FC<ExecutionCardProps> = ({ pipelineExecution }) => {
  const status = pipelineExecution.executionStatus as ExecutionStatus
  const { orgIdentifier, projectIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()
  const history = useHistory()
  const renderStageButton = useCallback((stage: StageExecutionSummaryDTO): RenderStageButtonInfo => {
    const parallel = !!get(stage, 'parallel')
    const checkStatus = (_status: ExecutionStatus): boolean =>
      !parallel
        ? get(stage, 'stage.executionStatus') === _status
        : !!get(stage, 'parallel.stageExecutions', []).find(
            (_stage: Record<string, string>) => get(_stage, 'stage.executionStatus') === _status
          )

    const success = checkStatus(ExecutionStatus.SUCCESS)
    const failed =
      !success &&
      (checkStatus(ExecutionStatus.FAILED) ||
        checkStatus(ExecutionStatus.ABORTED) ||
        checkStatus(ExecutionStatus.ERROR) ||
        checkStatus(ExecutionStatus.REJECTED))
    const running =
      !success &&
      !failed &&
      (checkStatus(ExecutionStatus.RUNNING) ||
        checkStatus(ExecutionStatus.PAUSED) ||
        checkStatus(ExecutionStatus.PAUSING) ||
        checkStatus(ExecutionStatus.WAITING) ||
        checkStatus(ExecutionStatus.ABORTING))

    return {
      key: parallel
        ? get(stage, 'parallel.stageExecutions[0].stage.planExecutionId')
        : get(stage, 'stage.planExecutionId'),
      icon: success ? 'tick-circle' : failed ? 'warning-sign' : running ? 'spinner' : 'pending',
      color: failed ? Color.RED_500 : success ? Color.BLUE_500 : running ? Color.GREEN_500 : Color.GREY_300,
      parallel,
      tooltip: undefined // TODO: disable tooltip since no tooltip design is finalized
    }
  }, [])

  return (
    <Card
      elevation={0}
      className={cx(
        css.card,
        css[status.toLowerCase().replace(/([-_]\w)/g, g => g[1].toUpperCase()) as keyof typeof css]
      )}
    >
      <CardBody.Menu
        menuContent={<ExecutionCardMenu pipelineExecution={pipelineExecution} />}
        menuPopoverProps={{ minimal: true }}
      >
        <>
          <ExecutionActionButtons pipelineExecution={pipelineExecution} />
          <Layout.Vertical>
            <Container flex className={css.cardBody}>
              <Layout.Vertical className={css.column} spacing="small" style={{ alignItems: 'normal' }}>
                <Container
                  flex
                  className={css.topSection}
                  onClick={() =>
                    history.push(
                      routeCDPipelineExecutionGraph.url({
                        orgIdentifier,
                        executionIdentifier: pipelineExecution.planExecutionId || '',
                        pipelineIdentifier: pipelineExecution.pipelineIdentifier || '',
                        projectIdentifier
                      })
                    )
                  }
                >
                  <Text
                    inline
                    className={css.executionId}
                    icon="gear"
                    font={{ weight: 'bold' }}
                    iconProps={{ size: 16, className: css.executionIdIcon }}
                  >
                    {pipelineExecution.pipelineName}
                  </Text>
                  <span className={css.pipe}></span>
                  <Text
                    font={{ weight: 'bold' }}
                    padding={{ right: 'medium' }}
                    lineClamp={1}
                    tooltipProps={{ targetClassName: css.pipelineNameTarget }}
                  >
                    {`${i18n.executionId} ${pipelineExecution.planExecutionId}`}
                  </Text>
                  <ExecutionStatusLabel status={status} />
                </Container>
                <Layout.Horizontal spacing="medium" className={cx(css.column, css.servicesContainer)}>
                  <Text inline className={cx(css.services)}>
                    {i18n.services}
                  </Text>
                  <Text
                    inline
                    font={{ weight: 'bold' }}
                    color={Color.BLUE_700}
                    tooltip={<ExecutionServiceTooltip />}
                    tooltipProps={{ position: BP.Position.BOTTOM }}
                  >
                    CV (tag #123) - TBD
                  </Text>
                </Layout.Horizontal>
              </Layout.Vertical>

              <ExecutionStageGraph
                className={css.column}
                stages={pipelineExecution.stageExecutionSummaryElements}
                stageStatusCounts={{
                  success: pipelineExecution.successfulStagesCount,
                  running: pipelineExecution.runningStagesCount,
                  failed: pipelineExecution.failedStagesCount
                }}
                renderStageButton={renderStageButton}
                errorMsg={pipelineExecution.errorMsg}
              />
            </Container>

            <Container flex className={css.cardFooter}>
              <Container className={css.column}>
                <UserLabel name={pipelineExecution.triggeredBy?.name || i18n.unknown} />
                <span className={css.pipe}></span>
                <Text inline>{i18n.triggerType[pipelineExecution.triggerType || 'MANUAL']}</Text>
              </Container>
              <Container className={css.column} padding={{ left: 'xxxlarge' }}>
                <Duration
                  startTime={pipelineExecution.startedAt || Date.now()}
                  endTime={pipelineExecution.endedAt}
                  formatter="hms"
                />
                <TimeAgo padding={{ left: 'medium' }} time={pipelineExecution.startedAt || Date.now()} />
              </Container>
            </Container>
          </Layout.Vertical>
        </>
      </CardBody.Menu>
    </Card>
  )
}
