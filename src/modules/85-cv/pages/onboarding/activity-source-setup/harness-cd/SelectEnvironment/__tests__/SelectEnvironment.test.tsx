import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ModalProvider } from '@wings-software/uikit'
import { StringsContext } from 'framework/strings/String'
import SelectEnvironment from '../SelectEnvironment'
import mockData from '../../SelectApplication/__tests__/mockData.json'

import mockEnvironments from '../__tests__/mockEnvironments.json'

jest.mock('framework/exports', () => ({
  ...(jest.requireActual('framework/exports') as object),
  useRouteParams: () => ({
    params: {
      accountId: 'testAcc'
    },
    query: {
      orgId: 'testOrg'
    }
  })
}))

jest.mock('services/cd-ng', () => ({
  useGetEnvironmentListForProject: () => mockEnvironments,
  useCreateEnvironment: jest.fn().mockImplementation(() => ({ mutate: jest.fn() }))
}))

jest.mock('services/portal', () => ({
  useList: () => {
    return { data: mockData, refetch: jest.fn() }
  }
}))

describe('SelectEnvironment', () => {
  test('render', async () => {
    const { container, getByText } = render(
      <ModalProvider>
        <MemoryRouter>
          <StringsContext.Provider
            value={{
              global: {
                retry: 'Retry'
              },
              cv: {
                activitySources: {
                  harnessCD: {
                    harnessApps: 'harnessApps',
                    environment: {
                      noData: 'Nodata',
                      infoText: 'infoText',
                      harnessEnv: 'harnessEnv',
                      env: 'env'
                    }
                  }
                }
              }
            }}
          >
            <SelectEnvironment
              initialValues={{ selectedApplications: [mockData.resource.response] }}
              onPrevious={jest.fn()}
            />
          </StringsContext.Provider>
        </MemoryRouter>
      </ModalProvider>
    )
    expect(getByText('env')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
