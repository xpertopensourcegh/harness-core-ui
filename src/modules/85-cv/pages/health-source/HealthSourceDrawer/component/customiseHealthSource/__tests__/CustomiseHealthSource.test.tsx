import React from 'react'
import { render } from '@testing-library/react'
import routes from '@common/RouteDefinitions'
import * as cvServices from 'services/cv'
import { TestWrapper, TestWrapperProps } from '@common/utils/testUtils'
import { SetupSourceTabs } from '@cv/components/CVSetupSourcesView/SetupSourceTabs/SetupSourceTabs'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import CustomiseHealthSource from '../CustomiseHealthSource'

const testWrapperProps: TestWrapperProps = {
  path: routes.toCVAddMonitoringServicesSetup({ ...accountPathProps, ...projectPathProps }),
  pathParams: {
    accountId: '1234_accountId',
    projectIdentifier: '1234_project',
    orgIdentifier: '1234_org'
  }
}

const onNextMock = jest.fn().mockResolvedValue(jest.fn())
const onPrevious = jest.fn().mockResolvedValue(jest.fn())

jest.mock('@cv/components/CVSetupSourcesView/SetupSourceTabs/SetupSourceTabs', () => ({
  ...(jest.requireActual('@cv/components/CVSetupSourcesView/SetupSourceTabs/SetupSourceTabs') as any),
  get SetupSourceTabsContext() {
    return React.createContext({
      tabsInfo: [],
      sourceData: { productName: 'apm' },
      onNext: onNextMock,
      onPrevious: onPrevious
    })
  }
}))
describe('CustomiseHealthSource', () => {
  beforeAll(() => {
    jest.spyOn(cvServices, 'useSaveMonitoredService').mockImplementation(() => ({} as any))
    jest.spyOn(cvServices, 'useUpdateMonitoredService').mockImplementation(() => ({} as any))
  })

  test('should matchsnapshot', () => {
    const { container } = render(
      <TestWrapper {...testWrapperProps}>
        <SetupSourceTabs data={{}} tabTitles={['Tab1']} determineMaxTab={() => 1}>
          <CustomiseHealthSource />
        </SetupSourceTabs>
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
