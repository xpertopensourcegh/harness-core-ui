import React from 'react'
import type { Story, Meta } from '@storybook/react'

import { TestWrapper } from '@common/utils/testUtils'
import type { NotificationRules } from 'services/pipeline-ng'
import NotificationTable, { NotificationTableProps } from './NotificationTable'

export default {
  title: 'Common / NotificationTable',
  component: NotificationTable,
  argTypes: {}
} as Meta

const notificationRules: NotificationRules[] = [
  {
    name: 'name',
    enabled: true,
    pipelineEvents: [{ type: 'AllEvents' }],
    notificationMethod: { type: 'Email', spec: { userGroups: ['pl-cd-ng'], recipients: ['abc@harness.io'] } }
  },
  {
    name: 'name',
    enabled: true,
    pipelineEvents: [{ type: 'AllEvents' }, { type: 'PipelineFailed' }],
    notificationMethod: {
      type: 'Slack',
      spec: { userGroups: ['pl-cd-ng'], webhookUrls: 'webhookURL' }
    }
  },
  {
    name: 'name',
    enabled: true,
    pipelineEvents: [{ type: 'AllEvents' }],
    notificationMethod: { type: 'PagerDuty', spec: { userGroups: ['pl-cd-ng'], integrationKeys: '12345' } }
  }
]

const Template: Story<NotificationTableProps> = args => (
  <TestWrapper>
    <NotificationTable {...args} />
  </TestWrapper>
)

export const Basic = Template.bind({})

Basic.args = {
  data: notificationRules,
  onUpdate: (data, index) => {
    if (data && index) notificationRules[index] = data
    else if (index) {
      notificationRules.splice(index, index + 1)
    }
  },
  totalPages: 1,
  totalItems: 3,
  pageItemCount: 3,
  pageSize: 5,
  pageIndex: 0
}
