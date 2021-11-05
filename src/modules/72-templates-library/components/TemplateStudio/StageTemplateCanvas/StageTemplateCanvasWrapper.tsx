import produce from 'immer'
import { get, isEmpty, omit, set } from 'lodash-es'
import React from 'react'
import { useParams } from 'react-router-dom'
import { DefaultNewStageId } from '@templates-library/components/TemplateStudio/StageTemplateCanvas/StageTemplateForm/StageTemplateForm'
import { TemplatePipelineProvider } from '@pipeline/components/TemplatePipelineContext'
import { StageTemplateCanvasWithRef } from '@templates-library/components/TemplateStudio/StageTemplateCanvas/StageTemplateCanvas'
import type { PipelineInfoConfig } from 'services/cd-ng'
import { TemplateContext } from '@templates-library/components/TemplateStudio/TemplateContext/TemplateContext'
import type { TemplateFormRef } from '@templates-library/components/TemplateStudio/TemplateStudio'
import { DefaultPipeline } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'

const StageTemplateCanvasWrapper = (_props: unknown, formikRef: TemplateFormRef) => {
  const {
    state: { template, isLoading, isUpdated },
    updateTemplate,
    isReadonly
  } = React.useContext(TemplateContext)
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps>()

  const createPipelineFromTemplate = React.useCallback(
    () =>
      produce({ ...DefaultPipeline }, draft => {
        if (!isEmpty(template.spec)) {
          set(draft, 'stages[0].stage', { ...template.spec, identifier: DefaultNewStageId })
        }
      }),
    [template.spec]
  )

  const [pipeline, setPipeline] = React.useState<PipelineInfoConfig>(createPipelineFromTemplate())

  React.useEffect(() => {
    if (!isLoading && !isUpdated) {
      setPipeline(createPipelineFromTemplate())
    }
  }, [isLoading, isUpdated])

  const onUpdatePipeline = async (pipelineConfig: PipelineInfoConfig) => {
    const stage = get(pipelineConfig, 'stages[0].stage')
    set(template, 'spec', omit(stage, 'name', 'identifier', 'description', 'tags'))
    await updateTemplate(template)
  }

  if (pipeline) {
    return (
      <TemplatePipelineProvider
        queryParams={{ accountIdentifier: accountId, orgIdentifier, projectIdentifier }}
        initialValue={pipeline as PipelineInfoConfig}
        onUpdatePipeline={onUpdatePipeline}
        isReadOnly={isReadonly}
      >
        <StageTemplateCanvasWithRef ref={formikRef} />
      </TemplatePipelineProvider>
    )
  } else {
    return <></>
  }
}

export const StageTemplateCanvasWrapperWithRef = React.forwardRef(StageTemplateCanvasWrapper)
