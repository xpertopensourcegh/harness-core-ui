import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import HarnessCDActivitySourceDetails from '../HarnessCDActivitySourceDetails'

describe('HarnessCDActivitySourceDetails snapshot test', () => {
  test('initializes ok', async () => {
    const { container } = render(
      <TestWrapper pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}>
        <HarnessCDActivitySourceDetails initialValues={{}} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
