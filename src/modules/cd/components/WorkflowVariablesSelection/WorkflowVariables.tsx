import React from 'react'
import { Layout, Text } from '@wings-software/uikit'

import { StepWidget, StepViewType } from 'modules/common/exports'
import type { Variable } from 'services/cd-ng'

import { PipelineContext } from 'modules/cd/pages/pipeline-studio/PipelineContext/PipelineContext'
import { getStageFromPipeline } from 'modules/cd/pages/pipeline-studio/StageBuilder/StageBuilderUtil'
import { StepType } from '../../components/PipelineSteps/PipelineStepInterface'

import factory from '../../components/PipelineSteps/PipelineStepFactory'
import i18n from './WorkflowVariables.i18n'

import css from './WorkflowVariables.module.scss'

export default function WorkflowVariables({
  isForOverrideSets,
  identifierName
}: {
  isForOverrideSets: boolean
  identifierName?: string
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

  const updateVariables = (vars: Variable[]) => {
    if (stageSpec) {
      if (!isForOverrideSets) {
        stageSpec['variables'] = vars
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

  const getInitialValues = () => {
    if (!isForOverrideSets) {
      return stageSpec?.['variables'] || []
    }

    const overrideSets = stageSpec['variableOverrideSets']
    return overrideSets
      .map((variableSet: { overrideSet: { identifier: string; variables: any } }) => {
        if (variableSet?.overrideSet?.identifier === identifierName) {
          return variableSet.overrideSet['variables']
        }
      })
      .filter((x: { overrideSet: { identifier: string; variables: any } }) => x !== undefined)[0]
  }

  return (
    <Layout.Vertical padding="large" style={{ background: 'var(--grey-100)', borderRadius: '5px' }}>
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
