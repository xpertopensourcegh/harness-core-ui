import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { Formik, FormikForm } from '@wings-software/uicore'
import { renderHook } from '@testing-library/react-hooks'
import type { UseGetReturn, UseMutateReturn } from 'restful-react'
import { AppStoreContext as StringsContext, AppStoreContextProps } from 'framework/AppStore/AppStoreContext'
import * as pipelineNg from 'services/pipeline-ng'
import { useStrings } from 'framework/exports'
import strings from 'strings/strings.en.yaml'
import {
  GetTemplateFromPipelineResponse,
  GetTemplateFromPipelineResponseEmpty,
  GetMergeInputSetFromPipelineTemplateWithListInputResponse,
  ConnectorResponse,
  GetInputSetsResponse
} from './sharedMockResponses'
import { getTriggerConfigDefaultProps, pipelineInputInitialValues } from './webhookMockConstants'
import WebhookPipelineInputPanel from '../views/WebhookPipelineInputPanel'
jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))
const value: AppStoreContextProps = {
  strings,
  featureFlags: {},
  updateAppStore: jest.fn()
}

const mockRedirecToWizard = jest.fn()
jest.mock('services/cd-ng', () => ({
  useGetConnector: jest.fn(() => ConnectorResponse)
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
    test('Initial Render - Pipeline Input Panel with no inputs', async () => {
      jest
        .spyOn(pipelineNg, 'useGetTemplateFromPipeline')
        .mockReturnValue(GetTemplateFromPipelineResponseEmpty as UseGetReturn<any, any, any, any>)

      jest.spyOn(pipelineNg, 'useGetMergeInputSetFromPipelineTemplateWithListInput').mockReturnValue({
        mutate: jest.fn().mockReturnValue(GetMergeInputSetFromPipelineTemplateWithListInputResponse) as unknown
      } as UseMutateReturn<any, any, any, any, any>)

      jest
        .spyOn(pipelineNg, 'useGetInputSetsListForPipeline')
        .mockReturnValue(GetInputSetsResponse as UseGetReturn<any, any, any, any>)

      const { container } = render(<WrapperComponent />)
      expect(result.current.getString('pipeline-triggers.pipelineInputLabel')).not.toBeNull()
      await waitFor(() => expect('stage-1').not.toBeNull())
      expect(container).toMatchSnapshot()
    })

    test('Initial Render - Pipeline Input Panel with two runtime inputs', async () => {
      jest
        .spyOn(pipelineNg, 'useGetTemplateFromPipeline')
        .mockReturnValue(GetTemplateFromPipelineResponse as UseGetReturn<any, any, any, any>)

      jest.spyOn(pipelineNg, 'useGetMergeInputSetFromPipelineTemplateWithListInput').mockReturnValue({
        mutate: jest.fn().mockReturnValue(GetMergeInputSetFromPipelineTemplateWithListInputResponse) as unknown
      } as UseMutateReturn<any, any, any, any, any>)

      jest
        .spyOn(pipelineNg, 'useGetInputSetsListForPipeline')
        .mockReturnValue(GetInputSetsResponse as UseGetReturn<any, any, any, any>)

      const { container } = render(<WrapperComponent />)
      expect(result.current.getString('pipeline-triggers.pipelineInputLabel')).not.toBeNull()
      await waitFor(() => expect('stage-1').not.toBeNull())
      expect(container).toMatchSnapshot()
    })
  })
})
