import React from 'react'
import moment from 'moment'

import { useExecutionContext } from 'modules/cd/pages/execution/ExecutionContext/ExecutionContext'

import css from './ExecutionMetadata.module.scss'

const DATE_FORMAT = 'MM/DD/YYYY hh:mm:ss a'

export default function ExecutionMetadata(): React.ReactElement {
  const { pipelineExecutionDetail, pipelineStagesMap } = useExecutionContext()

  const { pipelineExecution } = pipelineExecutionDetail || {}

  const { services, environments } = React.useMemo(() => {
    // eslint-disable-next-line no-shadow
    const services: string[] = []
    // eslint-disable-next-line no-shadow
    const environments: string[] = []

    pipelineStagesMap.forEach(stage => {
      if (stage.serviceIdentifier) {
        services.push(stage.serviceIdentifier)
      }

      if (stage.envIdentifier) {
        environments.push(stage.envIdentifier)
      }
    })

    return { services, environments }
  }, [pipelineStagesMap])

  return (
    <div className={css.main}>
      <div className={css.entry}>
        <span className={css.label}>Trigger Type</span>
        <span className={css.value}>{pipelineExecution?.triggerInfo?.triggerType}</span>
      </div>
      <div className={css.entry}>
        <span className={css.label}>Start Time</span>
        <span className={css.value}>{moment(pipelineExecution?.startedAt).format(DATE_FORMAT)}</span>
      </div>
      <div className={css.entry}>
        <span className={css.label}>Services</span>
        <span className={css.value}>{services.join(', ')}</span>
      </div>
      <div className={css.entry}>
        <span className={css.label}>Triggered By</span>
        <span className={css.value}>{pipelineExecution?.triggerInfo?.triggeredBy?.name || '-'}</span>
      </div>
      <div className={css.entry}>
        <span className={css.label}>End Time</span>
        <span className={css.value}>{moment(pipelineExecution?.endedAt).format(DATE_FORMAT)}</span>
      </div>
      <div className={css.entry}>
        <span className={css.label}>Environments</span>
        <span className={css.value}>{environments.join(', ')}</span>
      </div>
    </div>
  )
}
