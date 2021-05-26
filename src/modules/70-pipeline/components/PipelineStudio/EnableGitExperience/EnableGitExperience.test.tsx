import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { EnableGitExperience } from './EnableGitExperience'

describe('<EnableGitExperience />', () => {
  test('should render EnableGitExperience component properly', () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/ci/dashboard/:pipelineIdentifier/"
        pathParams={{
          accountId: 'dummy',
          pipelineIdentifier: -1
        }}
      >
        <EnableGitExperience />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
