import React from 'react'
import { Button } from '@wings-software/uikit'
import { Popover, Position } from '@blueprintjs/core'

import type { PipelineExecutionSummary } from 'services/pipeline-ng'
import { String } from 'framework/exports'
import { getPipelineStagesMap } from '@pipeline/utils/executionUtils'

import type { CDPipelineModuleInfo, ServiceExecutionSummary } from 'services/cd-ng'
import css from '../ExecutionCard.module.scss'

export interface ServicesDeployedProps {
  pipelineExecution: PipelineExecutionSummary
}

export default function ServicesDeployed(props: ServicesDeployedProps): React.ReactElement {
  const { pipelineExecution } = props
  const serviceIdentifiers: string[] =
    ((pipelineExecution?.moduleInfo?.cd as CDPipelineModuleInfo)?.serviceIdentifiers as string[]) || []
  const [showMore, setShowMore] = React.useState(false)
  const length = serviceIdentifiers.length

  const servicesMap = React.useMemo(() => {
    const stagesMap = getPipelineStagesMap(pipelineExecution.layoutNodeMap, pipelineExecution.startingNodeId)
    const map = new Map<string, ServiceExecutionSummary>()

    stagesMap.forEach(stage => {
      const serviceInfo = stage.moduleInfo?.cd?.serviceInfoList as ServiceExecutionSummary
      if (serviceInfo?.identifier) {
        map.set(serviceInfo.identifier, serviceInfo)
      }
    })

    return map
  }, [pipelineExecution])
  const items = showMore && length > 2 ? serviceIdentifiers : serviceIdentifiers?.slice(0, 2)
  function toggle(): void {
    setShowMore(status => !status)
  }

  return (
    <div className={css.servicesDeployed}>
      <String stringID="executionList.servicesDeployedText" vars={{ size: length }} />
      <div className={css.servicesList}>
        {items.map((identifier: string) => {
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
                {service?.artifacts ? (
                  <div>{JSON.stringify(service.artifacts)}</div>
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
