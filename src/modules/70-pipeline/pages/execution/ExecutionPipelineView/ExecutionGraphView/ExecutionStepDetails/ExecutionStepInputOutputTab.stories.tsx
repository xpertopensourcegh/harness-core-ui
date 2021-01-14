import React from 'react'
import type { Meta, Story } from '@storybook/react'

import ExecutionStepInputOutputTab, { ExecutionStepInputOutputTabProps } from './ExecutionStepInputOutputTab'
import data from './__tests__/io-1.json'

export default {
  title: 'Pipelines / Execution / ExecutionStepInputOutputTab ',
  component: ExecutionStepInputOutputTab
} as Meta

type StoryProps = Pick<ExecutionStepInputOutputTabProps, 'mode'> & {
  inputData: any
  outputData: any
}

export const Basic: Story<StoryProps> = args => (
  <ExecutionStepInputOutputTab data={args.mode === 'input' ? args.inputData : args.outputData} mode={args.mode} />
)

Basic.args = {
  mode: 'input',
  inputData: [data.stepParameters],
  outputData: data.outcomes
}
