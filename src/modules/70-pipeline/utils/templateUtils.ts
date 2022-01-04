import { defaultTo, get } from 'lodash-es'
import type { StageElementConfig, StepElementConfig } from 'services/cd-ng'
import type { TemplateSummaryResponse } from 'services/template-ng'
import { getIdentifierFromValue, getScopeFromDTO } from '@common/components/EntityReference/EntityReference'
import { Scope } from '@common/interfaces/SecretsInterface'
import type { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import type { TemplateStepNode } from 'services/pipeline-ng'

export const getTemplateNameWithLabel = (template?: TemplateSummaryResponse): string => {
  return `${(template as TemplateSummaryResponse)?.name} (${defaultTo(template?.versionLabel, 'Stable')})`
}

export const getScopeBasedTemplateRef = (template: TemplateSummaryResponse): string => {
  const templateIdentifier = defaultTo(template.identifier, '')
  const scope = getScopeFromDTO(defaultTo(template, {}))
  return scope === Scope.PROJECT ? templateIdentifier : `${scope}.${templateIdentifier}`
}

export const getStageType = (stage?: StageElementConfig, templateTypes?: { [key: string]: string }) => {
  return defaultTo(
    stage?.template
      ? get(templateTypes, getIdentifierFromValue(defaultTo(stage?.template?.templateRef, '')), '')
      : stage?.type,
    ''
  )
}

export const getStepType = (
  step?: StepElementConfig | TemplateStepNode,
  templateTypes?: { [key: string]: string }
): StepType => {
  const isTemplate = !!(step as TemplateStepNode)?.template
  return isTemplate
    ? (get(
        templateTypes,
        getIdentifierFromValue(defaultTo((step as TemplateStepNode)?.template?.templateRef, ''))
      ) as StepType)
    : ((step as StageElementConfig)?.type as StepType)
}
