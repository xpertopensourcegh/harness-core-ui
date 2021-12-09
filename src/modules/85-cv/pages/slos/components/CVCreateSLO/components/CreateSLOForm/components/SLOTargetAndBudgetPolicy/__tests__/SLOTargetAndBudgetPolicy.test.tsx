import React from 'react'
import { render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import { FormikForm } from '@wings-software/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import { initialFormData } from '@cv/pages/slos/components/CVCreateSLO/__tests__/CVCreateSLO.mock'
import type { StringKeys } from 'framework/strings'
import {
  getPeriodTypeOptions,
  getWindowEndOptionsForMonth
} from '@cv/pages/slos/components/CVCreateSLO/CVCreateSLO.utils'
import SLOTargetAndBudgetPolicy from '../SLOTargetAndBudgetPolicy'

jest.mock('@cv/pages/slos/components/SLOTargetChart/SLOTargetChart', () => ({
  __esModule: true,
  default: function SLOTargetChart() {
    return <span data-testid="SLO-target-chart" />
  }
}))

function WrapperComponent(props: { initialValues: any }): JSX.Element {
  const { initialValues } = props
  return (
    <TestWrapper>
      <Formik enableReinitialize={true} initialValues={initialValues} onSubmit={jest.fn()}>
        {formikProps => {
          return (
            <FormikForm>
              <SLOTargetAndBudgetPolicy formikProps={formikProps}>
                <></>
              </SLOTargetAndBudgetPolicy>
            </FormikForm>
          )
        }}
      </Formik>
    </TestWrapper>
  )
}

function getString(key: StringKeys): StringKeys {
  return key
}

describe('Test SLOTargetAndBudgetPolicy component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should render SLOTargetAndBudgetPolicy component', async () => {
    const { container } = render(<WrapperComponent initialValues={initialFormData} />)
    expect(screen.getByTestId('SLO-target-chart')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  test('verify getPeriodTypeOptions method', async () => {
    expect(getPeriodTypeOptions(getString)).toEqual([
      {
        label: 'cv.slos.sloTargetAndBudget.periodTypeOptions.rolling',
        value: 'Rolling'
      },
      {
        label: 'cv.slos.sloTargetAndBudget.periodTypeOptions.calendar',
        value: 'Calender'
      }
    ])
  })

  test('verify getWindowEndOptionsForMonth method', async () => {
    const periodLengthOptions = Array(31)
      .fill(0)
      .map((_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }))

    expect(getWindowEndOptionsForMonth()).toEqual(periodLengthOptions)
  })
})
