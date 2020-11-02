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
  FormikForm
} from '@wings-software/uikit'
import { FieldArray } from 'formik'
import * as yup from 'yup'
import cx from 'classnames'
import { isEmpty } from 'lodash-es'
import { useParams } from 'react-router-dom'
import { ConfigureOptions, PipelineContext, StepViewType } from '@pipeline/exports'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import {
  getIdentifierFromValue,
  getScopeFromDTO,
  getScopeFromValue
} from '@common/components/EntityReference/EntityReference'
import { Scope } from '@common/interfaces/SecretsInterface'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import { ConnectorInfoDTO, useGetConnector } from 'services/cd-ng'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import i18n from './PluginStep.i18n'
import css from './PluginStep.module.scss'
import stepCss from '../Steps.module.scss'

export enum LimitMemoryUnits {
  Mi = 'Mi',
  Gi = 'Gi'
}

const validationSchema = yup.object().shape({
  identifier: yup.string().trim().required(),
  name: yup.string().trim().required(),
  spec: yup
    .object()
    .shape({
      connectorRef: yup.mixed().required(),
      image: yup.string().trim().required(),
      settings: yup.array().compact().required(),
      limitCPU: yup.number().min(0),
      limitMemory: yup.number().min(0)
    })
    .required()
})

export interface PluginStepWidgetProps {
  initialValues: any //PluginStepData
  onUpdate?: (data: any) => void //PluginStepData
  stepViewType?: StepViewType
}

// TODO: Fix types
function getInitialValuesInCorrectFormat(initialValues: any): any {
  if (initialValues.spec?.resources) {
    return {
      identifier: initialValues.identifier,
      name: initialValues.name,
      spec: {
        connectorRef: initialValues.spec?.connectorRef,
        image: initialValues.spec?.image,
        settings: initialValues.spec?.settings,
        limitMemory: initialValues.spec?.resources?.limit?.memory?.match(/\d+/g)?.join(''),
        limitMemoryUnits:
          initialValues.spec?.resources?.limit?.memory?.match(/[A-Za-z]+$/)?.join('') || LimitMemoryUnits.Mi,
        limitCPU: initialValues.spec?.resources?.limit?.cpu
      }
    }
  } else {
    return { ...initialValues }
  }
}

const PluginStepWidget: React.FC<PluginStepWidgetProps> = ({ initialValues, onUpdate }): JSX.Element => {
  const {
    state: { pipelineView },
    updatePipelineView
  } = React.useContext(PipelineContext)

  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

  const connectorId = getIdentifierFromValue((initialValues.spec.connectorRef as string) || '') // ? as string
  const initialScope = getScopeFromValue((initialValues.spec.connectorRef as string) || '') // ? as string

  const { data: connector, loading, refetch } = useGetConnector({
    identifier: connectorId,
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
      !isEmpty(initialValues.spec.connectorRef) &&
      getMultiTypeFromValue(initialValues.spec.connectorRef || '') === MultiTypeInputType.FIXED
    ) {
      refetch()
    }
  }, [initialValues.spec.connectorRef])

  const values = getInitialValuesInCorrectFormat(initialValues)

  if (
    connector?.data?.connector &&
    getMultiTypeFromValue(initialValues.spec.connectorRef || '') === MultiTypeInputType.FIXED
  ) {
    const scope = getScopeFromDTO<ConnectorInfoDTO>(connector?.data?.connector)
    values.spec.connectorRef = {
      label: connector?.data?.connector.name || '',
      value: `${scope !== Scope.PROJECT ? `${scope}.` : ''}${connector?.data?.connector.identifier}`,
      scope: scope
    }
  } else {
    values.spec.connectorRef = initialValues.spec.connectorRef
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
        initialValues={getInitialValuesInCorrectFormat(initialValues)}
        validationSchema={validationSchema}
        onSubmit={_values => {
          // TODO: Use appropriate interface
          const schemaValues: any = {
            identifier: _values.identifier,
            name: _values.name,
            spec: {
              connectorRef: _values.spec.connectorRef,
              image: _values.spec.image,
              settings: _values.spec.settings,
              resources: {
                limit: {
                  memory: '',
                  cpu: _values.spec.limitCPU
                }
              }
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
                  name="spec.connectorRef"
                  label=""
                  placeholder={loading ? i18n.loading : i18n.connectorPlaceholder}
                  disabled={loading}
                  accountIdentifier={accountId}
                  projectIdentifier={projectIdentifier}
                  orgIdentifier={orgIdentifier}
                />
                {getMultiTypeFromValue(formValues.spec.connectorRef) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formValues.spec.connectorRef as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Text>{i18n.connectorLabel}</Text>
                      </Layout.Horizontal>
                    }
                    variableName="spec.connectorRef"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => {
                      setFieldValue('spec.connectorRef', value)
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
              <Text margin={{ top: 'medium' }}>{i18n.settings}</Text>
              <FieldArray
                name="spec.settings"
                render={({ push, remove }) => (
                  <>
                    {formValues.spec.settings.map((_settings: string, index: number) => (
                      <div className={css.fieldsGroup} key={index}>
                        <FormInput.MultiTextInput
                          label=""
                          name={`spec.settings[${index}].key`}
                          placeholder={i18n.settingsKeyPlaceholder}
                          style={{ flexGrow: 1 }}
                        />
                        {getMultiTypeFromValue(formValues.spec.settings[index].key) === MultiTypeInputType.RUNTIME && (
                          <ConfigureOptions
                            value={formValues.spec.settings[index].key as string}
                            type={
                              <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                                <Text>{i18n.settingsKeyPlaceholder}</Text>
                              </Layout.Horizontal>
                            }
                            variableName={`spec.settings[${index}].key`}
                            showRequiredField={false}
                            showDefaultField={false}
                            showAdvanced={true}
                            onChange={value => setFieldValue(`spec.settings[${index}].key`, value)}
                          />
                        )}
                        <FormInput.MultiTextInput
                          label=""
                          name={`spec.settings[${index}].value`}
                          placeholder={i18n.settingsValuePlaceholder}
                          style={{ flexGrow: 1 }}
                        />
                        {getMultiTypeFromValue(formValues.spec.settings[index].value) ===
                          MultiTypeInputType.RUNTIME && (
                          <ConfigureOptions
                            value={formValues.spec.settings[index].value as string}
                            type={
                              <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                                <Text>{i18n.settingsValuePlaceholder}</Text>
                              </Layout.Horizontal>
                            }
                            variableName={`spec.settings[${index}].value`}
                            showRequiredField={false}
                            showDefaultField={false}
                            showAdvanced={true}
                            onChange={value => setFieldValue(`spec.settings[${index}].value`, value)}
                          />
                        )}

                        {formValues.spec.settings.length > 1 && (
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
                      text={i18n.addSetting}
                      onClick={() => push({ key: '', value: '' })}
                    />
                  </>
                )}
              />
            </div>
            <div className={css.fieldsSection}>
              <Text className={css.optionalConfiguration} font={{ weight: 'semi-bold' }} margin={{ bottom: 'small' }}>
                {i18n.optionalConfiguration}
              </Text>
              <Text margin={{ top: 'medium' }}>
                {i18n.setContainerResources}
                <Button icon="question" minimal tooltip={i18n.setContainerResourcesTooltip} />
              </Text>
              <div className={cx(css.fieldsGroup, css.withoutSpacing)}>
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

export class PluginStep extends PipelineStep<any /*PluginStepData*/> {
  renderStep(
    initialValues: any, //PluginStepData
    onUpdate?: (data: any) => void, //PluginStepData
    stepViewType?: StepViewType
  ): JSX.Element {
    return <PluginStepWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }

  protected type = StepType.Plugin
  protected stepName = i18n.title
  // TODO: Replace with correct icon
  protected stepIcon: IconName = 'git-clone-step'

  protected defaultValues: any /*PluginStepData*/ = {
    identifier: '',
    spec: {
      settings: [{ key: '', value: '' }],
      limitMemoryUnits: LimitMemoryUnits.Mi
    }
  }
}
