import React from 'react'
import { render } from '@testing-library/react'
import { Formik } from 'formik'
import { FormikForm } from '@wings-software/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import SLOName from '../SLOName'
import { initialFormData } from '../../../_tests__/CreateSLO.mock'

function WrapperComponent(props: { initialValues: any }): JSX.Element {
  const { initialValues } = props
  return (
    <TestWrapper>
      <Formik enableReinitialize={true} initialValues={initialValues} onSubmit={jest.fn()}>
        {formikProps => {
          return (
            <FormikForm>
              <SLOName formikProps={formikProps}>
                <></>
              </SLOName>
            </FormikForm>
          )
        }}
      </Formik>
    </TestWrapper>
  )
}

describe('Test SLOName component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should render SLOName component', async () => {
    const { container } = render(<WrapperComponent initialValues={initialFormData} />)
    expect(container).toMatchSnapshot()
  })
})
