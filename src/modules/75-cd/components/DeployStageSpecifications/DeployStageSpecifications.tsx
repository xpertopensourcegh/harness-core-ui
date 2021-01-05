import React from 'react'

import { Layout } from '@wings-software/uicore'

import { cloneDeep } from 'lodash-es'

import { PipelineContext, getStageFromPipeline } from '@pipeline/exports'
import { EditStageView } from '../CDPipelineStages/stages/DeployStage/EditStageView/EditStageView'

export default function DeployStageSpecifications(): JSX.Element {
  const {
    state: {
      pipeline,
      pipelineView: {
        splitViewData: { selectedStageId }
      },
      pipelineView
    },
    updatePipelineView,
    updatePipeline
  } = React.useContext(PipelineContext)
  const { stage } = getStageFromPipeline(pipeline, selectedStageId || '')
  const cloneOriginalData = cloneDeep(stage)
  const [stageData, updateStageData] = React.useState({ customVariables: [], ...stage?.stage })
  const StateRef = React.useRef(stageData)
  const updateStage = (data: any) => {
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
        updatePipelineView({
          ...pipelineView,
          splitViewData: { ...pipelineView.splitViewData, selectedStageId: StateRef.current?.identifier }
        })
      }

      updatePipeline(pipeline)
    }
  }, [])

  return (
    <Layout.Vertical>
      <Layout.Vertical spacing="large">
        <EditStageView
          data={cloneOriginalData}
          context={'setup'}
          onChange={values =>
            updateStage({
              name: values?.name,
              identifier: values?.identifier,
              description: values?.description
            })
          }
        />
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
