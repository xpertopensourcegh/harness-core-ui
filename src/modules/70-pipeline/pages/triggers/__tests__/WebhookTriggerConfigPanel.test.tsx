import React from 'react'
import { render, waitFor, queryByText } from '@testing-library/react'
import { Formik, FormikForm } from '@wings-software/uicore'
import { renderHook } from '@testing-library/react-hooks'
import { InputTypes, setFieldValue, fillAtForm } from '@common/utils/JestFormHelper'

import { AppStoreContext as StringsContext, AppStoreContextProps } from 'framework/AppStore/AppStoreContext'
import { useStrings } from 'framework/exports'
import strings from 'strings/strings.en.yaml'
import { getTriggerConfigDefaultProps, triggerConfigInitialValues } from './webhookMockConstants'
import { GetSourceRepoToEventResponse, GetActionsListResponse } from './webhookMockResponses'
import WebhookTriggerConfigPanel from '../views/WebhookTriggerConfigPanel'

const useGetActionsList = jest.fn()
jest.mock('services/pipeline-ng', () => ({
  useGetSourceRepoToEvent: jest.fn(() => GetSourceRepoToEventResponse),
  useGetActionsList: jest.fn(args => {
    useGetActionsList(args)
    return GetActionsListResponse
  })
}))

const value: AppStoreContextProps = {
  strings,
  featureFlags: {},
  updateAppStore: jest.fn()
}

const defaultTriggerConfigDefaultProps = getTriggerConfigDefaultProps({})

const wrapper = ({ children }: React.PropsWithChildren<{}>): React.ReactElement => (
  <StringsContext.Provider value={value}>{children}</StringsContext.Provider>
)
const { result } = renderHook(() => useStrings(), { wrapper })

function WrapperComponent(): JSX.Element {
  return (
    <Formik initialValues={triggerConfigInitialValues} onSubmit={() => undefined}>
      {formikProps => (
        <FormikForm>
          <StringsContext.Provider value={value}>
            <WebhookTriggerConfigPanel {...defaultTriggerConfigDefaultProps} formikProps={formikProps} />
          </StringsContext.Provider>
        </FormikForm>
      )}
    </Formik>
  )
}

describe('WebhookTriggerConfigPanel Triggers tests', () => {
  describe('Renders/snapshots', () => {
    test('Initial Render - Trigger Configuration Panel', async () => {
      const { container } = render(<WrapperComponent />)
      await waitFor(() =>
        queryByText(
          container,
          result.current.getString('pipeline-triggers.triggerConfigurationPanel.listenOnNewWebhook')
        )
      )
      expect(container).toMatchSnapshot()
    })
  })
  describe('Interactivity', () => {
    test('Selecting Any Actions checkbox disables Actions Select box', async () => {
      const { container } = render(<WrapperComponent />)
      await waitFor(() =>
        queryByText(
          container,
          result.current.getString('pipeline-triggers.triggerConfigurationPanel.listenOnNewWebhook')
        )
      )
      fillAtForm([
        {
          container: container,
          type: InputTypes.SELECT,
          fieldId: 'sourceRepo',
          value: 'GITHUB'
        },
        {
          container: container,
          type: InputTypes.SELECT,
          fieldId: 'event',
          value: 'Pull Request'
        }
      ])
      await waitFor(() => expect(container.querySelector('[name="actions"]')).not.toBeNull())

      expect(container.querySelector('[name="actions"]')).toHaveProperty('disabled', false)
      setFieldValue({ type: InputTypes.CHECKBOX, container: container, fieldId: 'anyAction' })
      await waitFor(() => expect(container.querySelector('[name="actions"]')).toHaveProperty('disabled', true))

      setFieldValue({ type: InputTypes.CHECKBOX, container: container, fieldId: 'anyAction' })
      await waitFor(() => expect(container.querySelector('[name="actions"]')).toHaveProperty('disabled', false))
    })
  })
})
