import React from 'react'

import { Container } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import { useUpdateQueryParams } from '@common/hooks'

import { processExecutionData } from '@pipeline/utils/executionUtils'
import { useExecutionContext } from '@pipeline/pages/execution/ExecutionContext/ExecutionContext'
import { StageSelection, StageSelectOption } from '@pipeline/components/StageSelection/StageSelection'
import type { ExecutionPageQueryParams } from '@pipeline/utils/types'
import { isExecutionNotStarted } from '@pipeline/utils/statusHelpers'
import { PageSpinner } from '@common/components'

import { StepsTree } from './StepsTree/StepsTree'
import LogsContent from './LogsContent'
import css from './ExecutionLogView.module.scss'
import 'xterm/css/xterm.css'

export default function ExecutionLogView(): React.ReactElement {
  const { getString } = useStrings()
  const { pipelineStagesMap, pipelineExecutionDetail, selectedStageId, selectedStepId, loading } = useExecutionContext()
  const { updateQueryParams } = useUpdateQueryParams<ExecutionPageQueryParams>()

  const tree = React.useMemo(() => processExecutionData(pipelineExecutionDetail?.executionGraph), [
    pipelineExecutionDetail?.executionGraph
  ])
  const selectOptions: StageSelectOption[] = React.useMemo(() => {
    return [...pipelineStagesMap.entries()].map(([identifier, stage]) => ({
      label: stage.nodeIdentifier || '',
      value: identifier,
      node: stage,
      type: stage.nodeType || ''
    }))
  }, [pipelineStagesMap])

  function handleStageChange(item: StageSelectOption): void {
    updateQueryParams({ stage: item.value as string })
  }

  function handleStepSelect(stepId: string): void {
    updateQueryParams({ step: stepId, stage: selectedStageId })
  }

  return (
    <Container className={css.logsContainer}>
      {loading ? <PageSpinner /> : null}
      <div className={css.stepsContainer}>
        <StageSelection
          selectOptions={selectOptions}
          onStageChange={handleStageChange}
          selectedStageId={selectedStageId}
          className={css.stageSelector}
          chevronIcon="chevron-down"
          itemDisabled={item => isExecutionNotStarted(item.node.status)}
          popoverProps={{ popoverClassName: css.stageSelectionMenu }}
        />
        <div className={css.stageTree}>
          <StepsTree nodes={tree} selectedStepId={selectedStepId} onStepSelect={handleStepSelect} isRoot />
        </div>
      </div>
      <div className={css.logViewer}>
        <LogsContent header={getString('execution.stepLogs')} key={selectedStepId} />
      </div>
    </Container>
  )
}
