import React from 'react'
import {
  Text,
  Formik,
  FormInput,
  Button,
  getMultiTypeFromValue,
  MultiTypeInputType,
  Layout,
  Icon,
  SimpleTagInput
} from '@wings-software/uikit'
import { FieldArray } from 'formik'
import * as yup from 'yup'
import cx from 'classnames'
import { isEmpty } from 'lodash-es'
import { useParams } from 'react-router-dom'
import { ConfigureOptions, PipelineContext, StepViewType } from 'modules/pipeline/exports'
import { ConnectorInfoDTO, useGetConnector } from 'services/cd-ng'
import { FormMultiTypeConnectorField } from 'modules/common/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import {
  getIdentifierFromValue,
  getScopeFromDTO,
  getScopeFromValue
} from 'modules/common/components/EntityReference/EntityReference'
import { Scope } from 'modules/common/interfaces/SecretsInterface'
import { DrawerTypes } from 'modules/pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import type { ServiceWrapper } from 'modules/pipeline/components/PipelineStudio/ExecutionGraph/ExecutionGraphUtil'
import i18n from './CommonService.i18n'
import { PipelineStep } from '../../PipelineStep'
import css from './CommonService.module.scss'

// TODO: TDO
export type CommonServiceInfo = ServiceSpecType & {
  [key: string]: any
}

// TODO: TDO
export interface ServiceSpecType {
  [key: string]: any
}

// TODO: TDO
export type ServiceElement = ServiceWrapper & {
  identifier: string
  name?: string
  type?: string
  metadata?: string
  spec?: ServiceSpecType
}

export interface CommonServiceData extends ServiceElement {
  type: string
  name: string
  spec: CommonServiceInfo
}

interface CommonServiceWidgetProps {
  initialValues: CommonServiceData
  onUpdate?: (data: CommonServiceData) => void
  stepViewType?: StepViewType
}

export enum LimitMemoryUnits {
  Mi = 'Mi',
  Gi = 'Gi'
}

const validationSchema = yup.object().shape({
  identifier: yup.string().required(),
  name: yup.string().required(),
  spec: yup
    .object()
    .shape({
      connector: yup.mixed().required(),
      image: yup.string().required(),
      limitCPU: yup.number().min(0),
      limitMemory: yup.number().min(0)
    })
    .required()
})

const CommonServiceWidget: React.FC<CommonServiceWidgetProps> = ({ initialValues, onUpdate }): JSX.Element => {
  const {
    state: {
      pipelineView,
      pipelineView: {
        drawerData: { data }
      }
    },
    updatePipelineView
  } = React.useContext(PipelineContext)

  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

  const isEdit = data?.stepConfig?.addOrEdit === 'edit'
  const connectorRef = getIdentifierFromValue((initialValues.connector as string) || '') // ? as string
  const initialScope = getScopeFromValue((initialValues.connector as string) || '') // ? as string

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
      !isEmpty(initialValues.connector) &&
      getMultiTypeFromValue(initialValues.connector || '') === MultiTypeInputType.FIXED
    ) {
      refetch()
    }
  }, [initialValues.connector])

  const values = { ...initialValues } // , connector: '' } // ?? '' instead of undefined

  if (connector?.data?.connector && getMultiTypeFromValue(initialValues.connector || '') === MultiTypeInputType.FIXED) {
    const scope = getScopeFromDTO<ConnectorInfoDTO>(connector?.data?.connector)
    values.connector = {
      label: connector?.data?.connector.name || '',
      value: `${scope !== Scope.PROJECT ? `${scope}.` : ''}${connector?.data?.connector.identifier}`,
      scope: scope
    }
  } else {
    values.connector = initialValues.connector
  }

  const handleCancelClick = (): void => {
    updatePipelineView({
      ...pipelineView,
      isDrawerOpened: false,
      drawerData: { type: DrawerTypes.ConfigureService }
    })
  }

  return (
    <Formik<CommonServiceData>
      onSubmit={_values => onUpdate?.(_values)}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({ values: { spec: formValues }, setFieldValue, handleSubmit }) => {
        return (
          <>
            <div className={css.fieldsSection}>
              <FormInput.InputWithIdentifier
                inputName="name"
                idName="identifier"
                inputLabel={i18n.dependencyNameLabel}
              />
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
                {getMultiTypeFromValue(formValues.connector) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formValues.connector as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Text>{i18n.connectorLabel}</Text>
                      </Layout.Horizontal>
                    }
                    variableName="connector"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => {
                      setFieldValue('spec.connector', value)
                    }}
                  />
                )}
              </div>
              <Text className={css.verifying} font="small" margin={{ top: 'xsmall', bottom: 'medium' }}>
                <Icon className={css.verifyingIcon} name="command-artifact-check" margin={{ right: 'small' }} />
                {i18n.verifyingConnection}
              </Text>
              <Text margin={{ bottom: 'xsmall' }}>{i18n.imageLabel}</Text>
              <div className={cx(css.fieldsGroup, css.withoutSpacing)}>
                <FormInput.MultiTextInput name="spec.image" label="" style={{ flexGrow: 1 }} />
                {getMultiTypeFromValue(formValues.image) === MultiTypeInputType.RUNTIME && (
                  <ConfigureOptions
                    value={formValues.image as string}
                    type={
                      <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                        <Text>{i18n.imageLabel}</Text>
                      </Layout.Horizontal>
                    }
                    variableName="image"
                    showRequiredField={false}
                    showDefaultField={false}
                    showAdvanced={true}
                    onChange={value => setFieldValue('spec.image', value)}
                  />
                )}
              </div>
            </div>
            <div className={css.fieldsSection}>
              <Text className={css.optionalConfiguration} font={{ weight: 'semi-bold' }} margin={{ bottom: 'small' }}>
                {i18n.optionalConfiguration}
              </Text>
              <Text margin={{ bottom: 'xsmall' }}>{i18n.environment}</Text>
              <FieldArray
                name="spec.environment"
                render={({ push, remove }) => (
                  <>
                    {formValues.environment.map((_environment: string, index: number) => (
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
                        {getMultiTypeFromValue(formValues.environment[index].value) === MultiTypeInputType.RUNTIME && (
                          <ConfigureOptions
                            value={formValues.environment[index].value as string}
                            type={
                              <Layout.Horizontal spacing="medium" style={{ alignItems: 'center' }}>
                                <Text>{i18n.environmentValuePlaceholder}</Text>
                              </Layout.Horizontal>
                            }
                            variableName={`environment[${index}].value`}
                            showRequiredField={false}
                            showDefaultField={false}
                            showAdvanced={true}
                            onChange={value => setFieldValue(`spec.environment[${index}].value`, value)}
                          />
                        )}

                        {formValues.environment.length > 1 && (
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
                      margin={{ bottom: 'xlarge' }}
                    />
                  </>
                )}
              />
              <Text margin={{ bottom: 'xsmall' }}>{i18n.entryPointsLabel}</Text>
              <SimpleTagInput
                className={css.tagInput}
                placeholder=""
                items={[]}
                fill
                noInputBorder
                openOnKeyDown={false}
                showNewlyCreatedItemsInList={false}
                allowNewTag
                onChange={selectedItems => setFieldValue('spec.entrypoint', selectedItems)}
              />
              <Text margin={{ bottom: 'xsmall' }}>{i18n.argumentsLabel}</Text>
              <SimpleTagInput
                className={css.tagInput}
                placeholder=""
                items={[]}
                fill
                noInputBorder
                openOnKeyDown={false}
                showNewlyCreatedItemsInList={false}
                allowNewTag
                onChange={selectedItems => setFieldValue('spec.args', selectedItems)}
              />
              <div>
                <Text>
                  {i18n.setContainerResources}
                  <Button icon="question" minimal tooltip={i18n.setContainerResourcesTooltip} />
                </Text>
                <div className={css.fieldsGroup}>
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
            </div>
            <div className={css.buttonsWrapper}>
              <Button
                onClick={() => handleSubmit()}
                intent="primary"
                type="submit"
                text={isEdit ? i18n.save : i18n.add}
                margin={{ right: 'xxlarge' }}
              />
              <Button text={i18n.cancel} minimal onClick={handleCancelClick} />
            </div>
          </>
        )
      }}
    </Formik>
  )
}

export abstract class CommonService extends PipelineStep<CommonServiceData> {
  renderStep(
    initialValues: CommonServiceData,
    onUpdate?: (data: CommonServiceData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <CommonServiceWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }
}
