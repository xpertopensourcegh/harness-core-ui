import React from 'react'
import { render, waitFor, queryByText, fireEvent } from '@testing-library/react'
import { Formik, FormikForm } from '@wings-software/uikit'
import { renderHook } from '@testing-library/react-hooks'
import { AppStoreContext as StringsContext, AppStoreContextProps } from 'framework/AppStore/AppStoreContext'
import { useStrings } from 'framework/exports'
import strings from 'strings/strings.en.yaml'
import { getTriggerConfigDefaultProps, triggerConfigInitialValues } from './webhookMockConstants'
import WebhookConditionsPanel from '../views/WebhookConditionsPanel'

const value: AppStoreContextProps = {
  projects: [],
  strings,
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
            <WebhookConditionsPanel {...defaultTriggerConfigDefaultProps} formikProps={formikProps} />
          </StringsContext.Provider>
        </FormikForm>
      )}
    </Formik>
  )
}

describe('WebhookConditionsPanel Triggers tests', () => {
  describe('Renders/snapshots', () => {
    test('Initial Render - Conditions Panel', async () => {
      const { container } = render(<WrapperComponent />)
      await waitFor(() => queryByText(container, result.current.getString('pipeline-triggers.conditionsLabel')))
      expect(container).toMatchSnapshot()
    })
  })
  describe('Interactivity', () => {
    test('Add Payload Conditions row', async () => {
      const { container } = render(<WrapperComponent />)

      await waitFor(() => queryByText(container, result.current.getString('pipeline-triggers.conditionsLabel')))

      const addButton = queryByText(container, result.current.getString('pipeline-triggers.conditionsPanel.plusAdd'))
      if (!addButton) {
        throw Error('no add button')
      }
      fireEvent.click(addButton)
      expect(result.current.getString('pipeline-triggers.conditionsPanel.attribute')).not.toBeNull()
    })

    test('Delete Payload Conditions row (2nd of 3 rows)', async () => {
      const { container } = render(<WrapperComponent />)

      await waitFor(() => queryByText(container, result.current.getString('pipeline-triggers.conditionsLabel')))

      const addButton = queryByText(container, result.current.getString('pipeline-triggers.conditionsPanel.plusAdd'))
      if (!addButton) {
        throw Error('no add button')
      }
      fireEvent.click(addButton)
      expect(result.current.getString('pipeline-triggers.conditionsPanel.attribute')).not.toBeNull()
      await waitFor(() => expect(container.querySelectorAll('[class*="payloadConditions"').length).toEqual(1))

      const addButton2 = queryByText(container, result.current.getString('pipeline-triggers.conditionsPanel.plusAdd'))
      if (!addButton2) {
        throw Error('no add button')
      }
      fireEvent.click(addButton2)
      await waitFor(() => expect(container.querySelectorAll('[class*="payloadConditions"').length).toEqual(2))

      const addButton3 = queryByText(container, result.current.getString('pipeline-triggers.conditionsPanel.plusAdd'))
      if (!addButton3) {
        throw Error('no add button')
      }
      fireEvent.click(addButton3)
      await waitFor(() => expect(container.querySelectorAll('[class*="payloadConditions"').length).toEqual(3))
      const firstAttributeInput = document.body.querySelector('[name="payloadConditions.0.key"]')
      const thirdAttributeInput = document.body.querySelector('[name="payloadConditions.2.key"]')
      if (!firstAttributeInput || !thirdAttributeInput) {
        throw Error('missing attribute input')
      }

      fireEvent.change(firstAttributeInput, { target: { value: 'attribute1' } })
      fireEvent.change(thirdAttributeInput, { target: { value: 'attribute3' } })
      expect('attribute1').not.toBeNull()
      expect('attribute2').not.toBeNull()
      expect('attribute3').not.toBeNull()

      const middleDeleteButton = document.body.querySelectorAll('[data-name="main-delete"]')[1]
      if (!middleDeleteButton) {
        throw Error('no delete button')
      }
      fireEvent.click(middleDeleteButton)

      await waitFor(() => expect(container.querySelectorAll('[class*="payloadConditions"').length).toEqual(2))
      expect('attribute1').not.toBeNull()
      expect('attribute3').not.toBeNull()
    })
  })
})
