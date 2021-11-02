import React from 'react'
import { render } from '@testing-library/react'
import { Formik } from 'formik'
import { FormikForm } from '@wings-software/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import { initialFormData } from '@cv/pages/slos/__tests__/CVSLOsListingPage.mock'
import CreateSLOForm from '../CreateSLOForm'
import { mockedUserJourneysData } from '../components/SLOName/__tests__/SLOName.mock'

function WrapperComponent(props: { initialValues: any }): JSX.Element {
  const { initialValues } = props
  return (
    <TestWrapper>
      <Formik enableReinitialize={true} initialValues={initialValues} onSubmit={jest.fn()}>
        {formikProps => {
          return (
            <FormikForm>
              <CreateSLOForm formikProps={formikProps}></CreateSLOForm>
            </FormikForm>
          )
        }}
      </Formik>
    </TestWrapper>
  )
}

jest.mock('services/cv', () => ({
  useGetAllJourneys: jest.fn().mockImplementation(() => ({
    data: mockedUserJourneysData,
    loading: false,
    error: null,
    refetch: jest.fn()
  })),
  useSaveUserJourney: jest.fn().mockImplementation(() => ({
    data: {},
    loading: false,
    error: null,
    refetch: jest.fn()
  }))
}))

describe('Test CreateSLOForm component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should render CreateSLOForm component', async () => {
    const { getByText } = render(<WrapperComponent initialValues={initialFormData} />)

    // Verify if all the tabs are present
    expect(getByText('name')).toBeInTheDocument()
    expect(getByText('cv.slos.sli')).toBeInTheDocument()
    expect(getByText('cv.slos.sloTargetAndBudgetPolicy')).toBeInTheDocument()
  })
})
