import React from 'react'
import { defaultTo } from 'lodash-es'

import { String as StrTemplate } from 'framework/strings'
import { useExecutionContext } from '@pipeline/context/ExecutionContext'
import type { StageDetailProps } from '@pipeline/factories/ExecutionFactory/types'
import factory from '@pipeline/factories/ExecutionFactory'
import type { StageType } from '@pipeline/utils/stageHelpers'
import { Duration } from '@common/components/Duration/Duration'
import { ExecutionStatus, isExecutionFailed } from '@pipeline/utils/statusHelpers'
import ExecutionStatusLabel from '@pipeline/components/ExecutionStatusLabel/ExecutionStatusLabel'

import css from './ExecutionStageDetailsHeader.module.scss'

export function ExecutionStageDetailsHeader(): React.ReactElement {
  const { selectedStageId, pipelineStagesMap } = useExecutionContext()

  const stage = pipelineStagesMap.get(selectedStageId)
  const stageDetail = factory.getStageDetails(stage?.nodeType as StageType)
  const shouldShowError = isExecutionFailed(stage?.status)
  const errorMessage = defaultTo(stage?.failureInfo?.message, '')

  return (
    <div className={css.main}>
      <div className={css.stageDetails}>
        <div className={css.lhs} data-has-sibling={Boolean(stage && stageDetail?.component)}>
          <div className={css.stageName}>{stage?.name}</div>
          <div className={css.times}>
            <div className={css.timeDisplay}>
              <StrTemplate stringID="startedAt" className={css.timeLabel} />
              <span>:&nbsp;</span>
              <time>{stage?.startTs ? new Date(stage?.startTs).toLocaleString() : '-'}</time>
            </div>
            <Duration
              className={css.timeDisplay}
              durationText={<StrTemplate stringID="common.durationPrefix" className={css.timeLabel} />}
              startTime={stage?.startTs}
              endTime={stage?.endTs}
            />
          </div>
          {/* <StrTemplate className={css.moreInfo} stringID="common.moreInfo" /> */}
        </div>
        <div>
          {stage && stageDetail?.component
            ? React.createElement<StageDetailProps>(stageDetail.component, {
                stage
              })
            : null}
        </div>
      </div>

      {shouldShowError ? (
        <div className={css.errorMsgWrapper}>
          <ExecutionStatusLabel status={stage?.status as ExecutionStatus} />
          <div className={css.errorMsg}>
            <StrTemplate className={css.errorTitle} stringID="errorSummaryText" tagName="div" />
            <p>{errorMessage}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
