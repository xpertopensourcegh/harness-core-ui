import React from 'react'
import moment from 'moment'

import type { CDStageModuleInfo } from 'services/cd-ng'
import { useExecutionContext } from '../../ExecutionContext/ExecutionContext'

import css from './ExecutionMetadata.module.scss'

const DATE_FORMAT = 'MM/DD/YYYY hh:mm:ss a'

export default function ExecutionMetadata(): React.ReactElement {
  const { pipelineExecutionDetail, pipelineStagesMap } = useExecutionContext()

  const { pipelineExecutionSummary } = pipelineExecutionDetail || {}

  const { services, environments } = React.useMemo(() => {
    // eslint-disable-next-line no-shadow
    const services: string[] = []
    // eslint-disable-next-line no-shadow
    const environments: string[] = []

    pipelineStagesMap.forEach(stage => {
      const stageInfo = stage.moduleInfo?.cd as CDStageModuleInfo
      if (stageInfo?.serviceInfo?.identifier && environments.indexOf(stageInfo.serviceInfo.identifier) === -1) {
        services.push(stageInfo.serviceInfo.identifier)
      }

      if (
        stageInfo?.infraExecutionSummary?.identifier &&
        environments.indexOf(stageInfo.infraExecutionSummary.identifier) === -1
      ) {
        environments.push(stageInfo.infraExecutionSummary.identifier)
      }
    })

    return { services, environments }
  }, [pipelineStagesMap])

  return (
    <div className={css.main}>
      <div className={css.entry}>
        <span className={css.label}>Trigger Type</span>
        <span className={css.value}>{pipelineExecutionSummary?.executionTriggerInfo?.triggerType}</span>
      </div>
      <div className={css.entry}>
        <span className={css.label}>Start Time</span>
        <span className={css.value}>{moment(pipelineExecutionSummary?.startTs).format(DATE_FORMAT)}</span>
      </div>
      <div className={css.entry}>
        <span className={css.label}>Services</span>
        <span className={css.value}>{services.join(', ')}</span>
      </div>
      <div className={css.entry}>
        <span className={css.label}>Triggered By</span>
        <span className={css.value}>
          {pipelineExecutionSummary?.executionTriggerInfo?.triggeredBy?.identifier || '-'}
        </span>
      </div>
      <div className={css.entry}>
        <span className={css.label}>End Time</span>
        <span className={css.value}>{moment(pipelineExecutionSummary?.endTs).format(DATE_FORMAT)}</span>
      </div>
      <div className={css.entry}>
        <span className={css.label}>Environments</span>
        <span className={css.value}>{environments.join(', ')}</span>
      </div>
    </div>
  )
}
