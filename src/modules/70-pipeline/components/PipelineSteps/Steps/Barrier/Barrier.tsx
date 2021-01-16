import React from 'react'
import {
  IconName,
  Formik,
  FormInput,
  Button,
  Layout,
  getMultiTypeFromValue,
  MultiTypeInputType,
  Accordion
} from '@wings-software/uicore'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'
import { isEmpty } from 'lodash-es'
import { StepViewType } from '@pipeline/exports'
import type { StepFormikFowardRef } from '@pipeline/components/AbstractSteps/Step'
import { setFormikRef } from '@pipeline/components/AbstractSteps/Step'
import type { K8sRollingRollbackStepInfo, StepElement } from 'services/cd-ng'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { useStrings, UseStringsReturn } from 'framework/exports'
import { FormMultiTypeDurationField } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep, StepProps } from '../../PipelineStep'
import stepCss from '../Steps.module.scss'

export interface BarrierData extends StepElement {
  spec: K8sRollingRollbackStepInfo
}

interface BarrierProps {
  initialValues: BarrierData
  onUpdate?: (data: BarrierData) => void
  stepViewType?: StepViewType
  inputSetData?: {
    template?: BarrierData
    path?: string
  }
}

function BarrierWidget(props: BarrierProps, formikRef: StepFormikFowardRef<BarrierData>): React.ReactElement {
  const { initialValues, onUpdate } = props
  const { getString } = useStrings()
  return (
    <>
      <Formik<BarrierData>
        onSubmit={(values: BarrierData) => {
          onUpdate?.(values)
        }}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(getString('pipelineSteps.stepNameRequired')),
          spec: Yup.string().required(getString('pipelineSteps.timeoutRequired'))
        })}
      >
        {(formik: FormikProps<BarrierData>) => {
          const { submitForm, values, setFieldValue } = formik
          setFormikRef(formikRef, formik)
          return (
            <>
              <Accordion activeId="details" collapseProps={{ transitionDuration: 0 }}>
                <Accordion.Panel
                  id="details"
                  summary={getString('pipelineSteps.barrier')}
                  details={
                    <>
                      <FormInput.InputWithIdentifier inputLabel={getString('name')} />
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <FormMultiTypeDurationField
                          name="spec.timeout"
                          label={getString('pipelineSteps.timeoutLabel')}
                          multiTypeDurationProps={{ enableConfigureOptions: false }}
                        />
                        {getMultiTypeFromValue(values.spec.timeout) === MultiTypeInputType.RUNTIME && (
                          <ConfigureOptions
                            value={values.spec.timeout as string}
                            type="String"
                            variableName="step.spec.timeout"
                            showRequiredField={false}
                            showDefaultField={false}
                            showAdvanced={true}
                            onChange={value => {
                              setFieldValue('spec.timeout', value)
                            }}
                          />
                        )}
                      </Layout.Horizontal>
                    </>
                  }
                />
              </Accordion>
              <div className={stepCss.actionsPanel}>
                <Button intent="primary" text={getString('submit')} onClick={submitForm} />
              </div>
            </>
          )
        }}
      </Formik>
    </>
  )
}

const BarrierInputStep: React.FC<BarrierProps> = ({ inputSetData }) => {
  const { getString } = useStrings()
  return (
    <>
      {getMultiTypeFromValue(inputSetData?.template?.spec?.timeout) === MultiTypeInputType.RUNTIME && (
        <FormMultiTypeDurationField
          name={`${isEmpty(inputSetData?.path) ? '' : `${inputSetData?.path}.`}spec.timeout`}
          label={getString('pipelineSteps.timeoutLabel')}
          multiTypeDurationProps={{ enableConfigureOptions: false }}
        />
      )}
    </>
  )
}
const BarrierWidgetWithRef = React.forwardRef(BarrierWidget)
export class BarrierStep extends PipelineStep<BarrierData> {
  renderStep(props: StepProps<BarrierData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <BarrierInputStep
          initialValues={initialValues}
          onUpdate={onUpdate}
          stepViewType={stepViewType}
          inputSetData={inputSetData}
        />
      )
    }
    return (
      <BarrierWidgetWithRef
        initialValues={initialValues}
        onUpdate={onUpdate}
        stepViewType={stepViewType}
        ref={formikRef}
      />
    )
  }
  validateInputSet(data: BarrierData, template: BarrierData, getString?: UseStringsReturn['getString']): object {
    const errors = {} as any
    if (isEmpty(data?.spec?.timeout) && getMultiTypeFromValue(template?.spec?.timeout) === MultiTypeInputType.RUNTIME) {
      errors.spec = {}
      errors.spec.timeout = getString?.('fieldRequired', { field: 'Timeout' })
    }
    return errors
  }

  protected type = StepType.Barrier
  protected stepName = 'Barrier'
  protected stepIcon: IconName = 'command-barrier'

  protected defaultValues: BarrierData = {
    identifier: '',
    spec: {
      timeout: '10m'
    }
  }
}
