import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { noop } from 'lodash-es'
import { TestWrapper } from '@common/utils/testUtils'
import * as framework from 'framework/route/RouteMounter'
import SelectProduct from '../SelectProduct'

describe('SelectProduct', () => {
  test('render for AppD monitoring source', async () => {
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: 'loading',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG'
      },
      query: {}
    })
    const { container, getByText } = render(
      <TestWrapper
        pathParams={{ accountId: 'dummy', orgIdentifier: 'dummyOrgId', projectIdentifier: 'dummyProjectId' }}
      >
        <SelectProduct type="AppDynamics" onCompleteStep={() => noop} />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'Monitoring Source Type'))
    expect(getByText('AppDynamics')).toBeDefined()
    expect(getByText('+ new AppDynamics Connector')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
