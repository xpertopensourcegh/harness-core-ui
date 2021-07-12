import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { ActiveServiceInstancesContent } from '@dashboards/components/ServiceDetails/ActiveServiceInstances/ActiveServiceInstancesContent'
import * as cdngServices from 'services/cd-ng'

jest.mock('highcharts-react-official', () => () => <></>)

jest.spyOn(cdngServices, 'useGetEnvBuildInstanceCount').mockImplementation(() => {
  return {
    mutate: () => Promise.resolve({ loading: true, data: [] })
  } as any
})

describe('ActiveServiceInstancesContent', () => {
  test('should render ActiveServiceInstancesContent', () => {
    const { container } = render(
      <TestWrapper
        path="account/:accountId/cd/orgs/:orgIdentifier/projects/:projectIdentifier/services"
        pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}
      >
        <ActiveServiceInstancesContent />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
