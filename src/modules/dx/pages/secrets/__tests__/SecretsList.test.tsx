import React from 'react'
import { render } from '@testing-library/react'
import { noop } from 'lodash-es'

import { TestWrapper } from 'modules/common/utils/testUtils'
import type { PageSecretResponseWrapper } from 'services/cd-ng'
import SecretsList from '../views/SecretsListView/SecretsList'

import mockData from './secretsListMock.json'

jest.mock('react-timeago', () => () => 'dummy date')

describe('Secrets List', () => {
  test('render', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId/resources/secrets" pathParams={{ accountId: 'dummy' }}>
        <SecretsList secrets={mockData as PageSecretResponseWrapper} gotoPage={noop} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
    expect(container.querySelectorAll('div.row').length).toBe(4)
  })
})
