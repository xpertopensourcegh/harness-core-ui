import React from 'react'
import { render } from '@testing-library/react'

import { TestWrapper } from 'modules/common/utils/testUtils'
import CreateInlineSecret from '../CreateInlineSecret'

import mockData from './listSecretManagersMock.json'

describe('Create Inline Secret', () => {
  test('render', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/secrets" pathParams={{ accountId: 'dummy' }}>
        <CreateInlineSecret
          accountIdentifier="dummy"
          defaultSecretName="testName"
          defaultSecretId="testId"
          mock={mockData as any}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
