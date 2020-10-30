import React from 'react'
import {
  Text,
  Formik,
  FormikForm,
  FormInput,
  Button,
  getMultiTypeFromValue,
  MultiTypeInputType,
  Layout
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
import i18n from './CommonService.i18n'
import { PipelineStep } from '../../PipelineStep'
import { convertFromUIModel, convertToUIModel } from './CommonServiceUtils'

import css from './CommonService.module.scss'

// TODO: TDO
export type CommonServiceInfo = ServiceSpecType & {
  image: string
  connectorRef?: string
  environment?: { [key: string]: string }
  entrypoint?: string[]
  args?: string[]
  resources?: {
    limit: {
      memory?: number
      cpu?: number
    }
  }
}

// TODO: TDO
export interface ServiceSpecType {
  [key: string]: any
}

// TODO: TDO
export interface CommonServiceData {
  identifier: string
  type: string
  name?: string
  spec: CommonServiceInfo
}

// Interface for the form
export interface CommonServiceDataUI {
  identifier: string
  type: string
  name?: string
  spec: CommonServiceInfoUI
}

export type CommonServiceInfoUI = ServiceSpecType & {
  [key: string]: any
}

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
      limitCPU: yup.number().min(1),
      limitMemory: yup.number().min(1)
    })
    .required()
})

interface CommonServiceWidgetProps {
  initialValues: CommonServiceData
  onUpdate?: (data: CommonServiceData) => void
  stepViewType?: StepViewType
}

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
  const connectorId = getIdentifierFromValue((initialValues.spec.connectorRef as string) || '')
  const initialScope = getScopeFromValue((initialValues.spec.connectorRef as string) || '')

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

  const values = convertToUIModel(initialValues)

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
      drawerData: { type: DrawerTypes.ConfigureService }
    })
  }

  return (
    <Formik<CommonServiceDataUI>
      initialValues={values}
      validationSchema={validationSchema}
      onSubmit={(_values: CommonServiceDataUI) => {
        const schemaValues = convertFromUIModel(_values)
        onUpdate?.(schemaValues)
      }}
    >
      {({ values: formValues, setFieldValue, handleSubmit }) => {
        return (
          <FormikForm>
            <div className={css.fieldsSection}>
              <FormInput.InputWithIdentifier
                inputName="name"
                idName="identifier"
                inputLabel={i18n.dependencyNameLabel}
              />
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
                      text={i18n.addEnvironment}
                      onClick={() => push({ key: '', value: '' })}
                      margin={{ bottom: 'medium' }}
                    />
                  </>
                )}
              />
              <FormInput.TagInput
                name="spec.entrypoint"
                label={i18n.entryPointsLabel}
                items={[]}
                labelFor={name => name as string}
                itemFromNewTag={newTag => newTag}
                tagInputProps={{
                  className: '',
                  noInputBorder: true,
                  openOnKeyDown: false,
                  showAddTagButton: false,
                  fill: true,
                  showNewlyCreatedItemsInList: false,
                  allowNewTag: true,
                  placeholder: ''
                }}
              />
              <FormInput.TagInput
                name="spec.args"
                label={i18n.argumentsLabel}
                items={[]}
                labelFor={name => name as string}
                itemFromNewTag={newTag => newTag}
                tagInputProps={{
                  className: '',
                  noInputBorder: true,
                  openOnKeyDown: false,
                  showAddTagButton: false,
                  fill: true,
                  showNewlyCreatedItemsInList: false,
                  allowNewTag: true,
                  placeholder: ''
                }}
              />
              <div>
                <Text>
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
          </FormikForm>
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
