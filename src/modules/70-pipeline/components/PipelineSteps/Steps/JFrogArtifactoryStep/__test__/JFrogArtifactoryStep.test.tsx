import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { JFrogArtifactoryStepWidget } from '../JFrogArtifactoryStep'

describe('JFrogArtifactoryStep snapshot test', () => {
  test('Widget should render properly', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/ci/pipeline-studio/orgs/:orgIdentifier/projects/:projectIdentifier/pipelines/-1/ui/"
        pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}
      >
        <JFrogArtifactoryStepWidget initialValues={{ identifier: '', spec: {} }} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
