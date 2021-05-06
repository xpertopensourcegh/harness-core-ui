import React from 'react'
import { get } from 'lodash-es'
import { useExecutionContext } from '@pipeline/pages/execution/ExecutionContext/ExecutionContext'
import type { ExecutionNode, PipelineExecutionSummary, ExecutionGraph } from 'services/pipeline-ng'
import ArtifactsComponent from './ArtifactsComponent/ArtifactsComponent'
import type { ArtifactGroup } from './ArtifactsComponent/ArtifactsComponent'
import css from './ExecutionArtifactsView.module.scss'

export const getStageSetupIds: (data: PipelineExecutionSummary) => string[] = data => {
  return Object.keys(data?.layoutNodeMap ?? {})
}

export const getStageNodesWithArtifacts: (data: ExecutionGraph, stageIds: string[]) => ExecutionNode[] = (
  data,
  stageIds
) => {
  return Object.values(data?.nodeMap ?? {}).filter(entry => {
    const { setupId = '', outcomes = [] } = entry
    return (
      stageIds.includes(setupId) &&
      outcomes.length &&
      outcomes.some(outcome => outcome.fileArtifacts?.length || outcome.imageArtifacts?.length)
    )
  })
}

export const getArtifactGroups: (stages: ExecutionNode[]) => ArtifactGroup[] = stages => {
  return stages.map(node => {
    const imageArtifacts =
      node.outcomes
        ?.find(outcome => outcome.imageArtifacts)
        // TODO: fix typing once BE type is available
        ?.imageArtifacts?.map((artifact: any) => ({
          image: artifact.imageName,
          tag: artifact.tag,
          type: 'Image',
          url: artifact.url
        })) ?? []
    const fileArtifacts = node.outcomes
      ?.find(outcome => outcome.fileArtifacts)
      // TODO: fix typing once BE type is available
      ?.fileArtifacts?.map((artifact: any) => ({
        type: 'File',
        url: artifact.url
      }))
    return {
      name: node.name!,
      icon: 'pipeline-deploy',
      artifacts: imageArtifacts.concat(fileArtifacts)
    }
  })
}

export default function ExecutionArtifactsView(): React.ReactElement {
  const context = useExecutionContext()
  const executionSummary = get(context, 'pipelineExecutionDetail.pipelineExecutionSummary')
  const executionGraph = get(context, 'pipelineExecutionDetail.executionGraph')
  const stageSetupIds = getStageSetupIds(executionSummary as PipelineExecutionSummary)
  const stageNodes = getStageNodesWithArtifacts(executionGraph as any, stageSetupIds)
  const artifactGroups = getArtifactGroups(stageNodes)
  return (
    <div className={css.wrapper}>
      <ArtifactsComponent artifactGroups={artifactGroups as ArtifactGroup[]} />
    </div>
  )
}
