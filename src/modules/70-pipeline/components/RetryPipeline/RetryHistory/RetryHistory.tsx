import React from 'react'
import { Text, Button, ButtonProps, Card, Color, Layout } from '@wings-software/uicore'
import { Classes, Popover, PopoverInteractionKind, Position } from '@blueprintjs/core'
import cx from 'classnames'
import { useHistory, useParams } from 'react-router-dom'
import { defaultTo } from 'lodash-es'
import { useStrings } from 'framework/strings'
import { ExecutionInfo, useRetryHistory } from 'services/pipeline-ng'
import type { ExecutionPathProps, PipelineType } from '@common/interfaces/RouteInterfaces'
import { formatDatetoLocale } from '@common/utils/dateUtils'
import { TimeAgoPopover } from '@common/components'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import ExecutionStatusLabel from '@pipeline/components/ExecutionStatusLabel/ExecutionStatusLabel'
import type { ExecutionStatus } from '@pipeline/utils/statusHelpers'
import routes from '@common/RouteDefinitions'
import css from './RetryHistory.module.scss'

interface RetryHistoryProps {
  canExecute: boolean
}
const commonButtonProps: ButtonProps = {
  minimal: true,
  small: true,
  tooltipProps: {
    isDark: true
  },
  withoutBoxShadow: true
}

const RetryHistory = ({ canExecute }: RetryHistoryProps): React.ReactElement => {
  const { getString } = useStrings()
  const { projectIdentifier, orgIdentifier, pipelineIdentifier, accountId, executionIdentifier, module } =
    useParams<PipelineType<ExecutionPathProps>>()
  const history = useHistory()

  const {
    data: retryHistoryResponse,
    loading: loadingRetryHistory,
    refetch: refetchRetryHistory
  } = useRetryHistory({
    planExecutionId: executionIdentifier,
    queryParams: {
      pipelineIdentifier: pipelineIdentifier,
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier
    },
    lazy: true
  })
  const executionInfo = retryHistoryResponse?.data?.executionInfos

  const showAllRetryHistory = (): void => {
    if (!executionInfo) {
      refetchRetryHistory()
    }
  }

  const gotoExecutionDetails = (planExecutionId: string): void => {
    if (planExecutionId !== executionIdentifier) {
      history.push(
        routes.toExecutionPipelineView({
          orgIdentifier,
          pipelineIdentifier: pipelineIdentifier,
          projectIdentifier,
          executionIdentifier: planExecutionId || '',
          accountId,
          module
        })
      )
    }
  }

  const getExecutionDetail = (index: number): JSX.Element => {
    return (
      <Text color={Color.PRIMARY_7} font={{ size: 'normal', weight: 'semi-bold' }}>
        {index === 0
          ? `${getString('pipeline.recentExecutionText')} ${executionInfo?.length}/${executionInfo?.length}`
          : `${getString('executionText')} ${(executionInfo as ExecutionInfo[])?.length - index}/${
              executionInfo?.length
            }`}
      </Text>
    )
  }

  const RetryExecutionList = (): JSX.Element => {
    return (
      <div className={css.modalContent}>
        <Layout.Vertical>
          <div className={css.retryHeaderSection}>
            <div className={css.retryModalHeader}>
              <Text
                icon="execution-history"
                iconProps={{ size: 24 }}
                style={{ fontSize: 20 }}
                font={{ weight: 'bold' }}
                color={Color.GREY_700}
              >
                {getString('pipeline.retryHistory')}
              </Text>
            </div>
          </div>
          <div>
            {loadingRetryHistory ? (
              <PageSpinner />
            ) : (
              <>
                <Text color={Color.GREY_800} font={{ size: 'normal' }} margin="medium">
                  {getString('pipeline.retryHistoryDescription')}
                </Text>
                {executionInfo?.reverse()?.map((retryHistory, index) => {
                  return (
                    <Card
                      elevation={0}
                      className={cx(css.card, css.hoverCard, Classes.POPOVER_DISMISS)}
                      key={retryHistory.uuid}
                      onClick={() => gotoExecutionDetails(retryHistory?.uuid as string)}
                    >
                      <div className={css.content}>
                        <div className={cx(css.cardSection, css.executionDetail)}>
                          {getExecutionDetail(index)}
                          <ExecutionStatusLabel status={retryHistory.status as ExecutionStatus} />
                        </div>
                        <div className={cx(css.cardSection)}>
                          <Text
                            color={Color.GREY_400}
                            font={{ size: 'small', weight: 'light' }}
                            icon="calendar"
                            iconProps={{ size: 12 }}
                          >
                            {formatDatetoLocale(retryHistory.startTs as number)}
                          </Text>
                          <div>
                            <TimeAgoPopover
                              iconProps={{ size: 12, className: css.timerIcon }}
                              icon="time"
                              time={defaultTo(retryHistory.startTs, 0)}
                              inline={false}
                              className={css.timeAgo}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </>
            )}
          </div>
        </Layout.Vertical>
        <Button minimal icon="cross" className={cx(css.crossIcon, Classes.POPOVER_DISMISS)} />
      </div>
    )
  }

  return (
    <Popover
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_RIGHT}
      content={<RetryExecutionList />}
      popoverClassName={css.retryPopover}
    >
      <Button
        icon="execution-history"
        iconProps={{ size: 24 }}
        tooltip={getString('pipeline.retryHistory')}
        onClick={showAllRetryHistory}
        {...commonButtonProps}
        disabled={!canExecute}
      />
    </Popover>
  )
}

export default RetryHistory
