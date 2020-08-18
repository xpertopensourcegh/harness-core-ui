import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import type { IconName } from '@wings-software/uikit'
import { AbstractStepFactory } from '../AbstractStepFactory'
import { Step } from '../Step'
import { StepWidget } from '../StepWidget'

class StepFactory extends AbstractStepFactory {
  protected type = 'test-factory'
}

class StepOne extends Step<object> {
  protected type = 'step-one'
  protected stepName = 'stepOne'
  protected stepIcon: IconName = 'cross'

  protected defaultValues = { a: 'a' }
  renderStep(values: object, onSubmit: (data: object) => void): JSX.Element {
    return <div onClick={() => onSubmit(values)}>{JSON.stringify(values)}</div>
  }
}

class StepTwo extends Step<object> {
  protected type = 'step-two'
  protected stepName = 'stepTwo'
  protected stepIcon: IconName = 'cross'

  protected defaultValues = { b: 'b' }
  renderStep(values: object, onSubmit: (data: object) => void): JSX.Element {
    return <div onClick={() => onSubmit(values)}>{JSON.stringify(values)}</div>
  }
}

const factory = new StepFactory()
factory.registerStep(new StepOne())
factory.registerStep(new StepTwo())

describe('StepWidget tests', () => {
  test(`shows different steps based on type`, () => {
    let { container } = render(<StepWidget type="step-one" factory={factory} initialValues={{}} />)
    expect(container).toMatchSnapshot()
    container = render(<StepWidget type="step-two" factory={factory} initialValues={{}} />).container
    expect(container).toMatchSnapshot()
  })

  test(`shows invalid step`, () => {
    const { container } = render(<StepWidget type="step-three" factory={factory} initialValues={{}} />)
    expect(container).toMatchSnapshot()
  })

  test(`shows step and merge initial values`, () => {
    const { container } = render(<StepWidget type="step-one" factory={factory} initialValues={{ a: 'b' }} />)
    expect(container).toMatchSnapshot()
  })

  test(`should call on submit of the form`, () => {
    const onSubmit = jest.fn()
    const { container } = render(
      <StepWidget type="step-one" onSubmit={onSubmit} factory={factory} initialValues={{ a: 'b' }} />
    )
    fireEvent.click(container.children[0])
    expect(onSubmit).toBeCalled()
  })
})
