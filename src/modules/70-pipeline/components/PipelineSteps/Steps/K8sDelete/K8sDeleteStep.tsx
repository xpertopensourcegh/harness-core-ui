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
import { FieldArray } from 'formik'
import type { IOptionProps } from '@blueprintjs/core'
import * as Yup from 'yup'
import { isEmpty } from 'lodash-es'
import { StepViewType, StepProps } from '@pipeline/exports'
import type { StepElement } from 'services/cd-ng'
import { ConfigureOptions } from '@common/components/ConfigureOptions/ConfigureOptions'
import { useStrings } from 'framework/exports'
import { FormMultiTypeDurationField } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import { DurationInputFieldForInputSet } from '@common/components/MultiTypeDuration/MultiTypeDuration'

import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import css from './K8sDeleteStep.module.scss'

interface K8sDeleteSpec {
  resourceNames?: string[]
  deleteNamespace?: boolean
  manifestPaths?: string[]
}

interface K8sDeleteSpec {
  deleteResourcesBy?: string
  spec?: K8sDeleteSpec
}
export interface K8sDeleteData extends StepElement {
  identifier: string
  timeout?: string
  spec: K8sDeleteSpec
}

interface K8sDeleteProps {
  initialValues: K8sDeleteData
  onUpdate?: (data: K8sDeleteData) => void
  stepViewType?: StepViewType
  inputSetData?: {
    template?: K8sDeleteData
    path?: string
  }
  readonly?: boolean
}

const K8sDeleteDeployWidget: React.FC<K8sDeleteProps> = ({ initialValues, onUpdate }): JSX.Element => {
  const { getString } = useStrings()

  const accessTypeOptions = React.useMemo(() => {
    // eslint-disable-next-line no-shadow
    const options: IOptionProps[] = [
      {
        label: getString('pipelineSteps.resourceNameLabel'),
        value: getString('pipelineSteps.resourceNameValue')
      },
      {
        label: getString('pipelineSteps.releaseNameLabel'),
        value: getString('pipelineSteps.releaseNameValue')
      },
      {
        label: getString('pipelineSteps.manifestPathLabel'),
        value: getString('pipelineSteps.manifestPathValue')
      }
    ]
    return options
  }, [])

  return (
    <>
      <Formik<K8sDeleteData>
        onSubmit={(values: K8sDeleteData) => {
          /* istanbul ignore next */

          const data = values
          /* making sure to remove other entities */
          if (data.spec?.deleteResourcesBy === getString('pipelineSteps.resourceNameValue')) {
            /* istanbul ignore next */
            delete data.spec?.spec?.deleteNamespace
            delete data.spec?.spec?.manifestPaths
          } else if (data.spec?.deleteResourcesBy === getString('pipelineSteps.releaseNameValue')) {
            /* istanbul ignore next */
            delete data.spec?.spec?.resourceNames
            delete data.spec?.spec?.manifestPaths
          } else if (data.spec?.deleteResourcesBy === getString('pipelineSteps.manifestPathValue')) {
            /* istanbul ignore next */
            delete data.spec?.spec?.resourceNames
            delete data.spec?.spec?.deleteNamespace
          }
          onUpdate?.(data)
        }}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(getString('pipelineSteps.stepNameRequired')),
          timeout: Yup.string().required(getString('pipelineSteps.timeoutRequired'))
        })}
      >
        {formikProps => {
          const values = formikProps.values
          return (
            <Layout.Vertical spacing="xlarge">
              <Accordion activeId="details" collapseProps={{ transitionDuration: 0 }}>
                <Accordion.Panel
                  id="details"
                  summary={getString('pipelineSteps.k8sDelete')}
                  details={
                    <>
                      <FormInput.InputWithIdentifier inputLabel={getString('name')} />

                      <FormInput.RadioGroup
                        label={getString('pipelineSteps.deleteResourcesBy')}
                        name="spec.deleteResourcesBy"
                        items={accessTypeOptions}
                        radioGroup={{ inline: true }}
                      />

                      {values?.spec?.deleteResourcesBy === getString('pipelineSteps.resourceNameValue') && (
                        <FieldArray
                          name="spec.spec.resourceNames"
                          render={arrayHelpers => (
                            <Layout.Vertical>
                              {formikProps.values?.spec?.spec?.resourceNames?.map((path: string, index: number) => (
                                <Layout.Horizontal
                                  key={path}
                                  flex={{ distribution: 'space-between' }}
                                  style={{ alignItems: 'end' }}
                                >
                                  <FormInput.MultiTextInput
                                    label=""
                                    placeholder={getString('pipelineSteps.deleteResourcesPlaceHolder')}
                                    name={`spec.spec.resourceNames[${index}]`}
                                    style={{ width: '430px' }}
                                  />
                                  {/* istanbul ignore next */}
                                  {formikProps.values?.spec?.spec?.resourceNames &&
                                    formikProps.values?.spec?.spec?.resourceNames.length > 1 && (
                                      <Button
                                        minimal
                                        icon="minus"
                                        onClick={() => {
                                          /* istanbul ignore next */
                                          arrayHelpers.remove(index)
                                        }}
                                      />
                                    )}
                                </Layout.Horizontal>
                              ))}
                              <span>
                                <Button
                                  minimal
                                  text={getString('addFileText')}
                                  intent="primary"
                                  onClick={() => {
                                    /* istanbul ignore next */
                                    arrayHelpers.push('')
                                  }}
                                />
                              </span>
                            </Layout.Vertical>
                          )}
                        />
                      )}

                      {values?.spec?.deleteResourcesBy === getString('pipelineSteps.releaseNameValue') && (
                        <Layout.Horizontal
                          spacing="medium"
                          flex={{ distribution: 'space-between' }}
                          style={{ alignItems: 'center' }}
                          className={css.nameSpace}
                        >
                          <FormInput.CheckBox name="spec.spec.deleteNamespace" label="Delete namespace" />
                        </Layout.Horizontal>
                      )}

                      {values?.spec?.deleteResourcesBy === getString('pipelineSteps.manifestPathValue') && (
                        <FieldArray
                          name="spec.spec.manifestPaths"
                          render={arrayHelpers => (
                            <Layout.Vertical>
                              {/* istanbul ignore next */}
                              {formikProps.values?.spec?.spec?.manifestPaths?.map((path: string, index: number) => (
                                <Layout.Horizontal
                                  key={path}
                                  flex={{ distribution: 'space-between' }}
                                  style={{ alignItems: 'end' }}
                                >
                                  <FormInput.MultiTextInput
                                    label=""
                                    placeholder={getString('pipelineSteps.deleteResourcesPlaceHolder')}
                                    name={`spec.spec.manifestPaths[${index}]`}
                                    style={{ width: '430px' }}
                                  />
                                  {/* istanbul ignore next */}
                                  {formikProps.values?.spec?.spec?.manifestPaths &&
                                    formikProps.values?.spec?.spec?.manifestPaths.length > 1 && (
                                      <Button minimal icon="minus" onClick={() => arrayHelpers.remove(index)} />
                                    )}
                                </Layout.Horizontal>
                              ))}
                              <span>
                                <Button
                                  minimal
                                  text={getString('plusAdd')}
                                  intent="primary"
                                  onClick={() => arrayHelpers.push('')}
                                />
                              </span>
                            </Layout.Vertical>
                          )}
                        />
                      )}

                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <FormMultiTypeDurationField
                          name="timeout"
                          label={getString('pipelineSteps.timeoutLabel')}
                          multiTypeDurationProps={{ enableConfigureOptions: false }}
                        />
                        {getMultiTypeFromValue(formikProps.values.timeout) === MultiTypeInputType.RUNTIME && (
                          <ConfigureOptions
                            value={values.timeout as string}
                            type="String"
                            variableName="step.timeout"
                            showRequiredField={false}
                            showDefaultField={false}
                            showAdvanced={true}
                            onChange={value => {
                              formikProps.setFieldValue('timeout', value)
                            }}
                          />
                        )}
                      </Layout.Horizontal>
                    </>
                  }
                />
              </Accordion>
              <Button intent="primary" text={getString('submit')} onClick={formikProps.submitForm} />
            </Layout.Vertical>
          )
        }}
      </Formik>
    </>
  )
}

/* istanbul ignore next */
const K8sDeleteInputStep: React.FC<K8sDeleteProps> = ({ inputSetData, readonly }) => {
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
    </>
  )
}

export class K8sDeleteStep extends PipelineStep<K8sDeleteData> {
  renderStep(props: StepProps<K8sDeleteData>): JSX.Element {
    /* istanbul ignore next */

    const { initialValues, onUpdate, stepViewType, inputSetData } = props

    if (stepViewType === StepViewType.InputSet || stepViewType === StepViewType.DeploymentForm) {
      /* istanbul ignore next */
      return (
        <K8sDeleteInputStep
          initialValues={initialValues}
          onUpdate={onUpdate}
          stepViewType={stepViewType}
          inputSetData={inputSetData}
          readonly={!!inputSetData?.readonly}
        />
      )
    }
    /* istanbul ignore next */

    return (
      <K8sDeleteDeployWidget
        initialValues={initialValues}
        onUpdate={onUpdate}
        stepViewType={stepViewType}
        readonly={!!inputSetData?.readonly}
      />
    )
  }
  validateInputSet(): object {
    return {}
  }

  protected type = StepType.K8sDelete
  protected stepName = 'K8s Delete'
  protected stepIcon: IconName = 'service-kubernetes'

  protected defaultValues: K8sDeleteData = {
    identifier: '',
    timeout: '10m',
    spec: {
      deleteResourcesBy: '',
      spec: {}
    }
  }
}
