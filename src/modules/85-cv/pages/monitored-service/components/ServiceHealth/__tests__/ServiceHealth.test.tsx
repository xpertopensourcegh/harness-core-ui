import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import ServiceHealth from '../ServiceHealth'
import type { ServiceHealthProps } from '../ServiceHealth.types'

const WrapperComponent = (props: ServiceHealthProps): JSX.Element => {
  return (
    <TestWrapper>
      <ServiceHealth {...props} />
    </TestWrapper>
  )
}

describe('Unit tests for ServiceHealth', () => {
  test('Verify if all the fields are rendered correctly inside ServiceHealth', async () => {
    const props = { currentHealthScore: { riskStatus: 'MEDIUM', healthScore: 100 } }
    const { container } = render(<WrapperComponent {...props} />)
    expect(container).toMatchSnapshot()
  })
})
