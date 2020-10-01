import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import type { ConnectorInfoDTO } from 'services/cd-ng'
import SavedConnectorDetails from '../SavedConnectorDetails'
import { Vault, Docker, GitHttp, InlineK8s, ManualK8s } from '../../../__tests__/mockData'

describe('Saved Connector Details', () => {
  test('render for Inline K8s schema', async () => {
    const { container, getByText } = render(
      <SavedConnectorDetails connector={InlineK8s.data.content[0].connector as ConnectorInfoDTO} />
    )
    await waitFor(() => queryByText(container, 'K8sName'))
    expect(getByText('K8sName')).toBeDefined()
    expect(getByText('Harness Delegate running In-Cluster')).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('render for Manual K8s schema', async () => {
    const { container, getByText } = render(
      <SavedConnectorDetails connector={ManualK8s.data.content[0].connector as ConnectorInfoDTO} />
    )
    await waitFor(() => queryByText(container, 'k8sId'))
    expect(getByText('K8sName')).toBeDefined()
    expect(getByText('Harness Delegate running Out-of-Cluster')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
  test('render for GitHttp schema', async () => {
    const { container, getByText } = render(
      <SavedConnectorDetails connector={GitHttp.data.content[0].connector as ConnectorInfoDTO} />
    )
    await waitFor(() => queryByText(container, 'GitHttpId'))
    expect(getByText('GitHttpName')).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('render for Docker schema', async () => {
    const { container, getByText } = render(
      <SavedConnectorDetails connector={Docker.data.content[0].connector as ConnectorInfoDTO} />
    )
    await waitFor(() => queryByText(container, 'DockerId'))
    expect(getByText('DockerName')).toBeDefined()
    expect(container).toMatchSnapshot()
  })

  test('render for Vault schema', async () => {
    const { container, getByText } = render(
      <SavedConnectorDetails connector={Vault.data.content[0].connector as ConnectorInfoDTO} />
    )
    await waitFor(() => queryByText(container, 'VaultId'))
    expect(getByText('VaultName')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
