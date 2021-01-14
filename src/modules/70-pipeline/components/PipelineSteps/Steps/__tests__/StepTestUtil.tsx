import React from 'react'
import { Button, Formik, Text } from '@wings-software/uicore'
import { AbstractStepFactory } from '@pipeline/components/AbstractSteps/AbstractStepFactory'
import { StepWidgetWithFormikRef, StepWidgetProps } from '@pipeline/components/AbstractSteps/StepWidget'
import { TestWrapper, TestWrapperProps } from '@common/utils/testUtils'
import { StepViewType } from '@pipeline/components/AbstractSteps/Step'
import { useStrings } from 'framework/exports'
jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

class StepTestFactory extends AbstractStepFactory {
  protected type = 'test-factory'
}

export const factory = new StepTestFactory()

const FormikTestWrapper: React.FC<StepWidgetProps> = props => {
  const { getString } = useStrings()
  const stepRef = React.useRef(null)
  return (
    <Formik
      initialValues={props.initialValues}
      validate={values => {
        return factory.getStep(props.type)?.validateInputSet(values, props.template, getString) || {}
      }}
      onSubmit={data => props.onUpdate?.(data)}
    >
      {({ errors, submitForm }) => (
        <>
          <StepWidgetWithFormikRef ref={stepRef} {...props} />
          <Text>Errors</Text>
          <pre>{JSON.stringify(errors, null, 2)}</pre>
          <Button
            text="Submit"
            intent="primary"
            onClick={e => {
              e.stopPropagation()
              submitForm()
            }}
          />
        </>
      )}
    </Formik>
  )
}

export interface TestStepWidgetProps extends Omit<StepWidgetProps, 'factory'> {
  testWrapperProps?: TestWrapperProps
}

export const TestStepWidget: React.FC<TestStepWidgetProps> = props => {
  const type = props.stepViewType
  const stepRef = React.useRef(null)

  return (
    <TestWrapper {...props.testWrapperProps}>
      {type === StepViewType.InputSet || type === StepViewType.DeploymentForm ? (
        <FormikTestWrapper factory={factory} {...props} />
      ) : (
        <StepWidgetWithFormikRef ref={stepRef} factory={factory} {...props} />
      )}
    </TestWrapper>
  )
}
