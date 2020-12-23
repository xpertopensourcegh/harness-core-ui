import React from 'react'
import { render, waitFor, queryByText, fireEvent } from '@testing-library/react'
import { Formik, FormikForm, Button } from '@wings-software/uikit'
import { renderHook } from '@testing-library/react-hooks'
import { AppStoreContext as StringsContext, AppStoreContextProps } from 'framework/AppStore/AppStoreContext'
import { useStrings } from 'framework/exports'
import strings from 'strings/strings.en.yaml'
import { fillAtForm, InputTypes } from '@common/utils/JestFormHelper'
import { TestWrapper } from '@common/utils/testUtils'
import { getTriggerConfigDefaultProps, triggerConfigInitialValues } from './webhookMockConstants'
import { getValidationSchema } from '../utils/TriggersWizardPageUtils'
import WebhookConditionsPanel from '../views/WebhookConditionsPanel'

const value: AppStoreContextProps = {
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
    <Formik
      enableReinitialize={true}
      initialValues={triggerConfigInitialValues}
      validationSchema={getValidationSchema(result.current.getString)}
      onSubmit={jest.fn()}
    >
      {formikProps => {
        return (
          <TestWrapper>
            <FormikForm>
              <WebhookConditionsPanel {...defaultTriggerConfigDefaultProps} formikProps={formikProps} />
              <Button text="Submit" className="submitButton" type="submit" />
            </FormikForm>
          </TestWrapper>
        )
      }}
    </Formik>
  )
}

describe('WebhookConditionsPanel Triggers tests', () => {
  describe('Renders/snapshots', () => {
    test('Initial Render - Conditions Panel', async () => {
      const { container } = render(<WrapperComponent />)
      await waitFor(() => queryByText(container, result.current.getString('conditions')))
      expect(container).toMatchSnapshot()
    })
  })
  describe('Interactivity', () => {
    test('Add Payload Conditions row', async () => {
      const { container } = render(<WrapperComponent />)

      await waitFor(() => queryByText(container, result.current.getString('conditions')))

      const addButton = queryByText(container, result.current.getString('pipeline-triggers.conditionsPanel.plusAdd'))
      if (!addButton) {
        throw Error('no add button')
      }
      fireEvent.click(addButton)
      expect(result.current.getString('pipeline-triggers.conditionsPanel.attribute')).not.toBeNull()
    })

    test('Delete Payload Conditions row (2nd of 3 rows)', async () => {
      const { container } = render(<WrapperComponent />)

      await waitFor(() => queryByText(container, result.current.getString('conditions')))

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

    test('Source Branch Conditions Row validation with all values or none filled', async () => {
      const { container, getByText } = render(<WrapperComponent />)

      const sourceBranchValue = container.querySelector('[name="sourceBranchValue"]')
      if (!sourceBranchValue) {
        throw Error('No source branch value')
      }

      const targetBranchOperator = container.querySelector('[name="targetBranchOperator"]')
      if (!targetBranchOperator) {
        throw Error('No target branch operator')
      }

      fillAtForm([
        {
          container: container,
          type: InputTypes.SELECT,
          fieldId: 'sourceBranchOperator',
          value: 'not equals'
        },
        {
          container: container,
          type: InputTypes.TEXTFIELD,
          fieldId: 'sourceBranchValue',
          value: ''
        }
      ])
      const submit = document.querySelector('[class*="submitButton"]')
      if (!submit) {
        throw Error('no submit')
      }
      fireEvent.click(submit)
      await waitFor(() =>
        expect(getByText(result.current.getString('pipeline-triggers.validation.matchesValue'))).not.toBeNull()
      )
      fillAtForm([
        {
          container: container,
          type: InputTypes.TEXTFIELD,
          fieldId: 'sourceBranchValue',
          value: 'val'
        }
      ])
      fireEvent.click(submit)
      await waitFor(() => expect(container.querySelector('[class*="bp3-form-helper-text"]')).toBeNull())
    })

    test('Payload Conditions Row validation with all values or none filled', async () => {
      const { container, getByText } = render(<WrapperComponent />)
      const addButton2 = queryByText(container, result.current.getString('pipeline-triggers.conditionsPanel.plusAdd'))

      if (!addButton2) {
        throw Error('no add button')
      }
      fireEvent.click(addButton2)
      await waitFor(() => expect(container.querySelectorAll('[class*="payloadConditions"').length).toEqual(1))

      const sourceBranchValue = container.querySelector('[name="sourceBranchValue"]')
      if (!sourceBranchValue) {
        throw Error('No source branch value')
      }

      const targetBranchOperator = container.querySelector('[name="targetBranchOperator"]')
      if (!targetBranchOperator) {
        throw Error('No target branch operator')
      }

      fillAtForm([
        {
          container: container,
          type: InputTypes.SELECT,
          fieldId: 'payloadConditions.0.operator',
          value: 'not equals'
        }
      ])

      const submit = document.querySelector('[class*="submitButton"]')
      if (!submit) {
        throw Error('no submit')
      }
      fireEvent.click(submit)
      await waitFor(() =>
        expect(getByText(result.current.getString('pipeline-triggers.validation.payloadConditions'))).not.toBeNull()
      )
    })
  })
})
