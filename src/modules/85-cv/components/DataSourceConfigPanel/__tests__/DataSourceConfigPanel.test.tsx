import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Formik } from 'formik'
import xhr from '@wings-software/xhr-async'
import { FormikForm, Button, FormInput, CollapseList } from '@wings-software/uicore'
import DataSourceConfigPanel from '../DataSourceConfigPanel'
import i18n from '../DataSourceConfigPanel.i18n'

jest.mock('@wings-software/xhr-async', () => ({
  put: jest.fn().mockReturnValue({})
}))

const onRemoveCallback = jest.fn()

function MockForm(props: any): JSX.Element {
  const { validateCallback } = props
  return (
    <Formik onSubmit={() => undefined} initialValues={{ dsConfigs: [{}] }}>
      {formikProps => (
        <FormikForm className="mockForm">
          <CollapseList defaultOpenIndex={0}>
            <DataSourceConfigPanel
              entityName="solo"
              index={0}
              orgId={'123'}
              onRemove={onRemoveCallback}
              validateConfig={validateCallback}
              touched={formikProps.touched}
              values={formikProps.values}
              setFieldError={formikProps.setFieldError}
              setFieldTouched={formikProps.setFieldTouched}
            >
              <FormInput.Text
                name="dsConfigs[0].someField"
                className="someField"
                onChange={() => formikProps.setFieldTouched('dsConfigs[0].somefield', true)}
              />
              <Button
                className="invalidButton"
                onClick={() => formikProps.setFieldError('dsConfigs[0].someField', 'some invalid field value')}
              >
                Invalid Button
              </Button>
            </DataSourceConfigPanel>
          </CollapseList>
        </FormikForm>
      )}
    </Formik>
  )
}

describe('DataSourceConfigPanel unit tests', () => {
  let windowSpy: jest.SpyInstance
  beforeAll(() => {
    windowSpy = jest.spyOn(window, 'confirm')
    windowSpy.mockImplementation(() => true)
  })
  afterAll(() => {
    windowSpy.mockRestore()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('Ensure DataSource panel displays correct message when form is invalid', async () => {
    const { container, getByText } = render(<MockForm validateCallback={() => ({ someField: 'isInvalid' })} />)
    fireEvent.click(getByText('Save'))
    expect(container.querySelector('.mockForm')).not.toBeNull()
    getByText(i18n.editingMessage)

    const leftSection = container.querySelector('[class*="leftSection"] [class*="panelName"]')
    if (!leftSection) {
      throw Error('Left section was not rendered.')
    }

    fireEvent.click(leftSection)
    await waitFor(() => getByText(i18n.invalidMessage))
  })

  test('Ensure DataSource panel displays correct message when form saves successfully', async () => {
    const { getByText } = render(<MockForm />)
    fireEvent.click(getByText('Save'))
    await waitFor(() => expect(xhr.put).toBeCalledTimes(1))
    getByText(i18n.successMessage)
  })

  test('Ensure that delete confirm is not displayed when no changes are done', async () => {
    const { container } = render(<MockForm />)
    const closeButton = container.querySelector('button[class*="bp3-minimal"]')
    if (!closeButton) {
      throw Error('close button was not rendered.')
    }

    fireEvent.click(closeButton)
    expect(onRemoveCallback).toBeCalledTimes(1)
    expect(onRemoveCallback).toHaveBeenCalledWith(0)
  })

  test('Ensure that delete confirm is displayed when changes are made', async () => {
    const { container, getByText } = render(<MockForm />)
    const closeButton = container.querySelector('button[class*="bp3-minimal"]')
    if (!closeButton) {
      throw Error('close button was not rendered.')
    }

    const someFieldTextField = container.querySelector('[class*="someField"] input')
    if (!someFieldTextField) {
      throw Error('form field was not rendered.')
    }

    await waitFor(() => fireEvent.change(someFieldTextField, { target: { value: 'solo' } }))
    await waitFor(() => getByText(i18n.editingMessage))
    fireEvent.click(closeButton)
    expect(window.confirm).toHaveBeenCalledWith(i18n.deleteConfimation)
    expect(onRemoveCallback).toHaveBeenCalledTimes(1)
  })
})
