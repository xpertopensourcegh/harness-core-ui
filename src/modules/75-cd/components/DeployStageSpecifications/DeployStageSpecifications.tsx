import React from 'react'

import { Layout } from '@wings-software/uicore'

import { cloneDeep } from 'lodash-es'

import { PipelineContext, getStageFromPipeline } from '@pipeline/exports'
import { EditStageView } from '../CDPipelineStages/stages/DeployStage/EditStageView/EditStageView'

export default function DeployStageSpecifications(props: React.PropsWithChildren<unknown>): JSX.Element {
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
  const cloneOriginalData = cloneDeep(stage)
  const [stageData, updateStageData] = React.useState({ variables: [], ...stage?.stage })
  const StateRef = React.useRef(stageData)
  const updateStage = (data: any): void => {
    updateStageData(data)
    StateRef.current = data
  }

  React.useEffect(() => {
    return () => {
      const _stageObj = stage?.stage

      if (_stageObj) {
        _stageObj.name = StateRef.current?.name
        _stageObj.identifier = StateRef.current?.identifier
        _stageObj.description = StateRef.current?.description
        _stageObj.variables = StateRef.current?.variables
        _stageObj.skipCondition = StateRef.current?.skipCondition
      }

      updatePipeline(pipeline)
    }
  }, [])

  return (
    <Layout.Vertical spacing="large" style={{ paddingBottom: '64px' }}>
      <EditStageView
        data={cloneOriginalData}
        context={'setup'}
        onChange={values => {
          updateStage({
            name: values?.name,
            identifier: values?.identifier,
            description: values?.description,
            variables: values?.variables,
            skipCondition: values?.skipCondition
          })
        }}
      />
      {props.children}
    </Layout.Vertical>
  )
}
