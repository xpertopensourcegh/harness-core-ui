import { memoize } from 'lodash-es'
import { getMultiTypeFromValue, MultiTypeInputType } from '@wings-software/uicore'
import { getStageIndexByIdentifier } from '@pipeline/components/PipelineStudio/StageBuilder/StageBuilderUtil'
import type { NgPipeline } from 'services/cd-ng'
import { ENABLED_ARTIFACT_TYPES } from '@pipeline/components/ArtifactsSelection/ArtifactHelper'

export const getStagePathByIdentifier = memoize((stageIdentifier = '', pipeline: NgPipeline) => {
  let finalPath = ''
  if (pipeline) {
    const { stageIndex, parallelStageIndex } = getStageIndexByIdentifier(pipeline, stageIdentifier)
    finalPath =
      parallelStageIndex > -1 ? `stages[${stageIndex}].parallel[${parallelStageIndex}]` : `stages[${stageIndex}]`
  }

  return finalPath
})

export const getNonRuntimeFields = (spec: { [key: string]: any } = {}, template: { [key: string]: any }): string => {
  const fields: { [key: string]: any } = {}

  Object.entries(spec).forEach(([key]): void => {
    if (getMultiTypeFromValue(template?.[key]) !== MultiTypeInputType.RUNTIME) {
      fields[key] = spec[key]
    }
  })
  return JSON.stringify(fields, null, 2)
}

export const clearRuntimeInputValue = (template: NgPipeline): NgPipeline => {
  return JSON.parse(
    JSON.stringify(template || {}).replace(/"<\+input>.?(?:allowedValues\((.*?)\)|regex\((.*?)\))?"/g, '""')
  )
}

export const ArtifactConnectorTypes = [
  ENABLED_ARTIFACT_TYPES.DockerRegistry,
  ENABLED_ARTIFACT_TYPES.Gcr,
  ENABLED_ARTIFACT_TYPES.Ecr
]

export const setupMode = {
  PROPAGATE: 'PROPAGATE',
  DIFFERENT: 'DIFFERENT'
}
