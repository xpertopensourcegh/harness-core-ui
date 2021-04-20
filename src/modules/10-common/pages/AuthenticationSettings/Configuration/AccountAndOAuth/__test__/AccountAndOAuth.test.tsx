import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import AccountAndOAuth from '@common/pages/AuthenticationSettings/Configuration/AccountAndOAuth/AccountAndOAuth'
import { authSettings } from '@common/pages/AuthenticationSettings/__test__/mock'

const refetchAuthSettings = jest.fn()

describe('AccountAndOAuth', () => {
  let container: HTMLElement

  beforeEach(async () => {
    const renderObj = render(
      <TestWrapper path="/account/:accountId/admin/authentication/configuration" pathParams={{ accountId: 'testAcc' }}>
        <AccountAndOAuth authSettings={authSettings} refetchAuthSettings={refetchAuthSettings} />
      </TestWrapper>
    )
    container = renderObj.container
  })

  test('Login vai AccountAndOAuth', () => {
    expect(container).toMatchSnapshot()
  })
})
