import React from 'react'
import { Layout, Card, NestedAccordionPanel, getMultiTypeFromValue, MultiTypeInputType } from '@wings-software/uicore'
import { isEmpty } from 'lodash-es'
import type { PipelineInfoConfig, StageElementWrapperConfig } from 'services/cd-ng'
import { String } from 'framework/exports'
import { CollapseForm } from './CollapseForm'
import { StageInputSetForm } from './StageInputSetForm'
import { CICodebaseInputSetForm } from './CICodebaseInputSetForm'
import { getStageFromPipeline } from '../PipelineStudio/StepUtil'
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
  return (
    <NestedAccordionPanel
      isDefaultOpen
      addDomId
      id={`Stage.${allValues?.stage?.identifier}`}
      summary={<div className={css.stagesTreeBulletSquare}>{allValues?.stage?.name || ''}</div>}
      details={
        template?.stage?.spec && (
          <StageInputSetForm
            stageIdentifier={template?.stage?.identifier}
            path={path}
            deploymentStageTemplate={template?.stage.spec}
            deploymentStage={allValues?.stage?.spec}
            readonly={readonly}
          />
        )
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
            <div>WIP</div>
          </Card>
        </CollapseForm>
      )}
      {getMultiTypeFromValue(template?.properties?.ci?.codebase?.build as string) === MultiTypeInputType.RUNTIME && (
        <CollapseForm header={i18n.ciCodebase}>
          <CICodebaseInputSetForm path={path} readonly={readonly} />
        </CollapseForm>
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
                  path={`${!isEmpty(path) ? `${path}.` : ''}stages[${index}].stage.spec`}
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
                    path={`${!isEmpty(path) ? `${path}.` : ''}stages[${index}].parallel[${indexp}].stage.spec`}
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
