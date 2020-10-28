import React from 'react'
import { Layout, Select } from '@wings-software/uikit'
import ExecutionGraph from 'modules/pipeline/components/PipelineStudio/ExecutionGraph/ExecutionGraph'
import { PipelineContext } from 'modules/pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import {
  getSelectStageOptionsFromPipeline,
  StageSelectOption
} from 'modules/pipeline/components/PipelineStudio/CommonUtils/CommonUtils'
import css from './BuildStageSetupShell.module.scss'

export default function BuildStageSetupShell(): JSX.Element {
  const {
    state: {
      pipeline,
      pipelineView,
      pipelineView: {
        splitViewData: { selectedStageId }
      }
    },
    updatePipelineView
  } = React.useContext(PipelineContext)

  const selectOptions = getSelectStageOptionsFromPipeline(pipeline)
  const selectedStageOption = selectOptions.find(item => item.value === selectedStageId)

  return (
    <section className={css.setupShell}>
      <Layout.Horizontal margin="none" className={css.execution}>
        <div className={css.floatingToolbar}>
          <Select
            items={selectOptions}
            value={selectedStageOption}
            onChange={item => {
              updatePipelineView({
                ...pipelineView,
                isSplitViewOpen: true,
                splitViewData: {
                  ...pipelineView.splitViewData,
                  selectedStageId: item.value as string,
                  stageType: (item as StageSelectOption).node.stage.type
                }
              })
            }}
          />
        </div>
        <ExecutionGraph />
      </Layout.Horizontal>
    </section>
  )
}
