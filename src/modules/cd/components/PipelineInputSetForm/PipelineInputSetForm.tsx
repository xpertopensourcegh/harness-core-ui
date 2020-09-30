import React from 'react'
import { Layout } from '@wings-software/uikit'
import type { NgPipeline } from 'services/cd-ng'
import { CollapseForm } from './CollapseForm'
import i18n from './PipelineInputSetForm.i18n'
import { StageInputSetForm } from './StageInputSetForm'
import css from './PipelineInputSetForm.module.scss'

export interface PipelineInputSetFormProps {
  originalPipeline: NgPipeline
  template: NgPipeline
  pipeline?: NgPipeline
  onUpdate: (pipeline?: NgPipeline) => void
}

export const PipelineInputSetForm: React.FC<PipelineInputSetFormProps> = props => {
  const { originalPipeline, template, pipeline, onUpdate } = props
  return (
    <Layout.Vertical spacing="medium" padding="medium" className={css.container}>
      {(originalPipeline as any).variables?.length > 0 && (
        <CollapseForm header={i18n.pipelineVariables}>
          <div>WIP</div>
        </CollapseForm>
      )}
      {template.stages?.map((stageObj, index) => (
        <CollapseForm
          key={stageObj.stage.identifier}
          header={i18n.stageName(originalPipeline?.stages?.[index]?.stage.name)}
        >
          {stageObj.stage?.spec && (
            <StageInputSetForm
              onUpdate={data => {
                if (pipeline?.stages?.[index]?.stage.spec) {
                  pipeline.stages[index].stage.spec = data
                  onUpdate(pipeline)
                }
              }}
              deploymentStageTemplate={stageObj.stage.spec}
              deploymentStage={originalPipeline?.stages?.[index]?.stage.spec}
              deploymentStageInputSet={pipeline?.stages?.[index]?.stage.spec}
            />
          )}
        </CollapseForm>
      ))}
    </Layout.Vertical>
  )
}
