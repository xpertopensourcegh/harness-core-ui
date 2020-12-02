import React from 'react'
import { noop } from 'lodash-es'
import { render } from '@testing-library/react'
import { BuildStep, StepProps } from '../BuildStep'

const getProps = (): StepProps => ({
  identifier: 'string',
  key: 1,
  status: 'SUCCESS',
  label: '',
  time: '1606585312000',
  isSubStep: false,
  isSelected: false,
  onStepClick: noop
})

describe('BuildSteps snapshot test', () => {
  test('should render properly', async () => {
    const { container } = render(<BuildStep {...getProps()} />)
    expect(container).toMatchSnapshot()
  })
})
