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
import { FieldArray, FormikProps } from 'formik'
import * as Yup from 'yup'
import type {} from 'formik'
import { isEmpty } from 'lodash-es'
import { StepViewType, StepProps } from '@pipeline/exports'
import type { StepFormikFowardRef } from '@pipeline/components/AbstractSteps/Step'
import { setFormikRef } from '@pipeline/components/AbstractSteps/Step'
import type { StepElement } from 'services/cd-ng'
import { FormMultiTypeCheckboxField } from '@common/components'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { useStrings } from 'framework/exports'
import { FormMultiTypeDurationField } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { DurationInputFieldForInputSet } from '@common/components/MultiTypeDuration/MultiTypeDuration'

import MultiTypeFieldSelector from '@common/components/MultiTypeFieldSelector/MultiTypeFieldSelector'

import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import stepCss from '../Steps.module.scss'

interface K8sApplySpec {
  skipDryRun?: boolean
  skipSteadyStateCheck?: boolean
  filePaths?: string[]
}
export interface K8sApplyData extends StepElement {
  identifier: string
  timeout?: string
  spec: K8sApplySpec
}

interface K8sApplyProps {
  initialValues: K8sApplyData
  onUpdate?: (data: K8sApplyData) => void
  stepViewType?: StepViewType
  inputSetData?: {
    template?: K8sApplyData
    path?: string
  }
  readonly?: boolean
}

function K8sApplyDeployWidget(props: K8sApplyProps, formikRef: StepFormikFowardRef<K8sApplyData>): React.ReactElement {
  const { initialValues, onUpdate } = props
  const { getString } = useStrings()
  const defaultValueToReset = ['']
  return (
    <>
      <Formik<K8sApplyData>
        onSubmit={(values: K8sApplyData) => {
          onUpdate?.(values)
        }}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(getString('pipelineSteps.stepNameRequired')),
          timeout: Yup.string().required(getString('pipelineSteps.timeoutRequired'))
        })}
      >
        {(formik: FormikProps<K8sApplyData>) => {
          const { values, setFieldValue, submitForm } = formik
          setFormikRef(formikRef, formik)
          return (
            <Layout.Vertical spacing="xlarge">
              <Accordion activeId="details" collapseProps={{ transitionDuration: 0 }}>
                <Accordion.Panel
                  id="details"
                  summary={getString('pipelineSteps.k8sApply')}
                  details={
                    <>
                      <FormInput.InputWithIdentifier inputLabel={getString('name')} />
                      <MultiTypeFieldSelector
                        defaultValueToReset={defaultValueToReset}
                        name={'spec.filePaths'}
                        label={getString('fileFolderPathText')}
                      >
                        <FieldArray
                          name="spec.filePaths"
                          render={arrayHelpers => (
                            <Layout.Vertical>
                              {values?.spec?.filePaths?.map((path: string, index: number) => (
                                <Layout.Horizontal
                                  key={path}
                                  flex={{ distribution: 'space-between' }}
                                  style={{ alignItems: 'end' }}
                                >
                                  <FormInput.MultiTextInput
                                    label=""
                                    placeholder={'Enter overrides file path'}
                                    name={`spec.filePaths[${index}]`}
                                    style={{ width: '430px' }}
                                  />

                                  {values?.spec?.filePaths && values?.spec?.filePaths?.length > 1 && (
                                    <Button minimal icon="minus" onClick={() => arrayHelpers.remove(index)} />
                                  )}
                                </Layout.Horizontal>
                              ))}
                              <span>
                                <Button
                                  minimal
                                  text={getString('addFileText')}
                                  intent="primary"
                                  onClick={() => arrayHelpers.push('')}
                                />
                              </span>
                            </Layout.Vertical>
                          )}
                        />
                      </MultiTypeFieldSelector>

                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <FormMultiTypeDurationField
                          name="spec.timeout"
                          label={getString('pipelineSteps.timeoutLabel')}
                          multiTypeDurationProps={{ enableConfigureOptions: false }}
                        />
                        {getMultiTypeFromValue(values.timeout) === MultiTypeInputType.RUNTIME && (
                          <ConfigureOptions
                            value={values.timeout as string}
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
                      <FormMultiTypeCheckboxField
                        name="spec.skipDryRun"
                        label={getString('pipelineSteps.skipDryRun')}
                      />
                      <FormMultiTypeCheckboxField
                        name="spec.skipSteadyStateCheck"
                        label={getString('pipelineSteps.skipSteadyStateCheck')}
                      />
                    </>
                  }
                />
              </Accordion>
              <Button intent="primary" text={getString('submit')} onClick={submitForm} />
            </Layout.Vertical>
          )
        }}
      </Formik>
    </>
  )
}

const K8sApplyInputStep: React.FC<K8sApplyProps> = ({ inputSetData, readonly }) => {
  const { getString } = useStrings()
  return (
    <>
      {getMultiTypeFromValue(inputSetData?.template?.timeout) === MultiTypeInputType.RUNTIME && (
        <DurationInputFieldForInputSet
          label={getString('pipelineSteps.timeoutLabel')}
          name={`${isEmpty(inputSetData?.path) ? '' : `${inputSetData?.path}.`}spec.timeout`}
          disabled={readonly}
        />
      )}

      {getMultiTypeFromValue(inputSetData?.template?.spec?.skipDryRun) === MultiTypeInputType.RUNTIME && (
        <FormInput.CheckBox
          name={`${isEmpty(inputSetData?.path) ? '' : `${inputSetData?.path}.`}spec.skipDryRun`}
          className={stepCss.checkbox}
          label={getString('pipelineSteps.skipDryRun')}
        />
      )}
      {getMultiTypeFromValue(inputSetData?.template?.spec?.skipSteadyStateCheck) === MultiTypeInputType.RUNTIME && (
        <FormInput.CheckBox
          name={`${isEmpty(inputSetData?.path) ? '' : `${inputSetData?.path}.`}spec.skipSteadyStateCheck`}
          className={stepCss.checkbox}
          label={getString('pipelineSteps.skipSteadyStateCheck')}
        />
      )}
    </>
  )
}
const K8sApplyDeployWidgetWithRef = React.forwardRef(K8sApplyDeployWidget)
export class K8sApplyStep extends PipelineStep<K8sApplyData> {
  renderStep(props: StepProps<K8sApplyData>): JSX.Element {
    const { initialValues, onUpdate, stepViewType, inputSetData, formikRef } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      return (
        <K8sApplyInputStep
          initialValues={initialValues}
          onUpdate={onUpdate}
          stepViewType={stepViewType}
          inputSetData={inputSetData}
          readonly={!!inputSetData?.readonly}
        />
      )
    }
    return (
      <K8sApplyDeployWidgetWithRef
        initialValues={initialValues}
        onUpdate={onUpdate}
        stepViewType={stepViewType}
        readonly={!!inputSetData?.readonly}
        ref={formikRef}
      />
    )
  }
  validateInputSet(): object {
    return {}
  }

  protected type = StepType.K8sApply
  protected stepName = 'K8s Apply'
  protected stepIcon: IconName = 'service-kubernetes'

  protected defaultValues: K8sApplyData = {
    identifier: '',
    timeout: '10m',
    spec: {
      filePaths: [],
      skipDryRun: false,
      skipSteadyStateCheck: false
    }
  }
}
