import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import BuildInfraSpecifications from '../BuildInfraSpecifications'

describe('BuildInfraSpecifications snapshot test', () => {
  test('initializes ok', async () => {
    const { container } = render(
      <TestWrapper pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}>
        <BuildInfraSpecifications />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
