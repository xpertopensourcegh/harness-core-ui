import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { CustomVariables } from '../CustomVariables'

describe('CustomVariables snapshot test', () => {
  test('initializes ok', async () => {
    const { container } = render(
      <TestWrapper pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}>
        <CustomVariables />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
