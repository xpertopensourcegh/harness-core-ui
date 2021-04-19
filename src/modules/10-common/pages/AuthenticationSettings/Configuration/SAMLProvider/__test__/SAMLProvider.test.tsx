import React from 'react'
import { RenderResult, render, act, fireEvent, waitFor, queryByText } from '@testing-library/react'
import { TestWrapper, findDialogContainer } from '@common/utils/testUtils'
import SAMLProvider from '@common/pages/AuthenticationSettings/Configuration/SAMLProvider/SAMLProvider'
import routes from '@common/RouteDefinitions'
import { accountPathProps } from '@common/utils/routeUtils'

describe('SAML Provider', () => {
  let container: HTMLElement
  let getByText: RenderResult['getByText']

  beforeEach(async () => {
    const renderObj = render(
      <TestWrapper
        path={routes.toAuthenticationSettings({ ...accountPathProps })}
        pathParams={{ accountId: 'testAcc' }}
      >
        <SAMLProvider />
      </TestWrapper>
    )
    container = renderObj.container
    getByText = renderObj.getByText
  })

  test('SAML Providers list', () => {
    expect(container).toMatchSnapshot()
  }),
    test('Add SAML Provider', async () => {
      const addSAMLProvider = getByText('common.authSettings.SAMLProvider')
      expect(addSAMLProvider).toBeTruthy()
      act(() => {
        fireEvent.click(addSAMLProvider!)
      })

      await waitFor(() => queryByText(document.body, 'common.samlProvider.addSAMLProvider'))
      const form = findDialogContainer()
      expect(form).toBeTruthy()
    })
})
