import React from 'react'
import { render } from '@testing-library/react'
import { Formik } from 'formik'
import { TestWrapper } from '@common/utils/testUtils'
import SkipConditionsPanel from '../SkipConditionsPanel'
import { Modes } from '../../common'

describe('Skip Conditions Panel tests', () => {
  test('Step level conditions render', () => {
    const { queryByText } = render(
      <TestWrapper>
        <Formik initialValues={{}} onSubmit={() => void 0}>
          {() => {
            return <SkipConditionsPanel isReadonly={false} />
          }}
        </Formik>
      </TestWrapper>
    )

    expect(queryByText('skipConditionLabel')).toBeTruthy()
    expect(queryByText('skipConditionHelpText')).toBeTruthy()
  })

  test('should display correct label if mode is stage', () => {
    const { queryByText } = render(
      <TestWrapper>
        <Formik initialValues={{}} onSubmit={() => void 0}>
          {() => {
            return <SkipConditionsPanel isReadonly={false} mode={Modes.STAGE} />
          }}
        </Formik>
      </TestWrapper>
    )

    expect(queryByText('skipConditionStageLabel')).toBeTruthy()
    expect(queryByText('skipConditionText')).toBeTruthy()
  })
})
