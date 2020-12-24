import React from 'react'
import { Layout } from '@wings-software/uikit'
import { isEmpty } from 'lodash-es'
import type { PipelineInfoConfig, StageElementWrapperConfig } from 'services/cd-ng'
import { CollapseForm } from './CollapseForm'
import i18n from './PipelineInputSetForm.i18n'
import { StageInputSetForm } from './StageInputSetForm'
import { getStageFromPipeline } from '../PipelineStudio/StepUtil'
import css from './PipelineInputSetForm.module.scss'

export interface PipelineInputSetFormProps {
  originalPipeline: PipelineInfoConfig
  template: PipelineInfoConfig
  path?: string
}

function StageForm({
  allValues,
  path,
  template
}: {
  allValues?: StageElementWrapperConfig
  template?: StageElementWrapperConfig
  path: string
}): JSX.Element {
  return (
    <CollapseForm key={template?.stage?.identifier} header={i18n.stageName(allValues?.stage?.name || '')}>
      {template?.stage?.spec && (
        <StageInputSetForm
          path={path}
          deploymentStageTemplate={template?.stage.spec}
          deploymentStage={allValues?.stage?.spec}
        />
      )}
    </CollapseForm>
  )
}

export const PipelineInputSetForm: React.FC<PipelineInputSetFormProps> = props => {
  const { originalPipeline, template, path = '' } = props
  return (
    <Layout.Vertical spacing="medium" padding="medium" className={css.container}>
      {(originalPipeline as any)?.variables?.length > 0 && (
        <CollapseForm header={i18n.pipelineVariables}>
          <div>WIP</div>
        </CollapseForm>
      )}
      {template?.stages?.map((stageObj, index) => {
        if (stageObj.stage) {
          const allValues = getStageFromPipeline(stageObj.stage.identifier, originalPipeline)
          return (
            <StageForm
              key={stageObj?.stage?.identifier || index}
              template={stageObj}
              allValues={allValues}
              path={`${!isEmpty(path) ? `${path}.` : ''}stages[${index}].stage.spec`}
            />
          )
        } else if (stageObj.parallel) {
          return ((stageObj.parallel as unknown) as StageElementWrapperConfig[]).map((stageP, indexp) => {
            const allValues = getStageFromPipeline(stageP?.stage?.identifier || '', originalPipeline)
            return (
              <StageForm
                key={stageP?.stage?.identifier || indexp}
                template={stageP}
                allValues={allValues}
                path={`${!isEmpty(path) ? `${path}.` : ''}stages[${index}].parallel[${indexp}].stage.spec`}
              />
            )
          })
        }
      })}
    </Layout.Vertical>
  )
}
