import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import Delegates4Ways from '../Delegates4Ways'

const onSelect = jest.fn()

const selectCardData = [
  {
    text: 'Runs Harness Delegate as a Docker container on any Linux or Mac',
    value: 'service-docker',
    icon: 'docker-icon',
    name: 'Docker',
    type: 'DOCKER'
  },
  {
    text: 'Runs Harness Delegate as a Kubernetes',
    value: 'service-k8s',
    icon: 'k8s-icon',
    name: 'Kubernetes',
    type: 'K8sCluster'
  }
]

describe('Render Delegates4Ways', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper>
        <Delegates4Ways onSelect={onSelect} selectedCard={selectCardData[0]} selectCardData={selectCardData} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
