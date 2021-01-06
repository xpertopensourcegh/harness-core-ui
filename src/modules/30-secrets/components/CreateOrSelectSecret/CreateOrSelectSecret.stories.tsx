import React from 'react'
import type { Meta, Story } from '@storybook/react'

import { Container } from '@wings-software/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import CreateOrSelectSecret, { CreateOrSelectSecretProps } from './CreateOrSelectSecret'

export default {
  title: 'Secrets / CreateOrSelectSecret',
  component: CreateOrSelectSecret
} as Meta

export const Basic: Story<CreateOrSelectSecretProps> = args => (
  <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'dummy' }}>
    <Container width={400}>
      <CreateOrSelectSecret {...args} />
    </Container>
  </TestWrapper>
)

Basic.args = {
  type: 'SecretText'
}
