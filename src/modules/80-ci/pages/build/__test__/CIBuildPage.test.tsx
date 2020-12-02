import React from 'react'
import { render } from '@testing-library/react'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'
import { TestWrapper } from '@common/utils/testUtils'
import CIBuildPage from '../CIBuildPage'

import buildMock from './mock/buildMock.json'

jest.mock('@ci/services/LogService', () => ({
  getLogsFromBlob: (): Promise<void> => {
    return Promise.resolve()
  }
}))

jest.mock('@ci/services/LogService', () => ({
  getLogsFromBlob: (): Promise<void> => {
    return Promise.resolve()
  },
  useLogs: jest.fn(() => [[]])
}))

jest.mock('@ci/services/TokenService', () => ({
  fetchLogsAccessToken: (): Promise<string> => {
    return Promise.resolve('token')
  }
}))

jest.mock('services/ci', () => ({
  useGetBuild: jest.fn(() => ({
    data: buildMock,
    loading: false,
    error: false,
    refetch: jest.fn(() => ({}))
  }))
}))

describe('CIBuildPage snapshot test', () => {
  test('should render properly', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/ci/orgs/:orgIdentifier/projects/:projectIdentifier/builds/:buildIdentifier/pipeline/graph"
        pathParams={{
          orgIdentifier: 'dummy',
          projectIdentifier: 'dummy',
          buildIdentifier: 'dummy',
          accountId: 'dummy'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CIBuildPage />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
