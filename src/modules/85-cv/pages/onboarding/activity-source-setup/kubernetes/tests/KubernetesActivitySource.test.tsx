import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Container } from '@wings-software/uikit'
import * as framework from 'framework/route/RouteMounter'
import KubernetesActivitySource from '../KubernetesActivitySource'

jest.mock('../SelectActivitySource/SelectActivitySource', () => ({
  ...(jest.requireActual('../SelectActivitySource/SelectActivitySource') as object),
  SelectActivitySource: function MockSelectActivitySource(props: any) {
    return <Container className="SelectActivitySource" onClick={() => props.onSubmit()} />
  }
}))
jest.mock('../SelectKubernetesConnector/SelectKubernetesConnector', () => ({
  ...(jest.requireActual('../SelectKubernetesConnector/SelectKubernetesConnector') as object),
  SelectKubernetesConnector: function MockSelectKubernetesConnector(props: any) {
    return <Container className="SelectKubernetesConnector" onClick={() => props.onSubmit()}></Container>
  }
}))
jest.mock('../SelectKubernetesNamespaces/SelectKubernetesNamespaces', () => ({
  ...(jest.requireActual('../SelectKubernetesNamespaces/SelectKubernetesNamespaces') as object),
  SelectKubernetesNamespaces: function MockSelectKubernetesNamespaces(props: any) {
    return (
      <Container className="SelectKubernetesNamespaces" onClick={() => props.onSubmit()}>
        <button id="SelectKubernetesNamespacesPrevious" onClick={() => props.onPrevious()} />
      </Container>
    )
  }
}))

jest.mock('../MapWorkloadsToServices/MapWorkloadsToServices', () => ({
  ...(jest.requireActual('../MapWorkloadsToServices/MapWorkloadsToServices') as object),
  MapWorkloadsToServices: function MapWorkloadsToServices(props: any) {
    return (
      <Container className="MapWorkloadsToServices" onClick={() => props.onSubmit()}>
        <button id="MapWorkloadsToServices" onClick={() => props.onPrevious()} />
      </Container>
    )
  }
}))

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn().mockReturnValue([])
}))

describe('Unit tests for KubernetesActivitySource', () => {
  test('Ensure all tabs are rendered, and tabs can be selected on demand', async () => {
    const mockRouteParams = jest.spyOn(framework, 'useRouteParams')
    mockRouteParams.mockReturnValue({
      params: {
        accountId: 'loading',
        projectIdentifier: '1234_project',
        orgIdentifier: '1234_ORG',
        activitySource: ''
      },
      query: {}
    })
    const { container } = render(<KubernetesActivitySource />)
    await waitFor(() => expect(container.querySelector('[class*="SelectActivitySource"]')))

    const sourceRef = container.querySelector('.SelectActivitySource')
    if (!sourceRef) throw Error('Tabs were not rendered')
    fireEvent.click(sourceRef)

    await waitFor(() => expect(container.querySelector('.SelectKubernetesConnector')).not.toBeNull())

    const connectorRef = container.querySelector('.SelectKubernetesConnector')
    if (!connectorRef) throw Error('Tabs were not rendered')
    fireEvent.click(connectorRef)

    await waitFor(() => expect(container.querySelector('.SelectKubernetesNamespaces')).not.toBeNull())

    const nameSpaceRef = container.querySelector('.SelectKubernetesNamespaces')
    if (!nameSpaceRef) throw Error('Tabs were not rendered')

    const previousButtonNamespace = container.querySelector('#SelectKubernetesNamespacesPrevious')
    if (!previousButtonNamespace) throw Error('Previous button was not rendered namespace.')
    fireEvent.click(previousButtonNamespace)

    const workloadRef = container.querySelector('.MapWorkloadsToServices')
    if (!workloadRef) throw Error('Tabs were not rendered')

    const previousButtonWorkload = container.querySelector('#MapWorkloadsToServices')
    if (!previousButtonWorkload) throw Error('Previous button was not rendered workload.')
    fireEvent.click(previousButtonWorkload)
  })
})
