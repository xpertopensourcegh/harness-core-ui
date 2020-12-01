import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { noop } from 'lodash-es'
import { TestWrapper } from '@common/utils/testUtils'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import routes from '@common/RouteDefinitions'
import SelectProduct from '../SelectProduct'

describe('SelectProduct', () => {
  test('render for AppD monitoring source', async () => {
    const { container, getByText } = render(
      <TestWrapper
        path={routes.toCVMainDashBoardPage({ ...accountPathProps, ...projectPathProps })}
        pathParams={{
          accountId: 'loading',
          projectIdentifier: '1234_project',
          orgIdentifier: '1234_ORG'
        }}
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
