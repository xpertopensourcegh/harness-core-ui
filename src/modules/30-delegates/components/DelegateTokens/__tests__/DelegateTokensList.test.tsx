import React from 'react'
import { render } from '@testing-library/react'
import type { DelegateTokenDetails } from 'services/portal'
import { TestWrapper } from '@common/utils/testUtils'
import DelegateTokensList from '../DelegateTokensList'

const mockTokens: DelegateTokenDetails[] = [
  {
    accountId: 'dsaddefrfr',
    createdAt: 4342354343553,
    createdBy: { name: 'Admin' },
    identifier: 'dsfevrwv',
    name: 'Token 1',
    status: 'ACTIVE',
    uuid: 'debterbteb',
    value: 'fjon2kjh3rl4'
  }
]

jest.mock('@common/exports', () => ({}))

jest.mock('services/portal', () => ({}))

jest.mock('services/cd-ng', () => ({}))

describe('Delegate Tokens list', () => {
  test('render delegate token list', async () => {
    const { container } = render(
      <TestWrapper>
        <DelegateTokensList delegateTokens={mockTokens} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
