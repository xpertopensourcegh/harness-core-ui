import React from 'react'
import { Tabs } from '@blueprintjs/core'

import type { ExecutionNode } from 'services/pipeline-ng'
import { useStrings } from 'framework/exports'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { isExecutionSkipped } from '@pipeline/utils/statusHelpers'

import { ApprovalTab } from './Tabs/ApprovalTab/ApprovalTab'
import ExecutionStepDetailsTab from './Tabs/ExecutionStepDetailsTab/ExecutionStepDetailsTab'
import ExecutionStepInputOutputTab from './Tabs/ExecutionStepInputOutputTab/ExecutionStepInputOutputTab'

import css from './ExecutionStepDetails.module.scss'

export interface StepDetailTabs {
  step: ExecutionNode
}

export function StepDetailTabs(props: StepDetailTabs): React.ReactElement {
  const { step } = props
  const { getString } = useStrings()
  const isApprovalStep = step.stepType === StepType.HarnessApproval || step.stepType === StepType.JiraApproval

  return (
    <Tabs id="step-details" className={css.tabs} renderActiveTabPanelOnly>
      {isApprovalStep && !isExecutionSkipped(step.status) ? (
        <Tabs.Tab id="details" title={getString('approvalStage.title')} panel={<ApprovalTab step={step} />} />
      ) : (
        <Tabs.Tab id="details" title={getString('details')} panel={<ExecutionStepDetailsTab step={step} />} />
      )}
      <Tabs.Tab
        id="input"
        title="Input"
        panel={
          <ExecutionStepInputOutputTab baseFqn={step.baseFqn} mode="input" data={[(step as any).stepParameters]} />
        }
      />
      <Tabs.Tab
        id="output"
        title="Output"
        panel={<ExecutionStepInputOutputTab baseFqn={step.baseFqn} mode="output" data={(step as any).outcomes || []} />}
      />
    </Tabs>
  )
}
