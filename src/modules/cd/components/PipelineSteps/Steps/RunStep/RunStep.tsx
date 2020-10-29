import React from 'react'
import {
  Text,
  Formik,
  FormInput,
  Button,
  getMultiTypeFromValue,
  IconName,
  MultiTypeInputType,
  Layout,
  FormikForm,
  SimpleTagInput
} from '@wings-software/uikit'
import { FieldArray } from 'formik'
import * as yup from 'yup'
import cx from 'classnames'
import { isEmpty } from 'lodash-es'
import { useParams } from 'react-router-dom'
import { ConfigureOptions, PipelineContext, StepViewType } from '@pipeline/exports'
import { ConnectorInfoDTO, useGetConnector } from 'services/cd-ng'
import { FormMultiTypeConnectorField } from '@common/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import {
  getIdentifierFromValue,
  getScopeFromDTO,
  getScopeFromValue
} from '@common/components/EntityReference/EntityReference'
import { Scope } from '@common/interfaces/SecretsInterface'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import i18n from './RunStep.i18n'
import css from './RunStep.module.scss'
import stepCss from '../Steps.module.scss'

export enum LimitMemoryUnits {
  Mi = 'Mi',
  Gi = 'Gi'
}

const validationSchema = yup.object().shape({
  identifier: yup.string().required(),
  name: yup.string().required(),
  spec: yup.object().shape({
    connector: yup.string().required(),
    image: yup.string().required(),
    command: yup.array().required(),
    limitCPU: yup.number().min(0),
    limitMemory: yup.number().min(0)
  })
})

export interface RunStepWidgetProps {
  initialValues: any //RunStepData
  onUpdate?: (data: any) => void //RunStepData
  stepViewType?: StepViewType
}

const RunStepWidget: React.FC<RunStepWidgetProps> = ({ initialValues, onUpdate }): JSX.Element => {
  const {
    state: { pipelineView },
    updatePipelineView
  } = React.useContext(PipelineContext)

  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

  const connectorRef = getIdentifierFromValue((initialValues.spec.connector as string) || '') // ? as string
  const initialScope = getScopeFromValue((initialValues.spec.connector as string) || '') // ? as string

  const { data: connector, loading, refetch } = useGetConnector({
    identifier: connectorRef,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: initialScope === Scope.ORG || initialScope === Scope.PROJECT ? orgIdentifier : undefined,
      projectIdentifier: initialScope === Scope.PROJECT ? projectIdentifier : undefined
    },
    lazy: true,
    debounce: 300
  })

  React.useEffect(() => {
    if (
      !isEmpty(initialValues.spec.connector) &&
      getMultiTypeFromValue(initialValues.spec.connector || '') === MultiTypeInputType.FIXED
    ) {
      refetch()
    }
  }, [initialValues.spec.connector])

  const values = { ...initialValues }

  if (
    connector?.data?.connector &&
    getMultiTypeFromValue(initialValues.spec.connector || '') === MultiTypeInputType.FIXED
  ) {
    const scope = getScopeFromDTO<ConnectorInfoDTO>(connector?.data?.connector)
    values.spec.connector = {
      label: connector?.data?.connector.name || '',
      value: `${scope !== Scope.PROJECT ? `${scope}.` : ''}${connector?.data?.connector.identifier}`,
      scope: scope
    }
  } else {
    values.spec.connector = initialValues.spec.connector
  }

  const handleCancelClick = (): void => {
    updatePipelineView({
      ...pipelineView,
      isDrawerOpened: false,
      drawerData: { type: DrawerTypes.StepConfig }
    })
  }

  return (
    <>
      <Text className={stepCss.boldLabel} font={{ size: 'medium' }}>
        {i18n.title}
      </Text>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={_values => {
          // TODO: Use appropriate interface
          const schemaValues: any = {
            identifier: _values.identifier,
            name: _values.name,
            spec: {
              connector: _values.spec.connector,
              image: _values.spec.image,
              command: _values.spec.command,
              environment: _values.spec.environment,
              workingDir: _values.spec.workingDir,
              resources: {
                limit: {
                  memory: '',
                  cpu: _values.spec.limitCPU
                }
              },
              outputVariables: _values.spec.outputVariables
            }
          }

          if (_values.spec.limitMemory && _values.spec.limitMemoryUnits) {
            schemaValues.spec.resources.limit.memory = _values.spec.limitMemory + _values.spec.limitMemoryUnits
          }

          onUpdate?.(schemaValues)
        }}
      >
        {({ values: formValues, setFieldValue, handleSubmit }) => (
          <FormikForm>
            <div className={css.fieldsSection}>
              <FormInput.InputWithIdentifier inputName="name" idName="identifier" inputLabel={i18n.stepNameLabel} />
              <Text margin={{ bottom: 'xsmall' }}>{i18n.connectorLabel}</Text>
              <div className={cx(css.fieldsGroup, css.withoutSpacing)}>
                <FormMultiTypeConnectorField
                  name="spec.connector"
                  label=""
                  placeholder={loading ? i18n.loading : i18n.connectorPlaceholder}
                  disabled={loading}
                  accountIdentifier={accountId}
                  projectIdentifier={projectIdentifier}
                  orgIdentifier={orgIdentifier}
                />
                {getMultiTypeFromValue(formValues.spec.connector) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formValues.spec.connector as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Text>{i18n.connectorLabel}</Text>
                      </Layout.Horizontal>
                    }
                    variableName="spec.connector"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => {
                      setFieldValue('spec.connector', value)
                    }}
                  />
                )}
              </div>
              <Text margin={{ top: 'medium', bottom: 'xsmall' }}>{i18n.imageLabel}</Text>
              <div className={cx(css.fieldsGroup, css.withoutSpacing)}>
                <FormInput.MultiTextInput name="spec.image" label="" style={{ flexGrow: 1 }} />
                {getMultiTypeFromValue(formValues.spec.image) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formValues.spec.image as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Text>{i18n.imageLabel}</Text>
                      </Layout.Horizontal>
                    }
                    variableName="spec.image"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => setFieldValue('spec.image', value)}
                  />
                )}
              </div>
              <Text margin={{ top: 'medium', bottom: 'xsmall' }}>{i18n.commandsLabel}</Text>
              <SimpleTagInput
                className=""
                placeholder=""
                items={[]}
                fill
                noInputBorder
                openOnKeyDown={false}
                showNewlyCreatedItemsInList={false}
                allowNewTag
                onChange={selectedItems => setFieldValue('spec.command', selectedItems)}
              />
            </div>
            <div className={css.fieldsSection}>
              <Text className={css.optionalConfiguration} font={{ weight: 'semi-bold' }} margin={{ bottom: 'small' }}>
                {i18n.optionalConfiguration}
              </Text>
              <Text>{i18n.environment}</Text>
              <FieldArray
                name="spec.environment"
                render={({ push, remove }) => (
                  <>
                    {formValues.spec.environment.map((_environment: string, index: number) => (
                      <div className={css.fieldsGroup} key={index}>
                        <FormInput.Text
                          name={`spec.environment[${index}].key`}
                          placeholder={i18n.environmentKeyPlaceholder}
                          style={{ flexGrow: 1 }}
                        />
                        <FormInput.MultiTextInput
                          label=""
                          name={`spec.environment[${index}].value`}
                          placeholder={i18n.environmentValuePlaceholder}
                          style={{ flexGrow: 1 }}
                        />
                        {getMultiTypeFromValue(formValues.spec.environment[index].value) ===
                          MultiTypeInputType.RUNTIME && (
                          <ConfigureOptions
                            value={formValues.spec.environment[index].value as string}
                            type={
                              <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                                <Text>{i18n.environmentValuePlaceholder}</Text>
                              </Layout.Horizontal>
                            }
                            variableName={`spec.environment[${index}].value`}
                            showRequiredField={false}
                            showDefaultField={false}
                            showAdvanced={true}
                            onChange={value => setFieldValue(`spec.environment[${index}].value`, value)}
                          />
                        )}

                        {formValues.spec.environment.length > 1 && (
                          <Button
                            intent="primary"
                            icon="ban-circle"
                            iconProps={{ size: 20 }}
                            minimal
                            onClick={() => remove(index)}
                          />
                        )}
                      </div>
                    ))}
                    <Button
                      intent="primary"
                      minimal
                      text="+ Add Environment"
                      onClick={() => push({ key: '', value: '' })}
                      margin={{ bottom: 'medium' }}
                    />
                  </>
                )}
              />
              <Text margin={{ bottom: 'xsmall' }}>{i18n.workingDirectoryLabel}</Text>
              <div className={cx(css.fieldsGroup, css.withoutSpacing)}>
                <FormInput.MultiTextInput name="spec.workingDir" label="" style={{ flexGrow: 1 }} />
                {getMultiTypeFromValue(formValues.spec.workingDir) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formValues.spec.workingDir as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Text>{i18n.workingDirectoryLabel}</Text>
                      </Layout.Horizontal>
                    }
                    variableName="spec.workingDir"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => setFieldValue('spec.workingDir', value)}
                  />
                )}
              </div>
              <Text margin={{ top: 'medium' }}>
                {i18n.setContainerResources}
                <Button icon="question" minimal tooltip={i18n.setContainerResourcesTooltip} />
              </Text>
              <div
                className={cx(css.fieldsGroup, css.withoutSpacing)}
                style={{ marginBottom: 'var(--spacing-medium)' }}
              >
                <div>
                  <FormInput.Text
                    name="spec.limitMemory"
                    label={i18n.limitMemoryLabel}
                    placeholder={i18n.limitMemoryPlaceholder}
                  />
                  <Text font="xsmall" margin={{ top: 'small' }}>
                    {i18n.limitMemoryExample}
                  </Text>
                </div>
                <FormInput.Select
                  name="spec.limitMemoryUnits"
                  items={[
                    { label: i18n.limitMemoryUnitMiLabel, value: LimitMemoryUnits.Mi },
                    { label: i18n.limitMemoryUnitGiLabel, value: LimitMemoryUnits.Gi }
                  ]}
                />
                <div>
                  <FormInput.Text
                    name="spec.limitCPU"
                    label={i18n.limitCPULabel}
                    placeholder={i18n.limitCPUPlaceholder}
                  />
                  <Text font="xsmall" margin={{ top: 'small' }}>
                    {i18n.limitCPUExample}
                  </Text>
                </div>
              </div>
              <Text margin={{ bottom: 'xsmall' }}>{i18n.outputVariablesLabel}</Text>
              <SimpleTagInput
                placeholder=""
                items={[]}
                fill
                noInputBorder
                openOnKeyDown={false}
                showNewlyCreatedItemsInList={false}
                allowNewTag
                onChange={selectedItems => setFieldValue('spec.outputVariables', selectedItems)}
              />
            </div>
            <div className={css.buttonsWrapper}>
              <Button
                onClick={() => handleSubmit()}
                intent="primary"
                type="submit"
                text={i18n.save}
                margin={{ right: 'xxlarge' }}
              />
              <Button text={i18n.cancel} minimal onClick={handleCancelClick} />
            </div>
          </FormikForm>
        )}
      </Formik>
    </>
  )
}

export class RunStep extends PipelineStep<any /*RunStepData*/> {
  renderStep(
    initialValues: any, //RunStepData
    onUpdate?: (data: any) => void, //RunStepData
    stepViewType?: StepViewType
  ): JSX.Element {
    return <RunStepWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }

  protected type = StepType.Run
  protected stepName = i18n.title
  protected stepIcon: IconName = 'run-step'

  protected defaultValues: any /*RunStepData*/ = {
    identifier: '',
    spec: {
      environment: [{ key: '', value: '' }],
      limitMemoryUnits: LimitMemoryUnits.Mi
    }
  }
}
