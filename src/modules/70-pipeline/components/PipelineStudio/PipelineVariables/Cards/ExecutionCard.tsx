import React from 'react'
import produce from 'immer'
import { set } from 'lodash-es'
import { NestedAccordionPanel } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'

import type { ExecutionElementConfig, ExecutionWrapperConfig, StepElementConfig } from 'services/cd-ng'

import type { PipelineVariablesData } from '../types'
import { StepCardPanel } from './StepCard'

export interface ExecutionCardProps {
  execution: ExecutionElementConfig
  originalExecution: ExecutionElementConfig
  metadataMap: PipelineVariablesData['metadataMap']
  stageIdentifier: string
  onUpdateExecution(data: ExecutionElementConfig): void
}

export function ExecutionCard(props: ExecutionCardProps): React.ReactElement {
  const { execution, originalExecution, metadataMap, stageIdentifier, onUpdateExecution } = props
  const [allSteps, stepsPathMap] = React.useMemo(() => {
    const cards: Array<[StepElementConfig, StepElementConfig]> = []
    const pathsMap: Record<string, string> = {}

    function addToCards(
      steps?: ExecutionWrapperConfig[],
      originalSteps?: ExecutionWrapperConfig[],
      parentPath = ''
    ): void {
      if (!steps || !Array.isArray(steps)) return

      steps.forEach(({ step, stepGroup, parallel }, i) => {
        if (step) {
          cards.push([step, originalSteps?.[i]?.step || {}])
          // TODO: confirm if steps will have unique id
          pathsMap[step.identifier || ''] = `${parentPath}[${i}]`
        } else if (stepGroup) {
          addToCards(stepGroup.steps, originalSteps?.[i]?.stepGroup?.steps, `${parentPath}[${i}].stepGroup.steps`)
          addToCards(
            stepGroup.rollbackSteps,
            originalSteps?.[i]?.stepGroup?.rollbackSteps,
            `${parentPath}[${i}].stepGroup.rollbackSteps`
          )
        } else if (parallel) {
          // BE does not generate correct types for parallel
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          addToCards(parallel as any, originalSteps?.[i]?.parallel as any, `${parentPath}[${i}].parallel`)
        }
      })
    }

    addToCards(execution.steps, originalExecution.steps, 'steps')
    addToCards(execution.rollbackSteps, originalExecution.rollbackSteps, 'rollbackSteps')

    return [cards, pathsMap]
  }, [execution, originalExecution])

  return (
    <React.Fragment>
      {allSteps.map(([step, originalStep]) => {
        if (!step || !originalStep) return null

        return (
          <StepCardPanel
            key={originalStep.identifier}
            step={step}
            originalStep={originalStep}
            metadataMap={metadataMap}
            stageIdentifier={stageIdentifier}
            onUpdateStep={(data: StepElementConfig) => {
              if (data.identifier && stepsPathMap[data.identifier]) {
                onUpdateExecution(
                  produce(originalExecution, draft => {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    set(draft, stepsPathMap[data.identifier!], data)
                  })
                )
              }
            }}
          />
        )
      })}
    </React.Fragment>
  )
}

export function ExecutionCardPanel(props: ExecutionCardProps): React.ReactElement {
  const { getString } = useStrings()

  return (
    <NestedAccordionPanel
      isDefaultOpen
      addDomId
      id={`Stage.${props.stageIdentifier}.Execution`}
      summary={getString('executionText')}
      details={<ExecutionCard {...props} />}
    />
  )
}
