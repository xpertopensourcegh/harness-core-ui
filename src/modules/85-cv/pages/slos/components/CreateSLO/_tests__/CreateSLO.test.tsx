import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper, TestWrapperProps } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import { accountPathProps, projectPathProps } from '@common/utils/routeUtils'
import CreateSLO from '../CreateSLO'

const testWrapperProps: TestWrapperProps = {
  path: routes.toCVCreateSLOs({ ...accountPathProps, ...projectPathProps }),
  pathParams: {
    accountId: '1234_accountId',
    projectIdentifier: '1234_project',
    orgIdentifier: '1234_org'
  }
}

describe('Test CreateSLO component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should render CreateSLO and display SLO Name component by default', async () => {
    const { container, getByText } = render(
      <TestWrapper {...testWrapperProps}>
        <CreateSLO />
      </TestWrapper>
    )
    expect(getByText('cv.slos.sloName')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
