import React from 'react'
import { render, waitFor, queryByAttribute, fireEvent, findByText as findByTextGlobal } from '@testing-library/react'
import { useLocation } from 'react-router-dom'
import { TestWrapper, TestWrapperProps } from '@common/utils/testUtils'
import { accountPathProps, pipelineModuleParams, pipelinePathProps, projectPathProps } from '@common/utils/routeUtils'
import routes from '@common/RouteDefinitions'
import { defaultAppStoreValues } from '@common/utils/DefaultAppStoreData'
import { useGetListOfExecutions } from 'services/pipeline-ng'

import PipelineDeploymentList from '../PipelineDeploymentList'
import data from './execution-list.json'
import pipelines from './pipeline-list.json'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

jest.mock('services/pipeline-ng', () => ({
  useGetListOfExecutions: jest.fn(() => ({
    mutate: jest.fn(() => Promise.resolve(data)),
    loading: false,
    cancel: jest.fn()
  })),
  useGetPipelineList: jest.fn().mockImplementation(() => {
    return { mutate: jest.fn(() => Promise.resolve(pipelines)), cancel: jest.fn(), loading: false }
  }),
  useHandleInterrupt: jest.fn(() => ({}))
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
  path: routes.toDeployments({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams }),
  pathParams: {
    accountId: 'testAcc',
    orgIdentifier: 'testOrg',
    projectIdentifier: 'testProject',
    module: 'cd'
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

  // afterEach(() => {
  //   ;(useGetListOfExecutions as jest.Mock).mockClear()
  // })

  test('should render deployment list', async () => {
    const { container, findByText } = render(
      <TestWrapper
        path={routes.toPipelineDeploymentList({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'testProject',
          pipelineIdentifier: 'testPipeline',
          module: 'cd'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <PipelineDeploymentList onRunPipeline={jest.fn()} />
      </TestWrapper>
    )
    await waitFor(() => findByText('http_pipeline', { selector: '.pipelineName' }))
    expect(container).toMatchSnapshot()
  })

  test('should render deployment list with pipeline filter', async () => {
    const { container, findByText } = render(
      <TestWrapper
        path={routes.toDeployments({ ...accountPathProps, ...projectPathProps, ...pipelineModuleParams })}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'testProject',
          module: 'cd'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <PipelineDeploymentList onRunPipeline={jest.fn()} />
      </TestWrapper>
    )
    await waitFor(() => findByText('http_pipeline', { selector: '.pipelineName' }))
    // expect(() => getByText('Pipelines', { selector: '.label' })).toThrowError()
    expect(container).toMatchSnapshot()
  })

  // TODO:PMS enable search once with actual API
  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('search works', () => {
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

  // TODO:PMS enable search once with actual API
  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('Status selection works', async () => {
    const { getByTestId } = render(
      <TestWrapper {...testWrapperProps}>
        <ComponentWrapper />
      </TestWrapper>
    )

    const select = getByTestId('status-select')!

    fireEvent.click(select)

    await waitFor(() => queryByAttribute('class', document.body, 'bp3-popover-content'))
    const option1 = await findByTextGlobal(document.body, 'Failed', { selector: '.bp3-fill' })

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
    const option2 = await findByTextGlobal(document.body, 'Clear Selection', { selector: '.bp3-fill' })

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

  // TODO:PMS enable search once with actual API
  // eslint-disable-next-line jest/no-disabled-tests
  test.skip('Pipeline selection works', async () => {
    const { getByTestId } = render(
      <TestWrapper {...testWrapperProps}>
        <ComponentWrapper />
      </TestWrapper>
    )

    const select = getByTestId('pipeline-select')!

    fireEvent.click(select)

    await waitFor(() => queryByAttribute('class', document.body, 'bp3-popover-content'))
    const option1 = await findByTextGlobal(document.body, 'test345', { selector: '.bp3-fill' })

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
    const option2 = await findByTextGlobal(document.body, 'Clear Selection', { selector: '.bp3-fill' })

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
