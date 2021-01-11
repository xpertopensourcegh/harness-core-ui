import React from 'react'
import { render, fireEvent, findByText, act } from '@testing-library/react'
import { FormikForm, Formik } from '@wings-software/uicore'
import { noop } from 'lodash-es'
import { TestWrapper, findDialogContainer } from '@common/utils/testUtils'

import connectorsListMockData from './connectorsListMockdata.json'
import secretsListMockData from './secretsListMockData.json'
import MutiTypeSecretInput from '../MultiTypeSecretInput'

describe('SecretInput', () => {
  test('render', async () => {
    const handleSuccess = jest.fn()

    const { container, getByText } = render(
      <TestWrapper>
        <Formik initialValues={{}} onSubmit={noop}>
          {() => {
            return (
              <FormikForm>
                <MutiTypeSecretInput
                  name="test"
                  label="test"
                  onSuccess={handleSuccess}
                  connectorsListMockData={connectorsListMockData as any}
                  secretsListMockData={secretsListMockData as any}
                />
              </FormikForm>
            )
          }}
        </Formik>
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()

    act(() => {
      fireEvent.click(getByText('Create or Select a Secret'))
    })

    const modal = findDialogContainer()
    const secret = await findByText(modal!, 'a1')

    expect(modal).toMatchSnapshot()

    act(() => {
      fireEvent.click(secret)
    })

    expect(handleSuccess).toHaveBeenCalled()

    const closeButton = modal?.querySelector("span[icon='cross']")?.closest('button')

    act(() => {
      fireEvent.click(closeButton!)
    })
  })
})
