import React from 'react'
import type { Story, Meta } from '@storybook/react'
// import styled from '@emotion/styled'
import { TestWrapper } from '@common/utils/testUtils'

import { HarnessApprovalTab, HarnessApprovalTabProps } from './HarnessApprovalTab'
import harnessApprovalData from './__tests__/HarnessApprovalData.json'

export default {
  title: 'Pipelines / Execution / HarnessApprovalTab',
  component: HarnessApprovalTab,
  argTypes: {
    type: {
      control: {
        type: 'radio',
        options: ['HarnessApproval', 'JiraApproval']
      }
    }
  }
} as Meta

export const Basic: Story<HarnessApprovalTabProps> = args => {
  return (
    <TestWrapper>
      <HarnessApprovalTab {...args} />
    </TestWrapper>
  )
}

Basic.args = {
  isWaiting: true,
  authData: {
    data: { authorized: true }
  },
  approvalData: harnessApprovalData as any
}
