import React from 'react'
import { Layout, Text } from '@wings-software/uikit'

import { get } from 'lodash'
import { StepWidget, StepViewType } from 'modules/common/exports'
import type { Variable } from 'services/cd-ng'

import { PipelineContext } from 'modules/cd/pages/pipeline-studio/PipelineContext/PipelineContext'
import { getStageFromPipeline } from 'modules/cd/pages/pipeline-studio/StageBuilder/StageBuilderUtil'
import { StepType } from '../../components/PipelineSteps/PipelineStepInterface'

import factory from '../../components/PipelineSteps/PipelineStepFactory'
import i18n from './WorkflowVariables.i18n'

import css from './WorkflowVariables.module.scss'

export default function WorkflowVariables(): JSX.Element {
  const {
    state: {
      pipeline,
      pipelineView: {
        splitViewData: { selectedStageId }
      }
    },
    updatePipeline
  } = React.useContext(PipelineContext)

  const { stage } = getStageFromPipeline(pipeline, selectedStageId || '')
  let _variables = get(stage, 'stage.spec.service.serviceDef.spec.variables', [])
  return (
    <Layout.Vertical padding="large" style={{ background: 'var(--grey-100)', minHeight: 150 }}>
      <Text style={{ color: 'var(--grey-500)', lineHeight: '24px' }}>{i18n.info}</Text>
      <section className={css.variablesList}>
        <StepWidget<{ variables: Variable[] }>
          factory={factory}
          stepViewType={StepViewType.StageVariable}
          initialValues={{ variables: _variables || [] }}
          type={StepType.CustomVariable}
          onUpdate={({ variables }: { variables: Variable[] }) => {
            _variables = variables
            updatePipeline(pipeline)
          }}
        />
      </section>
    </Layout.Vertical>
  )
}
