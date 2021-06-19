import React from 'react'
import { render } from '@testing-library/react'
import { Formik } from '@wings-software/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import { StepMode as Modes } from '@pipeline/utils/stepUtils'
import ConditionalExecutionPanel from '../ConditionalExecutionPanel'

jest.mock('@common/components/MonacoEditor/MonacoEditor')

describe('ConditionalExecutionPanel', () => {
  test('matches snapshot', () => {
    const { container } = render(
      <TestWrapper>
        <Formik initialValues={{}} onSubmit={() => void 0}>
          {formikProps => {
            return <ConditionalExecutionPanel mode={Modes.STEP} isReadonly={false} formikProps={formikProps} />
          }}
        </Formik>
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
