import React from 'react'
import { MemoryRouter } from 'react-router'
import { render, queryByText } from '@testing-library/react'
import ConnectorDetailsStep from '../ConnectorDetailsStep'

describe('Connector detail step', () => {
  test('render for kubernetes connector', () => {
    const { container } = render(
      <MemoryRouter>
        <ConnectorDetailsStep name="sample-name" type="K8sCluster" />
      </MemoryRouter>
    )
    expect(queryByText(container, 'Give your Kubernetes Connector a name')).not.toBeNull()
    expect(container).toMatchSnapshot()
  })

  test('render for GIT connector', () => {
    const { container } = render(
      <MemoryRouter>
        <ConnectorDetailsStep name="sample-name" type="Git" />
      </MemoryRouter>
    )
    expect(queryByText(container, 'Give your GIT Connector a name')).not.toBeNull()
    expect(container).toMatchSnapshot()
  })
})
