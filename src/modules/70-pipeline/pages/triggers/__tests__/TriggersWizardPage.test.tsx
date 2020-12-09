import React from 'react'
import { render, waitFor, queryByText, fireEvent } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { AppStoreContext as StringsContext, AppStoreContextProps } from 'framework/AppStore/AppStoreContext'
import { useStrings } from 'framework/exports'
import strings from 'strings/strings.en.yaml'
import {
  GetSourceRepoToEventResponse,
  GetActionsListResponse,
  GetTriggerResponse,
  updateTriggerMockResponseYaml
} from './webhookMockResponses'
import {
  GetPipelineResponse,
  GetTemplateFromPipelineResponse,
  GetMergeInputSetFromPipelineTemplateWithListInputResponse,
  ConnectorResponse,
  GetInputSetsResponse
} from './sharedMockResponses'
import TriggersWizardPage from '../TriggersWizardPage'

const useGetActionsList = jest.fn()
const mockUpdate = jest.fn().mockReturnValue(Promise.resolve({ data: {}, status: {} }))
jest.mock('services/cd-ng', () => ({
  useGetSourceRepoToEvent: jest.fn(() => GetSourceRepoToEventResponse),
  useGetPipeline: jest.fn(() => GetPipelineResponse),
  useGetTemplateFromPipeline: jest.fn(() => GetTemplateFromPipelineResponse),
  useGetMergeInputSetFromPipelineTemplateWithListInput: jest.fn(
    () => GetMergeInputSetFromPipelineTemplateWithListInputResponse
  ),
  useGetTrigger: jest.fn(() => GetTriggerResponse),
  useCreateTrigger: jest.fn(() => GetTriggerResponse),
  useUpdateTrigger: jest.fn().mockImplementation(() => ({ mutate: mockUpdate })),
  useGetConnector: jest.fn(() => ConnectorResponse),
  useGetInputSetsListForPipeline: jest.fn(() => GetInputSetsResponse),
  useGetActionsList: jest.fn(args => {
    useGetActionsList(args)
    return GetActionsListResponse
  })
}))

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => {
    return {
      projectIdentifier: 'projectIdentifier',
      orgIdentifier: 'orgIdentifier',
      accountId: 'accountId',
      triggerIdentifier: 'triggerIdentifier' // means this is edit mode
    }
  }),
  useHistory: jest.fn(() => {
    return {
      push: jest.fn(),
      location: {
        search: '' // edit mode otherwise e.g. "?triggerType=Webhook&sourceRepo=GITHUB"
      }
    }
  })
}))

const value: AppStoreContextProps = {
  projects: [],
  organisationsMap: new Map(),
  user: {},
  strings,
  updateAppStore: jest.fn()
}

const wrapper = ({ children }: React.PropsWithChildren<{}>): React.ReactElement => (
  <StringsContext.Provider value={value}>{children}</StringsContext.Provider>
)
const { result } = renderHook(() => useStrings(), { wrapper })

function WrapperComponent(): JSX.Element {
  return (
    <StringsContext.Provider value={value}>
      <TriggersWizardPage />
    </StringsContext.Provider>
  )
}

describe('TriggersWizardPage Triggers tests', () => {
  describe('Renders/snapshots', () => {
    test('OnEdit Render - Show all fields filled', async () => {
      render(<WrapperComponent />)
      await waitFor(() => expect(() => queryByText(document.body, 'Loading, please wait...')).toBeDefined())
      await waitFor(() =>
        expect(() =>
          queryByText(document.body, result.current.getString('pipeline-triggers.listenOnNewWebhook'))
        ).not.toBeNull()
      )
      expect(document.body).toMatchSnapshot()
    })
  })
  describe('Payload/Values Comparison', () => {
    test('Submit shows all onEdit values were parsed into FormikValues for re-submission', async () => {
      const { container } = render(<WrapperComponent />)
      await waitFor(() =>
        queryByText(container, result.current.getString('pipeline-triggers.triggerConfigurationLabel'))
      )

      const tab3 = document.body.querySelector('[class*="bp3-tab-list"] [data-tab-id="Pipeline Input"]')
      if (!tab3) {
        throw Error('No Pipeline Input tab')
      }
      fireEvent.click(tab3)
      await waitFor(() => expect(result.current.getString('pipeline-triggers.updateTrigger')).not.toBeNull())
      const updateButton = queryByText(container, result.current.getString('pipeline-triggers.updateTrigger'))
      if (!updateButton) {
        throw Error('Cannot find Update Trigger button')
      }

      fireEvent.click(updateButton)
      await waitFor(() => expect(mockUpdate).toHaveBeenCalledTimes(1))
      expect(mockUpdate).toBeCalledWith(updateTriggerMockResponseYaml)
    })
  })
})
