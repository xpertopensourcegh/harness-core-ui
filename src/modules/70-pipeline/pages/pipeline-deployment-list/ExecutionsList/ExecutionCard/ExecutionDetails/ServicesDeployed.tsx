import React from 'react'
import { Button } from '@wings-software/uikit'
import { Popover, Position } from '@blueprintjs/core'

import type { PipelineExecutionSummaryDTO } from 'services/cd-ng'
import { String } from 'framework/exports'
import { getPipelineStagesMap } from '@pipeline/utils/executionUtils'

import css from '../ExecutionCard.module.scss'

export interface ServicesDeployedProps {
  pipelineExecution: PipelineExecutionSummaryDTO
}

export default function ServicesDeployed(props: ServicesDeployedProps): React.ReactElement {
  const { pipelineExecution } = props
  const serviceIdentifiers = pipelineExecution?.serviceIdentifiers || []
  const [showMore, setShowMore] = React.useState(false)
  const length = serviceIdentifiers.length

  const servicesMap = React.useMemo(() => {
    const stagesMap = getPipelineStagesMap({ data: { pipelineExecution } })
    const map = new Map()

    stagesMap.forEach(stage => {
      if (stage.serviceInfo && stage.serviceInfo.identifier) {
        map.set(stage.serviceInfo.identifier, stage.serviceInfo)
      }
    })

    return map
  }, [pipelineExecution])

  const items = showMore && length > 2 ? serviceIdentifiers : serviceIdentifiers.slice(0, 2)

  function toggle(): void {
    setShowMore(status => !status)
  }

  return (
    <div className={css.servicesDeployed}>
      <String stringID="executionList.servicesDeployedText" vars={{ size: length }} />
      <div className={css.servicesList}>
        {items.map(identifier => {
          const service = servicesMap.get(identifier)

          if (!service) return null

          return (
            <Popover
              key={identifier}
              wrapperTagName="div"
              targetTagName="div"
              interactionKind="hover"
              position={Position.BOTTOM_RIGHT}
            >
              <div className={css.serviceName}>{service.displayName}</div>
              <div className={css.servicesDeployedHoverCard}>
                <String tagName="div" className={css.title} stringID="primaryArtifactText" />
                {service?.artifact ? (
                  <div>{JSON.stringify(service?.artifact)}</div>
                ) : (
                  <String tagName="div" stringID="na" />
                )}
                <String tagName="div" className={css.title} stringID="sidecarsText" />
                <String tagName="div" stringID="todo" />
                <String tagName="div" className={css.title} stringID="manifestsText" />
                <String tagName="div" stringID="todo" />
              </div>
            </Popover>
          )
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
