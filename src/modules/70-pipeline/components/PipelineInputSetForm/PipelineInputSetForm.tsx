import React from 'react'
import { Layout, Card, NestedAccordionPanel, getMultiTypeFromValue, MultiTypeInputType } from '@wings-software/uicore'
import { isEmpty } from 'lodash-es'
import type { PipelineInfoConfig, StageElementWrapperConfig } from 'services/cd-ng'
import { String, useStrings } from 'framework/exports'
import { CollapseForm } from './CollapseForm'
import { StageInputSetForm } from './StageInputSetForm'
import { CICodebaseInputSetForm } from './CICodebaseInputSetForm'
import { getStageFromPipeline } from '../PipelineStudio/StepUtil'
import { StepWidget } from '../AbstractSteps/StepWidget'
import factory from '../PipelineSteps/PipelineStepFactory'
import type {
  CustomVariablesData,
  CustomVariableInputSetExtraProps
} from '../PipelineSteps/Steps/CustomVariables/CustomVariableInputSet'
import type { AbstractStepFactory } from '../AbstractSteps/AbstractStepFactory'
import { StepType } from '../PipelineSteps/PipelineStepInterface'
import { StepViewType } from '../AbstractSteps/Step'
import i18n from './PipelineInputSetForm.i18n'
import css from './PipelineInputSetForm.module.scss'

export interface PipelineInputSetFormProps {
  originalPipeline: PipelineInfoConfig
  template: PipelineInfoConfig
  path?: string
  readonly?: boolean
}

function StageForm({
  allValues,
  path,
  template,
  readonly
}: {
  allValues?: StageElementWrapperConfig
  template?: StageElementWrapperConfig
  path: string
  readonly?: boolean
}): JSX.Element {
  const { getString } = useStrings()
  return (
    <NestedAccordionPanel
      isDefaultOpen
      addDomId
      id={`Stage.${allValues?.stage?.identifier}`}
      summary={<div className={css.stagesTreeBulletSquare}>{allValues?.stage?.name || ''}</div>}
      details={
        <>
          {template?.stage?.variables && (
            <NestedAccordionPanel
              isDefaultOpen
              addDomId
              id={`Stage.${allValues?.stage?.identifier}.Variables`}
              summary={<div className={css.stagesTreeBulletCircle}>{getString('variablesText')}</div>}
              details={
                <StepWidget<CustomVariablesData, CustomVariableInputSetExtraProps>
                  factory={(factory as unknown) as AbstractStepFactory}
                  initialValues={{
                    variables: allValues?.stage?.variables || [],
                    canAddVariable: true
                  }}
                  type={StepType.CustomVariable}
                  stepViewType={StepViewType.InputSet}
                  customStepProps={{
                    template: { variables: template?.stage?.variables },
                    path
                  }}
                />
              }
            />
          )}
          {template?.stage?.spec && (
            <StageInputSetForm
              stageIdentifier={template?.stage?.identifier}
              path={`${path}.spec`}
              deploymentStageTemplate={template?.stage.spec}
              deploymentStage={allValues?.stage?.spec}
              readonly={readonly}
            />
          )}
        </>
      }
    />
  )
}

export const PipelineInputSetForm: React.FC<PipelineInputSetFormProps> = props => {
  const { originalPipeline, template, path = '', readonly } = props
  return (
    <Layout.Vertical spacing="medium" padding="medium" className={css.container}>
      {(originalPipeline as any)?.variables?.length > 0 && (
        <CollapseForm header={i18n.pipelineVariables}>
          <Card>
            <StepWidget<CustomVariablesData, CustomVariableInputSetExtraProps>
              factory={(factory as unknown) as AbstractStepFactory}
              initialValues={{
                variables: originalPipeline.variables || [],
                canAddVariable: true
              }}
              type={StepType.CustomVariable}
              stepViewType={StepViewType.InputSet}
              customStepProps={{
                template: { variables: template?.variables || [] },
                path
              }}
            />
          </Card>
        </CollapseForm>
      )}
      {getMultiTypeFromValue((template?.properties?.ci?.codebase?.build as unknown) as string) ===
        MultiTypeInputType.RUNTIME && (
        <>
          <div className={css.header}>{i18n.ciCodebase}</div>
          <CICodebaseInputSetForm path={path} readonly={readonly} />
        </>
      )}
      <>
        <div className={css.header}>
          <String stringID="pipeline-list.listStages" />
        </div>
        {template?.stages?.map((stageObj, index) => {
          if (stageObj.stage) {
            const allValues = getStageFromPipeline(stageObj.stage.identifier, originalPipeline)
            return (
              <Card key={stageObj?.stage?.identifier || index}>
                <StageForm
                  template={stageObj}
                  allValues={allValues}
                  path={`${!isEmpty(path) ? `${path}.` : ''}stages[${index}].stage`}
                  readonly={readonly}
                />
              </Card>
            )
          } else if (stageObj.parallel) {
            return ((stageObj.parallel as unknown) as StageElementWrapperConfig[]).map((stageP, indexp) => {
              const allValues = getStageFromPipeline(stageP?.stage?.identifier || '', originalPipeline)
              return (
                <Card key={stageObj?.stage?.identifier || index}>
                  <StageForm
                    template={stageP}
                    allValues={allValues}
                    path={`${!isEmpty(path) ? `${path}.` : ''}stages[${index}].parallel[${indexp}].stage`}
                    readonly={readonly}
                  />
                </Card>
              )
            })
          }
        })}
      </>
    </Layout.Vertical>
  )
}
