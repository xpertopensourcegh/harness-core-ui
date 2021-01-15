import React from 'react'
import { Button } from '@wings-software/uicore'
import { Popover, Position } from '@blueprintjs/core'

import type { PipelineExecutionSummary } from 'services/pipeline-ng'
import { String } from 'framework/exports'
import { getPipelineStagesMap } from '@pipeline/utils/executionUtils'

import type { CDPipelineModuleInfo, CDStageModuleInfo, ServiceExecutionSummary } from 'services/cd-ng'
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
      const serviceInfo = (stage.moduleInfo?.cd as CDStageModuleInfo)?.serviceInfo
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
                {service?.artifacts?.primary ? (
                  <>
                    <String tagName="div" className={css.title} stringID="primaryArtifactText" />
                    <String
                      tagName="div"
                      stringID="artifactDisplay"
                      useRichText
                      vars={{
                        image: ((service.artifacts.primary as unknown) as any).imagePath,
                        tag: ((service.artifacts.primary as unknown) as any).tag
                      }}
                    />
                  </>
                ) : null}
                {service?.artifacts?.sidecars && service.artifacts.sidecars.length > 0 ? (
                  <>
                    <String tagName="div" className={css.title} stringID="sidecarsText" />
                    {service.artifacts.sidecars.map((artifact, index) => (
                      <String
                        tagName="div"
                        key={index}
                        stringID="artifactDisplay"
                        useRichText
                        vars={{
                          image: ((artifact as unknown) as any).imagePath,
                          tag: ((artifact as unknown) as any).tag
                        }}
                      />
                    ))}
                  </>
                ) : null}
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
