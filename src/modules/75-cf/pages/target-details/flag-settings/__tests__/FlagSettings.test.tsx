import React from 'react'
import { render, RenderResult } from '@testing-library/react'

import { TestWrapper } from '@common/utils/testUtils'

import mockGitSync from '@cf/utils/testData/data/mockGitSync'
import mockTarget from '@cf/utils/testData/data/mockTarget'
import mockFeature from '@cf/utils/testData/data/mockFeature'

import { FlagSettings } from '../FlagSettings'

jest.mock('services/cf', () => ({
  useGetAllFeatures: jest
    .fn()
    .mockReturnValue({ data: { features: [mockFeature] }, loading: false, refetch: jest.fn() }),
  usePatchFeature: jest.fn().mockReturnValue({ mutate: jest.fn(), loading: false, data: [] })
}))

jest.mock('@cf/hooks/useEnvironmentSelectV2', () => ({
  useEnvironmentSelectV2: jest.fn().mockReturnValue({ data: [], loading: false })
}))

const renderComponent = (): RenderResult => {
  return render(
    <TestWrapper
      path="/account/:accountId/cf/orgs/:orgIdentifier/projects/:projectIdentifier/feature-flags"
      pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}
    >
      <FlagSettings gitSync={mockGitSync} target={mockTarget} />
    </TestWrapper>
  )
}

describe('FlagSettings', () => {
  test('it should render correctly', async () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })
})
