import { defaultTo, get, merge } from 'lodash-es'
import { parse } from 'yaml'
import produce from 'immer'
import { useCallback } from 'react'
import type { StageElementConfig, TemplateLinkConfig } from 'services/cd-ng'
import type { TemplateSummaryResponse } from 'services/template-ng'
import { usePipelineContext } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import { getIdentifierFromValue } from '@common/components/EntityReference/EntityReference'
import { useTemplateSelector } from '@pipeline/utils/useTemplateSelector'

interface TemplateActionsReturnType {
  onUseTemplate: (templateConfig: TemplateLinkConfig) => Promise<void>
  onCopyTemplate: (copiedTemplate: TemplateSummaryResponse) => Promise<void>
  onRemoveTemplate: () => Promise<void>
  onOpenTemplateSelector: () => void
}

export function useStageTemplateActions(): TemplateActionsReturnType {
  const {
    state: {
      selectionState: { selectedStageId = '' },
      templateTypes
    },
    updateStage,
    getStageFromPipeline
  } = usePipelineContext()
  const { openTemplateSelector, closeTemplateSelector } = useTemplateSelector()
  const { stage } = getStageFromPipeline(selectedStageId)

  const onUseTemplate = useCallback(
    async (templateConfig: TemplateLinkConfig) => {
      closeTemplateSelector()
      const node = stage?.stage
      const processNode = produce({} as StageElementConfig, draft => {
        draft.name = node?.name || ''
        draft.identifier = node?.identifier || ''
        draft.template = templateConfig
      })
      await updateStage(processNode)
    },
    [closeTemplateSelector, stage?.stage, updateStage]
  )

  const onCopyTemplate = useCallback(
    async (copiedTemplate: TemplateSummaryResponse) => {
      closeTemplateSelector()
      const node = stage?.stage
      const processNode = merge(
        produce({} as StageElementConfig, draft => {
          draft.name = node?.name || ''
          draft.identifier = node?.identifier || ''
        }),
        parse(copiedTemplate?.yaml || '')?.template.spec
      )
      await updateStage(processNode)
    },
    [closeTemplateSelector, stage?.stage, updateStage]
  )

  const onOpenTemplateSelector = useCallback(() => {
    const stageType =
      stage?.stage?.type ||
      get(templateTypes, getIdentifierFromValue(defaultTo(stage?.stage?.template?.templateRef, '')))
    const selectedTemplateRef = stage?.stage?.template?.templateRef || ''
    openTemplateSelector({
      templateType: 'Stage',
      childTypes: [stageType],
      selectedTemplateRef: selectedTemplateRef,
      onUseTemplate,
      onCopyTemplate
    })
  }, [stage?.stage, templateTypes, openTemplateSelector, onUseTemplate, onCopyTemplate])

  const onRemoveTemplate = useCallback(async () => {
    const node = stage?.stage
    const processNode = produce({} as StageElementConfig, draft => {
      draft.name = node?.name || ''
      draft.identifier = node?.identifier || ''
      draft.type = get(templateTypes, getIdentifierFromValue(defaultTo(node?.template?.templateRef, '')))
    })
    await updateStage(processNode)
  }, [stage?.stage, templateTypes, updateStage])

  return { onUseTemplate, onCopyTemplate, onRemoveTemplate, onOpenTemplateSelector }
}
