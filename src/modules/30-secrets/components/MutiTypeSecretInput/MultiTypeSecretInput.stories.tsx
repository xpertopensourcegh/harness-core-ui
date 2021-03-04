import React from 'react'
import type { Meta, Story } from '@storybook/react'
import { Formik } from 'formik'

import { TestWrapper } from '@common/utils/testUtils'

import MultiTypeSecretInput, { MultiTypeSecretInputProps } from './MultiTypeSecretInput'

import secretsListsMockData from './__test__/secretsListMockData.json'

export default {
  title: 'Secrets / MultiTypeSecretInput',
  component: MultiTypeSecretInput
} as Meta

export const Basic: Story<MultiTypeSecretInputProps> = args => {
  return (
    <TestWrapper {...args}>
      <Formik initialValues={{}} onSubmit={() => void 0}>
        <MultiTypeSecretInput {...args} secretsListMockData={secretsListsMockData as any} />
      </Formik>
    </TestWrapper>
  )
}

Basic.args = {
  name: 'secret',
  label: 'Secret'
}
