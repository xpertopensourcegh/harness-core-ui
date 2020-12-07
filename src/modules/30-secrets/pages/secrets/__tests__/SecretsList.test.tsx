import React from 'react'
import { act, fireEvent, getByText, queryByText, render, RenderResult, waitFor } from '@testing-library/react'
import { noop } from 'lodash-es'

import { findDialogContainer, findPopoverContainer, TestWrapper } from '@common/utils/testUtils'
import type { PageSecretResponseWrapper } from 'services/cd-ng'
import SecretsList from '../views/SecretsListView/SecretsList'

import mockData from './secretsListMock.json'

jest.mock('react-timeago', () => () => 'dummy date')

describe('Secrets List', () => {
  let container: HTMLElement
  let getAllByText: RenderResult['getAllByText']
  beforeEach(async () => {
    const renderObj = render(
      <TestWrapper path="/account/:accountId/resources/secrets" pathParams={{ accountId: 'dummy' }}>
        <SecretsList secrets={mockData.data as PageSecretResponseWrapper} gotoPage={noop} />
      </TestWrapper>
    )
    container = renderObj.container
    getAllByText = renderObj.getAllByText
  }),
    test('render', async () => {
      expect(container).toMatchSnapshot()
      expect(container.querySelectorAll('div.row').length).toBe(4)
    }),
    test('Edit', async () => {
      const menu = container?.querySelectorAll("[id='Options_svg__a']")[0]
      fireEvent.click(menu!)
      const popover = findPopoverContainer()
      const edit = getByText(popover as HTMLElement, 'Edit')
      await act(async () => {
        fireEvent.click(edit)
      })
      expect(container).toMatchSnapshot()
    }),
    test('Delete', async () => {
      const menu = container?.querySelectorAll("[id='Options_svg__a']")[0]
      fireEvent.click(menu!)
      const popover = findPopoverContainer()
      const deleteButton = getByText(popover as HTMLElement, 'Delete')
      await act(async () => {
        fireEvent.click(deleteButton)
        await waitFor(() => getByText(document.body, 'Delete Secret'))
        const form = findDialogContainer()
        expect(form).toBeTruthy()
        const deleteBtn = queryByText(form as HTMLElement, 'Delete')
        fireEvent.click(deleteBtn!)
      })
      expect(container).toMatchSnapshot()
    })
  test('Verify Connection', async () => {
    const testConnection = getAllByText('TEST CONNECTION')[0]
    let form = findDialogContainer()
    await act(async () => {
      fireEvent.click(testConnection)
      await waitFor(() => getByText(document.body, 'Test Connection'))
    })
    form = findDialogContainer()
    expect(form).toBeTruthy()
    await act(async () => {
      fireEvent.click(form?.querySelector('[icon="cross"]')!)
    })
    form = findDialogContainer()
    expect(form).not.toBeTruthy()
  })
})
