/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import type { Meta, Story } from '@storybook/react'

import { TestWrapper } from '@common/utils/testUtils'
import { InputOutputTabProps, InputOutputTab } from './InputOutputTab'
import data from './__tests__/io-1.json'

export default {
  title: 'Pipelines / Execution / InputOutputTab ',
  component: InputOutputTab
} as Meta

type StoryProps = Pick<InputOutputTabProps, 'mode'> & {
  inputData: any
  outputData: any
}

export const Basic: Story<StoryProps> = args => (
  <TestWrapper>
    <InputOutputTab data={args.mode === 'input' ? args.inputData : args.outputData} mode={args.mode} />
  </TestWrapper>
)

Basic.args = {
  mode: 'input',
  inputData: [data.stepParameters],
  outputData: data.outcomes
}
