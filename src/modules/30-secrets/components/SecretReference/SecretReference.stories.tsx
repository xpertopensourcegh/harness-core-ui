import React from 'react'
import type { Meta, Story } from '@storybook/react'

import SecretReference, { SecretReferenceProps } from './SecretReference'

export default {
  title: 'Secrets / SecretReference',
  component: SecretReference
} as Meta

export const Basic: Story<SecretReferenceProps> = args => <SecretReference {...args} />

Basic.args = {
  type: 'SecretText'
}
