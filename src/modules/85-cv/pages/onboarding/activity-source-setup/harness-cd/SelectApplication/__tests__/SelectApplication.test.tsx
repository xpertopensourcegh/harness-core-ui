import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { StringsContext } from 'framework/strings/String'
import SelectApplication from '../SelectApplication'
import mockData from './mockData.json'

describe('SelectApplication', () => {
  test('render', async () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <StringsContext.Provider
          value={{
            cv: {
              activitySources: {
                harnessCD: {
                  harnessApps: 'harnessApps',
                  application: {
                    noData: 'Nodata',
                    infoTextOne: 'infoTextOne',
                    infoTextTwo: 'infoTextTwo',
                    servicesToBeImported: 'servicesToBeImported'
                  }
                }
              }
            }
          }}
        >
          <SelectApplication
            onPrevious={jest.fn()}
            mockData={{ data: mockData as any, loading: false }}
            stepData={{}}
          />
        </StringsContext.Provider>
      </MemoryRouter>
    )
    expect(getByText('servicesToBeImported')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
