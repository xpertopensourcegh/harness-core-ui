import React from 'react'
import { Layout } from '@wings-software/uikit'
import type { PipelineInfoConfig, StageElementWrapperConfig, DeploymentStageConfig } from 'services/cd-ng'
import { CollapseForm } from './CollapseForm'
import i18n from './PipelineInputSetForm.i18n'
import { StageInputSetForm } from './StageInputSetForm'
import css from './PipelineInputSetForm.module.scss'

export interface PipelineInputSetFormProps {
  originalPipeline: PipelineInfoConfig
  template: PipelineInfoConfig
  pipeline?: PipelineInfoConfig
  onUpdate: (pipeline?: PipelineInfoConfig) => void
}

function getStepFromStage(stageId: string, pipeline?: PipelineInfoConfig): StageElementWrapperConfig | undefined {
  if (pipeline?.stages) {
    let responseStage: StageElementWrapperConfig | undefined = undefined
    pipeline.stages.forEach(item => {
      if (item.stage && item.stage.identifier === stageId) {
        responseStage = item
      } else if (item.parallel) {
        return ((item.parallel as unknown) as StageElementWrapperConfig[]).forEach(node => {
          if (node.stage?.identifier === stageId) {
            responseStage = node
          }
        })
      }
    })
    return responseStage
  }
  return
}

function StageForm({
  allValues,
  values,
  template,
  onUpdate
}: {
  allValues?: StageElementWrapperConfig
  values?: StageElementWrapperConfig
  template?: StageElementWrapperConfig
  onUpdate: (data?: DeploymentStageConfig) => void
}): JSX.Element {
  return (
    <CollapseForm key={template?.stage?.identifier} header={i18n.stageName(allValues?.stage?.name || '')}>
      {template?.stage?.spec && (
        <StageInputSetForm
          onUpdate={onUpdate}
          deploymentStageTemplate={template?.stage.spec}
          deploymentStage={allValues?.stage?.spec}
          deploymentStageInputSet={values?.stage?.spec}
        />
      )}
    </CollapseForm>
  )
}

export const PipelineInputSetForm: React.FC<PipelineInputSetFormProps> = props => {
  const { originalPipeline, template, pipeline, onUpdate } = props
  return (
    <Layout.Vertical spacing="medium" padding="medium" className={css.container}>
      {(originalPipeline as any)?.variables?.length > 0 && (
        <CollapseForm header={i18n.pipelineVariables}>
          <div>WIP</div>
        </CollapseForm>
      )}
      {template?.stages?.map((stageObj, index) => {
        if (stageObj.stage) {
          const allValues = getStepFromStage(stageObj.stage.identifier, originalPipeline)
          const values = getStepFromStage(stageObj.stage.identifier, pipeline)
          return (
            <StageForm
              key={stageObj?.stage?.identifier || index}
              template={stageObj}
              allValues={allValues}
              values={values}
              onUpdate={data => {
                if (values?.stage) {
                  if (!values.stage.spec) {
                    values.stage.spec = {}
                  }
                  values.stage.spec = data
                  onUpdate(pipeline)
                }
              }}
            />
          )
        } else if (stageObj.parallel) {
          return ((stageObj.parallel as unknown) as StageElementWrapperConfig[]).map((stageP, indexp) => {
            const allValues = getStepFromStage(stageP?.stage?.identifier || '', originalPipeline)
            const values = getStepFromStage(stageP?.stage?.identifier || '', pipeline)
            return (
              <StageForm
                key={stageP?.stage?.identifier || indexp}
                template={stageP}
                allValues={allValues}
                values={values}
                onUpdate={data => {
                  if (values?.stage) {
                    if (!values.stage.spec) {
                      values.stage.spec = {}
                    }
                    values.stage.spec = data
                    onUpdate(pipeline)
                  }
                }}
              />
            )
          })
        }
      })}
    </Layout.Vertical>
  )
}
