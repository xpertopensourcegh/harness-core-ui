import React from 'react'
import { render } from '@testing-library/react'
import { StringsContext } from 'framework/strings/String'
import ProgressStatus from '../ProgressStatus'

describe('ProgressStatus', () => {
  test('render initial state with services and env', async () => {
    const { container, getByText } = render(
      <StringsContext.Provider
        value={{
          global: {
            cv: {
              onboarding: {
                progress: {
                  heading: 'Your Progress',
                  mapServices: 'Map the above services to a monitoring source.',
                  serviceEnvCount: 'You have 2 services and 2 environments.'
                }
              }
            }
          }
        }}
      >
        <ProgressStatus
          numberOfServicesUsedInActivitySources={0}
          numberOfServicesUsedInMonitoringSources={0}
          totalNumberOfEnvironments={2}
          totalNumberOfServices={2}
          servicesUndergoingHealthVerification={0}
        />
      </StringsContext.Provider>
    )

    expect(getByText('You have 2 services and 2 environments.')).toBeDefined()

    expect(container).toMatchSnapshot()
  })
  test('render with some services in activity and monitoring', async () => {
    const { container, getByText } = render(
      <StringsContext.Provider
        value={{
          global: {
            cv: {
              onboarding: {
                progress: {
                  heading: 'Your Progress',
                  mapServices: 'Map the above services to a monitoring source.',
                  serviceEnvCount: 'You have 2 services and 2 environments.',
                  servicesUsedInActivitySources: '1 service is used in activity sources',
                  multiServiceUsedInMonitoringSources: '2 services are used in monitoring sources'
                }
              }
            }
          }
        }}
      >
        <ProgressStatus
          numberOfServicesUsedInActivitySources={1}
          numberOfServicesUsedInMonitoringSources={2}
          totalNumberOfEnvironments={2}
          totalNumberOfServices={2}
          servicesUndergoingHealthVerification={0}
        />
      </StringsContext.Provider>
    )

    expect(getByText('2 services are used in monitoring sources')).toBeDefined()

    expect(container).toMatchSnapshot()
  })
})
