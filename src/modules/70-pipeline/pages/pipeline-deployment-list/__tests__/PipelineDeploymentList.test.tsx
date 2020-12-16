import React from 'react'
import { render, waitFor, queryByAttribute, fireEvent, findByText } from '@testing-library/react'
import { useLocation } from 'react-router-dom'
import { TestWrapper, TestWrapperProps } from '@common/utils/testUtils'
import { accountPathProps, pipelinePathProps } from '@common/utils/routeUtils'
import routes from '@common/RouteDefinitions'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'
import { useGetListOfExecutions } from 'services/cd-ng'

import PipelineDeploymentList from '../PipelineDeploymentList'
import data from './execution-list.json'
import pipelines from './pipeline-list.json'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

const refetch = jest.fn()

jest.mock('services/cd-ng', () => ({
  useGetListOfExecutions: jest.fn(() => ({ ...data, refetch })),
  useHandleInterrupt: jest.fn(() => ({})),
  useGetPipelineList: jest.fn(() => ({ ...pipelines, refetch: jest.fn() }))
}))

function ComponentWrapper(): React.ReactElement {
  const location = useLocation()
  return (
    <React.Fragment>
      <PipelineDeploymentList onRunPipeline={jest.fn()} />
      <div data-testid="location">{`${location.pathname}${location.search}`}</div>
    </React.Fragment>
  )
}

const testWrapperProps: TestWrapperProps = {
  path: routes.toCDDeployments({ ...accountPathProps, ...pipelinePathProps }),
  pathParams: {
    accountId: 'testAcc',
    orgIdentifier: 'testOrg',
    projectIdentifier: 'testProject'
  },
  defaultAppStoreValues
}

jest.useFakeTimers()

describe('Test Pipeline Deployment list', () => {
  beforeAll(() => {
    jest.spyOn(global.Date, 'now').mockReturnValue(1603645966706)
  })
  afterAll(() => {
    jest.spyOn(global.Date, 'now').mockReset()
  })

  afterEach(() => {
    ;(useGetListOfExecutions as jest.Mock).mockClear()
  })

  // eslint-disable-next-line jest/no-disabled-tests
  test('should render deployment list', async () => {
    const { container, getByText } = render(
      <TestWrapper
        path={routes.toCDPipelineDeploymentList({ ...accountPathProps, ...pipelinePathProps })}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'testProject',
          pipelineIdentifier: 'testPipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <PipelineDeploymentList onRunPipeline={jest.fn()} />
      </TestWrapper>
    )
    await waitFor(() => getByText('test-p1'))
    expect(() => getByText('Pipelines', { selector: '.label' })).toThrowError()
    expect(container).toMatchSnapshot()
  })

  test('should render deployment list with pipeline filter', async () => {
    const { container, getByText } = render(
      <TestWrapper {...testWrapperProps}>
        <PipelineDeploymentList onRunPipeline={jest.fn()} />
      </TestWrapper>
    )
    await waitFor(() => getByText('test-p1'))

    expect(getByText('Pipelines', { selector: '.label' })).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('search works', () => {
    const { container, getByTestId } = render(
      <TestWrapper {...testWrapperProps}>
        <ComponentWrapper />
      </TestWrapper>
    )

    const search = queryByAttribute('type', container, 'search')!

    fireEvent.change(search, { target: { value: 'my search term' } })
    jest.runOnlyPendingTimers()

    expect(getByTestId('location')).toMatchInlineSnapshot(`
      <div
        data-testid="location"
      >
        /account/testAcc/cd/orgs/testOrg/projects/testProject/deployments?query=my%20search%20term
      </div>
    `)

    expect(useGetListOfExecutions).toHaveBeenLastCalledWith({
      queryParamStringifyOptions: { arrayFormat: 'repeat' },
      queryParams: {
        accountIdentifier: 'testAcc',
        executionStatuses: undefined,
        orgIdentifier: 'testOrg',
        page: 0,
        pipelineIdentifiers: undefined,
        projectIdentifier: 'testProject',
        searchTerm: 'my search term'
      }
    })

    const clear = queryByAttribute('data-icon', container, 'small-cross')!.closest('button')!
    fireEvent.click(clear)

    jest.runOnlyPendingTimers()

    expect(getByTestId('location')).toMatchInlineSnapshot(`
      <div
        data-testid="location"
      >
        /account/testAcc/cd/orgs/testOrg/projects/testProject/deployments?query=
      </div>
    `)

    expect(useGetListOfExecutions).toHaveBeenLastCalledWith({
      queryParamStringifyOptions: { arrayFormat: 'repeat' },
      queryParams: {
        accountIdentifier: 'testAcc',
        executionStatuses: undefined,
        orgIdentifier: 'testOrg',
        page: 0,
        pipelineIdentifiers: undefined,
        projectIdentifier: 'testProject',
        searchTerm: ''
      }
    })
  })

  test('Status selection works', async () => {
    const { getByTestId } = render(
      <TestWrapper {...testWrapperProps}>
        <ComponentWrapper />
      </TestWrapper>
    )

    const select = getByTestId('status-select')!

    fireEvent.click(select)

    await waitFor(() => queryByAttribute('class', document.body, 'bp3-popover-content'))
    const option1 = await findByText(document.body, 'Failed', { selector: '.bp3-fill' })

    fireEvent.click(option1)

    jest.runOnlyPendingTimers()

    expect(getByTestId('location')).toMatchInlineSnapshot(`
      <div
        data-testid="location"
      >
        /account/testAcc/cd/orgs/testOrg/projects/testProject/deployments?status=Failed
      </div>
    `)

    expect(useGetListOfExecutions).toHaveBeenLastCalledWith({
      queryParamStringifyOptions: { arrayFormat: 'repeat' },
      queryParams: {
        accountIdentifier: 'testAcc',
        executionStatuses: ['Failed'],
        orgIdentifier: 'testOrg',
        page: 0,
        pipelineIdentifiers: undefined,
        projectIdentifier: 'testProject',
        searchTerm: undefined
      }
    })

    fireEvent.click(select)

    await waitFor(() => queryByAttribute('class', document.body, 'bp3-popover-content'))
    const option2 = await findByText(document.body, 'Clear Selection', { selector: '.bp3-fill' })

    fireEvent.click(option2)

    jest.runOnlyPendingTimers()

    expect(getByTestId('location')).toMatchInlineSnapshot(`
      <div
        data-testid="location"
      >
        /account/testAcc/cd/orgs/testOrg/projects/testProject/deployments?status=
      </div>
    `)

    expect(useGetListOfExecutions).toHaveBeenLastCalledWith({
      queryParamStringifyOptions: { arrayFormat: 'repeat' },
      queryParams: {
        accountIdentifier: 'testAcc',
        executionStatuses: undefined,
        orgIdentifier: 'testOrg',
        page: 0,
        pipelineIdentifiers: undefined,
        projectIdentifier: 'testProject',
        searchTerm: undefined
      }
    })
  })

  test('Pipeline selection works', async () => {
    const { getByTestId } = render(
      <TestWrapper {...testWrapperProps}>
        <ComponentWrapper />
      </TestWrapper>
    )

    const select = getByTestId('pipeline-select')!

    fireEvent.click(select)

    await waitFor(() => queryByAttribute('class', document.body, 'bp3-popover-content'))
    const option1 = await findByText(document.body, 'test345', { selector: '.bp3-fill' })

    fireEvent.click(option1)

    jest.runOnlyPendingTimers()

    expect(getByTestId('location')).toMatchInlineSnapshot(`
      <div
        data-testid="location"
      >
        /account/testAcc/cd/orgs/testOrg/projects/testProject/deployments?pipeline=test345
      </div>
    `)

    expect(useGetListOfExecutions).toHaveBeenLastCalledWith({
      queryParamStringifyOptions: { arrayFormat: 'repeat' },
      queryParams: {
        accountIdentifier: 'testAcc',
        executionStatuses: undefined,
        orgIdentifier: 'testOrg',
        page: 0,
        pipelineIdentifiers: ['test345'],
        projectIdentifier: 'testProject',
        searchTerm: undefined
      }
    })

    fireEvent.click(select)

    await waitFor(() => queryByAttribute('class', document.body, 'bp3-popover-content'))
    const option2 = await findByText(document.body, 'Clear Selection', { selector: '.bp3-fill' })

    fireEvent.click(option2)

    jest.runOnlyPendingTimers()

    expect(getByTestId('location')).toMatchInlineSnapshot(`
      <div
        data-testid="location"
      >
        /account/testAcc/cd/orgs/testOrg/projects/testProject/deployments?pipeline=
      </div>
    `)

    expect(useGetListOfExecutions).toHaveBeenLastCalledWith({
      queryParamStringifyOptions: { arrayFormat: 'repeat' },
      queryParams: {
        accountIdentifier: 'testAcc',
        executionStatuses: undefined,
        orgIdentifier: 'testOrg',
        page: 0,
        pipelineIdentifiers: undefined,
        projectIdentifier: 'testProject',
        searchTerm: undefined
      }
    })
  })
})
