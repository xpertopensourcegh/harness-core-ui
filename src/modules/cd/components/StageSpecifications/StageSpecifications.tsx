import React from 'react'

import { Layout } from '@wings-software/uikit'

import { cloneDeep } from 'lodash'

import { PipelineContext } from 'modules/cd/pages/pipeline-studio/PipelineContext/PipelineContext'
import { getStageFromPipeline } from 'modules/cd/pages/pipeline-studio/StageBuilder/StageBuilderUtil'
import { EditStageView } from '../../pages/pipeline-studio/StageBuilder/views/EditStageView'

export default function StageSpecifications(): JSX.Element {
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

  return (
    <Layout.Vertical>
      <Layout.Vertical spacing="large" style={{ alignItems: 'center' }}>
        <EditStageView
          data={cloneOriginalData}
          context={'setup'}
          onChange={values => {
            const _stageObj = stage?.stage
            if (_stageObj) {
              _stageObj.name = values?.name
              _stageObj.identifier = values?.identifier
              _stageObj.description = values?.description
              updatePipelineView({ ...pipelineView, splitViewData: { selectedStageId: values?.identifier } })
              updatePipeline(pipeline)
            }
          }}
        />
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
