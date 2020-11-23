import React from 'react'

import { Layout } from '@wings-software/uikit'

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
  React.useEffect(() => {
    return () => {
      updatePipeline(pipeline)
    }
  }, [])
  return (
    <Layout.Vertical>
      <Layout.Vertical spacing="large">
        <EditStageView
          data={cloneOriginalData}
          context={'setup'}
          onChange={values => {
            const _stageObj = stage?.stage
            if (_stageObj) {
              _stageObj.name = values?.name
              _stageObj.identifier = values?.identifier
              _stageObj.description = values?.description
              updatePipelineView({
                ...pipelineView,
                splitViewData: { ...pipelineView.splitViewData, selectedStageId: values?.identifier }
              })
            }
          }}
        />
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
