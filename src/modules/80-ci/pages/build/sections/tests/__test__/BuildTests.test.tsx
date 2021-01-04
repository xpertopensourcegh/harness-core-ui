import React from 'react'
import { render } from '@testing-library/react'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'
import { TestWrapper } from '@common/utils/testUtils'
import { BuildPageContext, BuildPageContextInterface } from '@ci/pages/build/context/BuildPageContext'
import ReportsSummaryMock from './mock/reports-summary.json'
import TestSuiteMock from './mock/reports-test-suites.json'
import TestCaseMock from './mock/reports-test-cases.json'
import BuildsMock from './mock/builds.json'
import BuildTests from '../BuildTests'

jest.mock('services/ti-service', () => ({
  useReportSummary: () => ({
    data: ReportsSummaryMock,
    refetch: jest.fn()
  }),
  useGetBuild: () => ({
    data: BuildsMock,
    refetch: jest.fn()
  }),
  useTestSuiteSummary: () => ({
    data: TestSuiteMock,
    refetch: jest.fn()
  }),
  useTestCaseSummary: () => ({
    data: TestCaseMock,
    refetch: jest.fn()
  })
}))

describe('BuildTests snapshot test', () => {
  test('should render all components properly', async () => {
    const { container } = render(
      <TestWrapper
        path="/account/zEaak-FLS425IEO7OLzMUg/ci/orgs/default/projects/citestproject/builds/2445/tests"
        pathParams={{
          accountId: 'zEaak-FLS425IEO7OLzMUg',
          orgIdentifier: 'default',
          projectIdentifier: 'citestproject',
          buildIdentifier: 2445
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <BuildPageContext.Provider
          value={({ buildData: { response: BuildsMock } } as unknown) as BuildPageContextInterface}
        >
          <BuildTests />
        </BuildPageContext.Provider>
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
