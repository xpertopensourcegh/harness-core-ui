import React from 'react'
import { render, waitFor, queryByText, fireEvent } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { ModalProvider } from '@wings-software/uicore'
import { AppStoreContext as StringsContext, AppStoreContextProps } from 'framework/AppStore/AppStoreContext'
import { useStrings } from 'framework/exports'
import strings from 'strings/strings.en.yaml'
import { GetTriggerResponse } from './webhookMockResponses'
import { GetPipelineResponse, GetTriggerListForTargetResponse } from './sharedMockResponses'
import TriggersPage from '../TriggersPage'

const mockDelete = jest.fn().mockReturnValue(Promise.resolve({ data: {}, status: {} }))
const mockUpdateTriggerStatus = jest.fn().mockReturnValue(Promise.resolve({ data: {}, status: {} }))
const mockRedirecToWizard = jest.fn()
const mockGetTriggersFunction = jest.fn()
jest.mock('services/pipeline-ng', () => ({
  useGetPipeline: jest.fn(() => GetPipelineResponse),
  useGetTriggerListForTarget: jest.fn(args => {
    mockGetTriggersFunction(args)
    return GetTriggerListForTargetResponse
  }),
  useGetTrigger: jest.fn(() => GetTriggerResponse),
  useDeleteTrigger: jest.fn().mockImplementation(() => ({ mutate: mockDelete })),
  useUpdateTriggerStatus: jest.fn().mockImplementation(() => ({ mutate: mockUpdateTriggerStatus }))
}))

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => {
    return {
      projectIdentifier: 'projectIdentifier',
      orgIdentifier: 'orgIdentifier',
      accountId: 'accountId',
      pipelineIdentifier: 'pipelineIdentifier'
    }
  }),
  useHistory: jest.fn(() => {
    mockRedirecToWizard()
    return { push: jest.fn() }
  })
}))

jest.mock('react-timeago', () => () => 'dummy date')

const value: AppStoreContextProps = {
  strings,
  featureFlags: {},
  updateAppStore: jest.fn()
}

const wrapper = ({ children }: React.PropsWithChildren<{}>): React.ReactElement => (
  <StringsContext.Provider value={value}>{children}</StringsContext.Provider>
)
const { result } = renderHook(() => useStrings(), { wrapper })

function WrapperComponent(): JSX.Element {
  return (
    <StringsContext.Provider value={value}>
      <TriggersPage />
    </StringsContext.Provider>
  )
}

describe('TriggersPage Triggers tests', () => {
  describe('Renders/snapshots', () => {
    test('Initial Render - Shows Trigger List', async () => {
      render(
        <ModalProvider>
          <WrapperComponent />
        </ModalProvider>
      )
      await waitFor(() =>
        expect(result.current.getString('pipeline-triggers.triggerLabel').toUpperCase()).not.toBeNull()
      )
      // eslint-disable-next-line no-document-body-snapshot
      expect(document.body).toMatchSnapshot()
    })
  })
  describe('Interactivity', () => {
    test('Delete a trigger', async () => {
      const { container } = render(
        <ModalProvider>
          <WrapperComponent />
        </ModalProvider>
      )
      await waitFor(() =>
        expect(result.current.getString('pipeline-triggers.triggerLabel').toUpperCase()).not.toBeNull()
      )
      const firstActionButton = container.querySelectorAll('[class*="actionButton"]')?.[0]
      if (!firstActionButton) {
        throw Error('No action button')
      }
      fireEvent.click(firstActionButton)

      const deleteButton = queryByText(document.body, result.current.getString('delete'))

      if (!deleteButton) {
        throw Error('No error button')
      }
      fireEvent.click(deleteButton)
      await waitFor(() => expect(result.current.getString('pipeline-triggers.confirmDelete')).not.toBeNull())

      const confirmDeleteButton = document.body.querySelector('[class*="bp3-dialog-footer"] [class*="intent-primary"]')
      if (!confirmDeleteButton) {
        throw Error('No error button')
      }
      fireEvent.click(confirmDeleteButton)

      expect(mockDelete).toBeCalledWith('AllValues', { headers: { 'content-type': 'application/json' } })
    })

    test('Edit a trigger redirects to Trigger Wizard', async () => {
      const { container } = render(
        <ModalProvider>
          <WrapperComponent />
        </ModalProvider>
      )
      await waitFor(() =>
        expect(result.current.getString('pipeline-triggers.triggerLabel').toUpperCase()).not.toBeNull()
      )
      const firstActionButton = container.querySelectorAll('[class*="actionButton"]')?.[0]
      if (!firstActionButton) {
        throw Error('No action button')
      }
      fireEvent.click(firstActionButton)

      const editButton = queryByText(document.body, result.current.getString('edit'))

      if (!editButton) {
        throw Error('No edit button')
      }
      fireEvent.click(editButton)
      expect(mockRedirecToWizard).toBeCalled()
    })

    test('Add a trigger redirects to Trigger Wizard', async () => {
      const { container } = render(
        <StringsContext.Provider value={value}>
          <ModalProvider>
            <TriggersPage />
          </ModalProvider>
        </StringsContext.Provider>
      )
      await waitFor(() =>
        expect(result.current.getString('pipeline-triggers.triggerLabel').toUpperCase()).not.toBeNull()
      )
      const addTriggerButton = queryByText(container, result.current.getString('pipeline-triggers.newTrigger'))
      if (!addTriggerButton) {
        throw Error('No action button')
      }
      fireEvent.click(addTriggerButton)

      expect(mockRedirecToWizard).toBeCalled()
    })

    test('Search for a trigger shows filtered results', async () => {
      const { container } = render(
        <ModalProvider>
          <WrapperComponent />
        </ModalProvider>
      )
      await waitFor(() =>
        expect(result.current.getString('pipeline-triggers.triggerLabel').toUpperCase()).not.toBeNull()
      )
      const searchInput = container.querySelector('[data-name="search"]')
      if (!searchInput) {
        throw Error('No search input')
      }
      fireEvent.change(searchInput, { target: { value: 'test1' } })

      expect(mockGetTriggersFunction).toBeCalledWith({
        debounce: 300,
        queryParams: {
          projectIdentifier: 'projectIdentifier',
          orgIdentifier: 'orgIdentifier',
          accountIdentifier: 'accountId',
          targetIdentifier: 'pipelineIdentifier',
          searchTerm: 'test1'
        }
      })
    })
  })
})
