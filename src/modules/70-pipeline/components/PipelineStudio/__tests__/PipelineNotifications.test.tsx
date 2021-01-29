import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { PipelineNotifications } from '../PipelineNotifications/PipelineNotifications'

describe('Test PipelineNotifications', () => {
  test('should test render', () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/ci/dashboard/:pipelineIdentifier/"
        pathParams={{
          accountId: 'dummy',
          pipelineIdentifier: -1
        }}
      >
        <PipelineNotifications />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
