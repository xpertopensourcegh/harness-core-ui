import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { Formik, FormikForm } from '@wings-software/uikit'
import { renderHook } from '@testing-library/react-hooks'
import { AppStoreContext as StringsContext, AppStoreContextProps } from 'framework/AppStore/AppStoreContext'
import { useStrings } from 'framework/exports'
import strings from 'strings/strings.en.yaml'
import {
  GetTemplateFromPipelineResponse,
  GetMergeInputSetFromPipelineTemplateWithListInputResponse,
  ConnectorResponse,
  GetInputSetsResponse
} from './sharedMockResponses'
import { getTriggerConfigDefaultProps, pipelineInputInitialValues } from './webhookMockConstants'
import WebhookPipelineInputPanel from '../views/WebhookPipelineInputPanel'

const value: AppStoreContextProps = {
  projects: [],
  strings,
  updateAppStore: jest.fn()
}

const mockRedirecToWizard = jest.fn()
jest.mock('services/cd-ng', () => ({
  useGetConnector: jest.fn(() => ConnectorResponse)
}))
jest.mock('services/pipeline-ng', () => ({
  useGetTemplateFromPipeline: jest.fn(() => GetTemplateFromPipelineResponse),
  useGetMergeInputSetFromPipelineTemplateWithListInput: jest.fn(
    () => GetMergeInputSetFromPipelineTemplateWithListInputResponse
  ),
  useGetInputSetsListForPipeline: jest.fn(() => GetInputSetsResponse)
}))
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => {
    return {
      projectIdentifier: 'projectIdentifier',
      orgIdentifier: 'orgIdentifier',
      accountId: 'accountId'
    }
  }),
  useHistory: jest.fn(() => {
    mockRedirecToWizard()
    return { push: jest.fn() }
  })
}))

const defaultTriggerConfigDefaultProps = getTriggerConfigDefaultProps({})

const wrapper = ({ children }: React.PropsWithChildren<{}>): React.ReactElement => (
  <StringsContext.Provider value={value}>{children}</StringsContext.Provider>
)
const { result } = renderHook(() => useStrings(), { wrapper })

function WrapperComponent(): JSX.Element {
  return (
    <Formik initialValues={pipelineInputInitialValues} onSubmit={() => undefined}>
      {formikProps => (
        <FormikForm>
          <StringsContext.Provider value={value}>
            <WebhookPipelineInputPanel {...defaultTriggerConfigDefaultProps} formikProps={formikProps} />
          </StringsContext.Provider>
        </FormikForm>
      )}
    </Formik>
  )
}

describe('WebhookPipelineInputPanel Triggers tests', () => {
  describe('Renders/snapshots', () => {
    test('Initial Render - Pipeline Input Panel with two runtime inputs', async () => {
      const { container } = render(<WrapperComponent />)
      expect(result.current.getString('pipeline-triggers.pipelineInputLabel')).not.toBeNull()
      await waitFor(() => expect('stage-1').not.toBeNull())
      expect(container).toMatchSnapshot()
    })
  })
})
