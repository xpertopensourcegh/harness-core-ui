import React from 'react'
import { Tabs } from '@blueprintjs/core'

import { useExecutionContext } from 'modules/cd/pages/execution/ExecutionContext/ExecutionContext'
import ExecutionLayout from 'modules/common/components/ExecutionLayout/ExecutionLayout'

import ExecutionStepDetailsTab from './ExecutionStepDetailsTab'
import ExecutionStepInputTab from './ExecutionStepInputTab'
import ExecutionStepOutputTab from './ExecutionStepOutputTab'

import css from './ExecutionStepDetails.module.scss'

export interface ExecutionStepDetailsProps {
  selectedStep: string
}

export default function ExecutionStepDetails(props: ExecutionStepDetailsProps): React.ReactElement {
  const { selectedStep } = props
  const { pipelineExecutionDetail } = useExecutionContext()

  const step = pipelineExecutionDetail?.stageGraph?.nodeMap?.[selectedStep] || {}

  return (
    <div className={css.main}>
      <div className={css.header}>
        <div className={css.title}>Step: {step.name}</div>
        <ExecutionLayout.Toggle />
      </div>
      <Tabs id="step-details" className={css.tabs} renderActiveTabPanelOnly>
        <Tabs.Tab id="details" title="Details" panel={<ExecutionStepDetailsTab />} />
        <Tabs.Tab id="input" title="Input" panel={<ExecutionStepInputTab />} />
        <Tabs.Tab id="output" title="Output" panel={<ExecutionStepOutputTab />} />
      </Tabs>
    </div>
  )
}
