import React from 'react'
import { Layout, Text } from '@wings-software/uikit'

import { StepWidget, StepViewType } from '@pipeline/exports'
import type { NGVariable as Variable } from 'services/cd-ng'

import { PipelineContext, getStageFromPipeline } from '@pipeline/exports'
import { StepType } from '../../../70-pipeline/components/PipelineSteps/PipelineStepInterface'

import { PredefinedOverrideSets } from '../PredefinedOverrideSets/PredefinedOverrideSets'

import factory from '../../../70-pipeline/components/PipelineSteps/PipelineStepFactory'
import i18n from './WorkflowVariables.i18n'

import css from './WorkflowVariables.module.scss'

export default function WorkflowVariables({
  isForOverrideSets,
  identifierName,
  isForPredefinedSets
}: {
  isForOverrideSets: boolean
  identifierName?: string
  isForPredefinedSets: boolean
}): JSX.Element {
  const {
    state: {
      pipeline,
      pipelineView: {
        splitViewData: { selectedStageId }
      }
    },
    updatePipeline
  } = React.useContext(PipelineContext)
  // console.log(isForOverrideSets, identifierName)
  const { stage } = getStageFromPipeline(pipeline, selectedStageId || '')
  const stageSpec = stage?.['stage']?.['spec']?.['service']?.['serviceDefinition']?.['spec']
  const predefinedSetsPath = stage?.['stage']?.['spec']?.['service']?.['stageOverrides']
  const updateVariables = (vars: Variable[]): void => {
    if (stageSpec || predefinedSetsPath) {
      if (!isForOverrideSets) {
        if (isForPredefinedSets) {
          predefinedSetsPath['variables'] = vars
        } else {
          stageSpec['variables'] = vars
        }
      } else {
        const overrideSets = stageSpec['variableOverrideSets']
        overrideSets.map((variableSet: { overrideSet: { identifier: string; variables: object } }) => {
          if (variableSet?.overrideSet?.identifier === identifierName) {
            variableSet.overrideSet['variables'] = vars
          }
        })
      }
    }
    updatePipeline(pipeline)
  }

  const getInitialValues = (): Variable[] => {
    if (!isForOverrideSets) {
      if (isForPredefinedSets) {
        return predefinedSetsPath?.['variables'] || []
      }
      return stageSpec?.['variables'] || []
    }
    if (isForPredefinedSets) {
      return predefinedSetsPath?.['variables'] || []
    }
    const overrideSets = stageSpec['variableOverrideSets']
    return overrideSets
      .map((variableSet: { overrideSet: { identifier: string; variables: Variable[] } }) => {
        if (variableSet?.overrideSet?.identifier === identifierName) {
          return variableSet.overrideSet['variables']
        }
      })
      .filter((x: { overrideSet: { identifier: string; variables: Variable[] } }) => x !== undefined)[0]
  }

  return (
    <Layout.Vertical padding="large" style={{ background: 'var(--grey-100)', borderRadius: '5px' }}>
      {isForPredefinedSets && <PredefinedOverrideSets context="VARIABLES" currentStage={stage} />}
      {!isForOverrideSets && <Text style={{ color: 'var(--grey-500)', lineHeight: '24px' }}>{i18n.info}</Text>}

      <section className={css.variablesList}>
        <StepWidget<{ variables: Variable[] }>
          factory={factory}
          stepViewType={StepViewType.StageVariable}
          initialValues={{ variables: getInitialValues() }}
          type={StepType.CustomVariable}
          onUpdate={({ variables }: { variables: Variable[] }) => {
            updateVariables(variables)
          }}
        />
      </section>
    </Layout.Vertical>
  )
}
