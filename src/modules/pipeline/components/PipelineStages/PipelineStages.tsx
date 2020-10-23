import React from 'react'
import { noop } from 'lodash-es'
import { AddStageView } from './views/AddStageView'
import type { PipelineStageProps } from './PipelineStage'

export interface PipelineStagesProps<T = {}> {
  children: Array<React.ReactElement<PipelineStageProps>>
  minimal?: boolean
  stageType?: string
  isParallel?: boolean
  stageProps?: T
  onSelectStage?: (stageType: string) => void
  showSelectMenu?: boolean
}

interface PipelineStageMap extends Omit<PipelineStageProps, 'minimal'> {
  index: number
}

export function PipelineStages<T = {}>({
  children,
  showSelectMenu,
  isParallel = false,
  onSelectStage,
  stageType,
  stageProps,
  minimal = false
}: PipelineStagesProps<T>): JSX.Element {
  const [stages, setStages] = React.useState<Map<string, PipelineStageMap>>(new Map())

  React.useLayoutEffect(() => {
    const stagesLocal: Map<string, PipelineStageMap> = new Map()
    const steps = React.Children.toArray(children) as React.ReactElement<PipelineStageProps>[]
    steps.forEach((child, i: number) => {
      stagesLocal.set(child.props.type, {
        ...child.props,
        index: i
      })
    })
    setStages(stagesLocal)
  }, [children])

  const selected = stages.get(stageType || '')
  const selectedStageIndex = selected?.index || 0
  const stage = React.Children.toArray(children)[selectedStageIndex] as React.ReactElement<PipelineStageProps>
  return (
    <>
      {showSelectMenu && (
        <AddStageView
          stages={[...stages].map(item => item[1])}
          isParallel={isParallel}
          callback={onSelectStage || noop}
        />
      )}
      {!showSelectMenu && selected && stage && <>{React.cloneElement(stage, { ...selected, minimal, stageProps })}</>}
    </>
  )
}
