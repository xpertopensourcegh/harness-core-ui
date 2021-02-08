import React from 'react'
import { Layout, Text } from '@wings-software/uicore'
import get from 'lodash-es/get'
import isEmpty from 'lodash-es/isEmpty'

import {
  StepWidget,
  StepViewType,
  AbstractStepFactory,
  getStageIndexFromPipeline,
  getPrevoiusStageFromIndex
} from '@pipeline/exports'
import type { NGVariable as Variable } from 'services/cd-ng'
import { PipelineContext } from '@pipeline/exports'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { PredefinedOverrideSets } from '@pipeline/components/PredefinedOverrideSets/PredefinedOverrideSets'
import i18n from './WorkflowVariables.i18n'

import css from './WorkflowVariables.module.scss'

export default function WorkflowVariables({
  isForOverrideSets,
  identifierName,
  isForPredefinedSets,
  overrideSetIdentifier = '',
  isPropagating,
  factory
}: {
  isForOverrideSets: boolean
  identifierName?: string
  isForPredefinedSets: boolean
  overrideSetIdentifier?: string
  isPropagating?: boolean
  factory: AbstractStepFactory
}): JSX.Element {
  const {
    state: {
      pipeline,
      pipelineView: {
        splitViewData: { selectedStageId }
      }
    },
    getStageFromPipeline,
    updatePipeline
  } = React.useContext(PipelineContext)

  const { stage } = getStageFromPipeline(selectedStageId || '')
  const [parentStageData, setParentStageData] = React.useState<{ [key: string]: any }>()
  React.useEffect(() => {
    if (isEmpty(parentStageData) && stage?.stage?.spec?.serviceConfig?.useFromStage?.stage) {
      const { stages } = getPrevoiusStageFromIndex(pipeline)
      const parentStageName = stage?.stage?.spec?.serviceConfig?.useFromStage?.stage
      const { index } = getStageIndexFromPipeline(pipeline, parentStageName)
      setParentStageData(stages[index])
    }
  }, [])

  const stageSpec = stage?.['stage']?.['spec']?.['serviceConfig']?.['serviceDefinition']?.['spec']
  const predefinedSetsPath = stage?.['stage']?.['spec']?.['serviceConfig']?.['stageOverrides']
  const updateVariables = (vars: Variable[]): void => {
    if (stageSpec || predefinedSetsPath) {
      if (isPropagating) {
        predefinedSetsPath.variables = [...vars]
        updatePipeline(pipeline)
        return
      }
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
    if (isPropagating) {
      if (!overrideSetIdentifier.length) {
        return predefinedSetsPath?.['variables'] || []
      }
      const overrideSets = get(
        parentStageData,
        'stage.spec.serviceConfig.serviceDefinition.spec.variableOverrideSets',
        []
      )
      const selectedOverrideSet = overrideSets.find(
        ({ overrideSet }: { overrideSet: { identifier: string } }) => overrideSet.identifier === overrideSetIdentifier
      )
      return get(selectedOverrideSet, 'overrideSet.variables', [])
    }
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

      <section className={css.variablesList}>
        {overrideSetIdentifier?.length === 0 && !isForOverrideSets && (
          <Text style={{ color: 'var(--grey-500)', lineHeight: '24px' }}>{i18n.info}</Text>
        )}
        <StepWidget<{ variables: Variable[]; isPropagating?: boolean; canAddVariable: boolean }>
          factory={factory}
          stepViewType={StepViewType.StageVariable}
          initialValues={{
            variables: getInitialValues(),
            isPropagating,
            canAddVariable: !overrideSetIdentifier?.length
          }}
          type={StepType.CustomVariable}
          onUpdate={({ variables }: { variables: Variable[] }) => {
            updateVariables(variables)
          }}
        />
      </section>
    </Layout.Vertical>
  )
}
