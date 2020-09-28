import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { TestWrapper } from 'modules/common/utils/testUtils'
import ConnectorsPage from '../ConnectorsPage'
import { ManualK8s, InlineK8s, GitHttp, Docker, ActiveDocker } from '../__tests__/mockData'

jest.mock('react-timeago', () => () => 'dummy date')

describe('Connectors List', () => {
  test('render k8s manual config  connector row', async () => {
    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectorsPage
          mockData={{
            data: ManualK8s as any,
            loading: false
          }}
        />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'master url'))
    expect(getByText('K8sName')).toBeDefined()
    expect(getByText('master url')).toBeDefined()
    expect(getByText('error')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
  test('render inline k8s connector row', async () => {
    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectorsPage
          mockData={{
            data: InlineK8s as any,
            loading: false
          }}
        />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'k8sId'))
    expect(getByText('K8sName')).toBeDefined()
    expect(getByText('error')).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('render git http connector row', async () => {
    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectorsPage
          mockData={{
            data: GitHttp as any,
            loading: false
          }}
        />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'GitHttpId'))
    expect(getByText('GitHttpName')).toBeDefined()
    expect(getByText('error')).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('render docker connector row', async () => {
    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectorsPage
          mockData={{
            data: Docker as any,
            loading: false
          }}
        />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'DockerId'))
    expect(getByText('DockerName')).toBeDefined()
    expect(getByText('error')).toBeDefined()
    expect(getByText('TEST CONNECTION')).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('render active docker connector row', async () => {
    const { container, getByText } = render(
      <TestWrapper path="/account/:accountId/resources/connectors" pathParams={{ accountId: 'dummy' }}>
        <ConnectorsPage
          mockData={{
            data: ActiveDocker as any,
            loading: false
          }}
        />
      </TestWrapper>
    )
    await waitFor(() => queryByText(container, 'DockerId'))
    expect(getByText('DockerName')).toBeDefined()
    expect(getByText('active')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
