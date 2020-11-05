import React from 'react'
import { Button } from '@wings-software/uikit'

import type { PipelineExecutionSummaryDTO } from 'services/cd-ng'
import { String } from 'framework/exports'

import css from '../ExecutionCard.module.scss'

export interface ServicesDeployedProps {
  pipelineExecution: PipelineExecutionSummaryDTO
}

export default function ServicesDeployed(props: ServicesDeployedProps): React.ReactElement {
  const { pipelineExecution } = props
  const serviceIdentifiers = pipelineExecution?.serviceIdentifiers || []
  const [showMore, setShowMore] = React.useState(false)
  const length = serviceIdentifiers.length

  const items = showMore && length > 2 ? serviceIdentifiers : serviceIdentifiers.slice(0, 2)

  function toggle(): void {
    setShowMore(status => !status)
  }

  return (
    <div className={css.servicesDeployed}>
      <String stringID="executionList.servicesDeployedText" vars={{ size: length }} />
      <div className={css.servicesList}>
        {items.map(identifier => {
          return <span key={identifier}>{identifier}</span>
        })}
      </div>
      {length > 2 ? (
        <Button
          className={css.infoToggle}
          icon={showMore ? 'chevron-up' : 'chevron-down'}
          minimal
          small
          intent="primary"
          onClick={toggle}
        />
      ) : null}
    </div>
  )
}
